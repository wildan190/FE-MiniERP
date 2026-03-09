<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-[100]" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DollarSign class="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900">
                      Submit Reimbursement Claim
                    </DialogTitle>
                    <div class="mt-4 space-y-4">
                      <!-- Type -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Expense Type</label>
                        <select
                          v-model="form.type"
                          class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        >
                          <option value="Travel">Travel</option>
                          <option value="Medical">Medical</option>
                          <option value="Office Supplies">Office Supplies</option>
                          <option value="Internet/Phone">Internet/Phone</option>
                          <option value="Meal">Meal</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <!-- Amount -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Amount (IDR)</label>
                        <div class="relative">
                          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
                          <input
                            v-model.number="form.amount"
                            type="number"
                            placeholder="0"
                            class="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <!-- Description -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea
                          v-model="form.description"
                          rows="3"
                          placeholder="Provide details about the expense..."
                          class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <!-- Proof File -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Proof of Purchase (Receipt)</label>
                        <div 
                          class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-primary-400 transition-colors cursor-pointer relative"
                          @click="$refs.fileInput.click()"
                        >
                          <div class="space-y-1 text-center">
                            <UploadCloud v-if="!selectedFile" class="mx-auto h-10 w-10 text-gray-400" />
                            <FileCheck v-else class="mx-auto h-10 w-10 text-emerald-500" />
                            <div class="flex text-sm text-gray-600">
                              <span class="relative font-medium text-primary-600 hover:text-primary-500">
                                {{ selectedFile ? selectedFile.name : 'Upload a file' }}
                              </span>
                            </div>
                            <p class="text-xs text-gray-500">PNG, JPG, PDF up to 2MB</p>
                          </div>
                          <input 
                            ref="fileInput"
                            type="file" 
                            class="hidden" 
                            accept=".jpg,.jpeg,.png,.pdf"
                            @change="handleFileChange"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-700 sm:w-auto transition-all active:scale-95 disabled:opacity-50"
                  :disabled="loading || !isValid"
                  @click="submit"
                >
                  <Loader2 v-if="loading" class="h-4 w-4 animate-spin mr-2" />
                  Submit Claim
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-all"
                  @click="close"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { DollarSign, UploadCloud, FileCheck, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  loading: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  type: 'Travel',
  amount: 0,
  description: '',
})

const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const isValid = computed(() => {
  return form.type && form.amount > 0 && selectedFile.value
})

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const close = () => {
  if (props.loading) return
  emit('close')
  resetForm()
}

const resetForm = () => {
  form.type = 'Travel'
  form.amount = 0
  form.description = ''
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const submit = () => {
  emit('submit', {
    ...form,
    proof_file: selectedFile.value
  })
}
</script>
