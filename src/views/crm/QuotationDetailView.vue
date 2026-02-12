<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading...</p>
      </div>

      <div v-else-if="quotation" class="space-y-6">
        <!-- Header -->
        <div class="md:hidden print:hidden">
          <div class="flex flex-col items-center text-center mb-4">
            <h1 class="text-2xl font-bold text-gray-900">{{ quotation.quotation_number }}</h1>
            <span
              class="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize"
              :class="getStatusClass(quotation.status)"
            >
              {{ quotation.status }}
            </span>
          </div>
          <div class="flex flex-col gap-2">
            <button @click="handlePrint" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center">
              Edit
            </button>
            <button class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Delete
            </button>
          </div>
        </div>

        <div class="hidden md:flex items-start justify-between print:hidden">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ quotation.quotation_number }}</h1>
            <p class="mt-1 text-gray-600">Created {{ formatDate(quotation.created_at) }}</p>
          </div>
          <div class="flex gap-2 items-center">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize mr-2"
              :class="getStatusClass(quotation.status)"
            >
              {{ quotation.status }}
            </span>
            <button @click="handlePrint" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Edit
            </button>
            <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Delete
            </button>
          </div>
        </div>

        <!-- Normal View Content (Hidden on print) -->
        <div class="space-y-6 print:hidden">
          <!-- Customer Info -->
          <Card>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Name</p>
                <p class="font-medium text-gray-900">{{ quotation.customer?.name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="font-medium text-gray-900">{{ quotation.customer?.email || 'N/A' }}</p>
              </div>
              <div v-if="quotation.customer?.phone">
                <p class="text-sm text-gray-600">Phone</p>
                <p class="font-medium text-gray-900">{{ quotation.customer.phone }}</p>
              </div>
              <div v-if="quotation.customer?.company_name">
                <p class="text-sm text-gray-600">Company</p>
                <p class="font-medium text-gray-900">{{ quotation.customer.company_name }}</p>
              </div>
            </div>
          </Card>

          <!-- Quotation Info -->
          <Card>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Quotation Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-600">Valid Until</p>
                <p class="font-medium text-gray-900">{{ formatDate(quotation.valid_until) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Created At</p>
                <p class="font-medium text-gray-900">{{ formatDate(quotation.created_at) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Last Updated</p>
                <p class="font-medium text-gray-900">{{ formatDate(quotation.updated_at) }}</p>
              </div>
            </div>
            <div v-if="quotation.terms" class="mt-4">
              <p class="text-sm text-gray-600">Terms & Conditions</p>
              <p class="font-medium text-gray-900 mt-1 text-justify">{{ quotation.terms }}</p>
            </div>
          </Card>

          <!-- Items -->
          <Card>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Items</h2>
            
            <!-- Desktop Table -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Qty</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Unit Price</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Tax Rate</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Tax</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in quotation.items"
                    :key="item.id"
                    class="border-b border-gray-100"
                  >
                    <td class="px-4 py-3 text-sm text-gray-900">{{ item.description }}</td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900">{{ Math.floor(Number(item.quantity)) }}</td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900">{{ formatCurrency(parseFloat(String(item.unit_price))) }}</td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900">{{ item.tax_rate }}%</td>
                    <td class="px-4 py-3 text-sm text-right text-gray-900">{{ formatCurrency(parseFloat(String(item.tax_amount))) }}</td>
                    <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">{{ formatCurrency(parseFloat(String(item.total))) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div class="md:hidden space-y-3">
              <div
                v-for="item in quotation.items"
                :key="item.id"
                class="border border-gray-200 rounded-lg p-3"
              >
                <p class="font-medium text-gray-900 mb-2">{{ item.description }}</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p class="text-gray-600">Quantity</p>
                    <p class="font-medium">{{ Math.floor(Number(item.quantity)) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Unit Price</p>
                    <p class="font-medium">{{ formatCurrency(parseFloat(String(item.unit_price))) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Tax Rate</p>
                    <p class="font-medium">{{ item.tax_rate }}%</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Total</p>
                    <p class="font-semibold text-green-600">{{ formatCurrency(parseFloat(String(item.total))) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial Summary -->
            <div class="mt-6 border-t pt-4">
              <div class="flex flex-col gap-2 max-w-sm ml-auto">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal:</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(parseFloat(String(quotation.subtotal))) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Discount:</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(parseFloat(String(quotation.discount_amount))) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax:</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(parseFloat(String(quotation.tax_amount))) }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold border-t pt-2">
                  <span class="text-gray-900">Total:</span>
                  <span class="text-green-600">{{ formatCurrency(parseFloat(String(quotation.total_amount))) }}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Official Print View (Only visible on print) -->
        <div class="hidden print:block print-document bg-white">
          <!-- Paper Header -->
          <div class="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
            <div class="flex items-center gap-4">
              <div class="bg-gray-900 p-3 rounded-lg">
                <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-black text-gray-900 tracking-tight uppercase">MiniERP Business</h1>
                <p class="text-sm text-gray-600 font-medium font-serif italic">Professional Enterprise Solution</p>
                <div class="text-[10px] text-gray-500 mt-2 leading-tight">
                  <p>Jl. Professional No. 123, SCBD District 8</p>
                  <p>Jakarta Selatan, 12190, Indonesia</p>
                  <p>Phone: +62 21 555 1234 | www.minierp.com</p>
                </div>
              </div>
            </div>
            <div class="text-right">
              <h2 class="text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">QUOTATION</h2>
              <div class="mt-4 text-sm text-gray-600 space-y-1">
                <p class="flex justify-end gap-2">Reference: <span class="font-bold text-gray-900">{{ quotation.quotation_number }}</span></p>
                <p class="flex justify-end gap-2">Issue Date: <span class="font-bold text-gray-900">{{ formatDate(quotation.created_at) }}</span></p>
                <p class="flex justify-end gap-2">Expiry Date: <span class="font-bold text-red-600">{{ formatDate(quotation.valid_until) }}</span></p>
              </div>
            </div>
          </div>

          <!-- Customer & Project Info -->
          <div class="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Bill To</h3>
              <div class="space-y-1">
                <p class="text-xl font-extrabold text-gray-900">{{ quotation.customer?.name }}</p>
                <p class="text-gray-800 font-bold text-sm" v-if="quotation.customer?.company_name">{{ quotation.customer?.company_name }}</p>
                <div class="text-gray-600 text-[11px] mt-2 space-y-0.5">
                  <p class="flex items-center gap-2">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                    {{ quotation.customer?.email }}
                  </p>
                  <p v-if="quotation.customer?.phone" class="flex items-center gap-2">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.567 4.567l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                    {{ quotation.customer?.phone }}
                  </p>
                </div>
              </div>
            </div>
            <div class="border-l border-gray-100 pl-8">
              <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Quotation Summary</h3>
              <div class="space-y-3">
                <div class="flex justify-between border-b border-gray-50 pb-1">
                  <span class="text-[10px] text-gray-500 uppercase">Status</span>
                  <span class="text-xs font-bold uppercase tracking-wider" :class="quotation.status === 'accepted' ? 'text-green-600' : 'text-gray-900'">{{ quotation.status }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-1">
                  <span class="text-[10px] text-gray-500 uppercase">Payment Terms</span>
                  <span class="text-xs font-bold text-gray-900">Net 30 Days</span>
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-1">
                  <span class="text-[10px] text-gray-500 uppercase">Currency</span>
                  <span class="text-xs font-bold text-gray-900">IDR</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="mb-10">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100 border-b border-gray-300">
                  <th class="px-4 py-3 text-left text-[10px] font-black text-gray-900 uppercase tracking-widest border-r border-gray-300">No.</th>
                  <th class="px-4 py-3 text-left text-[10px] font-black text-gray-900 uppercase tracking-widest border-r border-gray-300">Description</th>
                  <th class="px-4 py-3 text-center text-[10px] font-black text-gray-900 uppercase tracking-widest border-r border-gray-300">Qty</th>
                  <th class="px-4 py-3 text-right text-[10px] font-black text-gray-900 uppercase tracking-widest border-r border-gray-300">Unit Price</th>
                  <th class="px-4 py-3 text-right text-[10px] font-black text-gray-900 uppercase tracking-widest border-r border-gray-300">Tax</th>
                  <th class="px-4 py-3 text-right text-[10px] font-black text-gray-900 uppercase tracking-widest">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in quotation.items" :key="item.id" class="border-b border-gray-200">
                  <td class="px-4 py-4 text-xs text-gray-600 border-r border-gray-200">{{ index + 1 }}</td>
                  <td class="px-4 py-4 text-xs text-gray-900 font-medium border-r border-gray-200">
                    {{ item.description }}
                  </td>
                  <td class="px-4 py-4 text-xs text-center text-gray-700 border-r border-gray-200">{{ Math.floor(Number(item.quantity)) }}</td>
                  <td class="px-4 py-4 text-xs text-right text-gray-700 border-r border-gray-200">{{ formatCurrency(parseFloat(String(item.unit_price))) }}</td>
                  <td class="px-4 py-4 text-xs text-right text-gray-500 border-r border-gray-200">{{ item.tax_rate }}%</td>
                  <td class="px-4 py-4 text-xs text-right text-gray-900 font-bold">{{ formatCurrency(parseFloat(String(item.total))) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totals Area -->
          <div class="flex justify-between items-start gap-12 page-break-avoid">
            <div class="flex-1 space-y-6">
              <div v-if="quotation.terms">
                <h3 class="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-2 italic">Notes / Terms:</h3>
                <p class="text-[11px] text-gray-500 leading-relaxed text-justify">{{ quotation.terms }}</p>
              </div>
              <div class="text-[10px] text-gray-400 space-y-1">
                <p>• Prices are valid for 30 days from the date of issue.</p>
                <p>• Delivery will be made within 7 business days after acceptance.</p>
              </div>
            </div>
            <div class="w-64">
              <div class="space-y-2 border-t-2 border-gray-900 pt-4">
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-gray-500 uppercase tracking-wider">Subtotal</span>
                  <span class="text-gray-900 font-bold">{{ formatCurrency(parseFloat(String(quotation.subtotal))) }}</span>
                </div>
                <div class="flex justify-between items-center text-[11px] text-red-500" v-if="parseFloat(String(quotation.discount_amount)) > 0">
                  <span class="uppercase tracking-wider">Discount</span>
                  <span class="font-bold">- {{ formatCurrency(parseFloat(String(quotation.discount_amount))) }}</span>
                </div>
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-gray-500 uppercase tracking-wider">Pajak (Tax)</span>
                  <span class="text-gray-900 font-bold">{{ formatCurrency(parseFloat(String(quotation.tax_amount))) }}</span>
                </div>
                <div class="flex justify-between items-center pt-4 mt-2 border-t-2 border-gray-900">
                  <span class="text-gray-900 font-black uppercase tracking-widest text-xs">Grand Total</span>
                  <span class="text-gray-900 text-2xl font-black">{{ formatCurrency(parseFloat(String(quotation.total_amount))) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Signature Block -->
          <div class="grid grid-cols-2 gap-40 mt-32 text-center page-break-avoid">
            <div class="space-y-20">
              <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Client Acceptance</p>
              <div class="border-t border-gray-900 pt-3 w-48 mx-auto">
                <p class="text-xs font-bold text-gray-900">{{ quotation.customer?.name }}</p>
                <p class="text-[9px] text-gray-400 uppercase tracking-widest">Date & Official Stamp</p>
              </div>
            </div>
            <div class="space-y-20">
              <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Authorized Signature</p>
              <div class="border-t border-gray-900 pt-3 w-48 mx-auto relative">
                <div class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-10">
                   <svg class="w-24 h-24 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <p class="text-xs font-bold text-gray-900">Finance Manager</p>
                <p class="text-[9px] text-gray-400 uppercase tracking-widest">MiniERP Digital Signature</p>
              </div>
            </div>
          </div>

          <!-- Professional Footer -->
          <div class="mt-20 pt-10 border-t border-gray-100 text-center">
            <p class="text-[9px] text-gray-400 font-medium uppercase tracking-[0.3em]">
              MiniERP • Business Intelligence & Resource Planning • ID-77-2026
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-red-600">Quotation not found</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { quotationService, type Quotation } from '../../services'
import AppLayout from '../../layouts/AppLayout.vue'
import Card from '../../components/common/Card.vue'

const route = useRoute()
const quotation = ref<Quotation | null>(null)
const loading = ref(false)

const fetchQuotation = async () => {
  loading.value = true
  try {
    const uuid = route.params.uuid as string
    const response = await quotationService.getQuotationById(uuid)
    quotation.value = response.data
  } catch (error) {
    console.error('Failed to fetch quotation:', error)
  } finally {
    loading.value = false
  }
}

const handlePrint = () => {
  window.print()
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusClass = (status: string) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    expired: 'bg-orange-100 text-orange-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchQuotation()
})
</script>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 15mm;
  }

  /* Reset some AppLayout styles that might interfere */
  :deep(.sidebar), :deep(.topbar), :deep(footer), :deep(.no-print) {
    display: none !important;
  }
  
  .max-w-7xl {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background-color: white !important;
    font-size: 11pt;
  }

  .print-document {
    display: block !important;
    visibility: visible !important;
    position: static;
    width: 100%;
    margin: 0;
    padding: 0;
    background: white;
  }

  /* Force background colors to print */
  .bg-gray-100 { background-color: #f3f4f6 !important; }
  .bg-gray-900 { background-color: #111827 !important; }
  .text-white { color: #ffffff !important; }
  
  .page-break-avoid {
    page-break-inside: avoid;
  }
}

/* Custom Paper styling for digital display preview */
.print-document {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}
</style>
