<script setup lang="ts">
import { ref, watch } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { X, Loader2, RefreshCw } from 'lucide-vue-next'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const store = useInventoryStore()
const saving = ref(false)
const error = ref('')

const form = ref({
  product_uuid: '',
  warehouse_uuid: '',
  type: 'adjustment',
  quantity: 0,
  notes: '',
  reference_number: '',
})

watch(() => props.isOpen, async (open) => {
  if (open) {
    error.value = ''
    form.value = {
      product_uuid: '',
      warehouse_uuid: '',
      type: 'adjustment',
      quantity: 0,
      notes: '',
      reference_number: '',
    }
    await Promise.all([
      store.fetchProducts(),
      store.fetchWarehouses(),
    ])
  }
})

async function save() {
  if (!form.value.product_uuid || !form.value.warehouse_uuid) {
    error.value = 'Product and warehouse are required.'
    return
  }
  if (form.value.quantity === 0) {
    error.value = 'Quantity cannot be zero.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await store.recordMovement(form.value)
    emit('saved')
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to record movement.'
  } finally {
    saving.value = false
  }
}

const movementTypes = [
  { value: 'inbound', label: 'Inbound (Receive Stock)' },
  { value: 'outbound', label: 'Outbound (Issue Stock)' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'reconciliation', label: 'Reconciliation' },
]
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg">
          <!-- Header -->
          <div class="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-50 rounded-xl">
                <RefreshCw class="h-5 w-5 text-purple-600" />
              </div>
              <h2 class="text-lg font-bold text-gray-900">Record Stock Movement</h2>
            </div>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="save" class="px-8 py-6 space-y-5">
            <div v-if="error" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{{ error }}</div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Movement Type <span class="text-rose-500">*</span></label>
              <select v-model="form.type"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option v-for="t in movementTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Product <span class="text-rose-500">*</span></label>
              <select v-model="form.product_uuid"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">— Select Product —</option>
                <option v-for="p in store.products" :key="p.uuid" :value="p.uuid">{{ p.name }} ({{ p.sku }})</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Warehouse <span class="text-rose-500">*</span></label>
              <select v-model="form.warehouse_uuid"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">— Select Warehouse —</option>
                <option v-for="wh in store.warehouses" :key="wh.uuid" :value="wh.uuid">{{ wh.name }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Quantity <span class="text-rose-500">*</span></label>
                <p class="text-xs text-gray-400 mb-1">Use negative for outbound/adjustments.</p>
                <input v-model.number="form.quantity" type="number" step="0.001"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Reference No.</label>
                <input v-model="form.reference_number" type="text"
                  placeholder="PO-0001, SO-0001..."
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
              <textarea v-model="form.notes" rows="2"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="emit('close')"
                class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" :disabled="saving"
                class="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all disabled:opacity-60 flex items-center gap-2">
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                {{ saving ? 'Recording…' : 'Record Movement' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
