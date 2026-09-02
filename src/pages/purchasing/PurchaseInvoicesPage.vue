<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import Swal from 'sweetalert2';
import { Banknote, Plus, X, Search, FileText, Eye, Calendar, Package } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import MobileExpandableRow from '@/components/common/MobileExpandableRow.vue';

const purchasingStore = usePurchasingStore();
const isAddModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedInvoice = ref<any>(null);

const searchQuery = ref('');

const newInvoice = ref({
  purchase_order_uuid: '',
  date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notes: '',
  items: [] as any[]
});

onMounted(async () => {
  await purchasingStore.fetchInvoices();
  await purchasingStore.fetchOrders();
});

const handleOrderChange = () => {
  const selectedOrder = (purchasingStore.orders || []).find((o: any) => o.uuid === newInvoice.value.purchase_order_uuid);
  if (selectedOrder && selectedOrder.items) {
    newInvoice.value.items = selectedOrder.items.map((item: any) => ({
      item_name: item.item_name,
      qty: Number(item.qty || item.quantity || 1),
      price: Number(item.price || item.unit_price || 0),
    }));
  } else {
    newInvoice.value.items = [];
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const calculateTotal = (items: any[]) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, i) => sum + ((Number(i.price) || 0) * (Number(i.qty) || 1)), 0);
};

const handleCreateInvoice = async () => {
  if (!newInvoice.value.purchase_order_uuid) {
    Swal.fire({ title: 'Validation Error', text: 'Please select a Purchase Order.', icon: 'warning' });
    return;
  }

  const selectedOrder = (purchasingStore.orders || []).find((o: any) => o.uuid === newInvoice.value.purchase_order_uuid);
  const supplierUuid = selectedOrder?.supplier?.uuid;

  if (!supplierUuid) {
    Swal.fire({ title: 'Validation Error', text: 'The selected PO does not have a valid supplier.', icon: 'warning' });
    return;
  }

  const payload = {
    supplier_uuid: supplierUuid,
    purchase_order_uuid: newInvoice.value.purchase_order_uuid,
    date: newInvoice.value.date,
    due_date: newInvoice.value.due_date,
    notes: newInvoice.value.notes || undefined,
    items: newInvoice.value.items.map((item: any) => ({
      item_name: item.item_name,
      qty: Number(item.qty) || 1,
      price: Number(item.price) || 0,
    }))
  };

  try {
    await purchasingStore.createInvoice(payload);
    isAddModalOpen.value = false;
    newInvoice.value = {
      purchase_order_uuid: '',
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
      items: []
    };
    Swal.fire({ title: 'Success!', text: 'Supplier Invoice recorded successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
  } catch (err: any) {
    Swal.fire({ title: 'Error', text: err.response?.data?.message || err.message || 'Failed to create invoice', icon: 'error' });
  }
};

const openDetail = (invoice: any) => {
  selectedInvoice.value = invoice;
  isDetailModalOpen.value = true;
};

const filteredInvoices = computed(() => {
  return (purchasingStore.invoices || []).filter((inv: any) => {
    if (!inv) return false;
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q || 
      (inv.number && inv.number.toLowerCase().includes(q)) ||
      (inv.supplier?.name && inv.supplier.name.toLowerCase().includes(q)) ||
      (inv.order?.number && inv.order.number.toLowerCase().includes(q)) ||
      (inv.notes && inv.notes.toLowerCase().includes(q));

    return matchesSearch;
  });
});
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Supplier Invoices</h1>
          <p class="text-gray-500">Manage invoices from suppliers and link them to your orders.</p>
        </div>
        <button 
          @click="isAddModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> New Invoice
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by invoice number, supplier, PO..." 
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <!-- Content Table Card -->
      <Card class="overflow-hidden border-0 shadow-sm">
        <div v-if="purchasingStore.isLoading && !purchasingStore.invoices.length" class="p-6 space-y-4">
          <Skeleton v-for="i in 4" :key="i" class="h-12 w-full rounded-xl" />
        </div>

        <div v-else class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/50">
                <th class="table-th">Invoice #</th>
                <th class="table-th">Supplier</th>
                <th class="table-th">PO Reference</th>
                <th class="table-th">Invoice Date</th>
                <th class="table-th">Due Date</th>
                <th class="table-th">Total Amount</th>
                <th class="table-th">Status</th>
                <th class="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr 
                v-for="inv in filteredInvoices" 
                :key="inv.uuid"
                class="hover:bg-gray-50/50 transition-colors"
              >
                <td class="table-td font-semibold text-gray-900 font-mono">
                  {{ inv.number }}
                </td>
                <td class="table-td text-gray-800 font-medium">
                  {{ inv.supplier?.name || '-' }}
                </td>
                <td class="table-td text-primary-700 font-medium font-mono text-xs">
                  {{ inv.order?.number || '-' }}
                </td>
                <td class="table-td text-gray-500 text-xs font-medium">
                  {{ inv.date ? new Date(inv.date).toLocaleDateString('id-ID') : '-' }}
                </td>
                <td class="table-td text-gray-500 text-xs font-medium">
                  {{ inv.due_date ? new Date(inv.due_date).toLocaleDateString('id-ID') : '-' }}
                </td>
                <td class="table-td font-bold text-gray-900 font-mono">
                  {{ formatCurrency(inv.total_amount || calculateTotal(inv.items)) }}
                </td>
                <td class="table-td">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1"
                    :class="{
                      'bg-amber-100 text-amber-800': inv.status === 'draft' || inv.status === 'open',
                      'bg-emerald-100 text-emerald-800': inv.status === 'paid',
                      'bg-rose-100 text-rose-800': inv.status === 'cancelled'
                    }"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {{ inv.status || 'open' }}
                  </span>
                </td>
                <td class="table-td text-right">
                  <div class="table-action-toolbar justify-end">
                    <button 
                      @click="openDetail(inv)" 
                      class="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Inspect Invoice"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredInvoices.length">
                <td colspan="8" class="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                  No supplier invoices found. Create a new invoice to record supplier billings.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Accordion View -->
        <div class="md:hidden p-3 space-y-3">
          <MobileExpandableRow
            v-for="(inv, idx) in filteredInvoices"
            :key="inv.uuid"
            :title="inv.number || `INV #${idx + 1}`"
            :subtitle="`Supplier: ${inv.supplier?.name || '-'} • ${formatCurrency(inv.total_amount || calculateTotal(inv.items))}`"
            :badge="inv.status ? inv.status.toUpperCase() : 'OPEN'"
            :badgeClass="inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
            :index="idx + 1"
          >
            <template #header-icon>
              <div class="h-9 w-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                <Banknote class="h-4 w-4" />
              </div>
            </template>

            <template #details>
              <div class="space-y-3 text-xs bg-white p-3 rounded-xl border border-gray-200/80">
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">PO Reference</span>
                  <span class="font-medium text-gray-800 font-mono">{{ inv.order?.number || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Due Date</span>
                  <span class="font-medium text-gray-800">{{ inv.due_date }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold mb-1">Items Breakdown ({{ (inv.items || []).length }})</span>
                  <div class="space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div v-for="(item, i) in (inv.items || [])" :key="i" class="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
                      <span class="font-medium text-gray-900">{{ item.item_name }}</span>
                      <span class="font-mono text-gray-600">x{{ item.qty }} @ {{ formatCurrency(item.price) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template #actions>
              <button
                @click="openDetail(inv)"
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

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isDetailModalOpen && selectedInvoice" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Supplier Invoice Details</h2>
                <p class="text-xs text-gray-500 font-mono">{{ selectedInvoice.number }}</p>
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
                  <span class="font-bold text-gray-900">{{ selectedInvoice.supplier?.name || '-' }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">PO Reference</span>
                  <span class="font-bold text-primary-700 font-mono">{{ selectedInvoice.order?.number || '-' }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Invoice Date</span>
                  <span class="font-medium text-gray-800">{{ selectedInvoice.date }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Due Date</span>
                  <span class="font-medium text-gray-800">{{ selectedInvoice.due_date }}</span>
                </div>
              </div>

              <!-- Items Table -->
              <div class="space-y-2">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Billed Items</h3>
                <div class="border border-gray-200 rounded-2xl overflow-hidden">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <tr>
                        <th class="px-4 py-3">Item Name</th>
                        <th class="px-4 py-3 text-center">Qty</th>
                        <th class="px-4 py-3 text-right">Price</th>
                        <th class="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="(item, idx) in (selectedInvoice.items || [])" :key="idx" class="hover:bg-gray-50/50">
                        <td class="px-4 py-3 font-semibold text-gray-900">{{ item.item_name }}</td>
                        <td class="px-4 py-3 text-center font-mono font-bold">{{ item.qty }}</td>
                        <td class="px-4 py-3 text-right font-mono text-gray-600">{{ formatCurrency(item.price) }}</td>
                        <td class="px-4 py-3 text-right font-mono font-bold text-gray-900">{{ formatCurrency(item.qty * item.price) }}</td>
                      </tr>
                    </tbody>
                    <tfoot class="bg-gray-50 font-bold border-t border-gray-200">
                      <tr>
                        <td colspan="3" class="px-4 py-3 text-right uppercase text-xs">Total Billed Amount</td>
                        <td class="px-4 py-3 text-right text-primary-700 font-mono text-base">
                          {{ formatCurrency(selectedInvoice.total_amount || calculateTotal(selectedInvoice.items)) }}
                        </td>
                      </tr>
                    </tfoot>
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

    <!-- New Invoice Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-xl font-bold text-gray-900">Record Supplier Invoice</h2>
              <button @click="isAddModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form @submit.prevent="handleCreateInvoice" class="p-6 space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5 col-span-2">
                  <label class="text-sm font-semibold text-gray-700">Link to Purchase Order <span class="text-rose-500">*</span></label>
                  <select v-model="newInvoice.purchase_order_uuid" @change="handleOrderChange" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Select an approved PO...</option>
                    <option v-for="o in purchasingStore.orders" :key="o.uuid" :value="o.uuid">{{ o.number }} - {{ o.supplier?.name }}</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Invoice Date <span class="text-rose-500">*</span></label>
                  <input v-model="newInvoice.date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Due Date <span class="text-rose-500">*</span></label>
                  <input v-model="newInvoice.due_date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Notes / Remarks</label>
                  <textarea v-model="newInvoice.notes" rows="2" placeholder="e.g. Invoice matches Goods Receipt BAST" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
              </div>

              <div v-if="newInvoice.items.length" class="space-y-4">
                <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Invoice Items</h3>
                <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <div v-for="(item, index) in newInvoice.items" :key="index" class="grid grid-cols-12 gap-3 items-center bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
                    <div class="col-span-6">
                      <p class="text-sm font-bold text-gray-900">{{ item.item_name }}</p>
                      <p class="text-xs text-gray-500">Qty: {{ item.qty }}</p>
                    </div>
                    <div class="col-span-6 space-y-1 text-right">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Unit Price</label>
                      <p class="font-mono font-bold text-gray-900">{{ formatCurrency(item.price) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isAddModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Post Supplier Invoice</button>
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
