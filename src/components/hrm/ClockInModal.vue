<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900" id="modal-title">Clock In</h3>
          <button @click="handleClose" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Office Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Office Location</label>
            <select
              v-model="form.office_location_uuid"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select Location</option>
              <option v-for="loc in officeLocations" :key="loc.uuid" :value="loc.uuid">
                {{ loc.name }}
              </option>
            </select>
          </div>

          <!-- Face Verification -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Face Verification</label>
            <div class="aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative">
              <!-- Live Video Feed -->
              <video
                v-if="!imagePreview && isCameraActive"
                ref="videoRef"
                autoplay
                playsinline
                class="w-full h-full object-cover"
              ></video>

              <!-- Image Preview -->
              <img v-else-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />

              <!-- Camera Placeholder/Errors -->
              <template v-else>
                <div v-if="cameraError" class="text-center p-4">
                  <AlertCircle class="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <p class="text-xs text-red-600">{{ cameraError }}</p>
                  <button type="button" @click="startCamera" class="mt-2 text-xs text-primary-600 font-bold underline">Retry Camera</button>
                </div>
                <template v-else>
                  <Camera class="h-10 w-10 text-gray-400 mb-2" />
                  <p class="text-xs text-gray-500">Initializing camera...</p>
                </template>
              </template>

              <!-- Camera Controls -->
              <div v-if="isCameraActive && !imagePreview" class="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  type="button"
                  @click="capturePhoto"
                  class="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors active:scale-95"
                >
                  <div class="h-6 w-6 rounded-full border-4 border-primary-600"></div>
                </button>
              </div>

              <!-- Retake -->
              <button
                v-if="imagePreview"
                type="button"
                @click="resetCamera"
                class="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
            <p class="text-[10px] text-gray-400 text-right italic">* Face verification is required</p>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Optional notes..."
            ></textarea>
          </div>

          <!-- Status / Error -->
          <div v-if="locationError" class="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
            <AlertCircle class="h-5 w-5 text-red-600 flex-shrink-0" />
            <p class="text-xs text-red-600">{{ locationError }}</p>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="handleClose"
              class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || isGettingLocation || !imagePreview || !form.office_location_uuid"
              class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
            >
              <template v-if="loading">
                <Loader2 class="h-5 w-5 animate-spin" />
                Processing...
              </template>
              <template v-else>
                Clock In
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Hidden Canvas for capture -->
    <canvas ref="canvasRef" style="display: none"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { X, Camera, Trash2, AlertCircle, Loader2 } from 'lucide-vue-next'
import type { OfficeLocation } from '../../services/hrm/types/office-location.types'

const props = defineProps<{
  isOpen: boolean
  loading: boolean
  officeLocations: OfficeLocation[]
}>()

const emit = defineEmits(['close', 'submit'])

const form = ref({
  office_location_uuid: '',
  notes: '',
  face_image: null as File | null,
  latitude: null as number | null,
  longitude: null as number | null,
})

const imagePreview = ref<string | null>(null)
const locationError = ref<string | null>(null)
const isGettingLocation = ref(false)

// Camera logic
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isCameraActive = ref(false)
const cameraError = ref<string | null>(null)
let mediaStream: MediaStream | null = null

const startCamera = async () => {
  cameraError.value = null
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    })
    isCameraActive.value = true
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
    }
  } catch (err: any) {
    console.error('Camera access error:', err)
    cameraError.value = 'Could not access camera. Please allow permission.'
    isCameraActive.value = false
  }
}

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  isCameraActive.value = false
}

const capturePhoto = () => {
  if (!videoRef.value || !canvasRef.value) return

  const canvas = canvasRef.value
  const video = videoRef.value
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  
  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], 'attendance-face.jpg', { type: 'image/jpeg' })
      form.value.face_image = file
      imagePreview.value = URL.createObjectURL(blob)
      stopCamera()
    }
  }, 'image/jpeg', 0.8)
}

const resetCamera = () => {
  imagePreview.value = null
  form.value.face_image = null
  startCamera()
}

const getLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation is not supported by your browser.'
    return
  }

  isGettingLocation.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.value.latitude = position.coords.latitude
      form.value.longitude = position.coords.longitude
      isGettingLocation.value = false
    },
    (error) => {
      console.error('Location error:', error)
      locationError.value = 'Failed to get location. Please enable location access.'
      isGettingLocation.value = false
    }
  )
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}

const handleClose = () => {
  stopCamera()
  emit('close')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    getLocation()
    startCamera()
  } else {
    stopCamera()
  }
})

// Ensure video source is set when ref becomes available
watch(videoRef, (newRef) => {
  if (newRef && mediaStream) {
    newRef.srcObject = mediaStream
  }
})

onMounted(() => {
  if (props.isOpen) {
    getLocation()
    startCamera()
  }
})

onUnmounted(() => {
  stopCamera()
})
</script>
