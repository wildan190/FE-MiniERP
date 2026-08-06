<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import AppLayout from '@/layouts/AppLayout.vue'
import TransferOrderModal from '@/components/inventory/TransferOrderModal.vue'
import { Plus, ArrowRightLeft, Truck, CheckCircle2, XCircle, FileText, ChevronRight } from 'lucide-vue-next'

const store = useInventoryStore()
const showModal = ref(false)
const selectedTransfer = ref<any>(null)

onMounted(async () => {
  await Promise.all([
    store.fetchTransfers(),
    store.fetchWarehouses(),
    store.fetchProducts(),
  ])
})

async function onSaved() {
  showModal.value = false
  await store.fetchTransfers()
}

async function advanceStatus(transfer: any) {
  const nextStatus: any = { draft: 'in_transit', in_transit: 'completed' }
  if (!nextStatus[transfer.status]) return
  if (!confirm(`Move transfer ${transfer.transfer_number} to "${nextStatus[transfer.status]}"?`)) return
  await store.updateTransferStatus(transfer.uuid, nextStatus[transfer.status])
}

async function cancelTransfer(transfer: any) {
  if (!confirm(`Cancel transfer ${transfer.transfer_number}? This cannot be undone.`)) return
  await store.updateTransferStatus(transfer.uuid, 'cancelled')
}

function statusStyles(status: string) {
  const map: any = {
    draft: 'bg-gray-100 text-gray-600',
    in_transit: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-600',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

function statusIcon(status: string) {
  const map: any = {
    draft: FileText,
    in_transit: Truck,
    completed: CheckCircle2,
    cancelled: XCircle,
  }
  return map[status] || FileText
}

function formatDate(dt: string) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('id-ID', { dateStyle: 'medium' })
}
</script>

<template>
  <AppLayout>
    <TransferOrderModal :is-open="showModal" @close="showModal = false" @saved="onSaved" />

    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Transfer Orders</h1>
          <p class="text-gray-500">Track inter-warehouse stock movements from draft to completion.</p>
        </div>
        <button @click="showModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-100 transition-all">
          <Plus class="h-4 w-4" /> New Transfer
        </button>
      </div>

      <!-- Status Summary Chips -->
      <div class="flex flex-wrap gap-3">
        <div v-for="s in ['draft', 'in_transit', 'completed', 'cancelled']" :key="s"
          class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-semibold">
          <component :is="statusIcon(s)" class="h-4 w-4" :class="statusStyles(s).split(' ')[1]" />
          <span class="capitalize">{{ s.replace('_', ' ') }}</span>
          <span class="text-xs font-bold text-gray-400">
            {{ store.transfers.filter(t => t.status === s).length }}
          </span>
        </div>
      </div>

      <!-- Transfers List -->
      <div class="space-y-4">
        <div v-for="transfer in store.transfers" :key="transfer.uuid"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <!-- Left: Info -->
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div :class="['p-3 rounded-2xl flex-shrink-0', statusStyles(transfer.status).replace('text-', 'bg-').replace('-700', '-50').replace('-600', '-50')]">
                <component :is="statusIcon(transfer.status)" class="h-5 w-5"
                  :class="statusStyles(transfer.status).split(' ')[1]" />
              </div>
              <div class="min-w-0">
                <p class="font-bold text-gray-900 font-mono">{{ transfer.transfer_number }}</p>
                <div class="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <span class="font-semibold text-gray-700">{{ transfer.source_warehouse?.name }}</span>
                  <ArrowRightLeft class="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span class="font-semibold text-gray-700">{{ transfer.destination_warehouse?.name }}</span>
                </div>
              </div>
            </div>

            <!-- Middle: Meta -->
            <div class="flex items-center gap-6 text-sm text-gray-500 flex-shrink-0">
              <div class="text-center hidden md:block">
                <p class="font-bold text-gray-800">{{ transfer.items?.length || 0 }}</p>
                <p class="text-xs text-gray-400">SKUs</p>
              </div>
              <div class="text-center hidden lg:block">
                <p class="font-bold text-gray-800">{{ formatDate(transfer.transfer_date) }}</p>
                <p class="text-xs text-gray-400">Date</p>
              </div>
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', statusStyles(transfer.status)]">
                {{ transfer.status.replace('_', ' ') }}
              </span>
            </div>

            <!-- Right: Actions -->
            <div class="flex items-center gap-2 flex-shrink-0" v-if="!['completed', 'cancelled'].includes(transfer.status)">
              <button @click="cancelTransfer(transfer)"
                class="px-3 py-1.5 text-xs font-semibold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition-all">
                Cancel
              </button>
              <button @click="advanceStatus(transfer)"
                class="px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all">
                {{ transfer.status === 'draft' ? '→ In Transit' : '→ Complete' }}
              </button>
            </div>
          </div>

          <!-- Items -->
          <div v-if="transfer.items?.length" class="mt-4 pt-4 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div v-for="item in transfer.items" :key="item.uuid"
              class="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 text-xs">
              <span class="font-medium text-gray-700 truncate mr-2">{{ item.product?.name }}</span>
              <span class="font-bold text-gray-900 flex-shrink-0">
                {{ item.quantity_requested }} {{ item.product?.uom }}
              </span>
            </div>
          </div>

          <div v-if="transfer.notes" class="mt-3 text-xs text-gray-400 italic">
            {{ transfer.notes }}
          </div>
        </div>

        <div v-if="!store.transfers.length"
          class="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
          <ArrowRightLeft class="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-400 font-medium">No transfer orders yet</p>
          <p class="text-sm text-gray-300 mt-1">Create a new transfer to move stock between warehouses.</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
