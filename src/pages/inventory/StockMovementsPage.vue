<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import AppLayout from '@/layouts/AppLayout.vue'
import StockAdjustModal from '@/components/inventory/StockAdjustModal.vue'
import {
  ArrowUpCircle, ArrowDownCircle, ArrowRightLeft,
  RefreshCw, Search, Filter, Plus
} from 'lucide-vue-next'

const store = useInventoryStore()
const showModal = ref(false)
const filterType = ref('')
const filterWarehouse = ref('')

onMounted(async () => {
  await Promise.all([
    store.fetchMovements({ per_page: 50 }),
    store.fetchWarehouses(),
    store.fetchProducts(),
  ])
})

const filteredMovements = computed(() => {
  return store.movements.filter(m => {
    const matchType = !filterType.value || m.type === filterType.value
    const matchWH = !filterWarehouse.value || m.warehouse_uuid === filterWarehouse.value
    return matchType && matchWH
  })
})

const movementTypes = [
  { value: '', label: 'All Types' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'transfer_in', label: 'Transfer In' },
  { value: 'transfer_out', label: 'Transfer Out' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'reconciliation', label: 'Reconciliation' },
]

function movementIcon(type: string) {
  const map: any = {
    inbound: ArrowUpCircle,
    outbound: ArrowDownCircle,
    transfer_in: ArrowRightLeft,
    transfer_out: ArrowRightLeft,
    adjustment: RefreshCw,
    reconciliation: RefreshCw,
  }
  return map[type] || RefreshCw
}

function typeStyles(type: string) {
  const map: any = {
    inbound: 'bg-emerald-100 text-emerald-700',
    outbound: 'bg-rose-100 text-rose-700',
    transfer_in: 'bg-blue-100 text-blue-700',
    transfer_out: 'bg-orange-100 text-orange-700',
    adjustment: 'bg-purple-100 text-purple-700',
    reconciliation: 'bg-gray-100 text-gray-600',
  }
  return map[type] || 'bg-gray-100 text-gray-600'
}

function iconStyles(type: string) {
  const map: any = {
    inbound: 'bg-emerald-50 text-emerald-600',
    outbound: 'bg-rose-50 text-rose-600',
    transfer_in: 'bg-blue-50 text-blue-600',
    transfer_out: 'bg-orange-50 text-orange-600',
    adjustment: 'bg-purple-50 text-purple-600',
    reconciliation: 'bg-gray-50 text-gray-500',
  }
  return map[type] || 'bg-gray-50 text-gray-500'
}

function formatDate(dt: string) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

async function onSaved() {
  showModal.value = false
  await store.fetchMovements({ per_page: 50 })
}
</script>

<template>
  <AppLayout>
    <StockAdjustModal :is-open="showModal" @close="showModal = false" @saved="onSaved" />

    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Stock Movements</h1>
          <p class="text-gray-500">Immutable ledger of every stock transaction across all warehouses.</p>
        </div>
        <button @click="showModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-100 transition-all">
          <Plus class="h-4 w-4" /> Record Movement
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-4">
        <select v-model="filterType"
          class="px-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 text-gray-700">
          <option v-for="t in movementTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
        <select v-model="filterWarehouse"
          class="px-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 text-gray-700">
          <option value="">All Warehouses</option>
          <option v-for="wh in store.warehouses" :key="wh.uuid" :value="wh.uuid">{{ wh.name }}</option>
        </select>
        <div class="ml-auto text-sm text-gray-400 flex items-center gap-1.5">
          <Filter class="h-3.5 w-3.5" />
          {{ filteredMovements.length }} records
        </div>
      </div>

      <!-- Ledger Table -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th class="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th class="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Warehouse</th>
                <th class="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                <th class="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Stock After</th>
                <th class="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Reference</th>
                <th class="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="m in filteredMovements" :key="m.uuid" class="hover:bg-gray-50/60 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <div :class="['p-2 rounded-xl', iconStyles(m.type)]">
                      <component :is="movementIcon(m.type)" class="h-3.5 w-3.5" />
                    </div>
                    <span :class="['text-xs font-bold px-2 py-0.5 rounded-full capitalize hidden sm:inline-block', typeStyles(m.type)]">
                      {{ m.type.replace('_', ' ') }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <p class="font-semibold text-gray-800">{{ m.product?.name }}</p>
                  <p class="text-xs text-gray-400 font-mono">{{ m.product?.sku }}</p>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  <span class="text-gray-600">{{ m.warehouse?.name }}</span>
                </td>
                <td class="px-4 py-4 text-right">
                  <span class="font-black text-lg" :class="m.quantity >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                    {{ m.quantity >= 0 ? '+' : '' }}{{ m.quantity }}
                  </span>
                </td>
                <td class="px-4 py-4 text-right hidden lg:table-cell">
                  <span class="font-mono font-semibold text-gray-700">{{ m.stock_after }}</span>
                </td>
                <td class="px-4 py-4 hidden lg:table-cell">
                  <span class="text-gray-500 text-xs font-mono">{{ m.reference_number || '—' }}</span>
                </td>
                <td class="px-4 py-4 text-xs text-gray-400 hidden xl:table-cell whitespace-nowrap">
                  {{ formatDate(m.created_at) }}
                </td>
              </tr>
              <tr v-if="!filteredMovements.length">
                <td colspan="7" class="py-16 text-center text-gray-400 text-sm">
                  No stock movements recorded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
