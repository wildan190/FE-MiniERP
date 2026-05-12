<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import { Plus, Search, Mail, Phone, MapPin, Users, X } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';

const purchasingStore = usePurchasingStore();
const searchQuery = ref('');
const isAddModalOpen = ref(false);

const newSupplier = ref({
  name: '',
  pic: '',
  contact: '',
  email: '',
  address: '',
  category: 'General'
});

onMounted(async () => {
  await purchasingStore.fetchSuppliers();
});

const handleAddSupplier = async () => {
  await purchasingStore.createSupplier(newSupplier.value);
  isAddModalOpen.value = false;
  // Reset form
  newSupplier.value = {
    name: '',
    pic: '',
    contact: '',
    email: '',
    address: '',
    category: 'General'
  };
};
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p class="text-gray-500">Manage your vendor relationships and contact details.</p>
        </div>
        <button 
          @click="isAddModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> Add Supplier
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search suppliers by name, category, or PIC..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      <!-- Suppliers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="supplier in purchasingStore.suppliers" 
          :key="supplier.uuid"
          class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-lg group-hover:bg-primary-600 group-hover:text-white transition-all">
              {{ supplier.name.charAt(0) }}
            </div>
            <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {{ supplier.category || 'General' }}
            </span>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ supplier.name }}</h3>
          <p class="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Active Partner
          </p>

          <div class="space-y-3 pt-4 border-t border-gray-50">
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <Mail class="h-4 w-4 text-gray-400" />
              <span>{{ supplier.pic || 'No PIC assigned' }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <Phone class="h-4 w-4 text-gray-400" />
              <span>{{ supplier.contact || 'No contact info' }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <MapPin class="h-4 w-4 text-gray-400" />
              <span class="truncate">{{ supplier.address || 'No address' }}</span>
            </div>
          </div>

          <div class="mt-6 pt-4 flex items-center justify-between">
            <button class="text-sm font-medium text-primary-600 hover:text-primary-700">Edit Details</button>
            <button class="text-sm font-medium text-gray-400 hover:text-gray-600">View History</button>
          </div>
        </div>

        <div v-if="!purchasingStore.suppliers.length" class="col-span-full py-20 text-center">
          <div class="inline-flex items-center justify-center h-20 w-20 bg-gray-50 rounded-full mb-4">
            <Users class="h-10 w-10 text-gray-300" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">No suppliers yet</h3>
          <p class="text-gray-500 mt-1">Start by adding your first vendor to the system.</p>
        </div>
      </div>
    </div>

    <!-- Add Supplier Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-xl font-bold text-gray-900">Add New Supplier</h2>
              <button @click="isAddModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form @submit.prevent="handleAddSupplier" class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Supplier Name</label>
                  <input v-model="newSupplier.name" type="text" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">PIC Name</label>
                  <input v-model="newSupplier.pic" type="text" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Category</label>
                  <select v-model="newSupplier.category" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option>General</option>
                    <option>IT Equipment</option>
                    <option>Office Supplies</option>
                    <option>Raw Materials</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Contact Number</label>
                  <input v-model="newSupplier.contact" type="text" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Email Address</label>
                  <input v-model="newSupplier.email" type="email" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Address</label>
                  <textarea v-model="newSupplier.address" rows="3" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isAddModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Save Supplier</button>
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
