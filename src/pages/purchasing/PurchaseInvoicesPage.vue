<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import { Banknote, Plus, X, Search, FileText } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';

const purchasingStore = usePurchasingStore();
const isAddModalOpen = ref(false);

const newInvoice = ref({
  purchase_order_uuid: '',
  invoice_number: '',
  invoice_date: new Date().toISOString().split('T')[0],
  due_date: '',
  notes: '',
  items: [] as any[]
});

onMounted(async () => {
  await purchasingStore.fetchOrders();
});

const handleOrderChange = () => {
  const selectedOrder = purchasingStore.orders.find(o => o.uuid === newInvoice.value.purchase_order_uuid);
  if (selectedOrder) {
    newInvoice.value.items = selectedOrder.items.map((item: any) => ({
      purchase_order_item_uuid: item.uuid,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price
    }));
  }
};

const handleCreateInvoice = async () => {
  // Logic to call API would go here
  // await purchasingStore.createInvoice(newInvoice.value);
  isAddModalOpen.value = false;
};
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

      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
        <div class="inline-flex items-center justify-center h-20 w-20 bg-gray-50 rounded-full mb-4">
          <Banknote class="h-10 w-10 text-gray-300" />
        </div>
        <h3 class="text-lg font-medium text-gray-900">No supplier invoices yet</h3>
        <p class="text-gray-500 mt-1">Incoming invoices will appear here for verification and payment processing.</p>
      </div>
    </div>

    <!-- New Invoice Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-xl font-bold text-gray-900">Post Supplier Invoice</h2>
              <button @click="isAddModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form @submit.prevent="handleCreateInvoice" class="p-6 space-y-6">
              <div class="grid grid-cols-3 gap-4">
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Link to Purchase Order</label>
                  <select v-model="newInvoice.purchase_order_uuid" @change="handleOrderChange" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Select a PO...</option>
                    <option v-for="o in purchasingStore.orders" :key="o.uuid" :value="o.uuid">{{ o.number }} - {{ o.supplier?.name }}</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Supplier Invoice #</label>
                  <input v-model="newInvoice.invoice_number" type="text" required placeholder="INV/2026/..." class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Invoice Date</label>
                  <input v-model="newInvoice.invoice_date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div v-if="newInvoice.items.length" class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Invoice Items</h3>
                  <div class="text-sm font-bold text-primary-600">
                    Total: Rp {{ newInvoice.items.reduce((acc, curr) => acc + curr.total_price, 0).toLocaleString() }}
                  </div>
                </div>
                
                <div class="overflow-x-auto rounded-2xl border border-gray-100">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50/50">
                      <tr>
                        <th class="px-4 py-3 font-bold text-gray-400">Item</th>
                        <th class="px-4 py-3 font-bold text-gray-400">Qty</th>
                        <th class="px-4 py-3 font-bold text-gray-400">Unit Price</th>
                        <th class="px-4 py-3 font-bold text-gray-400">Total</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-for="item in newInvoice.items" :key="item.purchase_order_item_uuid">
                        <td class="px-4 py-3 font-medium text-gray-900">{{ item.item_name }}</td>
                        <td class="px-4 py-3 text-gray-600">{{ item.quantity }}</td>
                        <td class="px-4 py-3 text-gray-600">Rp {{ item.unit_price.toLocaleString() }}</td>
                        <td class="px-4 py-3 font-bold text-gray-900">Rp {{ item.total_price.toLocaleString() }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isAddModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Post Invoice</button>
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
