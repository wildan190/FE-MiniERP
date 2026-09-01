<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import { Box, Plus, X, Search, Eye, Calendar, FileText, CheckCircle, Package } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import MobileExpandableRow from '@/components/common/MobileExpandableRow.vue';

const purchasingStore = usePurchasingStore();
const authStore = useAuthStore();
const isAddModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedReceipt = ref<any>(null);

const searchQuery = ref('');

const newReceipt = ref({
  purchase_order_uuid: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  items: [] as any[]
});

onMounted(async () => {
  await purchasingStore.fetchReceipts();
  await purchasingStore.fetchOrders();
});

// Filter only approved / partial / active purchase orders for receiving
const eligibleOrders = computed(() => {
  return (purchasingStore.orders || []).filter(
    (o: any) => o && (o.status === 'approved' || o.status === 'partial' || o.status === 'draft')
  );
});

const handleOrderChange = () => {
  const selectedOrder = (purchasingStore.orders || []).find(
    (o: any) => o.uuid === newReceipt.value.purchase_order_uuid
  );

  if (selectedOrder && selectedOrder.items) {
    newReceipt.value.items = selectedOrder.items.map((item: any) => ({
      purchase_order_item_uuid: item.uuid,
      item_name: item.item_name,
      ordered_qty: Number(item.qty || item.quantity || 1),
      qty_received: Number(item.qty || item.quantity || 1),
      qty_rejected: 0,
      notes: ''
    }));
  } else {
    newReceipt.value.items = [];
  }
};

const handleCreateReceipt = async () => {
  if (!newReceipt.value.purchase_order_uuid) {
    Swal.fire({ title: 'Validation Error', text: 'Please select a Purchase Order.', icon: 'warning' });
    return;
  }

  if (!newReceipt.value.items.length) {
    Swal.fire({ title: 'Validation Error', text: 'No items to receive for the selected order.', icon: 'warning' });
    return;
  }

  const payload = {
    purchase_order_uuid: newReceipt.value.purchase_order_uuid,
    date: newReceipt.value.date,
    notes: newReceipt.value.notes || undefined,
    items: newReceipt.value.items.map((item: any) => ({
      purchase_order_item_uuid: item.purchase_order_item_uuid,
      qty_received: Number(item.qty_received) || 0,
      qty_rejected: Number(item.qty_rejected) || 0,
      notes: item.notes || undefined
    }))
  };

  try {
    await purchasingStore.createReceipt(payload);
    isAddModalOpen.value = false;
    newReceipt.value = {
      purchase_order_uuid: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      items: []
    };
    Swal.fire({ title: 'Success!', text: 'Goods receipt recorded successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
  } catch (err: any) {
    Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message || 'Failed to record goods receipt', icon: 'error' });
  }
};

const openDetail = (receipt: any) => {
  selectedReceipt.value = receipt;
  isDetailModalOpen.value = true;
};

const filteredReceipts = computed(() => {
  return (purchasingStore.receipts || []).filter((receipt: any) => {
    if (!receipt) return false;
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q || 
      (receipt.number && receipt.number.toLowerCase().includes(q)) ||
      (receipt.order?.number && receipt.order.number.toLowerCase().includes(q)) ||
      (receipt.order?.supplier?.name && receipt.order.supplier.name.toLowerCase().includes(q)) ||
      (receipt.notes && receipt.notes.toLowerCase().includes(q));

    return matchesSearch;
  });
});
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Goods Receipts (BAST)</h1>
          <p class="text-gray-500">Record, inspect, and verify incoming shipments from suppliers.</p>
        </div>
        <button 
          @click="isAddModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> Receive Goods
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by GR number, PO number, supplier, notes..." 
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <!-- Content Table Card -->
      <Card class="overflow-hidden border-0 shadow-sm">
        <div v-if="purchasingStore.isLoading && !purchasingStore.receipts.length" class="p-6 space-y-4">
          <Skeleton v-for="i in 4" :key="i" class="h-12 w-full rounded-xl" />
        </div>

        <div v-else class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/50">
                <th class="table-th">GR Number</th>
                <th class="table-th">PO Reference</th>
                <th class="table-th">Supplier</th>
                <th class="table-th">Received Date</th>
                <th class="table-th">Items Count</th>
                <th class="table-th">Received By</th>
                <th class="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr 
                v-for="receipt in filteredReceipts" 
                :key="receipt.uuid"
                class="hover:bg-gray-50/50 transition-colors"
              >
                <td class="table-td font-semibold text-gray-900 font-mono">
                  {{ receipt.number }}
                </td>
                <td class="table-td text-primary-700 font-medium font-mono text-xs">
                  {{ receipt.order?.number || '-' }}
                </td>
                <td class="table-td text-gray-800 font-medium">
                  {{ receipt.order?.supplier?.name || '-' }}
                </td>
                <td class="table-td text-gray-500 text-xs font-medium">
                  {{ receipt.date ? new Date(receipt.date).toLocaleDateString('id-ID') : '-' }}
                </td>
                <td class="table-td text-gray-700 font-medium">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-gray-100 text-xs font-semibold">
                    <Package class="h-3.5 w-3.5 text-gray-500" />
                    {{ (receipt.items || []).length }} item(s)
                  </span>
                </td>
                <td class="table-td text-gray-600 text-xs">
                  {{ receipt.receiver?.name || '-' }}
                </td>
                <td class="table-td text-right">
                  <div class="table-action-toolbar justify-end">
                    <button 
                      @click="openDetail(receipt)" 
                      class="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Inspect Goods Receipt"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredReceipts.length">
                <td colspan="7" class="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                  No goods receipts found. Start recording received goods from purchase orders.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Accordion View -->
        <div class="md:hidden p-3 space-y-3">
          <MobileExpandableRow
            v-for="(receipt, idx) in filteredReceipts"
            :key="receipt.uuid"
            :title="receipt.number || `GR #${idx + 1}`"
            :subtitle="`PO: ${receipt.order?.number || '-'} • Supplier: ${receipt.order?.supplier?.name || '-'}`"
            badge="RECEIVED"
            badgeClass="bg-emerald-100 text-emerald-800"
            :index="idx + 1"
          >
            <template #header-icon>
              <div class="h-9 w-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                <Box class="h-4 w-4" />
              </div>
            </template>

            <template #details>
              <div class="space-y-3 text-xs bg-white p-3 rounded-xl border border-gray-200/80">
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Date Received</span>
                  <span class="font-medium text-gray-800">{{ receipt.date }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Notes</span>
                  <span class="font-medium text-gray-800">{{ receipt.notes || 'No notes' }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold mb-1">Items Breakdown ({{ (receipt.items || []).length }})</span>
                  <div class="space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div v-for="(item, i) in (receipt.items || [])" :key="i" class="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
                      <span class="font-medium text-gray-900">{{ item.order_item?.item_name || item.item_name || `Item #${i+1}` }}</span>
                      <span class="font-mono text-gray-600">Rcv: {{ item.qty_received }} / Rej: {{ item.qty_rejected }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template #actions>
              <button
                @click="openDetail(receipt)"
                class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors flex items-center gap-1.5"
              >
                <Eye class="h-3.5 w-3.5" />
                View Details
              </button>
            </template>
          </MobileExpandableRow>
        </div>
      </Card>
    </div>

    <!-- Detail Inspection Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isDetailModalOpen && selectedReceipt" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Goods Receipt Details</h2>
                <p class="text-xs text-gray-500 font-mono">{{ selectedReceipt.number }}</p>
              </div>
              <button @click="isDetailModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <!-- Meta Info -->
              <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">PO Reference</span>
                  <span class="font-bold text-primary-700 font-mono">{{ selectedReceipt.order?.number || '-' }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Supplier</span>
                  <span class="font-bold text-gray-900">{{ selectedReceipt.order?.supplier?.name || '-' }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Received Date</span>
                  <span class="font-medium text-gray-800">{{ selectedReceipt.date }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Received By</span>
                  <span class="font-medium text-gray-800">{{ selectedReceipt.receiver?.name || '-' }}</span>
                </div>
                <div class="col-span-2">
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Notes / Remarks</span>
                  <span class="font-medium text-gray-800">{{ selectedReceipt.notes || 'No remarks provided.' }}</span>
                </div>
              </div>

              <!-- Items Table -->
              <div class="space-y-2">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Received Goods Breakdown</h3>
                <div class="border border-gray-200 rounded-2xl overflow-hidden">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <tr>
                        <th class="px-4 py-3">Item Name</th>
                        <th class="px-4 py-3 text-center">Qty Received</th>
                        <th class="px-4 py-3 text-center">Qty Rejected</th>
                        <th class="px-4 py-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="(item, idx) in (selectedReceipt.items || [])" :key="idx" class="hover:bg-gray-50/50">
                        <td class="px-4 py-3 font-semibold text-gray-900">{{ item.order_item?.item_name || item.item_name || `Item #${idx + 1}` }}</td>
                        <td class="px-4 py-3 text-center font-mono font-bold text-emerald-700">{{ item.qty_received }}</td>
                        <td class="px-4 py-3 text-center font-mono font-bold text-rose-600">{{ item.qty_rejected }}</td>
                        <td class="px-4 py-3 text-gray-500 text-xs">{{ item.notes || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button @click="isDetailModalOpen = false" class="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl text-sm font-bold hover:bg-gray-300 transition-colors">Close</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Receive Goods Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-xl font-bold text-gray-900">Receive Goods (Post BAST)</h2>
              <button @click="isAddModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form @submit.prevent="handleCreateReceipt" class="p-6 space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Link to Purchase Order <span class="text-rose-500">*</span></label>
                  <select v-model="newReceipt.purchase_order_uuid" @change="handleOrderChange" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Select an approved PO...</option>
                    <option v-for="o in eligibleOrders" :key="o.uuid" :value="o.uuid">{{ o.number }} - {{ o.supplier?.name }} ({{ o.status }})</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Received Date <span class="text-rose-500">*</span></label>
                  <input v-model="newReceipt.date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Notes / Remarks</label>
                  <textarea v-model="newReceipt.notes" rows="2" placeholder="e.g. Received in good condition at main warehouse" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
              </div>

              <div v-if="newReceipt.items.length" class="space-y-4">
                <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Verify Delivered Items</h3>
                <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <div v-for="(item, index) in newReceipt.items" :key="index" class="grid grid-cols-12 gap-3 items-center bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
                    <div class="col-span-6">
                      <p class="text-sm font-bold text-gray-900">{{ item.item_name }}</p>
                      <p class="text-xs text-gray-500">Ordered Qty: {{ item.ordered_qty }} units</p>
                    </div>
                    <div class="col-span-3 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Received Qty</label>
                      <input v-model.number="item.qty_received" type="number" min="0" :max="item.ordered_qty" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold" />
                    </div>
                    <div class="col-span-3 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Rejected Qty</label>
                      <input v-model.number="item.qty_rejected" type="number" min="0" :max="item.ordered_qty" class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-rose-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isAddModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Post Goods Receipt</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up { animation: scaleUp 0.3s ease-out; }
</style>
