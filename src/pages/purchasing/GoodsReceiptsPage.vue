<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import { Box, Plus, X, Search } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';

const purchasingStore = usePurchasingStore();
const isAddModalOpen = ref(false);

const newReceipt = ref({
  purchase_order_uuid: '',
  received_date: new Date().toISOString().split('T')[0],
  notes: '',
  items: [] as any[]
});

onMounted(async () => {
  await purchasingStore.fetchOrders();
});

const handleOrderChange = () => {
  const selectedOrder = purchasingStore.orders.find(o => o.uuid === newReceipt.value.purchase_order_uuid);
  if (selectedOrder) {
    newReceipt.value.items = selectedOrder.items.map((item: any) => ({
      purchase_order_item_uuid: item.uuid,
      item_name: item.item_name,
      ordered_qty: item.quantity,
      received_qty: item.quantity
    }));
  }
};

const handleCreateReceipt = async () => {
  // Logic to call API would go here
  // await purchasingStore.createReceipt(newReceipt.value);
  isAddModalOpen.value = false;
};
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Goods Receipts</h1>
          <p class="text-gray-500">Record and verify incoming shipments from suppliers.</p>
        </div>
        <button 
          @click="isAddModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> Receive Goods
        </button>
      </div>

      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
        <div class="inline-flex items-center justify-center h-20 w-20 bg-gray-50 rounded-full mb-4">
          <Box class="h-10 w-10 text-gray-300" />
        </div>
        <h3 class="text-lg font-medium text-gray-900">No goods receipts yet</h3>
        <p class="text-gray-500 mt-1">Start recording received items from your purchase orders.</p>
      </div>
    </div>

    <!-- Receive Goods Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-xl font-bold text-gray-900">Receive Goods</h2>
              <button @click="isAddModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form @submit.prevent="handleCreateReceipt" class="p-6 space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Link to Purchase Order</label>
                  <select v-model="newReceipt.purchase_order_uuid" @change="handleOrderChange" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Select an approved PO...</option>
                    <option v-for="o in purchasingStore.orders" :key="o.uuid" :value="o.uuid">{{ o.number }} - {{ o.supplier?.name }}</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Received Date</label>
                  <input v-model="newReceipt.received_date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Notes / Remarks</label>
                  <textarea v-model="newReceipt.notes" rows="2" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
              </div>

              <div v-if="newReceipt.items.length" class="space-y-4">
                <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Verify Items</h3>
                <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <div v-for="(item, index) in newReceipt.items" :key="index" class="grid grid-cols-12 gap-3 items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                    <div class="col-span-7">
                      <p class="text-sm font-bold text-gray-900">{{ item.item_name }}</p>
                      <p class="text-xs text-gray-500">Ordered: {{ item.ordered_qty }} units</p>
                    </div>
                    <div class="col-span-5 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Received Qty</label>
                      <input v-model.number="item.received_qty" type="number" min="0" :max="item.ordered_qty" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isAddModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Post Receipt</button>
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
