<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useProjectStore } from '@/stores/project';
import { useEmployeeStore } from '@/stores/employee';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import { 
  X, 
  ShoppingBag, 
  DollarSign, 
  User, 
  FileText, 
  Calendar, 
  Layers, 
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'saved']);
const projectStore = useProjectStore();
const employeeStore = useEmployeeStore();
const authStore = useAuthStore();

const isSubmitting = ref(false);

const expense = ref({
  project_uuid: '',
  type: 'material',
  item_name: '',
  quantity: 1,
  unit_price: 0,
  amount: 0,
  purpose: '',
  description: '',
  requested_by_employee_uuid: '',
  requested_by_name: '',
  date: new Date().toISOString().split('T')[0]
});

// Auto calculate total amount
const calculatedTotal = computed(() => {
  const qty = Number(expense.value.quantity) || 0;
  const price = Number(expense.value.unit_price) || 0;
  return qty * price;
});

watch(calculatedTotal, (newTotal) => {
  expense.value.amount = newTotal;
});

// Auto-fill requested_by_name when employee is selected
watch(() => expense.value.requested_by_employee_uuid, (empUuid) => {
  if (empUuid) {
    const emp = employeeStore.employees.find(e => e.uuid === empUuid);
    if (emp) {
      expense.value.requested_by_name = `${emp.first_name} ${emp.last_name || ''}`.trim();
    }
  }
});

onMounted(async () => {
  if (projectStore.projects.length === 0) {
    await projectStore.fetchProjects();
  }
  if (employeeStore.employees.length === 0) {
    await employeeStore.fetchEmployees();
  }
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (projectStore.projects.length === 0) projectStore.fetchProjects();
    if (employeeStore.employees.length === 0) employeeStore.fetchEmployees();

    // Set default requester if logged-in user matches an employee or fallback to auth user name
    const currentUserName = authStore.user?.name || '';
    const matchingEmp = employeeStore.employees.find(
      e => e.first_name.toLowerCase().includes(currentUserName.toLowerCase()) || 
           e.user?.email === authStore.user?.email
    );

    expense.value = {
      project_uuid: projectStore.projects[0]?.uuid || '',
      type: 'material',
      item_name: '',
      quantity: 1,
      unit_price: 0,
      amount: 0,
      purpose: '',
      description: '',
      requested_by_employee_uuid: matchingEmp?.uuid || '',
      requested_by_name: matchingEmp ? `${matchingEmp.first_name} ${matchingEmp.last_name || ''}`.trim() : currentUserName,
      date: new Date().toISOString().split('T')[0]
    };
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      ...expense.value,
      amount: calculatedTotal.value > 0 ? calculatedTotal.value : expense.value.amount
    };

    await projectStore.addExpense(payload);
    
    await Swal.fire({
      title: 'Expense Recorded!',
      text: 'Project cost added and successfully synced to the Finance module.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    emit('saved');
    emit('close');
  } catch (err: any) {
    console.error('Failed to add expense:', err);
    Swal.fire({
      title: 'Failed to Save',
      text: err.response?.data?.message || err.message || 'Error occurred while saving expense',
      icon: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const categories = [
  { value: 'material', label: 'Material & Supplies' },
  { value: 'labor', label: 'Labor & Manpower' },
  { value: 'equipment', label: 'Equipment & Rental' },
  { value: 'subcontractor', label: 'Vendor / Subcontractor' },
  { value: 'operational', label: 'Operational & Travel' },
  { value: 'other', label: 'Other Expenses' }
];
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-primary-50/30">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-sm">
                <ShoppingBag class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Add Project Expense</h2>
                <p class="text-xs text-gray-500">Record itemized purchase and sync directly to Company Finance.</p>
              </div>
            </div>
            <button @click="emit('close')" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <!-- Modal Body / Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            <!-- Sync to Finance Notice Badge -->
            <div class="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-800">
              <Sparkles class="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Integrated Finance:</strong> This expense will automatically post as an expenditure entry in the <strong>Finance module</strong> and update project profitability.
              </span>
            </div>

            <!-- Project & Category Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 class="h-3 w-3" /> Project *
                </label>
                <select v-model="expense.project_uuid" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500">
                  <option value="" disabled>Select project...</option>
                  <option v-for="p in projectStore.projects" :key="p.uuid" :value="p.uuid">{{ p.name }} ({{ p.code || 'PRJ' }})</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers class="h-3 w-3" /> Expense Category *
                </label>
                <select v-model="expense.type" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500">
                  <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                </select>
              </div>
            </div>

            <!-- Item Name (Beli Apa) -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag class="h-3 w-3" /> Item / Purchase Name (Beli Apa) *
              </label>
              <input 
                v-model="expense.item_name" 
                type="text" 
                required 
                placeholder="e.g. 50 Bags Portland Cement, Cloud Server Subscription, Freelance UI Specialist" 
                class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Quantity, Unit Price, and Auto-calculated Total Amount -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity (Jumlah) *</label>
                <input 
                  v-model.number="expense.quantity" 
                  type="number" 
                  min="1" 
                  required 
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Price (Harga Satuan) *</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">Rp</span>
                  <input 
                    v-model.number="expense.unit_price" 
                    type="number" 
                    min="0" 
                    required 
                    placeholder="0"
                    class="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Amount (Biaya)</label>
                <div class="px-3 py-2 bg-primary-50 text-primary-700 font-extrabold text-sm rounded-xl flex items-center border border-primary-100">
                  Rp {{ calculatedTotal.toLocaleString('id-ID') }}
                </div>
              </div>
            </div>

            <!-- Purpose (Keperluan Buat Apa) -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FileText class="h-3 w-3" /> Purpose &amp; Justification (Keperluan Buat Apa) *
              </label>
              <textarea 
                v-model="expense.purpose" 
                rows="2" 
                required 
                placeholder="e.g. Pembelian bahan baku untuk sprint 2 milestone pondasi, atau server hosting staging client..." 
                class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <!-- Requester (Siapa yang Mengajukan) & Date -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User class="h-3 w-3" /> Requester (Yang Mengajukan) *
                </label>
                <select v-model="expense.requested_by_employee_uuid" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                  <option value="">Select employee or type below...</option>
                  <option v-for="emp in employeeStore.employees" :key="emp.uuid" :value="emp.uuid">
                    {{ emp.first_name }} {{ emp.last_name || '' }} ({{ emp.emp_code }})
                  </option>
                </select>
                <input 
                  v-if="!expense.requested_by_employee_uuid" 
                  v-model="expense.requested_by_name" 
                  type="text" 
                  placeholder="Or enter applicant name manually..."
                  class="w-full mt-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar class="h-3 w-3" /> Expense Date *
                </label>
                <input 
                  v-model="expense.date" 
                  type="date" 
                  required 
                  class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary-500" 
                />
              </div>
            </div>

            <!-- Optional Additional Notes -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">Additional Notes / Reference No (Optional)</label>
              <input 
                v-model="expense.description" 
                type="text" 
                placeholder="No. Invoice / Kwitansi / Supplier info..." 
                class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 flex gap-3 border-t border-gray-100">
              <button 
                type="button" 
                @click="emit('close')" 
                class="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="isSubmitting || !expense.project_uuid || !expense.item_name || calculatedTotal <= 0"
                class="flex-1 px-4 py-3 bg-primary-600 text-white rounded-2xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 class="h-4 w-4" />
                {{ isSubmitting ? 'Recording & Syncing...' : 'Save & Sync to Finance' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up { animation: scaleUp 0.3s ease-out; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
</style>
