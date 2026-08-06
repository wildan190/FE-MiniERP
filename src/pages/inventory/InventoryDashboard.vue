<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import AppLayout from '@/layouts/AppLayout.vue'
import ProductModal from '@/components/inventory/ProductModal.vue'
import StockAdjustModal from '@/components/inventory/StockAdjustModal.vue'
import {
  Package, Warehouse, TrendingUp, AlertTriangle,
  ArrowUpCircle, ArrowDownCircle, RefreshCw, Plus, ArrowRightLeft
} from 'lucide-vue-next'

const store = useInventoryStore()
const showProductModal = ref(false)
const showAdjustModal = ref(false)

onMounted(async () => {
  await Promise.all([
    store.fetchDashboard(),
    store.fetchWarehouses(),
  ])
})

function formatCurrency(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

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

function movementColor(type: string) {
  const map: any = {
    inbound: 'text-emerald-600 bg-emerald-50',
    outbound: 'text-rose-600 bg-rose-50',
    transfer_in: 'text-blue-600 bg-blue-50',
    transfer_out: 'text-orange-600 bg-orange-50',
    adjustment: 'text-purple-600 bg-purple-50',
    reconciliation: 'text-gray-600 bg-gray-50',
  }
  return map[type] || 'text-gray-600 bg-gray-50'
}

function movementBadge(type: string) {
  const map: any = {
    inbound: 'bg-emerald-100 text-emerald-700',
    outbound: 'bg-rose-100 text-rose-700',
    transfer_in: 'bg-blue-100 text-blue-700',
    transfer_out: 'bg-orange-100 text-orange-700',
    adjustment: 'bg-purple-100 text-purple-700',
    reconciliation: 'bg-gray-100 text-gray-700',
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

async function onSaved() {
  showProductModal.value = false
  showAdjustModal.value = false
  await store.fetchDashboard()
}
</script>

<template>
  <AppLayout>
    <ProductModal :is-open="showProductModal" @close="showProductModal = false" @saved="onSaved" />
    <StockAdjustModal :is-open="showAdjustModal" @close="showAdjustModal = false" @saved="onSaved" />

    <div class="p-6 max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Inventory Overview</h1>
          <p class="text-gray-500 mt-1">Real-time stock levels, valuation, and movement tracking.</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="showAdjustModal = true"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
            <RefreshCw class="h-4 w-4" /> Stock Adjustment
          </button>
          <button @click="showProductModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all shadow-md shadow-primary-200 flex items-center gap-2">
            <Plus class="h-4 w-4" /> New Product
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-violet-50 rounded-2xl group-hover:bg-violet-100 transition-colors">
              <TrendingUp class="h-6 w-6 text-violet-600" />
            </div>
          </div>
          <p class="text-2xl font-black text-gray-900">{{ formatCurrency(store.dashboardData?.stats?.total_valuation || 0) }}</p>
          <p class="text-sm text-gray-400 mt-1 font-medium">Total Stock Valuation</p>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
              <Package class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p class="text-2xl font-black text-gray-900">{{ store.dashboardData?.stats?.total_skus || 0 }}</p>
          <p class="text-sm text-gray-400 mt-1 font-medium">Total SKUs</p>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
              <Warehouse class="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p class="text-2xl font-black text-gray-900">{{ store.dashboardData?.stats?.total_warehouses || 0 }}</p>
          <p class="text-sm text-gray-400 mt-1 font-medium">Active Warehouses</p>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group" :class="store.dashboardData?.stats?.low_stock_count > 0 ? 'border-rose-200 bg-rose-50/30' : ''">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-rose-50 rounded-2xl group-hover:bg-rose-100 transition-colors">
              <AlertTriangle class="h-6 w-6 text-rose-600" />
            </div>
          </div>
          <p class="text-2xl font-black" :class="store.dashboardData?.stats?.low_stock_count > 0 ? 'text-rose-600' : 'text-gray-900'">
            {{ store.dashboardData?.stats?.low_stock_count || 0 }}
          </p>
          <p class="text-sm text-gray-400 mt-1 font-medium">Low Stock Alerts</p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Low Stock Warnings -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-gray-900 text-lg flex items-center gap-2">
              <AlertTriangle class="h-5 w-5 text-rose-500" />
              Low Stock Alerts
            </h3>
            <span class="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded-full">
              {{ store.dashboardData?.low_stock_items?.length || 0 }}
            </span>
          </div>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="item in store.dashboardData?.low_stock_items" :key="item.uuid"
              class="flex items-center justify-between p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
              <div>
                <p class="text-sm font-bold text-gray-800">{{ item.name }}</p>
                <p class="text-xs text-gray-500 font-mono">{{ item.sku }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-rose-600">
                  {{ item.stocks?.reduce((s: number, st: any) => s + st.quantity_on_hand, 0) || 0 }} {{ item.uom }}
                </p>
                <p class="text-xs text-gray-400">Min: {{ item.reorder_level }}</p>
              </div>
            </div>
            <div v-if="!store.dashboardData?.low_stock_items?.length"
              class="text-center py-8 text-gray-400 text-sm">
              ✅ All stock levels healthy
            </div>
          </div>
        </div>

        <!-- Recent Movements -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 class="font-bold text-gray-900 text-lg mb-5">Recent Stock Movements</h3>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="m in store.dashboardData?.recent_movements" :key="m.uuid"
              class="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div :class="['p-2.5 rounded-xl', movementColor(m.type)]">
                <component :is="movementIcon(m.type)" class="h-4 w-4" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ m.product?.name }}</p>
                <p class="text-xs text-gray-400">{{ m.warehouse?.name }} · {{ m.reference_number || 'No reference' }}</p>
              </div>
              <div class="text-right">
                <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', movementBadge(m.type)]">
                  {{ m.type.replace('_', ' ') }}
                </span>
                <p class="text-sm font-black mt-1" :class="m.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'">
                  {{ m.quantity > 0 ? '+' : '' }}{{ m.quantity }}
                </p>
              </div>
            </div>
            <div v-if="!store.dashboardData?.recent_movements?.length"
              class="text-center py-8 text-gray-400 text-sm">
              No movements recorded yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
