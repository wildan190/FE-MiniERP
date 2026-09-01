<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { usePurchasingStore } from '@/stores/purchasing';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import { ClipboardList, Plus, Search, X, Trash2, Eye, Package, CheckCircle, XCircle } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Skeleton from '@/components/common/Skeleton.vue';
import MobileExpandableRow from '@/components/common/MobileExpandableRow.vue';

const purchasingStore = usePurchasingStore();
const authStore = useAuthStore();
const isAddModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedRequest = ref<any>(null);

const searchQuery = ref('');
const statusFilter = ref('All Status');

// Check if user has purchasing approval rights (Manager / Admin)
const canApprove = computed(() => {
  return authStore.isSuperAdmin || 
    authStore.hasRole('purchasing-manager') || 
    authStore.hasRole('admin') || 
    authStore.hasPermission('purchasing.requests.approve') ||
    authStore.hasPermission('purchasing.orders.manage');
});

const newRequest = ref({
  department: '',
  description: '',
  items: [
    { item_name: '', quantity: 1, estimated_price: 0 }
  ]
});

onMounted(async () => {
  await purchasingStore.fetchRequests();
});

const addItem = () => {
  newRequest.value.items.push({ item_name: '', quantity: 1, estimated_price: 0 });
};

const removeItem = (index: number) => {
  newRequest.value.items.splice(index, 1);
};

const handleCreateRequest = async () => {
  await purchasingStore.createRequest(newRequest.value);
  isAddModalOpen.value = false;
  newRequest.value = {
    department: '',
    description: '',
    items: [{ item_name: '', quantity: 1, estimated_price: 0 }]
  };
};

const handleApprove = async (uuid: string) => {
  const result = await Swal.fire({
    title: 'Approve Request?',
    text: 'Are you sure you want to approve this purchase request?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Approve',
    confirmButtonColor: '#10B981',
  });

  if (result.isConfirmed) {
    try {
      await purchasingStore.updateRequestStatus(uuid, 'approved');
      if (selectedRequest.value && selectedRequest.value.uuid === uuid) {
        selectedRequest.value.status = 'approved';
      }
      Swal.fire({ title: 'Approved!', text: 'Purchase request has been approved.', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message || 'Failed to approve request', icon: 'error' });
    }
  }
};

const handleReject = async (uuid: string) => {
  const result = await Swal.fire({
    title: 'Reject Request?',
    text: 'Are you sure you want to reject this purchase request?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Reject',
    confirmButtonColor: '#EF4444',
  });

  if (result.isConfirmed) {
    try {
      await purchasingStore.updateRequestStatus(uuid, 'rejected');
      if (selectedRequest.value && selectedRequest.value.uuid === uuid) {
        selectedRequest.value.status = 'rejected';
      }
      Swal.fire({ title: 'Rejected!', text: 'Purchase request has been rejected.', icon: 'info', timer: 1500, showConfirmButton: false });
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message || 'Failed to reject request', icon: 'error' });
    }
  }
};

const openDetail = (request: any) => {
  selectedRequest.value = request;
  isDetailModalOpen.value = true;
};

const calculateTotalEstimate = (items: any[]) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, i) => sum + ((i.estimated_price || i.price || 0) * (i.quantity || i.qty || 1)), 0);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const filteredRequests = computed(() => {
  return (purchasingStore.requests || []).filter((req: any) => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q || 
      (req.number && req.number.toLowerCase().includes(q)) ||
      (req.department && req.department.toLowerCase().includes(q)) ||
      (req.description && req.description.toLowerCase().includes(q));

    const matchesStatus = statusFilter.value === 'All Status' || 
      (req.status && req.status.toLowerCase() === statusFilter.value.toLowerCase());

    return matchesSearch && matchesStatus;
  });
});
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Purchase Requests</h1>
          <p class="text-gray-500">Track and approve internal purchase requirements.</p>
        </div>
        <button 
          @click="isAddModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> New Request
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by request number, department, or description..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
            <option>All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <!-- Requests Desktop Table -->
      <Card class="!p-0 overflow-hidden">
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50/75">
                <th class="table-th">Number</th>
                <th class="table-th">Department</th>
                <th class="table-th">Items & Goods</th>
                <th class="table-th">Total Estimate</th>
                <th class="table-th">Date</th>
                <th class="table-th">Status</th>
                <th class="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="req in filteredRequests" :key="req.uuid" class="table-tr-hover">
                <td class="table-td font-bold text-gray-900 font-mono">{{ req.number || 'PR-N/A' }}</td>
                <td class="table-td text-gray-700 font-medium">{{ req.department || '-' }}</td>
                <td class="table-td">
                  <div class="flex items-center gap-1.5 flex-wrap max-w-xs">
                    <span 
                      v-for="(item, idx) in (req.items || []).slice(0, 2)" 
                      :key="idx" 
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium"
                    >
                      <Package class="h-3 w-3 text-gray-500" />
                      {{ item.item_name || item.name }} (x{{ item.quantity || item.qty || 1 }})
                    </span>
                    <span v-if="(req.items || []).length > 2" class="text-[11px] font-bold text-primary-600">
                      +{{ req.items.length - 2 }} more
                    </span>
                    <span v-if="!req.items || !req.items.length" class="text-xs text-gray-400 italic">No items listed</span>
                  </div>
                </td>
                <td class="table-td font-bold text-gray-900">
                  {{ formatCurrency(calculateTotalEstimate(req.items)) }}
                </td>
                <td class="table-td text-gray-500 text-xs font-medium">
                  {{ req.created_at ? new Date(req.created_at).toLocaleDateString('id-ID') : '-' }}
                </td>
                <td class="table-td">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1"
                    :class="{
                      'bg-amber-100 text-amber-800': req.status === 'pending',
                      'bg-emerald-100 text-emerald-800': req.status === 'approved',
                      'bg-rose-100 text-rose-800': req.status === 'rejected'
                    }"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {{ req.status }}
                  </span>
                </td>
                <td class="table-td text-right">
                  <div class="table-action-toolbar justify-end gap-1">
                    <button 
                      v-if="req.status === 'pending' && canApprove"
                      @click="handleApprove(req.uuid)" 
                      class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Approve Request"
                    >
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button 
                      v-if="req.status === 'pending' && canApprove"
                      @click="handleReject(req.uuid)" 
                      class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Reject Request"
                    >
                      <XCircle class="h-4 w-4" />
                    </button>
                    <button 
                      @click="openDetail(req)" 
                      class="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Inspect Items & Details"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredRequests.length">
                <td colspan="7" class="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                  No purchase requests found matching your query.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Accordion View -->
        <div class="md:hidden p-3">
          <MobileExpandableRow
            v-for="(req, idx) in filteredRequests"
            :key="req.uuid"
            :title="req.number || `PR #${idx + 1}`"
            :subtitle="`Dept: ${req.department || '-'} • ${formatCurrency(calculateTotalEstimate(req.items))}`"
            :badge="req.status ? req.status.toUpperCase() : 'PENDING'"
            :badgeClass="req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : req.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'"
            :index="idx + 1"
          >
            <template #header-icon>
              <div class="h-9 w-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                <ClipboardList class="h-4 w-4" />
              </div>
            </template>

            <template #details>
              <div class="space-y-3 text-xs bg-white p-3 rounded-xl border border-gray-200/80">
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Description</span>
                  <span class="font-medium text-gray-800">{{ req.description || 'No description' }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold mb-1">Items Breakdown ({{ (req.items || []).length }})</span>
                  <div class="space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div v-for="(item, i) in (req.items || [])" :key="i" class="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
                      <span class="font-medium text-gray-900">{{ item.item_name || item.name }}</span>
                      <span class="font-mono text-gray-600">x{{ item.quantity || item.qty }} @ {{ formatCurrency(item.estimated_price || item.price || 0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template #actions>
              <button
                @click="openDetail(req)"
                class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors flex items-center gap-1.5"
              >
                <Eye class="h-3.5 w-3.5" />
                View Details & Items
              </button>
            </template>
          </MobileExpandableRow>
        </div>
      </Card>
    </div>

    <!-- Detail Inspection Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isDetailModalOpen && selectedRequest" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Purchase Request Details</h2>
                <p class="text-xs text-gray-500 font-mono">{{ selectedRequest.number }}</p>
              </div>
              <button @click="isDetailModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <!-- Meta Info -->
              <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Department</span>
                  <span class="font-bold text-gray-900">{{ selectedRequest.department || '-' }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Status</span>
                  <span 
                    class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase mt-1"
                    :class="{
                      'bg-amber-100 text-amber-800': selectedRequest.status === 'pending',
                      'bg-emerald-100 text-emerald-800': selectedRequest.status === 'approved',
                      'bg-rose-100 text-rose-800': selectedRequest.status === 'rejected'
                    }"
                  >
                    {{ selectedRequest.status }}
                  </span>
                </div>
                <div class="col-span-2">
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Description / Purpose</span>
                  <span class="font-medium text-gray-800">{{ selectedRequest.description || 'No description provided.' }}</span>
                </div>
              </div>

              <!-- Items Table -->
              <div class="space-y-2">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Requested Goods / Items List</h3>
                <div class="border border-gray-200 rounded-2xl overflow-hidden">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <tr>
                        <th class="px-4 py-3">Item Name</th>
                        <th class="px-4 py-3 text-center">Qty</th>
                        <th class="px-4 py-3 text-right">Est. Price</th>
                        <th class="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="(item, idx) in (selectedRequest.items || [])" :key="idx" class="hover:bg-gray-50/50">
                        <td class="px-4 py-3 font-semibold text-gray-900">{{ item.item_name || item.name }}</td>
                        <td class="px-4 py-3 text-center font-mono font-bold">{{ item.quantity || item.qty }}</td>
                        <td class="px-4 py-3 text-right font-mono text-gray-600">{{ formatCurrency(item.estimated_price || item.price || 0) }}</td>
                        <td class="px-4 py-3 text-right font-mono font-bold text-gray-900">
                          {{ formatCurrency((item.estimated_price || item.price || 0) * (item.quantity || item.qty || 1)) }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot class="bg-gray-50 font-bold border-t border-gray-200">
                      <tr>
                        <td colspan="3" class="px-4 py-3 text-right uppercase text-xs">Total Estimate</td>
                        <td class="px-4 py-3 text-right text-primary-700 font-mono text-base">
                          {{ formatCurrency(calculateTotalEstimate(selectedRequest.items)) }}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <template v-if="selectedRequest.status === 'pending' && canApprove">
                  <button 
                    @click="handleApprove(selectedRequest.uuid)" 
                    class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-200"
                  >
                    <CheckCircle class="h-4 w-4" /> Approve
                  </button>
                  <button 
                    @click="handleReject(selectedRequest.uuid)" 
                    class="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-md shadow-rose-200"
                  >
                    <XCircle class="h-4 w-4" /> Reject
                  </button>
                </template>
              </div>
              <button @click="isDetailModalOpen = false" class="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl text-sm font-bold hover:bg-gray-300 transition-colors">Close</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- New Request Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-xl font-bold text-gray-900">New Purchase Request</h2>
              <button @click="isAddModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form @submit.prevent="handleCreateRequest" class="p-6 space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-sm font-semibold text-gray-700">Requesting Department</label>
                  <input v-model="newRequest.department" type="text" required placeholder="e.g. IT Department" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Description / Purpose</label>
                  <textarea v-model="newRequest.description" rows="2" placeholder="e.g. For new employee workstation" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Requested Items</h3>
                  <button type="button" @click="addItem" class="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <Plus class="h-3 w-3" /> Add Item
                  </button>
                </div>

                <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <div v-for="(item, index) in newRequest.items" :key="index" class="grid grid-cols-12 gap-3 items-end bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                    <div class="col-span-6 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Item Name</label>
                      <input v-model="item.item_name" type="text" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div class="col-span-2 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Qty</label>
                      <input v-model.number="item.quantity" type="number" min="1" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div class="col-span-3 space-y-1">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Est. Price</label>
                      <input v-model.number="item.estimated_price" type="number" required class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm" />
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
                <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Submit Request</button>
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
