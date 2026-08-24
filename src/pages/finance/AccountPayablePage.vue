<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useApStore } from '@/stores/ap'
import {
  CreditCard, Building2, AlertTriangle, Clock, CheckCircle2,
  Plus, RefreshCw, ExternalLink, Wallet, ChevronRight, Loader2, X
} from 'lucide-vue-next'

const store = useApStore()
const router = useRouter()

const activeTab = ref<'bills' | 'vendors'>('bills')
const filterStatus = ref('')
const showVendorModal = ref(false)
const showBillModal = ref(false)
const saving = ref(false)
const modalError = ref('')

const newVendor = ref({ name: '', email: '', phone: '', npwp: '', bank_code: '', bank_account_number: '', bank_account_name: '' })
const newBill = ref({
  vendor_uuid: '', reference: '', bill_date: '', due_date: '', tax_rate: 0, notes: '',
  items: [{ description: '', quantity: 1, unit_price: 0 }]
})

const BANK_CODES = [
  { code: 'bca', label: 'BCA' }, { code: 'bni', label: 'BNI' },
  { code: 'bri', label: 'BRI' }, { code: 'mandiri', label: 'Mandiri' },
  { code: 'cimb', label: 'CIMB Niaga' }, { code: 'permata', label: 'Bank Permata' },
  { code: 'danamon', label: 'Bank Danamon' }, { code: 'ocbc', label: 'OCBC NISP' },
]

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  draft:    { label: 'Draft',    cls: 'bg-gray-100 text-gray-600' },
  approved: { label: 'Approved', cls: 'bg-blue-100 text-blue-700' },
  partial:  { label: 'Partial',  cls: 'bg-amber-100 text-amber-700' },
  paid:     { label: 'Paid',     cls: 'bg-emerald-100 text-emerald-700' },
  cancelled:{ label: 'Cancelled',cls: 'bg-rose-100 text-rose-700' },
}

onMounted(async () => {
  await Promise.all([store.fetchDashboard(), store.fetchVendors(), store.fetchBills()])
})

const filteredBills = computed(() => {
  if (!filterStatus.value) return store.bills
  return store.bills.filter(b => b.status === filterStatus.value)
})

const billSubtotal = computed(() =>
  newBill.value.items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
)
const billTax = computed(() => Math.round(billSubtotal.value * (newBill.value.tax_rate / 100) * 100) / 100)
const billTotal = computed(() => billSubtotal.value + billTax.value)

function addBillItem() {
  newBill.value.items.push({ description: '', quantity: 1, unit_price: 0 })
}
function removeBillItem(i: number) {
  newBill.value.items.splice(i, 1)
}

async function handleSaveVendor() {
  saving.value = true; modalError.value = ''
  try {
    await store.createVendor(newVendor.value)
    showVendorModal.value = false
    newVendor.value = { name: '', email: '', phone: '', npwp: '', bank_code: '', bank_account_number: '', bank_account_name: '' }
  } catch (e: any) { modalError.value = e.response?.data?.message || e.message }
  finally { saving.value = false }
}

async function handleSaveBill() {
  saving.value = true; modalError.value = ''
  try {
    await store.createBill(newBill.value)
    await store.fetchBills()
    showBillModal.value = false
    newBill.value = { vendor_uuid: '', reference: '', bill_date: '', due_date: '', tax_rate: 0, notes: '', items: [{ description: '', quantity: 1, unit_price: 0 }] }
  } catch (e: any) { modalError.value = e.response?.data?.message || e.message }
  finally { saving.value = false }
}

function formatRp(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
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
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard class="h-6 w-6 text-primary-600" /> Account Payable
          </h1>
          <p class="text-gray-500">Manajemen hutang vendor & disbursement Midtrans Iris</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="showVendorModal = true"
            class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
            <Building2 class="h-4 w-4" /> Add Vendor
          </button>
          <button @click="showBillModal = true"
            class="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-100 flex items-center gap-2">
            <Plus class="h-4 w-4" /> Create Bill
          </button>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div v-if="store.dashboard" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 col-span-2">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Outstanding</p>
          <p class="text-3xl font-black text-gray-900">{{ formatRp(store.dashboard.total_outstanding) }}</p>
          <div class="flex items-center gap-1 mt-1">
            <Wallet class="h-3.5 w-3.5 text-emerald-500" />
            <p class="text-xs text-emerald-600 font-semibold">
              Iris Balance: {{ formatRp(store.dashboard.iris_balance?.balance ?? 0) }}
            </p>
          </div>
        </div>

        <div v-for="(count, key) in store.dashboard.aging" :key="key"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {{ { current: 'Current', days_1_30: '1-30 Days', days_31_60: '31-60 Days', days_61_90: '61-90 Days', over_90: '> 90 Days' }[key] }}
          </p>
          <p :class="['text-2xl font-black', key !== 'current' && count > 0 ? 'text-rose-600' : 'text-gray-900']">{{ count }}</p>
          <p class="text-xs text-gray-400">overdue bills</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200">
        <button @click="activeTab = 'bills'"
          :class="['px-6 py-3 font-semibold text-sm border-b-2 transition-all', activeTab === 'bills' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700']">
          Bills
        </button>
        <button @click="activeTab = 'vendors'"
          :class="['px-6 py-3 font-semibold text-sm border-b-2 transition-all', activeTab === 'vendors' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700']">
          Vendors ({{ store.vendors.length }})
        </button>
      </div>

      <!-- Bills List -->
      <div v-if="activeTab === 'bills'" class="space-y-4">
        <!-- Filter -->
        <div class="flex flex-wrap gap-2">
          <button v-for="s in ['', 'draft', 'approved', 'partial', 'paid', 'cancelled']" :key="s"
            @click="filterStatus = s"
            :class="['px-3 py-1.5 rounded-xl text-xs font-bold transition-all', filterStatus === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
            {{ s === '' ? 'All' : STATUS_CONFIG[s]?.label }}
          </button>
        </div>

        <div v-if="store.isLoading" class="text-center py-10 text-gray-400">
          <Loader2 class="h-8 w-8 animate-spin mx-auto" />
        </div>

        <div v-else class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div v-for="bill in filteredBills" :key="bill.uuid"
            @click="router.push(`/finance/ap/${bill.uuid}`)"
            class="flex items-center justify-between p-5 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all">
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', STATUS_CONFIG[bill.status]?.cls]">
                  {{ STATUS_CONFIG[bill.status]?.label }}
                </span>
                <span v-if="isOverdue(bill.due_date, bill.status)" class="flex items-center gap-1 text-xs text-rose-600 font-semibold">
                  <AlertTriangle class="h-3 w-3" /> Overdue
                </span>
              </div>
              <p class="font-bold text-gray-900">{{ bill.vendor?.name }}</p>
              <p class="text-xs text-gray-400">{{ bill.bill_number }} · Due: {{ formatDate(bill.due_date) }}</p>
            </div>
            <div class="text-right flex items-center gap-4">
              <div>
                <p class="font-black text-gray-900">{{ formatRp(bill.total_amount) }}</p>
                <p v-if="bill.paid_amount > 0" class="text-xs text-emerald-600 font-semibold">
                  Paid: {{ formatRp(bill.paid_amount) }}
                </p>
              </div>
              <ChevronRight class="h-5 w-5 text-gray-300" />
            </div>
          </div>

          <div v-if="!filteredBills.length" class="py-16 text-center text-gray-400">
            <CheckCircle2 class="h-10 w-10 mx-auto text-emerald-400 mb-2" />
            <p class="font-semibold">No bills found</p>
          </div>
        </div>
      </div>

      <!-- Vendors List -->
      <div v-if="activeTab === 'vendors'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="v in store.vendors" :key="v.uuid"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
          <div class="flex items-start gap-3">
            <div class="p-3 bg-primary-50 rounded-2xl">
              <Building2 class="h-5 w-5 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-gray-900 truncate">{{ v.name }}</p>
              <p class="text-xs text-gray-500">{{ v.bank_account_name }}</p>
              <p class="text-xs font-mono text-gray-400">{{ v.bank_code.toUpperCase() }} · {{ v.bank_account_number }}</p>
              <div v-if="v.midtrans_beneficiary_alias" class="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 class="h-3 w-3" /> Iris Registered
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Vendor Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showVendorModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showVendorModal = false" />
          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Add Vendor</h2>
              <button @click="showVendorModal = false"><X class="h-5 w-5 text-gray-400" /></button>
            </div>
            <div v-if="modalError" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{{ modalError }}</div>
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Vendor Name *</label>
                <input v-model="newVendor.name" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="PT Maju Jaya" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input v-model="newVendor.email" type="email" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">NPWP</label>
                <input v-model="newVendor.npwp" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Bank *</label>
                <select v-model="newVendor.bank_code" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
                  <option value="">Select Bank</option>
                  <option v-for="b in BANK_CODES" :key="b.code" :value="b.code">{{ b.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Account Number *</label>
                <input v-model="newVendor.bank_account_number" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono" />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Account Name *</label>
                <input v-model="newVendor.bank_account_name" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button @click="showVendorModal = false" class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold">Cancel</button>
              <button @click="handleSaveVendor" :disabled="saving" class="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60">
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                {{ saving ? 'Saving...' : 'Add Vendor' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Create Bill Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showBillModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showBillModal = false" />
          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Create Bill</h2>
              <button @click="showBillModal = false"><X class="h-5 w-5 text-gray-400" /></button>
            </div>
            <div v-if="modalError" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{{ modalError }}</div>
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Vendor *</label>
                <select v-model="newBill.vendor_uuid" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
                  <option value="">-- Select Vendor --</option>
                  <option v-for="v in store.vendors" :key="v.uuid" :value="v.uuid">{{ v.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Bill Date *</label>
                <input v-model="newBill.bill_date" type="date" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Due Date *</label>
                <input v-model="newBill.due_date" type="date" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">PO / Reference</label>
                <input v-model="newBill.reference" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Tax Rate (%)</label>
                <input v-model.number="newBill.tax_rate" type="number" min="0" max="100" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
              </div>
            </div>

            <!-- Line Items -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-bold text-gray-700">Line Items</h3>
                <button @click="addBillItem" class="text-xs font-semibold text-primary-600 hover:underline">+ Add Item</button>
              </div>
              <div class="space-y-2">
                <div v-for="(item, i) in newBill.items" :key="i" class="flex items-center gap-2">
                  <input v-model="item.description" placeholder="Description" class="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                  <input v-model.number="item.quantity" type="number" min="0" placeholder="Qty" class="w-16 px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                  <input v-model.number="item.unit_price" type="number" min="0" placeholder="Price" class="w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                  <button @click="removeBillItem(i)" class="text-rose-400 hover:text-rose-600">
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="bg-gray-50 rounded-2xl p-4 space-y-1 text-sm">
              <div class="flex justify-between text-gray-600"><span>Subtotal</span><span class="font-semibold">{{ formatRp(billSubtotal) }}</span></div>
              <div class="flex justify-between text-gray-600"><span>Tax ({{ newBill.tax_rate }}%)</span><span class="font-semibold">{{ formatRp(billTax) }}</span></div>
              <div class="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-200"><span>Total</span><span>{{ formatRp(billTotal) }}</span></div>
            </div>

            <div class="flex justify-end gap-3">
              <button @click="showBillModal = false" class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold">Cancel</button>
              <button @click="handleSaveBill" :disabled="saving" class="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60">
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                {{ saving ? 'Saving...' : 'Create Bill' }}
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
