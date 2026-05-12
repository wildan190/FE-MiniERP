<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProjectStore } from '@/stores/project';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'saved']);
const projectStore = useProjectStore();

const expense = ref({
  project_uuid: '',
  type: 'Material',
  description: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0]
});

onMounted(async () => {
  if (projectStore.projects.length === 0) {
    await projectStore.fetchProjects();
  }
});

const handleSubmit = async () => {
  await projectStore.addExpense(expense.value);
  emit('saved');
  emit('close');
  // Reset
  expense.value = {
    project_uuid: '',
    type: 'Material',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  };
};

const categories = ['Material', 'Labor', 'Equipment', 'Subcontractor', 'Others'];
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 class="text-xl font-bold text-gray-900">Add Project Expense</h2>
            <button @click="emit('close')" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Project</label>
              <select v-model="expense.project_uuid" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                <option value="" disabled>Select project...</option>
                <option v-for="p in projectStore.projects" :key="p.uuid" :value="p.uuid">{{ p.name }}</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Category</label>
                <select v-model="expense.type" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Amount (Rp)</label>
                <input v-model.number="expense.amount" type="number" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Date</label>
              <input v-model="expense.date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Description</label>
              <textarea v-model="expense.description" rows="3" placeholder="What is this expense for?" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" @click="emit('close')" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
              <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Save Expense</button>
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
</style>
