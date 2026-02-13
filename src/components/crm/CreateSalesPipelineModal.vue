<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-full sm:max-w-xl">
        <div class="bg-white px-3 py-4 sm:px-6 sm:py-6">
          <div class="sm:flex sm:items-start text-left w-full">
            <div class="w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">Create Pipeline Entry</h3>
              
              <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Prospect Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Prospect <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.prospect_id"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    :disabled="!!initialProspectId"
                  >
                    <option value="">Select a prospect</option>
                    <option v-for="prospect in prospects" :key="prospect.uuid" :value="prospect.uuid">
                      {{ prospect.title }} ({{ prospect.customer?.name }})
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Stage <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.stage"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select stage...</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    v-model="formData.notes"
                    rows="4"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter transition notes..."
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="loading || !formData.prospect_id || !formData.stage"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Entry' }}
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
import { ref, onMounted, watch } from 'vue'
import { prospectService } from '../../services/crm/prospect'
import { salesPipelineService } from '../../services/crm/salesPipeline'
import type { Prospect } from '../../services/crm/types/prospect.types'

interface Props {
  isOpen: boolean
  initialProspectId?: string
  initialStage?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const prospects = ref<Prospect[]>([])
const loading = ref(false)
const errorMessage = ref('')

const formData = ref({
  prospect_id: props.initialProspectId || '',
  stage: props.initialStage || '',
  notes: ''
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    formData.value.prospect_id = props.initialProspectId || ''
    formData.value.stage = props.initialStage || ''
    formData.value.notes = ''
    if (prospects.value.length === 0) {
      fetchProspects()
    }
  }
})

const fetchProspects = async () => {
  try {
    const response = await prospectService.getProspects(1)
    prospects.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch prospects:', error)
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!formData.value.prospect_id) {
    errorMessage.value = 'Prospect is required'
    return
  }
  
  if (!formData.value.stage) {
    errorMessage.value = 'Stage is required'
    return
  }

  loading.value = true
  try {
    await salesPipelineService.createSalesPipeline({
      prospect_id: formData.value.prospect_id,
      stage: formData.value.stage,
      notes: formData.value.notes || undefined
    })
    
    emit('created')
    handleClose()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to create pipeline entry'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  errorMessage.value = ''
  emit('close')
}

onMounted(() => {
  fetchProspects()
})
</script>
