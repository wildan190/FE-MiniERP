<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 rounded-full">
            <Camera class="w-6 h-6 text-primary-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
              Enroll Employee Face
            </h3>
            <div class="mt-2 text-sm text-gray-500">
              <p v-if="!isCameraMode">Please upload a clear photo or use the camera for recognition.</p>
              <p v-else>Position the face clearly in the frame and click "Capture".</p>
            </div>
          </div>
        </div>

        <div class="mt-5 space-y-4">
          <!-- Mode Toggle -->
          <div class="flex p-1 bg-gray-100 rounded-lg">
            <button 
              type="button"
              class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all"
              :class="isCameraMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              @click="toggleMode(true)"
            >
              <div class="flex items-center justify-center gap-2">
                <Camera class="w-4 h-4" />
                Camera
              </div>
            </button>
            <button 
              type="button"
              class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all"
              :class="!isCameraMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              @click="toggleMode(false)"
            >
              <div class="flex items-center justify-center gap-2">
                <Upload class="w-4 h-4" />
                Upload
              </div>
            </button>
          </div>

          <!-- Camera Mode -->
          <div v-if="isCameraMode" class="space-y-4">
            <div class="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-200">
              <video 
                v-show="!previewUrl"
                ref="videoRef" 
                autoplay 
                playsinline 
                class="w-full h-full object-cover mirror"
              ></video>
              <img 
                v-if="previewUrl" 
                :src="previewUrl" 
                alt="Captured frame" 
                class="w-full h-full object-cover"
              />
              
              <div v-if="cameraError" class="absolute inset-0 flex items-center justify-center bg-gray-900 p-4 text-center">
                <div class="text-white space-y-2">
                  <p class="text-sm font-medium">{{ cameraError }}</p>
                  <button @click="startCamera" class="text-xs text-primary-400 hover:text-primary-300 underline">Try Again</button>
                </div>
              </div>
            </div>

            <div class="flex justify-center gap-3">
              <button 
                v-if="!previewUrl"
                type="button" 
                @click="captureImage"
                class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
              >
                <Camera class="w-5 h-5" />
                Capture Photo
              </button>
              <button 
                v-else
                type="button" 
                @click="retakePhoto"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                <RefreshCw class="w-5 h-5" />
                Retake
              </button>
            </div>
          </div>

          <!-- Upload Mode -->
          <div v-else>
            <div 
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary-500 transition-colors bg-gray-50 overflow-hidden relative min-h-[160px]"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <div v-if="previewUrl" class="absolute inset-0">
                <img :src="previewUrl" alt="Face Preview" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p class="text-white text-sm font-medium">Change Image</p>
                </div>
              </div>
              
              <div v-if="!previewUrl" class="space-y-1 text-center py-6">
                <Upload class="mx-auto h-12 w-12 text-gray-400" />
                <div class="flex text-sm text-gray-600 justify-center">
                  <label class="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                    <span>Click to upload</span>
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>
            <input 
              ref="fileInput" 
              type="file" 
              class="sr-only" 
              accept="image/jpeg,image/png"
              @change="handleFileChange"
            >
            <p v-if="errors?.face_image" class="mt-1 text-xs text-red-600">{{ errors.face_image[0] }}</p>
            <p v-if="fileError" class="mt-1 text-xs text-red-600">{{ fileError }}</p>
          </div>

          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              @click="handleSubmit"
              :disabled="loading || !selectedFile || !!fileError"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
            >
              <Loader2 v-if="loading" class="animate-spin h-4 w-4" />
              {{ loading ? 'Enrolling...' : 'Enroll Face' }}
            </button>
            <button
              type="button"
              @click="handleClose"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Hidden canvas for capturing frames -->
    <canvas ref="canvasRef" style="display: none;"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue';
import { Upload, Camera, Loader2, RefreshCw } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  loading: boolean;
  errors?: Record<string, string[]> | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', file: File): void
}>();

const isCameraMode = ref(true);
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const fileError = ref<string>('');
const cameraError = ref<string | null>(null);
const stream = ref<MediaStream | null>(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetState();
    if (isCameraMode.value) {
      nextTick(() => startCamera());
    }
  } else {
    stopCamera();
  }
});

const resetState = () => {
  selectedFile.value = null;
  fileError.value = '';
  cameraError.value = null;
  if (previewUrl.value && !selectedFile.value?.webkitRelativePath) { // Only revoke if it's a blob URL
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = null;
};

const toggleMode = (camera: boolean) => {
  if (isCameraMode.value === camera) return;
  
  isCameraMode.value = camera;
  resetState();
  
  if (camera) {
    nextTick(() => startCamera());
  } else {
    stopCamera();
  }
};

const startCamera = async () => {
  cameraError.value = null;
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user' 
      } 
    });
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
    }
  } catch (err: any) {
    console.error('Camera access error:', err);
    if (err.name === 'NotAllowedError') {
      cameraError.value = 'Camera access denied. Please allow camera permissions.';
    } else if (err.name === 'NotFoundError') {
      cameraError.value = 'No camera found on this device.';
    } else {
      cameraError.value = 'Failed to access camera.';
    }
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
};

const captureImage = () => {
  if (!videoRef.value || !canvasRef.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Handle mirror effect if needed
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], `face_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      selectedFile.value = file;
      previewUrl.value = URL.createObjectURL(blob);
    }
  }, 'image/jpeg', 0.9);
};

const retakePhoto = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = null;
  selectedFile.value = null;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.item(0);
  if (file) {
    processFile(file);
  }
};

const handleFileDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.item(0);
  if (file) {
    processFile(file);
  }
};

const processFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    fileError.value = 'Invalid file type. Only JPG and PNG are allowed.';
    return;
  }

  if (file.size > maxSize) {
    fileError.value = 'File is too large. Maximum size is 2MB.';
    return;
  }

  fileError.value = '';
  selectedFile.value = file;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = URL.createObjectURL(file);
};

const handleSubmit = () => {
  if (!selectedFile.value) return;
  emit('submit', selectedFile.value);
};

const handleClose = () => {
  stopCamera();
  emit('close');
};

onBeforeUnmount(() => {
  stopCamera();
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.mirror {
  transform: scaleX(-1);
}
</style>
