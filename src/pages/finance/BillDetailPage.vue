<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useApStore } from '@/stores/ap'
import { ArrowLeft, CheckCircle2, Send, RefreshCw, Clock, AlertTriangle, Loader2, X, BadgeCheck } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useApStore()

const showPayModal = ref(false)
const saving = ref(false)
const reconciling = ref<string | null>(null)
const modalError = ref('')
const payForm = ref({ amount: 0, payment_method: 'midtrans_iris', notes: '' })

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  draft:    { label: 'Draft',    cls: 'bg-gray-100 text-gray-600' },
  approved: { label: 'Approved', cls: 'bg-blue-100 text-blue-700' },
  partial:  { label: 'Partial',  cls: 'bg-amber-100 text-amber-700' },
  paid:     { label: 'Paid',     cls: 'bg-emerald-100 text-emerald-700' },
  cancelled:{ label: 'Cancelled',cls: 'bg-rose-100 text-rose-700' },
}

const MIDTRANS_STATUS: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pending',   cls: 'text-amber-600' },
  queued:    { label: 'Queued',    cls: 'text-blue-600' },
  processed: { label: 'Processed', cls: 'text-emerald-600' },
  failed:    { label: 'Failed',    cls: 'text-rose-600' },
}

onMounted(async () => {
  await store.fetchBill(route.params.uuid as string)
  if (store.currentBill) {
    payForm.value.amount = store.currentBill.outstanding_amount ?? 0
  }
})

async function handleApprove() {
  saving.value = true
  try {
    await store.approveBill(route.params.uuid as string)
  } finally { saving.value = false }
}

async function handlePay() {
  saving.value = true; modalError.value = ''
  try {
    await store.payBill(route.params.uuid as string, payForm.value)
    showPayModal.value = false
  } catch (e: any) {
    modalError.value = e.response?.data?.message || e.message
  } finally { saving.value = false }
}

async function handleReconcile(paymentUuid: string) {
  reconciling.value = paymentUuid
  try {
    await store.reconcile(paymentUuid)
    await store.fetchBill(route.params.uuid as string)
  } finally { reconciling.value = null }
}

function formatRp(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val ?? 0)
}
function formatDate(d: string) {
  return d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}
function formatDateTime(d: string) {
  return d ? new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
}
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-4xl mx-auto space-y-6">
      <button @click="router.back()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-semibold transition-colors">
        <ArrowLeft class="h-4 w-4" /> Back to Account Payable
      </button>

      <div v-if="!store.currentBill" class="text-center py-20 text-gray-400">
        <Loader2 class="h-10 w-10 animate-spin mx-auto" />
      </div>

      <template v-else>
        <!-- Bill Header -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span :class="['px-2.5 py-1 text-xs font-bold rounded-full', STATUS_CONFIG[store.currentBill.status]?.cls]">
                  {{ STATUS_CONFIG[store.currentBill.status]?.label }}
                </span>
                <span v-if="new Date(store.currentBill.due_date) < new Date() && !['paid','cancelled'].includes(store.currentBill.status)"
                  class="flex items-center gap-1 text-xs text-rose-600 font-bold">
                  <AlertTriangle class="h-3.5 w-3.5" /> Overdue
                </span>
              </div>
              <h1 class="text-2xl font-black text-gray-900">{{ store.currentBill.bill_number }}</h1>
              <p class="text-gray-500 font-semibold">{{ store.currentBill.vendor?.name }}</p>
              <p v-if="store.currentBill.reference" class="text-xs text-gray-400 mt-0.5">Ref: {{ store.currentBill.reference }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">Total Amount</p>
              <p class="text-3xl font-black text-gray-900">{{ formatRp(store.currentBill.total_amount) }}</p>
              <p v-if="store.currentBill.paid_amount > 0" class="text-sm text-emerald-600 font-semibold">
                Paid: {{ formatRp(store.currentBill.paid_amount) }}
              </p>
              <p v-if="store.currentBill.outstanding_amount > 0" class="text-sm text-rose-600 font-bold">
                Outstanding: {{ formatRp(store.currentBill.outstanding_amount) }}
              </p>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-50">
            <div>
              <p class="text-xs text-gray-400">Bill Date</p>
              <p class="font-semibold text-gray-800">{{ formatDate(store.currentBill.bill_date) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Due Date</p>
              <p class="font-semibold text-gray-800">{{ formatDate(store.currentBill.due_date) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Approved By</p>
              <p class="font-semibold text-gray-800">{{ store.currentBill.approved_by?.name || '—' }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6">
            <button v-if="store.currentBill.status === 'draft'" @click="handleApprove" :disabled="saving"
              class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60">
              <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
              <BadgeCheck v-else class="h-4 w-4" />
              Approve Bill
            </button>
            <button v-if="['approved', 'partial'].includes(store.currentBill.status)"
              @click="showPayModal = true"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-md shadow-emerald-100 flex items-center gap-2">
              <Send class="h-4 w-4" /> Pay via Midtrans Iris
            </button>
          </div>
        </div>

        <!-- Line Items -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 class="font-bold text-gray-900 mb-4">Line Items</h2>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider text-left">
                <th class="pb-2">Description</th>
                <th class="pb-2 text-right">Qty</th>
                <th class="pb-2 text-right">Unit Price</th>
                <th class="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in store.currentBill.items" :key="item.uuid" class="border-b border-gray-50">
                <td class="py-2.5 font-medium text-gray-800">{{ item.description }}</td>
                <td class="py-2.5 text-right text-gray-500">{{ item.quantity }}</td>
                <td class="py-2.5 text-right text-gray-500">{{ formatRp(item.unit_price) }}</td>
                <td class="py-2.5 text-right font-semibold text-gray-900">{{ formatRp(item.amount) }}</td>
              </tr>
            </tbody>
            <tfoot class="border-t border-gray-200">
              <tr>
                <td colspan="3" class="pt-3 text-right font-semibold text-gray-600">Subtotal</td>
                <td class="pt-3 text-right font-bold text-gray-900">{{ formatRp(store.currentBill.subtotal) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="pt-1 text-right font-semibold text-gray-600">Tax</td>
                <td class="pt-1 text-right font-bold text-gray-900">{{ formatRp(store.currentBill.tax_amount) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="pt-2 text-right font-black text-gray-900 text-base">Total</td>
                <td class="pt-2 text-right font-black text-gray-900 text-base">{{ formatRp(store.currentBill.total_amount) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Payment Timeline -->
        <div v-if="store.currentBill.payments?.length" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 class="font-bold text-gray-900 mb-4">Payment History</h2>
          <div class="space-y-3">
            <div v-for="p in store.currentBill.payments" :key="p.uuid"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl" :class="p.midtrans_status === 'processed' ? 'bg-emerald-100' : p.midtrans_status === 'failed' ? 'bg-rose-100' : 'bg-amber-100'">
                  <CheckCircle2 v-if="p.midtrans_status === 'processed'" class="h-4 w-4 text-emerald-600" />
                  <Clock v-else class="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ formatRp(p.amount) }}</p>
                  <p class="text-xs text-gray-400">{{ formatDateTime(p.payment_date) }} · via {{ p.payment_method.replace('_', ' ').toUpperCase() }}</p>
                  <p v-if="p.midtrans_reference_no" class="text-xs font-mono text-gray-500 mt-0.5">{{ p.midtrans_reference_no }}</p>
                  <span v-if="p.midtrans_status" :class="['text-xs font-bold', MIDTRANS_STATUS[p.midtrans_status]?.cls]">
                    {{ MIDTRANS_STATUS[p.midtrans_status]?.label }}
                  </span>
                </div>
              </div>
              <button v-if="['pending', 'queued'].includes(p.midtrans_status)"
                @click="handleReconcile(p.uuid)"
                :disabled="reconciling === p.uuid"
                class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 flex items-center gap-1 disabled:opacity-60">
                <RefreshCw class="h-3.5 w-3.5" :class="reconciling === p.uuid ? 'animate-spin' : ''" />
                Sync
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Pay Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPayModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showPayModal = false" />
          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Process Payment</h2>
              <button @click="showPayModal = false"><X class="h-5 w-5 text-gray-400" /></button>
            </div>
            <div v-if="modalError" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{{ modalError }}</div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Amount *</label>
                <input v-model.number="payForm.amount" type="number" min="1"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono" />
                <p class="text-xs text-gray-400 mt-1">Outstanding: {{ formatRp(store.currentBill?.outstanding_amount ?? 0) }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Method</label>
                <select v-model="payForm.payment_method" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
                  <option value="midtrans_iris">Midtrans Iris (Auto Disbursement)</option>
                  <option value="bank_transfer">Manual Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea v-model="payForm.notes" rows="2" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none" />
              </div>
            </div>
            <div v-if="payForm.payment_method === 'midtrans_iris'"
              class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">
              Dana akan langsung di-disbursement ke rekening vendor melalui <strong>Midtrans Iris API</strong>.
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button @click="showPayModal = false" class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold">Cancel</button>
              <button @click="handlePay" :disabled="saving"
                class="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60 shadow-md shadow-emerald-100">
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                <Send v-else class="h-4 w-4" />
                {{ saving ? 'Processing...' : 'Confirm Payment' }}
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
