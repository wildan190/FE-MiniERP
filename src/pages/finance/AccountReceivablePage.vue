<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useArStore } from '@/stores/ar'
import Swal from 'sweetalert2'
import {
  Coins, Users, AlertTriangle, Clock, CheckCircle2,
  Plus, RefreshCw, ExternalLink, ArrowDownLeft, ChevronRight, Loader2, X,
  FileText, Search, Building2, Calendar, CreditCard, Send, Ban, DollarSign
} from 'lucide-vue-next'

const store = useArStore()
const router = useRouter()

const activeTab = ref<'invoices' | 'customers'>('invoices')
const filterStatus = ref('')
const searchQuery = ref('')
const showInvoiceModal = ref(false)
const showPaymentModal = ref(false)
const selectedInvoiceForPayment = ref<any>(null)
const saving = ref(false)
const modalError = ref('')

// Form New Invoice
const newInvoice = ref({
  customer_uuid: '',
  customer_name: '',
  customer_email: '',
  reference: '',
  invoice_date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  payment_terms: 'net_30',
  tax_rate: 11,
  discount_amount: 0,
  notes: '',
  terms_and_conditions: 'Payment is due within designated terms. Late payments are subject to a 1.5% monthly fee.',
  items: [
    { item_name: '', description: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_rate: 0 }
  ]
})

// Form Record Payment
const paymentForm = ref({
  payment_date: new Date().toISOString().split('T')[0],
  amount: 0,
  payment_method: 'bank_transfer',
  reference_number: '',
  bank_account: 'BCA - 883019283 (Main Operational)',
  notes: ''
})

const PAYMENT_TERMS_OPTIONS = [
  { value: 'due_on_receipt', label: 'Due On Receipt' },
  { value: 'net_15', label: 'Net 15 Days' },
  { value: 'net_30', label: 'Net 30 Days' },
  { value: 'net_60', label: 'Net 60 Days' },
  { value: 'custom', label: 'Custom Date' }
]

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer (VA/Manual)' },
  { value: 'qris', label: 'QRIS' },
  { value: 'midtrans_va', label: 'Midtrans Virtual Account' },
  { value: 'cash', label: 'Cash Receipt' },
  { value: 'cheque', label: 'Cheque / Giro' },
  { value: 'other', label: 'Other Method' }
]

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-700 border-gray-200' },
  sent:      { label: 'Sent',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  partial:   { label: 'Partial',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  paid:      { label: 'Paid',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  overdue:   { label: 'Overdue',   cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
}

onMounted(async () => {
  await Promise.all([
    store.fetchDashboard(),
    store.fetchInvoices(),
    store.fetchCustomers()
  ])
})

const filteredInvoices = computed(() => {
  let list = store.invoices
  if (filterStatus.value) {
    list = list.filter(i => i.status === filterStatus.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(i =>
      i.invoice_number?.toLowerCase().includes(q) ||
      i.customer_name?.toLowerCase().includes(q) ||
      i.reference?.toLowerCase().includes(q)
    )
  }
  return list
})

// Subtotal & Calculations
const invoiceSubtotal = computed(() => {
  return newInvoice.value.items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0
    const price = Number(item.unit_price) || 0
    const disc = Number(item.discount_rate) || 0
    return sum + (qty * price * (1 - disc / 100))
  }, 0)
})

const invoiceTaxAmount = computed(() => {
  const taxable = Math.max(0, invoiceSubtotal.value - (Number(newInvoice.value.discount_amount) || 0))
  return taxable * ((Number(newInvoice.value.tax_rate) || 0) / 100)
})

const invoiceTotalAmount = computed(() => {
  const taxable = Math.max(0, invoiceSubtotal.value - (Number(newInvoice.value.discount_amount) || 0))
  return taxable + invoiceTaxAmount.value
})

function addItemRow() {
  newInvoice.value.items.push({
    item_name: '', description: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_rate: 0
  })
}

function removeItemRow(index: number) {
  if (newInvoice.value.items.length > 1) {
    newInvoice.value.items.splice(index, 1)
  }
}

function onCustomerSelected(e: Event) {
  const uuid = (e.target as HTMLSelectElement).value
  const cust = store.customers.find(c => c.uuid === uuid)
  if (cust) {
    newInvoice.value.customer_uuid = cust.uuid
    newInvoice.value.customer_name = cust.name || cust.company_name
    newInvoice.value.customer_email = cust.email || ''
    if (cust.payment_terms) {
      newInvoice.value.payment_terms = cust.payment_terms
      onPaymentTermsChange()
    }
  }
}

function onPaymentTermsChange() {
  const term = newInvoice.value.payment_terms
  const invDate = new Date(newInvoice.value.invoice_date || Date.now())
  let addDays = 30
  if (term === 'due_on_receipt') addDays = 0
  else if (term === 'net_15') addDays = 15
  else if (term === 'net_30') addDays = 30
  else if (term === 'net_60') addDays = 60

  if (term !== 'custom') {
    const due = new Date(invDate.getTime() + addDays * 86400000)
    newInvoice.value.due_date = due.toISOString().split('T')[0]
  }
}

async function handleSaveInvoice() {
  saving.value = true
  modalError.value = ''
  try {
    await store.createInvoice(newInvoice.value)
    showInvoiceModal.value = false
    Swal.fire({
      icon: 'success',
      title: 'Invoice Created!',
      text: 'Customer invoice generated in Draft status.',
      timer: 1500,
      showConfirmButton: false
    })
    // Reset form
    newInvoice.value = {
      customer_uuid: '',
      customer_name: '',
      customer_email: '',
      reference: '',
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      payment_terms: 'net_30',
      tax_rate: 11,
      discount_amount: 0,
      notes: '',
      terms_and_conditions: 'Payment is due within designated terms. Late payments are subject to a 1.5% monthly fee.',
      items: [{ item_name: '', description: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_rate: 0 }]
    }
  } catch (err: any) {
    modalError.value = err.response?.data?.message || err.message
  } finally {
    saving.value = false
  }
}

function openPaymentModal(invoice: any) {
  selectedInvoiceForPayment.value = invoice
  const balance = Math.max(0, Number(invoice.total_amount) - Number(invoice.paid_amount))
  paymentForm.value = {
    payment_date: new Date().toISOString().split('T')[0],
    amount: balance,
    payment_method: 'bank_transfer',
    reference_number: '',
    bank_account: 'BCA - 883019283 (Main Operational)',
    notes: `Receipt for ${invoice.invoice_number}`
  }
  showPaymentModal.value = true
}

async function handleRecordPayment() {
  if (!selectedInvoiceForPayment.value) return
  saving.value = true
  modalError.value = ''
  try {
    await store.recordPayment(selectedInvoiceForPayment.value.uuid, paymentForm.value)
    showPaymentModal.value = false
    Swal.fire({
      icon: 'success',
      title: 'Payment Recorded!',
      text: 'Customer receipt posted to General Ledger and invoice balance updated.',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (err: any) {
    modalError.value = err.response?.data?.message || err.message
  } finally {
    saving.value = false
  }
}

async function handleSendInvoice(invoice: any) {
  const confirm = await Swal.fire({
    title: 'Send Invoice?',
    text: `Mark invoice "${invoice.invoice_number}" as sent to ${invoice.customer_name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Mark as Sent',
    confirmButtonColor: '#3B82F6'
  })
  if (confirm.isConfirmed) {
    await store.sendInvoice(invoice.uuid)
    Swal.fire({ icon: 'success', title: 'Invoice Sent', timer: 1500, showConfirmButton: false })
  }
}

async function handleCancelInvoice(invoice: any) {
  const { value: reason } = await Swal.fire({
    title: 'Cancel Invoice',
    text: `Enter reason for voiding invoice ${invoice.invoice_number}:`,
    input: 'textarea',
    inputPlaceholder: 'e.g. Incorrect order terms, customer requested reissuance...',
    inputValidator: (v) => !v ? 'Reason is required!' : null,
    showCancelButton: true,
    confirmButtonText: 'Void Invoice',
    confirmButtonColor: '#EF4444'
  })
  if (reason) {
    await store.cancelInvoice(invoice.uuid, reason)
    Swal.fire({ icon: 'info', title: 'Invoice Cancelled', timer: 1500, showConfirmButton: false })
  }
}

function formatRp(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)
}
function formatDate(d: string) {
  return d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}
function isOverdue(due: string, status: string) {
  return new Date(due) < new Date() && !['paid', 'cancelled'].includes(status)
}
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div class="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600 shadow-xs">
              <Coins class="h-7 w-7" />
            </div>
            Accounts Receivable (AR)
          </h1>
          <p class="text-gray-500 text-sm mt-1">
            Enterprise customer invoicing, revenue recognition, collection aging analysis, and payment receipts.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="() => { store.fetchDashboard(); store.fetchInvoices(); store.fetchCustomers(); }"
            class="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl shadow-xs flex items-center gap-2 text-sm transition-all"
          >
            <RefreshCw class="h-4 w-4 text-gray-500" :class="{ 'animate-spin': store.isLoading }" />
            <span>Refresh</span>
          </button>
          <button
            @click="showInvoiceModal = true"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md shadow-indigo-200 flex items-center gap-2 text-sm transition-all"
          >
            <Plus class="h-4 w-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Outstanding AR -->
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Outstanding AR</p>
            <p class="text-2xl font-black text-gray-900 mt-1">
              {{ formatRp(store.dashboard?.total_outstanding) }}
            </p>
            <p class="text-[11px] text-indigo-600 font-semibold mt-1">
              {{ store.dashboard?.active_invoices_count || 0 }} open invoice(s)
            </p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Coins class="h-6 w-6" />
          </div>
        </div>

        <!-- Overdue Amount -->
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Overdue Receivables</p>
            <p class="text-2xl font-black text-rose-600 mt-1">
              {{ formatRp(store.dashboard?.overdue_amount) }}
            </p>
            <p class="text-[11px] text-rose-500 font-semibold mt-1">Requires collection action</p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle class="h-6 w-6" />
          </div>
        </div>

        <!-- Collected This Month -->
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Collected This Month</p>
            <p class="text-2xl font-black text-emerald-600 mt-1">
              {{ formatRp(store.dashboard?.collected_this_month) }}
            </p>
            <p class="text-[11px] text-emerald-600 font-semibold mt-1">Verified cash inflows</p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft class="h-6 w-6" />
          </div>
        </div>

        <!-- Total Invoices Tracked -->
        <div class="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-indigo-100 uppercase tracking-widest">Total Invoices</p>
            <p class="text-3xl font-black text-white mt-1">
              {{ store.dashboard?.total_invoices_count || 0 }}
            </p>
            <p class="text-[11px] text-indigo-100 font-semibold mt-1">
              {{ store.customers?.length || 0 }} registered customer(s)
            </p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-white/20 text-white flex items-center justify-center">
            <FileText class="h-6 w-6" />
          </div>
        </div>
      </div>

      <!-- Aging Buckets Distribution Bar -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <Clock class="h-5 w-5 text-indigo-600" />
            <h3 class="text-base font-extrabold text-gray-900">AR Aging Schedule (Outstanding Aging Distribution)</h3>
          </div>
          <span class="text-xs text-gray-400 font-medium">Auto-calculated from invoice due dates</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <!-- Current -->
          <div class="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
            <div class="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              <span>Current (<span class="font-mono">&le;</span> Due)</span>
              <span class="px-1.5 py-0.5 bg-emerald-100 rounded-md">{{ store.dashboard?.aging?.current?.count || 0 }}</span>
            </div>
            <p class="text-lg font-black text-emerald-700 mt-2">
              {{ formatRp(store.dashboard?.aging?.current?.amount) }}
            </p>
          </div>

          <!-- 1 - 30 Days -->
          <div class="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl">
            <div class="flex items-center justify-between text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              <span>1 - 30 Days</span>
              <span class="px-1.5 py-0.5 bg-blue-100 rounded-md">{{ store.dashboard?.aging?.days_1_30?.count || 0 }}</span>
            </div>
            <p class="text-lg font-black text-blue-700 mt-2">
              {{ formatRp(store.dashboard?.aging?.days_1_30?.amount) }}
            </p>
          </div>

          <!-- 31 - 60 Days -->
          <div class="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
            <div class="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              <span>31 - 60 Days</span>
              <span class="px-1.5 py-0.5 bg-amber-100 rounded-md">{{ store.dashboard?.aging?.days_31_60?.count || 0 }}</span>
            </div>
            <p class="text-lg font-black text-amber-700 mt-2">
              {{ formatRp(store.dashboard?.aging?.days_31_60?.amount) }}
            </p>
          </div>

          <!-- 61 - 90 Days -->
          <div class="p-4 bg-orange-50/60 border border-orange-100 rounded-2xl">
            <div class="flex items-center justify-between text-[11px] font-bold text-orange-800 uppercase tracking-wider">
              <span>61 - 90 Days</span>
              <span class="px-1.5 py-0.5 bg-orange-100 rounded-md">{{ store.dashboard?.aging?.days_61_90?.count || 0 }}</span>
            </div>
            <p class="text-lg font-black text-orange-700 mt-2">
              {{ formatRp(store.dashboard?.aging?.days_61_90?.amount) }}
            </p>
          </div>

          <!-- > 90 Days -->
          <div class="p-4 bg-rose-50/60 border border-rose-100 rounded-2xl col-span-2 sm:col-span-1">
            <div class="flex items-center justify-between text-[11px] font-bold text-rose-800 uppercase tracking-wider">
              <span>&gt; 90 Days Overdue</span>
              <span class="px-1.5 py-0.5 bg-rose-100 rounded-md">{{ store.dashboard?.aging?.over_90?.count || 0 }}</span>
            </div>
            <p class="text-lg font-black text-rose-700 mt-2">
              {{ formatRp(store.dashboard?.aging?.over_90?.amount) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tab Navigation & Filters -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-2">
        <div class="flex gap-4">
          <button
            @click="activeTab = 'invoices'"
            class="pb-3 text-sm font-bold border-b-2 transition-all"
            :class="activeTab === 'invoices' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Customer Invoices ({{ store.invoices?.length || 0 }})
          </button>
          <button
            @click="activeTab = 'customers'"
            class="pb-3 text-sm font-bold border-b-2 transition-all"
            :class="activeTab === 'customers' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          >
            Debtors &amp; Customers ({{ store.customers?.length || 0 }})
          </button>
        </div>

        <div v-if="activeTab === 'invoices'" class="flex items-center gap-3">
          <div class="relative min-w-[220px]">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              placeholder="Search invoice or customer..."
              class="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <select
            v-model="filterStatus"
            class="px-3 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="partial">Partial Paid</option>
            <option value="paid">Fully Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- ================= TAB 1: INVOICES TABLE ================= -->
      <div v-if="activeTab === 'invoices'" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div v-if="filteredInvoices.length === 0" class="p-16 text-center">
          <FileText class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h4 class="font-bold text-gray-900 text-base">No Customer Invoices Found</h4>
          <p class="text-xs text-gray-400 mt-1">Generate customer invoices to track receivables and collections.</p>
          <button
            @click="showInvoiceModal = true"
            class="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-all inline-flex items-center gap-2"
          >
            <Plus class="h-4 w-4" /> Create First Invoice
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left min-w-[800px]">
            <thead>
              <tr class="bg-gray-50/70 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th class="px-6 py-4">Invoice #</th>
                <th class="px-6 py-4">Customer</th>
                <th class="px-6 py-4">Dates &amp; Terms</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Total Amount</th>
                <th class="px-6 py-4 text-right">Balance Due</th>
                <th class="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-sm">
              <tr v-for="inv in filteredInvoices" :key="inv.uuid" class="hover:bg-gray-50/50 transition-colors">
                <!-- Invoice # -->
                <td class="px-6 py-4">
                  <RouterLink
                    :to="`/finance/ar/${inv.uuid}`"
                    class="font-extrabold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5"
                  >
                    <span>{{ inv.invoice_number }}</span>
                  </RouterLink>
                  <span v-if="inv.reference" class="text-[11px] text-gray-400 block mt-0.5">
                    Ref: {{ inv.reference }}
                  </span>
                </td>

                <!-- Customer -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                      {{ inv.customer_name?.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 text-xs">{{ inv.customer_name }}</p>
                      <p class="text-[10px] text-gray-400 truncate max-w-[160px]">{{ inv.customer_email || 'No email' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Dates & Terms -->
                <td class="px-6 py-4 text-xs">
                  <div class="space-y-0.5">
                    <p class="text-gray-700 font-medium">Inv: {{ formatDate(inv.invoice_date) }}</p>
                    <p :class="isOverdue(inv.due_date, inv.status) ? 'text-rose-600 font-bold' : 'text-gray-400'">
                      Due: {{ formatDate(inv.due_date) }}
                      <span v-if="isOverdue(inv.due_date, inv.status)" class="text-[10px] px-1 py-0.2 bg-rose-100 rounded">OVERDUE</span>
                    </p>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border"
                    :class="STATUS_CONFIG[inv.status]?.cls || 'bg-gray-100 text-gray-600'"
                  >
                    {{ STATUS_CONFIG[inv.status]?.label || inv.status }}
                  </span>
                </td>

                <!-- Total Amount -->
                <td class="px-6 py-4 text-right">
                  <span class="font-extrabold text-gray-900 text-xs">
                    {{ formatRp(inv.total_amount) }}
                  </span>
                </td>

                <!-- Balance Due -->
                <td class="px-6 py-4 text-right">
                  <span
                    class="font-black text-xs"
                    :class="inv.balance_due > 0 ? (isOverdue(inv.due_date, inv.status) ? 'text-rose-600' : 'text-indigo-600') : 'text-emerald-600'"
                  >
                    {{ inv.balance_due > 0 ? formatRp(inv.balance_due) : 'Settled' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <!-- Record Payment Button -->
                    <button
                      v-if="['sent', 'partial', 'overdue'].includes(inv.status)"
                      @click="openPaymentModal(inv)"
                      class="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                      title="Record Payment"
                    >
                      <DollarSign class="h-3.5 w-3.5" />
                      Pay
                    </button>

                    <!-- Send Button -->
                    <button
                      v-if="inv.status === 'draft'"
                      @click="handleSendInvoice(inv)"
                      class="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      title="Mark as Sent"
                    >
                      <Send class="h-3.5 w-3.5" />
                      Send
                    </button>

                    <!-- View Details -->
                    <RouterLink
                      :to="`/finance/ar/${inv.uuid}`"
                      class="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs transition-all"
                      title="View Details"
                    >
                      <ChevronRight class="h-4 w-4" />
                    </RouterLink>

                    <!-- Cancel / Void -->
                    <button
                      v-if="['draft', 'sent'].includes(inv.status) && inv.paid_amount == 0"
                      @click="handleCancelInvoice(inv)"
                      class="p-1.5 hover:bg-rose-50 text-rose-500 rounded-xl text-xs transition-all"
                      title="Cancel Invoice"
                    >
                      <Ban class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================= TAB 2: DEBTORS & CUSTOMERS ================= -->
      <div v-else-if="activeTab === 'customers'" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div v-if="store.customers.length === 0" class="p-16 text-center">
          <Users class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h4 class="font-bold text-gray-900 text-base">No Customers Found</h4>
          <p class="text-xs text-gray-400 mt-1">Customers from the CRM module will appear here with active credit risk profiling.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left min-w-[700px]">
            <thead>
              <tr class="bg-gray-50/70 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th class="px-6 py-4">Customer Name</th>
                <th class="px-6 py-4">Contact Info</th>
                <th class="px-6 py-4">Default Terms</th>
                <th class="px-6 py-4 text-center">Open Invoices</th>
                <th class="px-6 py-4 text-right">Credit Limit</th>
                <th class="px-6 py-4 text-right">Total Outstanding</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-sm">
              <tr v-for="cust in store.customers" :key="cust.uuid" class="hover:bg-gray-50/50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2.5">
                    <div class="h-8 w-8 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">
                      {{ (cust.name || cust.company_name || 'C').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 text-xs">{{ cust.name }}</p>
                      <p v-if="cust.company_name" class="text-[11px] text-gray-400">{{ cust.company_name }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-xs text-gray-600">
                  <p>{{ cust.email || '—' }}</p>
                  <p class="text-gray-400 text-[11px]">{{ cust.phone || '' }}</p>
                </td>
                <td class="px-6 py-4 text-xs font-semibold text-gray-700 uppercase">
                  {{ cust.payment_terms?.replace('_', ' ') || 'Net 30' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="px-2 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-xs">
                    {{ cust.active_invoices || 0 }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-xs text-gray-600 font-medium">
                  {{ cust.credit_limit > 0 ? formatRp(cust.credit_limit) : 'No Limit' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span
                    class="font-black text-xs"
                    :class="cust.total_outstanding > 0 ? 'text-indigo-600' : 'text-gray-400'"
                  >
                    {{ formatRp(cust.total_outstanding) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ================= MODAL: CREATE CUSTOMER INVOICE ================= -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showInvoiceModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <!-- Header -->
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-indigo-50/50">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Coins class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">New Customer Invoice (AR)</h3>
                  <p class="text-xs text-gray-500">Bill customers, define line items, and schedule payment due dates.</p>
                </div>
              </div>
              <button @click="showInvoiceModal = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <!-- Form Body -->
            <form @submit.prevent="handleSaveInvoice" class="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <!-- Customer & Reference Section -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Customer <span class="text-rose-500">*</span></label>
                  <select
                    v-model="newInvoice.customer_uuid"
                    @change="onCustomerSelected"
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="">Select Customer...</option>
                    <option v-for="c in store.customers" :key="c.uuid" :value="c.uuid">
                      {{ c.name }} {{ c.company_name ? `(${c.company_name})` : '' }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Customer Name (Display) <span class="text-rose-500">*</span></label>
                  <input
                    v-model="newInvoice.customer_name"
                    required
                    placeholder="e.g. Acme Corp / PT Maju Jaya"
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Reference / PO #</label>
                  <input
                    v-model="newInvoice.reference"
                    placeholder="e.g. PO-2026-0901"
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <!-- Dates & Terms -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Invoice Date <span class="text-rose-500">*</span></label>
                  <input
                    type="date"
                    v-model="newInvoice.invoice_date"
                    @change="onPaymentTermsChange"
                    required
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Payment Terms</label>
                  <select
                    v-model="newInvoice.payment_terms"
                    @change="onPaymentTermsChange"
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300"
                  >
                    <option v-for="t in PAYMENT_TERMS_OPTIONS" :key="t.value" :value="t.value">{{ t.label }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Due Date <span class="text-rose-500">*</span></label>
                  <input
                    type="date"
                    v-model="newInvoice.due_date"
                    required
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <!-- Line Items Section -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Line Items</h4>
                  <button
                    type="button"
                    @click="addItemRow"
                    class="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-xs hover:bg-indigo-100 transition-colors flex items-center gap-1"
                  >
                    <Plus class="h-3 w-3" /> Add Item
                  </button>
                </div>

                <div class="space-y-2">
                  <div
                    v-for="(item, idx) in newInvoice.items"
                    :key="idx"
                    class="p-3 bg-gray-50/70 border border-gray-200/80 rounded-2xl grid grid-cols-12 gap-2 items-center text-xs"
                  >
                    <div class="col-span-12 sm:col-span-4">
                      <input
                        v-model="item.item_name"
                        required
                        placeholder="Item name / Service..."
                        class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div class="col-span-4 sm:col-span-2">
                      <input
                        type="number"
                        v-model="item.quantity"
                        min="0.01"
                        step="any"
                        placeholder="Qty"
                        class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-right"
                      />
                    </div>
                    <div class="col-span-8 sm:col-span-3">
                      <input
                        type="number"
                        v-model="item.unit_price"
                        min="0"
                        placeholder="Price (Rp)"
                        class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-right"
                      />
                    </div>
                    <div class="col-span-10 sm:col-span-2 text-right font-extrabold text-gray-800">
                      {{ formatRp(item.quantity * item.unit_price * (1 - (item.discount_rate || 0)/100)) }}
                    </div>
                    <div class="col-span-2 sm:col-span-1 text-center">
                      <button
                        type="button"
                        @click="removeItemRow(idx)"
                        class="p-1 text-gray-400 hover:text-rose-600 rounded-md"
                        :disabled="newInvoice.items.length === 1"
                      >
                        <X class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Financial Summary Calculation -->
              <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-bold text-gray-900">{{ formatRp(invoiceSubtotal) }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-600">
                  <span>VAT / PPN Rate (%)</span>
                  <div class="flex items-center gap-2">
                    <input
                      type="number"
                      v-model="newInvoice.tax_rate"
                      min="0"
                      max="100"
                      class="w-16 px-2 py-1 border border-gray-200 rounded-lg text-right text-xs bg-white"
                    />
                    <span class="font-bold text-gray-900">{{ formatRp(invoiceTaxAmount) }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center text-gray-600">
                  <span>Discount Amount (Rp)</span>
                  <input
                    type="number"
                    v-model="newInvoice.discount_amount"
                    min="0"
                    class="w-32 px-2 py-1 border border-gray-200 rounded-lg text-right text-xs bg-white"
                  />
                </div>
                <div class="pt-2 border-t border-gray-200 flex justify-between items-center text-sm">
                  <span class="font-extrabold text-gray-900">Total Invoice Amount</span>
                  <span class="font-black text-indigo-700 text-lg">{{ formatRp(invoiceTotalAmount) }}</span>
                </div>
              </div>

              <div v-if="modalError" class="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
                {{ modalError }}
              </div>

              <!-- Footer -->
              <div class="pt-2 flex gap-3">
                <button
                  type="button"
                  @click="showInvoiceModal = false"
                  class="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-2xl text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                  <span v-else>Create &amp; Save Draft</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ================= MODAL: RECORD CUSTOMER PAYMENT ================= -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPaymentModal && selectedInvoiceForPayment" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up flex flex-col">
            <!-- Header -->
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-emerald-50/50">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <DollarSign class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Record Customer Payment</h3>
                  <p class="text-xs text-gray-500">Post settlement towards invoice {{ selectedInvoiceForPayment.invoice_number }}.</p>
                </div>
              </div>
              <button @click="showPaymentModal = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <!-- Body -->
            <form @submit.prevent="handleRecordPayment" class="p-6 space-y-4">
              <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1 text-xs">
                <div class="flex justify-between text-gray-600">
                  <span>Customer:</span>
                  <span class="font-bold text-gray-900">{{ selectedInvoiceForPayment.customer_name }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Total Invoice:</span>
                  <span class="font-bold text-gray-900">{{ formatRp(selectedInvoiceForPayment.total_amount) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Current Balance Due:</span>
                  <span class="font-black text-rose-600">{{ formatRp(selectedInvoiceForPayment.balance_due) }}</span>
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
                  :max="selectedInvoiceForPayment.balance_due"
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
                    <option v-for="m in PAYMENT_METHODS" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Bank / Ref Number</label>
                  <input
                    v-model="paymentForm.reference_number"
                    placeholder="e.g. TRF-839281"
                    class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Receiving Bank Account</label>
                <input
                  v-model="paymentForm.bank_account"
                  placeholder="e.g. BCA - 883019283 (Main Operational)"
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div v-if="modalError" class="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold">
                {{ modalError }}
              </div>

              <!-- Footer -->
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
                  <span v-else>Record &amp; Post Receipt</span>
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
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up { animation: scaleUp 0.25s ease-out; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
</style>
