<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-full sm:max-w-5xl">
        <div class="bg-white px-3 py-4 sm:px-6 sm:py-6">
          <div class="sm:flex sm:items-start">
            <div class="text-left w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">Create Quotation</h3>
              
              <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Customer Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Customer <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.customer_id"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a customer</option>
                    <option v-for="customer in customers" :key="customer.uuid" :value="customer.uuid">
                      {{ customer.name }} - {{ customer.email }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Valid Until -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.valid_until"
                      type="date"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <!-- Status -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      v-model="formData.status"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <!-- Discount Amount -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Discount Amount</label>
                    <input
                      v-model.number="formData.discount_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <!-- Terms -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                  <textarea
                    v-model="formData.terms"
                    rows="2"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter terms and conditions..."
                  />
                </div>

                <!-- Items Section -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <label class="block text-sm font-medium text-gray-700">
                      Items <span class="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      @click="addItem"
                      class="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      + Add Item
                    </button>
                  </div>

                  <!-- Items List -->
                  <div class="space-y-4 max-h-96 overflow-y-auto">
                    <div
                      v-for="(item, index) in formData.items"
                      :key="index"
                      class="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                    >
                      <div class="flex justify-between items-start">
                        <h4 class="font-medium text-gray-900">Item {{ index + 1 }}</h4>
                        <button
                          v-if="formData.items.length > 1"
                          type="button"
                          @click="removeItem(index)"
                          class="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <!-- Description -->
                        <div class="md:col-span-2">
                          <label class="block text-xs font-medium text-gray-700 mb-1">
                            Description <span class="text-red-500">*</span>
                          </label>
                          <input
                            v-model="item.description"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="Enter item description"
                            required
                          />
                        </div>

                        <!-- Quantity -->
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">
                            Quantity <span class="text-red-500">*</span>
                          </label>
                          <input
                            v-model.number="item.quantity"
                            type="number"
                            min="1"
                            step="1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="1"
                            required
                          />
                        </div>

                        <!-- Unit Price -->
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">
                            Unit Price <span class="text-red-500">*</span>
                          </label>
                          <input
                            v-model.number="item.unit_price"
                            type="number"
                            min="0"
                            step="0.01"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="0.00"
                            required
                          />
                        </div>

                        <!-- Tax Rate -->
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                          <input
                            v-model.number="item.tax_rate"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="0"
                          />
                        </div>

                        <!-- Item Total (Calculated) -->
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">Total</label>
                          <div class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-green-600">
                            {{ formatCurrency(calculateItemTotal(item)) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Financial Summary -->
                <div class="border-t pt-4 space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal:</span>
                    <span class="font-medium text-gray-900">{{ formatCurrency(calculatedSubtotal) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Discount:</span>
                    <span class="font-medium text-gray-900">{{ formatCurrency(formData.discount_amount || 0) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tax:</span>
                    <span class="font-medium text-gray-900">{{ formatCurrency(calculatedTax) }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold border-t pt-2">
                    <span class="text-gray-900">Total:</span>
                    <span class="text-green-600">{{ formatCurrency(calculatedTotal) }}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="loading"
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Quotation' }}
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
import { ref, computed, onMounted } from 'vue'
import { quotationService, customerService } from '../../services'
import type { Customer } from '../../services'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const customers = ref<Customer[]>([])
const loading = ref(false)
const errorMessage = ref('')

interface QuotationItemForm {
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
}

const formData = ref({
  customer_id: '',
  valid_until: '',
  status: 'draft' as 'draft' | 'sent' | 'accepted' | 'declined' | 'expired',
  discount_amount: 0,
  terms: '',
  items: [
    {
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_rate: 0
    }
  ] as QuotationItemForm[]
})

const fetchCustomers = async () => {
  try {
    const response = await customerService.getCustomers(1)
    customers.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch customers:', error)
  }
}

const addItem = () => {
  formData.value.items.push({
    description: '',
    quantity: 1,
    unit_price: 0,
    tax_rate: 0
  })
}

const removeItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const calculateItemTotal = (item: QuotationItemForm): number => {
  const subtotal = item.quantity * item.unit_price
  const tax = subtotal * ((item.tax_rate || 0) / 100)
  return subtotal + tax
}

const calculatedSubtotal = computed(() => {
  return formData.value.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_price)
  }, 0)
})

const calculatedTax = computed(() => {
  return formData.value.items.reduce((sum, item) => {
    const subtotal = item.quantity * item.unit_price
    return sum + (subtotal * ((item.tax_rate || 0) / 100))
  }, 0)
})

const calculatedTotal = computed(() => {
  return calculatedSubtotal.value - (formData.value.discount_amount || 0) + calculatedTax.value
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validation
  if (!formData.value.customer_id) {
    errorMessage.value = 'Please select a customer'
    return
  }
  
  if (!formData.value.valid_until) {
    errorMessage.value = 'Please select a valid until date'
    return
  }
  
  if (formData.value.items.length === 0) {
    errorMessage.value = 'Please add at least one item'
    return
  }
  
  for (const item of formData.value.items) {
    if (!item.description || item.quantity <= 0 || item.unit_price < 0) {
      errorMessage.value = 'Please fill in all required item fields'
      return
    }
  }

  loading.value = true
  try {
    await quotationService.createQuotation({
      customer_id: formData.value.customer_id,
      valid_until: formData.value.valid_until,
      status: formData.value.status,
      discount_amount: formData.value.discount_amount || 0,
      terms: formData.value.terms || undefined,
      items: formData.value.items.map(item => ({
        ...item,
        quantity: Math.floor(item.quantity)
      }))
    })
    
    emit('created')
    handleClose()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to create quotation'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  // Reset form
  formData.value = {
    customer_id: '',
    valid_until: '',
    status: 'draft',
    discount_amount: 0,
    terms: '',
    items: [
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0
      }
    ]
  }
  errorMessage.value = ''
  emit('close')
}

onMounted(() => {
  fetchCustomers()
})
</script>
