<template>
  <div v-if="props.isOpen" class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-full sm:max-w-lg">
        <div class="bg-white px-3 py-4 sm:px-6 sm:py-6">
          <div class="sm:flex sm:items-start text-left w-full">
            <div class="w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">
                {{ props.editingLocation ? 'Edit Office Location' : 'Create Office Location' }}
              </h3>
              
              <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
                    <div v-if="errors && Object.keys(errors).length > 0" class="mt-2 text-sm text-red-700">
                      <ul role="list" class="list-disc pl-5 space-y-1">
                        <li v-for="(fieldErrors, field) in errors" :key="field">
                          {{ fieldErrors[0] }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Office Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. Main Office, Branch Jakarta"
                    />
                    <p v-if="errors?.name" class="mt-1 text-xs text-red-600">{{ errors.name[0] }}</p>
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Address <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="formData.address"
                      rows="2"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter full address..."
                    ></textarea>
                    <p v-if="errors?.address" class="mt-1 text-xs text-red-600">{{ errors.address[0] }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Latitude <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model.number="formData.latitude"
                      type="number"
                      step="any"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="-6.1754"
                    />
                    <p v-if="errors?.latitude" class="mt-1 text-xs text-red-600">{{ errors.latitude[0] }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Longitude <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model.number="formData.longitude"
                      type="number"
                      step="any"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="106.8272"
                    />
                    <p v-if="errors?.longitude" class="mt-1 text-xs text-red-600">{{ errors.longitude[0] }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Radius (meters)
                    </label>
                    <input
                      v-model.number="formData.radius"
                      type="number"
                      min="1"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. 50"
                    />
                    <p v-if="errors?.radius" class="mt-1 text-xs text-red-600">{{ errors.radius[0] }}</p>
                  </div>

                  <div class="flex items-center pt-8">
                    <label class="inline-flex items-center cursor-pointer">
                      <input
                        v-model="formData.is_active"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      <span class="ms-3 text-sm font-medium text-gray-900">Active</span>
                    </label>
                    <p v-if="errors?.is_active" class="mt-1 text-xs text-red-600">{{ errors.is_active[0] }}</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="props.loading || !isFormValid"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ props.loading ? (props.editingLocation ? 'Updating...' : 'Creating...') : (props.editingLocation ? 'Update Location' : 'Create Location') }}
          </button>
          <button
            type="button"
            @click="handleClose"
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { CreateOfficeLocationRequest, OfficeLocation, UpdateOfficeLocationRequest } from '../../services/hrm/types/office-location.types'

interface Props {
  isOpen: boolean
  loading?: boolean
  editingLocation?: OfficeLocation | null
  errors?: Record<string, string[]> | null
  errorMessage?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: CreateOfficeLocationRequest | UpdateOfficeLocationRequest): void
}>()

const formData = ref<CreateOfficeLocationRequest>({
  name: '',
  address: '',
  latitude: 0,
  longitude: 0,
  radius: 100,
  is_active: true
})

const isFormValid = computed(() => {
  return formData.value.name && 
         formData.value.address && 
         formData.value.latitude !== null && 
         formData.value.longitude !== null
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.editingLocation) {
      formData.value = {
        name: props.editingLocation.name,
        address: props.editingLocation.address,
        latitude: props.editingLocation.latitude,
        longitude: props.editingLocation.longitude,
        radius: props.editingLocation.radius,
        is_active: props.editingLocation.is_active
      }
    } else {
      formData.value = {
        name: '',
        address: '',
        latitude: 0, // Default or leave blank if managed well
        longitude: 0,
        radius: 100,
        is_active: true
      }
    }
  }
})

const handleSubmit = () => {
  emit('submit', { ...formData.value })
}

const handleClose = () => {
  emit('close')
}
</script>
