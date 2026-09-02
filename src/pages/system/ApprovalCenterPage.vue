<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useApprovalStore } from '@/stores/approval'
import AppLayout from '@/layouts/AppLayout.vue'
import { CheckCircle2, Clock, XCircle, ShieldAlert, ArrowRight, Check, X, Loader2, MessageSquare } from 'lucide-vue-next'

const store = useApprovalStore()
const activeTab = ref<'pending' | 'chains'>('pending')
const selectedRequest = ref<any>(null)
const actionModal = ref<'approve' | 'reject' | null>(null)
const actionInput = ref('')
const processing = ref(false)
const modalError = ref('')

onMounted(async () => {
  await Promise.all([
    store.fetchPendingRequests(),
    store.fetchChains(),
  ])
})

function openActionModal(req: any, type: 'approve' | 'reject') {
  selectedRequest.value = req
  actionModal.value = type
  actionInput.value = ''
  modalError.value = ''
}

async function submitAction() {
  if (!selectedRequest.value) return
  if (actionModal.value === 'reject' && !actionInput.value.trim()) {
    modalError.value = 'Reason is required for rejection.'
    return
  }

  processing.value = true
  modalError.value = ''
  try {
    if (actionModal.value === 'approve') {
      await store.approveRequest(selectedRequest.value.uuid, actionInput.value)
    } else if (actionModal.value === 'reject') {
      await store.rejectRequest(selectedRequest.value.uuid, actionInput.value)
    }
    actionModal.value = null
    selectedRequest.value = null
  } catch (e: any) {
    modalError.value = e.response?.data?.message || e.message || 'Action failed.'
  } finally {
    processing.value = false
  }
}

function formatDate(dt: string) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert class="h-6 w-6 text-primary-600" /> Multi-Tier Approval Center
          </h1>
          <p class="text-gray-500">Inbox for pending approvals, audit history, and multi-step workflow configurations.</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-gray-200">
        <button @click="activeTab = 'pending'"
          :class="['px-6 py-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-2', activeTab === 'pending' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700']">
          <Clock class="h-4 w-4" /> Pending Approvals
          <span class="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
            {{ store.pendingRequests.length }}
          </span>
        </button>
        <button @click="activeTab = 'chains'"
          :class="['px-6 py-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-2', activeTab === 'chains' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700']">
          <ShieldAlert class="h-4 w-4" /> Approval Chains Setup
          <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
            {{ store.chains.length }}
          </span>
        </button>
      </div>

      <!-- Pending Inbox Tab -->
      <div v-if="activeTab === 'pending'" class="space-y-4">
        <div v-for="req in store.pendingRequests" :key="req.uuid"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 capitalize">
                  Pending Step {{ req.current_step_order }}
                </span>
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                  {{ req.chain?.module }}
                </span>
              </div>
              <h3 class="font-bold text-gray-900 text-lg">{{ req.chain?.name }}</h3>
              <p class="text-xs text-gray-400 mt-1">
                Requested by <span class="font-semibold text-gray-700">{{ req.requester?.name || 'System User' }}</span> · {{ formatDate(req.created_at) }}
              </p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-3">
              <button @click="openActionModal(req, 'reject')"
                class="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5">
                <X class="h-4 w-4" /> Reject
              </button>
              <button @click="openActionModal(req, 'approve')"
                class="px-5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-sm font-semibold shadow-md shadow-emerald-100 transition-all flex items-center gap-1.5">
                <Check class="h-4 w-4" /> Approve Step {{ req.current_step_order }}
              </button>
            </div>
          </div>

          <!-- Histories timeline -->
          <div v-if="req.histories?.length" class="mt-4 pt-4 border-t border-gray-50 space-y-2">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Audit Trail</p>
            <div v-for="h in req.histories" :key="h.uuid" class="flex items-center gap-3 text-xs bg-gray-50 p-2.5 rounded-xl">
              <span :class="['p-1 rounded-lg', h.action === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
                <Check v-if="h.action === 'approved'" class="h-3 w-3" />
                <X v-else class="h-3 w-3" />
              </span>
              <span class="font-semibold text-gray-800">{{ h.approver?.name }}</span>
              <span class="text-gray-400">Step {{ h.step_order }}</span>
              <span v-if="h.comments" class="italic text-gray-600">"{{ h.comments }}"</span>
            </div>
          </div>
        </div>

        <div v-if="!store.pendingRequests.length" class="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
          <CheckCircle2 class="h-12 w-12 text-emerald-400 mx-auto mb-3" />
          <p class="text-gray-700 font-bold text-base">Inbox Clean!</p>
          <p class="text-xs text-gray-400 mt-1">There are no pending multi-tier approvals requiring your decision.</p>
        </div>
      </div>

      <!-- Approval Chains Setup Tab -->
      <div v-if="activeTab === 'chains'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="chain in store.chains" :key="chain.uuid"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-700 uppercase tracking-wider">
                {{ chain.module }}
              </span>
              <h3 class="font-bold text-gray-900 text-lg mt-1">{{ chain.name }}</h3>
            </div>
            <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', chain.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500']">
              {{ chain.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="mt-4 space-y-2">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Threshold Range</p>
            <p class="text-sm font-semibold text-gray-800">
              {{ formatCurrency(chain.min_amount) }}
              <span v-if="chain.max_amount"> – {{ formatCurrency(chain.max_amount) }}</span>
              <span v-else>+</span>
            </p>
          </div>

          <!-- Steps -->
          <div class="mt-4 pt-4 border-t border-gray-50 space-y-2">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Configured Steps</p>
            <div class="flex items-center gap-2 flex-wrap">
              <div v-for="step in chain.steps" :key="step.uuid"
                class="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700">
                <span class="h-5 w-5 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {{ step.step_order }}
                </span>
                <span class="capitalize">{{ step.approver_type.replace('_', ' ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve/Reject Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="actionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="actionModal = null" />

          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 class="font-bold text-lg text-gray-900 capitalize">
                {{ actionModal }} Approval Request
              </h3>
              <button @click="actionModal = null" class="p-1 text-gray-400 hover:text-gray-600">
                <X class="h-5 w-5" />
              </button>
            </div>

            <div v-if="modalError" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
              {{ modalError }}
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                {{ actionModal === 'approve' ? 'Comments (Optional)' : 'Reason for Rejection *' }}
              </label>
              <textarea v-model="actionInput" rows="3"
                :placeholder="actionModal === 'approve' ? 'Add any notes...' : 'State the reason for rejecting...'"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="actionModal = null"
                class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button @click="submitAction" :disabled="processing"
                :class="['px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center gap-2', actionModal === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700']">
                <Loader2 v-if="processing" class="h-4 w-4 animate-spin" />
                Confirm {{ actionModal }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
