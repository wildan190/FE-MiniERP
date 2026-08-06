<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import AppLayout from '@/layouts/AppLayout.vue'
import WarehouseModal from '@/components/inventory/WarehouseModal.vue'
import { Plus, Warehouse, MapPin, Package, Edit3, ToggleLeft, ToggleRight } from 'lucide-vue-next'

const store = useInventoryStore()
const showModal = ref(false)
const editingWarehouse = ref<any>(null)

onMounted(async () => {
  await store.fetchWarehouses()
})

function openEdit(warehouse: any) {
  editingWarehouse.value = warehouse
  showModal.value = true
}

function openCreate() {
  editingWarehouse.value = null
  showModal.value = true
}

async function onSaved() {
  showModal.value = false
  await store.fetchWarehouses()
}
</script>

<template>
  <AppLayout>
    <WarehouseModal
      :is-open="showModal"
      :warehouse="editingWarehouse"
      @close="showModal = false"
      @saved="onSaved"
    />

    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Warehouses</h1>
          <p class="text-gray-500">Manage your storage locations and stock distribution.</p>
        </div>
        <button @click="openCreate"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-100 transition-all">
          <Plus class="h-4 w-4" /> Add Warehouse
        </button>
      </div>

      <!-- Warehouse Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="wh in store.warehouses" :key="wh.uuid"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group">
          <div class="flex items-start justify-between mb-4">
            <div class="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
              <Warehouse class="h-6 w-6 text-emerald-600" />
            </div>
            <div class="flex items-center gap-2">
              <span :class="['text-xs font-bold px-2.5 py-1 rounded-full', wh.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500']">
                {{ wh.is_active ? 'Active' : 'Inactive' }}
              </span>
              <button @click="openEdit(wh)"
                class="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all opacity-0 group-hover:opacity-100">
                <Edit3 class="h-4 w-4" />
              </button>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-lg">{{ wh.name }}</h3>
          <p class="text-xs font-mono text-gray-400 mt-0.5">{{ wh.code }}</p>

          <div class="mt-4 space-y-2">
            <div v-if="wh.location" class="flex items-center gap-2 text-sm text-gray-600">
              <MapPin class="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span>{{ wh.location }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Package class="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span>{{ wh.stocks_count || 0 }} product lines</span>
            </div>
          </div>

          <div v-if="wh.address" class="mt-4 pt-4 border-t border-gray-50">
            <p class="text-xs text-gray-400 leading-relaxed">{{ wh.address }}</p>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!store.warehouses.length"
          class="col-span-full bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
          <Warehouse class="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-400 font-medium">No warehouses configured</p>
          <p class="text-sm text-gray-300 mt-1">Add your first warehouse to start managing inventory.</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
