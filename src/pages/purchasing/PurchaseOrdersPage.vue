<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import { Box, Plus, Search, X, Trash2, Calendar, Eye, Package, FileText, CheckCircle, XCircle } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import MobileExpandableRow from '@/components/common/MobileExpandableRow.vue';

const purchasingStore = usePurchasingStore();
const authStore = useAuthStore();
const isAddModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedOrder = ref<any>(null);

const searchQuery = ref('');
const statusFilter = ref('All Status');

// Check if user has purchasing approval rights (Manager / Admin)
const canApprove = computed(() => {
  return authStore.isSuperAdmin || 
    authStore.hasRole('purchasing-manager') || 
    authStore.hasRole('admin') || 
    authStore.hasPermission('purchasing.orders.manage');
});

const supplierList = computed(() => {
  const sups = purchasingStore.suppliers;
  if (!sups) return [];
  if (Array.isArray(sups)) return sups.filter(Boolean);
  if (typeof sups === 'object' && Array.isArray((sups as any).data)) return (sups as any).data.filter(Boolean);
  return [];
});

const newOrder = ref({
  supplier_uuid: '',
  date: new Date().toISOString().split('T')[0], // required by backend
  eta: '',                                       // expected_delivery_date → eta
  notes: '',                                     // description → notes
  items: [
    { item_name: '', qty: 1, unit_price: 0 }     // quantity → qty
  ]
});

onMounted(async () => {
  await purchasingStore.fetchOrders();
  await purchasingStore.fetchSuppliers();
});

const addItem = () => {
  newOrder.value.items.push({ item_name: '', qty: 1, unit_price: 0 });
};

const removeItem = (index: number) => {
  newOrder.value.items.splice(index, 1);
};

const handleApproveOrder = async (uuid: string) => {
  const result = await Swal.fire({
    title: 'Approve Purchase Order?',
    text: 'This will approve the PO and authorize procurement from the vendor.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Approve PO',
    confirmButtonColor: '#10B981',
  });

  if (result.isConfirmed) {
    try {
      await purchasingStore.updateOrderStatus(uuid, 'approved');
      if (selectedOrder.value && selectedOrder.value.uuid === uuid) {
        selectedOrder.value.status = 'approved';
      }
      Swal.fire({ title: 'Approved!', text: 'Purchase Order has been approved.', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message || 'Failed to approve order', icon: 'error' });
    }
  }
};

const handleCreateOrder = async () => {
  // Map frontend model to backend contract before sending
  const payload = {
    supplier_uuid: newOrder.value.supplier_uuid,
    date:          newOrder.value.date,
    eta:           newOrder.value.eta || undefined,
    notes:         newOrder.value.notes || undefined,
    items: newOrder.value.items.map(item => ({
      item_name: item.item_name,
      qty:       item.qty,
      price:     item.unit_price,
    })),
  };
  await purchasingStore.createOrder(payload);
  isAddModalOpen.value = false;
  newOrder.value = {
    supplier_uuid: '',
    date: new Date().toISOString().split('T')[0],
    eta: '',
    notes: '',
    items: [{ item_name: '', qty: 1, unit_price: 0 }],
  };
};

const openDetail = (order: any) => {
  selectedOrder.value = order;
  isDetailModalOpen.value = true;
};

const calculateTotal = (items: any[]) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, i) => sum + ((i.unit_price || i.price || 0) * (i.qty || i.quantity || 1)), 0);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const filteredOrders = computed(() => {
  return (purchasingStore.orders || []).filter((order: any) => {
    if (!order) return false;
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q || 
      (order.number && order.number.toLowerCase().includes(q)) ||
      (order.supplier?.name && order.supplier.name.toLowerCase().includes(q)) ||
      (order.notes && order.notes.toLowerCase().includes(q));

    const matchesStatus = statusFilter.value === 'All Status' || 
      (order.status && order.status.toLowerCase() === statusFilter.value.toLowerCase());

    return matchesSearch && matchesStatus;
  });
});
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p class="text-gray-500">Official orders issued to suppliers.</p>
        </div>
        <button 
          @click="isAddModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> Create PO
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by PO number, supplier, or notes..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
            <option>All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <!-- Orders Desktop Table -->
      <Card class="!p-0 overflow-hidden">
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50/75">
                <th class="table-th">PO Number</th>
                <th class="table-th">Supplier</th>
                <th class="table-th">Ordered Items</th>
                <th class="table-th">Total Amount</th>
                <th class="table-th">Expected Date</th>
                <th class="table-th">Status</th>
                <th class="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="order in filteredOrders" :key="order?.uuid || order?.id" class="table-tr-hover">
                <td class="table-td font-bold text-gray-900 font-mono">{{ order?.number || 'PO-N/A' }}</td>
                <td class="table-td text-gray-700 font-medium">{{ order?.supplier?.name || '-' }}</td>
                <td class="table-td">
                  <div class="flex items-center gap-1.5 flex-wrap max-w-xs">
                    <span 
                      v-for="(item, idx) in (order?.items || []).slice(0, 2)" 
                      :key="idx" 
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium"
                    >
                      <Package class="h-3 w-3 text-gray-500" />
                      {{ item.item_name || item.name }} (x{{ item.qty || item.quantity || 1 }})
                    </span>
                    <span v-if="(order?.items || []).length > 2" class="text-[11px] font-bold text-primary-600">
                      +{{ order.items.length - 2 }} more
                    </span>
                    <span v-if="!order?.items || !order?.items.length" class="text-xs text-gray-400 italic">No items listed</span>
                  </div>
                </td>
                <td class="table-td font-bold text-primary-700">
                  {{ formatCurrency(order?.total_amount || calculateTotal(order?.items)) }}
                </td>
                <td class="table-td text-gray-500 text-xs font-medium">
                  {{ order?.eta ? new Date(order.eta).toLocaleDateString('id-ID') : 'N/A' }}
                </td>
                <td class="table-td">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1"
                    :class="{
                      'bg-amber-100 text-amber-800': order?.status === 'draft',
                      'bg-emerald-100 text-emerald-800': order?.status === 'approved',
                      'bg-blue-100 text-blue-800': order?.status === 'completed'
                    }"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {{ order?.status }}
                  </span>
                </td>
                <td class="table-td text-right">
                  <div class="table-action-toolbar justify-end gap-1">
                    <button 
                      v-if="order?.status === 'draft' && canApprove"
                      @click="handleApproveOrder(order.uuid)" 
                      class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Approve Purchase Order"
                    >
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button 
                      @click="openDetail(order)" 
                      class="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Inspect PO & Items"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredOrders.length">
                <td colspan="7" class="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                  No purchase orders found matching your query.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Accordion View -->
        <div class="md:hidden p-3">
          <MobileExpandableRow
            v-for="(order, idx) in filteredOrders"
            :key="order?.uuid || order?.id"
            :title="order?.number || `PO #${idx + 1}`"
            :subtitle="`Supplier: ${order?.supplier?.name || '-'} • ${formatCurrency(order?.total_amount || calculateTotal(order?.items))}`"
            :badge="order?.status ? order.status.toUpperCase() : 'DRAFT'"
            :badgeClass="order?.status === 'completed' ? 'bg-blue-100 text-blue-800' : order?.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
            :index="idx + 1"
          >
            <template #header-icon>
              <div class="h-9 w-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                <FileText class="h-4 w-4" />
              </div>
            </template>

            <template #details>
              <div class="space-y-3 text-xs bg-white p-3 rounded-xl border border-gray-200/80">
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Notes</span>
                  <span class="font-medium text-gray-800">{{ order?.notes || 'No notes provided' }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold mb-1">Ordered Items Breakdown ({{ (order?.items || []).length }})</span>
                  <div class="space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div v-for="(item, i) in (order?.items || [])" :key="i" class="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
                      <span class="font-medium text-gray-900">{{ item.item_name || item.name }}</span>
                      <span class="font-mono text-gray-600">x{{ item.qty || item.quantity }} @ {{ formatCurrency(item.unit_price || item.price || 0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template #actions>
              <button
                @click="openDetail(order)"
                class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors flex items-center gap-1.5"
              >
                <Eye class="h-3.5 w-3.5" />
                Inspect PO & Items
              </button>
            </template>
          </MobileExpandableRow>
        </div>
      </Card>
    </div>

    <!-- PO Detail Inspection Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isDetailModalOpen && selectedOrder" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Purchase Order Details</h2>
                <p class="text-xs text-gray-500 font-mono">{{ selectedOrder.number }}</p>
              </div>
              <button @click="isDetailModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <!-- Meta Info -->
              <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Supplier</span>
                  <span class="font-bold text-gray-900">{{ selectedOrder.supplier?.name || '-' }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Status</span>
                  <span 
                    class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase mt-1"
                    :class="{
                      'bg-amber-100 text-amber-800': selectedOrder.status === 'draft',
                      'bg-emerald-100 text-emerald-800': selectedOrder.status === 'approved',
                      'bg-blue-100 text-blue-800': selectedOrder.status === 'completed'
                    }"
                  >
                    {{ selectedOrder.status }}
                  </span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Expected Delivery (ETA)</span>
                  <span class="font-medium text-gray-800">{{ selectedOrder.eta ? new Date(selectedOrder.eta).toLocaleDateString('id-ID') : 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Order Date</span>
                  <span class="font-medium text-gray-800">{{ selectedOrder.date || (selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString('id-ID') : 'N/A') }}</span>
                </div>
                <div class="col-span-2">
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Notes</span>
                  <span class="font-medium text-gray-800">{{ selectedOrder.notes || 'No notes.' }}</span>
                </div>
              </div>

              <!-- Items Table -->
              <div class="space-y-2">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordered Goods / Line Items</h3>
                <div class="border border-gray-200 rounded-2xl overflow-hidden">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <tr>
                        <th class="px-4 py-3">Item Name</th>
                        <th class="px-4 py-3 text-center">Qty</th>
                        <th class="px-4 py-3 text-right">Unit Price</th>
                        <th class="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="(item, idx) in (selectedOrder.items || [])" :key="idx" class="hover:bg-gray-50/50">
                        <td class="px-4 py-3 font-semibold text-gray-900">{{ item.item_name || item.name }}</td>
                        <td class="px-4 py-3 text-center font-mono font-bold">{{ item.qty || item.quantity }}</td>
                        <td class="px-4 py-3 text-right font-mono text-gray-600">{{ formatCurrency(item.unit_price || item.price || 0) }}</td>
                        <td class="px-4 py-3 text-right font-mono font-bold text-gray-900">
                          {{ formatCurrency((item.unit_price || item.price || 0) * (item.qty || item.quantity || 1)) }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot class="bg-gray-50 font-bold border-t border-gray-200">
                      <tr>
                        <td colspan="3" class="px-4 py-3 text-right uppercase text-xs">Total Order Amount</td>
                        <td class="px-4 py-3 text-right text-primary-700 font-mono text-base">
                          {{ formatCurrency(selectedOrder.total_amount || calculateTotal(selectedOrder.items)) }}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <button 
                  v-if="selectedOrder.status === 'draft' && canApprove"
                  @click="handleApproveOrder(selectedOrder.uuid)" 
                  class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-200"
                >
                  <CheckCircle class="h-4 w-4" /> Approve Purchase Order
                </button>
              </div>
              <button @click="isDetailModalOpen = false" class="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl text-sm font-bold hover:bg-gray-300 transition-colors">Close</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- New Order Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-xl font-bold text-gray-900">Create Purchase Order</h2>
              <button @click="isAddModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form @submit.prevent="handleCreateOrder" class="p-6 space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-sm font-semibold text-gray-700">Select Supplier</label>
                  <select v-model="newOrder.supplier_uuid" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Choose a supplier...</option>
                    <option v-for="s in supplierList" :key="s?.uuid || s?.id" :value="s?.uuid || s?.id">{{ s?.name }}</option>
                  </select>
                </div>
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-sm font-semibold text-gray-700">Order Date <span class="text-rose-500">*</span></label>
                  <input v-model="newOrder.date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-sm font-semibold text-gray-700">Expected Delivery (ETA)</label>
                  <input v-model="newOrder.eta" type="date" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-sm font-semibold text-gray-700">Notes</label>
                  <textarea v-model="newOrder.notes" rows="1" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Order Items</h3>
                  <button type="button" @click="addItem" class="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <Plus class="h-3 w-3" /> Add Item
                  </button>
                </div>

                <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <div v-for="(item, index) in newOrder.items" :key="index" class="grid grid-cols-12 gap-3 items-end bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                    <div class="col-span-6 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Item Name</label>
                      <input v-model="item.item_name" type="text" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div class="col-span-2 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Qty</label>
                      <input v-model.number="item.qty" type="number" min="1" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div class="col-span-3 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Unit Price</label>
                      <input v-model.number="item.unit_price" type="number" min="0" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div class="col-span-1 pb-1 text-center">
                      <button @click="removeItem(index)" type="button" class="p-1.5 text-gray-400 hover:text-rose-600">
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isAddModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Create Order</button>
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
