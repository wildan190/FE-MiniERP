<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useArStore } from '@/stores/ar'
import Swal from 'sweetalert2'
import {
  Coins, ArrowLeft, Printer, Send, DollarSign, CheckCircle2,
  Calendar, FileText, Building2, Clock, Ban, Loader2, X, AlertCircle
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useArStore()

const invoiceUuid = computed(() => route.params.uuid as string)
const showPaymentModal = ref(false)
const saving = ref(false)
const modalError = ref('')

const paymentForm = ref({
  payment_date: new Date().toISOString().split('T')[0],
  amount: 0,
  payment_method: 'bank_transfer',
  reference_number: '',
  bank_account: 'BCA - 883019283 (Main Operational)',
  notes: ''
})

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-700' },
  sent:      { label: 'Sent',      cls: 'bg-blue-100 text-blue-700' },
  partial:   { label: 'Partial',   cls: 'bg-amber-100 text-amber-700' },
  paid:      { label: 'Paid',      cls: 'bg-emerald-100 text-emerald-700' },
  overdue:   { label: 'Overdue',   cls: 'bg-rose-100 text-rose-700' },
  cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-500' },
}

const invoice = computed(() => store.currentInvoice)
const balanceDue = computed(() => {
  if (!invoice.value) return 0
  return Math.max(0, Number(invoice.value.total_amount) - Number(invoice.value.paid_amount))
})

onMounted(async () => {
  if (invoiceUuid.value) {
    await store.fetchInvoice(invoiceUuid.value)
  }
})

function openPaymentModal() {
  if (!invoice.value) return
  paymentForm.value = {
    payment_date: new Date().toISOString().split('T')[0],
    amount: balanceDue.value,
    payment_method: 'bank_transfer',
    reference_number: '',
    bank_account: 'BCA - 883019283 (Main Operational)',
    notes: `Receipt for ${invoice.value.invoice_number}`
  }
  showPaymentModal.value = true
}

async function handleRecordPayment() {
  if (!invoice.value) return
  saving.value = true
  modalError.value = ''
  try {
    await store.recordPayment(invoice.value.uuid, paymentForm.value)
    showPaymentModal.value = false
    Swal.fire({
      icon: 'success',
      title: 'Payment Recorded!',
      text: 'Customer receipt has been posted to the General Ledger.',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (err: any) {
    modalError.value = err.response?.data?.message || err.message
  } finally {
    saving.value = false
  }
}

async function handleSendInvoice() {
  if (!invoice.value) return
  const confirm = await Swal.fire({
    title: 'Mark Invoice as Sent?',
    text: `Confirm issuing invoice "${invoice.value.invoice_number}" to ${invoice.value.customer_name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Mark as Sent',
    confirmButtonColor: '#3B82F6'
  })
  if (confirm.isConfirmed) {
    await store.sendInvoice(invoice.value.uuid)
    Swal.fire({ icon: 'success', title: 'Invoice Sent', timer: 1500, showConfirmButton: false })
  }
}

function handlePrint() {
  window.print()
}

function formatRp(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)
}
function formatDate(d: string) {
  return d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-5xl mx-auto space-y-6">

      <!-- Navigation & Actions Bar -->
      <div class="flex items-center justify-between print:hidden">
        <button
          @click="router.push('/finance/ar')"
          class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
        >
          <ArrowLeft class="h-4 w-4" /> Back to Invoices
        </button>

        <div class="flex items-center gap-2">
          <!-- Print Button -->
          <button
            @click="handlePrint"
            class="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Printer class="h-4 w-4 text-gray-500" />
            Print / PDF
          </button>

          <!-- Send Invoice Button -->
          <button
            v-if="invoice?.status === 'draft'"
            @click="handleSendInvoice"
            class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-200"
          >
            <Send class="h-4 w-4" />
            Send to Customer
          </button>

          <!-- Record Payment Button -->
          <button
            v-if="['sent', 'partial', 'overdue'].includes(invoice?.status)"
            @click="openPaymentModal"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-200"
          >
            <DollarSign class="h-4 w-4" />
            Record Payment
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="store.isLoading && !invoice" class="p-20 text-center">
        <Loader2 class="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
        <p class="text-xs text-gray-400">Loading invoice document...</p>
      </div>

      <!-- Printable Document Container -->
      <div v-else-if="invoice" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-8 print:border-none print:shadow-none print:p-0">

        <!-- Top Row: Brand & Status Header -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-gray-100 pb-8">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div class="h-9 w-9 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">
                ERP
              </div>
              <span class="text-xl font-black text-gray-900 tracking-tight">MiniERP Corporation</span>
            </div>
            <p class="text-xs text-gray-400 max-w-sm">
              Jl. Jendral Sudirman Kav. 52-53, Jakarta Selatan 12190<br />
              NPWP: 01.382.918.4-012.000 | finance@minierp.com
            </p>
          </div>

          <div class="text-left sm:text-right space-y-1">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Tax Invoice</span>
            <h2 class="text-2xl font-black text-indigo-600">{{ invoice.invoice_number }}</h2>
            <div class="pt-1">
              <span
                class="px-3 py-1 text-xs font-black uppercase rounded-lg"
                :class="STATUS_CONFIG[invoice.status]?.cls || 'bg-gray-100 text-gray-700'"
              >
                {{ STATUS_CONFIG[invoice.status]?.label || invoice.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Meta Grid: Billed To & Dates -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <!-- Billed To -->
          <div class="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1.5">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Billed To</span>
            <p class="text-sm font-extrabold text-gray-900">{{ invoice.customer_name }}</p>
            <p v-if="invoice.customer?.company_name" class="text-gray-600 font-semibold">{{ invoice.customer.company_name }}</p>
            <p class="text-gray-500">{{ invoice.customer_email || invoice.customer?.email || 'No email provided' }}</p>
            <p v-if="invoice.customer?.tax_id" class="text-gray-500">NPWP: {{ invoice.customer.tax_id }}</p>
          </div>

          <!-- Invoice Details -->
          <div class="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500 font-medium">Invoice Date:</span>
              <span class="font-bold text-gray-900">{{ formatDate(invoice.invoice_date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 font-medium">Payment Due Date:</span>
              <span class="font-bold text-gray-900">{{ formatDate(invoice.due_date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 font-medium">Payment Terms:</span>
              <span class="font-bold text-indigo-700 uppercase">{{ invoice.payment_terms?.replace('_', ' ') }}</span>
            </div>
            <div v-if="invoice.reference" class="flex justify-between">
              <span class="text-gray-500 font-medium">Customer PO / Ref:</span>
              <span class="font-bold text-gray-900">{{ invoice.reference }}</span>
            </div>
          </div>
        </div>

        <!-- Line Items Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th class="py-3 px-4">Item &amp; Description</th>
                <th class="py-3 px-4 text-right">Qty</th>
                <th class="py-3 px-4 text-right">Unit Price</th>
                <th class="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in invoice.items" :key="item.uuid">
                <td class="py-3.5 px-4">
                  <p class="font-bold text-gray-900">{{ item.item_name }}</p>
                  <p v-if="item.description" class="text-[11px] text-gray-400 mt-0.5">{{ item.description }}</p>
                </td>
                <td class="py-3.5 px-4 text-right font-medium text-gray-700">
                  {{ Number(item.quantity).toLocaleString('id-ID') }} {{ item.unit || 'pcs' }}
                </td>
                <td class="py-3.5 px-4 text-right font-medium text-gray-700">
                  {{ formatRp(item.unit_price) }}
                </td>
                <td class="py-3.5 px-4 text-right font-extrabold text-gray-900">
                  {{ formatRp(item.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bottom Summary & Settlement Balance -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pt-4 border-t border-gray-100">
          <div class="space-y-3 flex-1 text-xs text-gray-500">
            <div class="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-1">
              <span class="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Remittance Bank Details</span>
              <p class="font-bold text-gray-900">Bank Central Asia (BCA) - IDR</p>
              <p class="font-mono text-indigo-900 font-bold">883-019-2831</p>
              <p>a/n PT MiniERP Indonesia Sejahtera</p>
            </div>
            <p v-if="invoice.notes"><strong class="text-gray-700">Notes:</strong> {{ invoice.notes }}</p>
          </div>

          <div class="w-full sm:w-72 space-y-2 text-xs">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span class="font-bold text-gray-900">{{ formatRp(invoice.subtotal) }}</span>
            </div>
            <div v-if="invoice.discount_amount > 0" class="flex justify-between text-gray-600">
              <span>Discount:</span>
              <span class="font-bold text-rose-600">-{{ formatRp(invoice.discount_amount) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>VAT / PPN ({{ Number(invoice.tax_rate) }}%):</span>
              <span class="font-bold text-gray-900">{{ formatRp(invoice.tax_amount) }}</span>
            </div>
            <div class="pt-2 border-t border-gray-200 flex justify-between text-sm">
              <span class="font-black text-gray-900">Total Invoice:</span>
              <span class="font-black text-indigo-600 text-base">{{ formatRp(invoice.total_amount) }}</span>
            </div>
            <div class="flex justify-between text-emerald-700 font-semibold">
              <span>Amount Paid:</span>
              <span>-{{ formatRp(invoice.paid_amount) }}</span>
            </div>
            <div class="pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
              <span class="font-bold text-gray-700">Balance Due:</span>
              <span class="font-black text-base" :class="balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'">
                {{ formatRp(balanceDue) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Payment History Timeline -->
        <div v-if="invoice.payments && invoice.payments.length > 0" class="pt-6 border-t border-gray-100 space-y-3">
          <h4 class="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 class="h-4 w-4 text-emerald-600" />
            Payment &amp; Settlement History
          </h4>

          <div class="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden text-xs">
            <div v-for="pay in invoice.payments" :key="pay.uuid" class="p-3.5 bg-gray-50/50 flex items-center justify-between">
              <div>
                <p class="font-bold text-gray-900">{{ pay.payment_number }} &bull; {{ formatRp(pay.amount) }}</p>
                <p class="text-gray-400 text-[11px]">
                  Date: {{ formatDate(pay.payment_date) }} &bull; Method: {{ pay.payment_method?.replace('_', ' ') }}
                  <span v-if="pay.reference_number"> &bull; Ref: {{ pay.reference_number }}</span>
                </p>
              </div>
              <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg uppercase">
                Verified
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Payment Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPaymentModal && invoice" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up flex flex-col">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-emerald-50/50">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <DollarSign class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Record Customer Receipt</h3>
                  <p class="text-xs text-gray-500">Post settlement for {{ invoice.invoice_number }}.</p>
                </div>
              </div>
              <button @click="showPaymentModal = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form @submit.prevent="handleRecordPayment" class="p-6 space-y-4">
              <div class="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
                <div class="flex justify-between text-gray-600">
                  <span>Customer:</span>
                  <span class="font-bold text-gray-900">{{ invoice.customer_name }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Balance Due:</span>
                  <span class="font-black text-rose-600">{{ formatRp(balanceDue) }}</span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Receipt Date <span class="text-rose-500">*</span></label>
                <input
                  type="date"
                  v-model="paymentForm.payment_date"
                  required
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Payment Amount (Rp) <span class="text-rose-500">*</span></label>
                <input
                  type="number"
                  v-model="paymentForm.amount"
                  :max="balanceDue"
                  min="1"
                  required
                  class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                  <select
                    v-model="paymentForm.payment_method"
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-300"
                  >
                    <option value="bank_transfer">Bank Transfer (VA/Manual)</option>
                    <option value="qris">QRIS</option>
                    <option value="midtrans_va">Midtrans VA</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque / Giro</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Bank / Ref Number</label>
                  <input
                    v-model="paymentForm.reference_number"
                    placeholder="e.g. TRF-920192"
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>

              <div v-if="modalError" class="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
                {{ modalError }}
              </div>

              <div class="pt-2 flex gap-3">
                <button
                  type="button"
                  @click="showPaymentModal = false"
                  class="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-2xl text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                  <span v-else>Confirm Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<style scoped>
@media print {
  body {
    background: white !important;
  }
}
</style>
