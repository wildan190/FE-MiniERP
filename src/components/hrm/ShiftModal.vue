<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900" id="modal-title">
            {{ shift ? 'Edit Shift' : 'Add New Shift' }}
          </h3>
          <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Shift Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Morning Shift"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Start Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                v-model="form.start_time"
                type="time"
                required
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <!-- End Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                v-model="form.end_time"
                type="time"
                required
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Optional details about this shift..."
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
            >
              <template v-if="loading">
                <Loader2 class="h-5 w-5 animate-spin" />
                Saving...
              </template>
              <template v-else>
                {{ shift ? 'Update Shift' : 'Create Shift' }}
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import type { Shift } from '../../services/hrm/types/shift.types'

const props = defineProps<{
  isOpen: boolean
  loading: boolean
  shift: Shift | null
}>()

const emit = defineEmits(['close', 'submit'])

const form = ref({
  name: '',
  start_time: '',
  end_time: '',
  description: '',
})

watch(() => props.shift, (newShift) => {
  if (newShift) {
    form.value = {
      name: newShift.name,
      start_time: newShift.start_time.substring(0, 5), // Ensure HH:mm format
      end_time: newShift.end_time.substring(0, 5),
      description: newShift.description || '',
    }
  } else {
    form.value = {
      name: '',
      start_time: '',
      end_time: '',
      description: '',
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>
