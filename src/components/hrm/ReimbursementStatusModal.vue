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
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div 
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                    :class="selectedStatus === 'approved' ? 'bg-blue-100' : (selectedStatus === 'rejected' ? 'bg-red-100' : 'bg-emerald-100')"
                  >
                    <component 
                      :is="selectedStatus === 'approved' ? CheckCircle2 : (selectedStatus === 'rejected' ? XCircle : Banknote)" 
                      class="h-6 w-6" 
                      :class="selectedStatus === 'approved' ? 'text-blue-600' : (selectedStatus === 'rejected' ? 'text-red-600' : 'text-emerald-600')"
                    />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900">
                      Update Claim Status
                    </DialogTitle>
                    <div class="mt-4 space-y-4">
                      <!-- Status Selection -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Select Status</label>
                        <div class="grid grid-cols-3 gap-2">
                          <button
                            v-for="status in availableStatuses"
                            :key="status.id"
                            type="button"
                            @click="selectedStatus = status.id"
                            class="px-3 py-2 rounded-xl border text-xs font-bold transition-all"
                            :class="selectedStatus === status.id ? status.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300'"
                          >
                            {{ status.label }}
                          </button>
                        </div>
                      </div>

                      <!-- Reason (Only for Rejected) -->
                      <div v-if="selectedStatus === 'rejected'">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Reason for Rejection</label>
                        <textarea
                          v-model="reason"
                          rows="3"
                          placeholder="Why is this claim being rejected?"
                          class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                        ></textarea>
                      </div>

                      <div v-else class="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p v-if="selectedStatus === 'approved'">Are you sure you want to approve this claim for payment?</p>
                        <p v-else>Confirm that this claim has been paid to the employee.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm sm:w-auto transition-all active:scale-95 disabled:opacity-50"
                  :class="selectedStatus === 'approved' ? 'bg-blue-600 hover:bg-blue-700' : (selectedStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700')"
                  :disabled="loading || (selectedStatus === 'rejected' && !reason)"
                  @click="submit"
                >
                  <Loader2 v-if="loading" class="h-4 w-4 animate-spin mr-2" />
                  Confirm {{ selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1) }}
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
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckCircle2, XCircle, Banknote, Loader2 } from 'lucide-vue-next'
import type { Reimbursement } from '../../services/hrm/types/reimbursement.types'

const props = defineProps<{
  isOpen: boolean
  loading: boolean
  claim: Reimbursement | null
}>()

const emit = defineEmits(['close', 'submit'])

const selectedStatus = ref<'approved' | 'rejected' | 'paid'>('approved')
const reason = ref('')

const availableStatuses = [
  { id: 'approved', label: 'Approve', activeClass: 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm shadow-blue-100' },
  { id: 'rejected', label: 'Reject', activeClass: 'border-red-500 bg-red-50 text-red-600 shadow-sm shadow-red-100' },
  { id: 'paid', label: 'Mark as Paid', activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100' },
] as const

watch(() => props.claim, (newClaim) => {
  if (newClaim) {
    if (newClaim.status === 'pending') selectedStatus.value = 'approved'
    else if (newClaim.status === 'approved') selectedStatus.value = 'paid'
    reason.value = ''
  }
})

const close = () => {
  if (props.loading) return
  emit('close')
}

const submit = () => {
  emit('submit', {
    status: selectedStatus.value,
    reason: selectedStatus.value === 'rejected' ? reason.value : undefined
  })
}
</script>
