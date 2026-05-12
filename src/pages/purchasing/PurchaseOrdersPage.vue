<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import { Box, Plus, Search, X, Trash2, Calendar } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';

const purchasingStore = usePurchasingStore();
const isAddModalOpen = ref(false);

const newOrder = ref({
  supplier_uuid: '',
  description: '',
  expected_delivery_date: '',
  items: [
    { item_name: '', quantity: 1, unit_price: 0 }
  ]
});

onMounted(async () => {
  await purchasingStore.fetchOrders();
  await purchasingStore.fetchSuppliers();
});

const addItem = () => {
  newOrder.value.items.push({ item_name: '', quantity: 1, unit_price: 0 });
};

const removeItem = (index: number) => {
  newOrder.value.items.splice(index, 1);
};

const handleCreateOrder = async () => {
  await purchasingStore.createOrder(newOrder.value);
  isAddModalOpen.value = false;
  // Reset form
  newOrder.value = {
    supplier_uuid: '',
    description: '',
    expected_delivery_date: '',
    items: [{ item_name: '', quantity: 1, unit_price: 0 }]
  };
};
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

      <!-- Orders Table -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">PO Number</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Supplier</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Expected Date</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="order in purchasingStore.orders" :key="order.uuid" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-900">{{ order.number }}</td>
              <td class="px-6 py-4 text-gray-600">{{ order.supplier?.name }}</td>
              <td class="px-6 py-4 font-bold text-primary-700">Rp {{ order.total_amount.toLocaleString() }}</td>
              <td class="px-6 py-4 text-gray-500 text-sm">
                {{ order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : 'N/A' }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                  :class="{
                    'bg-amber-50 text-amber-600': order.status === 'draft',
                    'bg-emerald-50 text-emerald-600': order.status === 'approved',
                    'bg-blue-50 text-blue-600': order.status === 'completed'
                  }"
                >
                  {{ order.status }}
                </span>
              </td>
            </tr>
            <tr v-if="!purchasingStore.orders.length">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 italic">
                No purchase orders found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Select Supplier</label>
                  <select v-model="newOrder.supplier_uuid" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Choose a supplier...</option>
                    <option v-for="s in purchasingStore.suppliers" :key="s.uuid" :value="s.uuid">{{ s.name }}</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Expected Delivery Date</label>
                  <input v-model="newOrder.expected_delivery_date" type="date" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Description / Note</label>
                  <textarea v-model="newOrder.description" rows="2" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
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
                      <input v-model.number="item.quantity" type="number" min="1" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div class="col-span-3 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Unit Price</label>
                      <input v-model.number="item.unit_price" type="number" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
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
