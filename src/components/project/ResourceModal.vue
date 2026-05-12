<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProjectStore } from '@/stores/project';
import { useEmployeeStore } from '@/stores/employee';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'saved']);
const projectStore = useProjectStore();
const employeeStore = useEmployeeStore();

const member = ref({
  project_uuid: '',
  employee_uuid: '',
  role: '',
  allocation_percentage: 100
});

onMounted(async () => {
  if (employeeStore.employees.length === 0) {
    await employeeStore.fetchEmployees();
  }
  if (projectStore.projects.length === 0) {
    await projectStore.fetchProjects();
  }
});

const handleSubmit = async () => {
  await projectStore.assignMember(member.value);
  emit('saved');
  emit('close');
  // Reset
  member.value = {
    project_uuid: '',
    employee_uuid: '',
    role: '',
    allocation_percentage: 100
  };
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 class="text-xl font-bold text-gray-900">Assign Resource</h2>
            <button @click="emit('close')" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Project</label>
              <select v-model="member.project_uuid" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                <option value="" disabled>Select project...</option>
                <option v-for="p in projectStore.projects" :key="p.uuid" :value="p.uuid">{{ p.name }}</option>
              </select>
            </div>
            
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Employee</label>
              <select v-model="member.employee_uuid" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                <option value="" disabled>Select employee...</option>
                <option v-for="e in employeeStore.employees" :key="e.uuid" :value="e.uuid">{{ e.first_name }} {{ e.last_name }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Role in Project</label>
                <input v-model="member.role" type="text" placeholder="e.g. Developer, Lead" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">Allocation (%)</label>
                <input v-model.number="member.allocation_percentage" type="number" min="1" max="100" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" @click="emit('close')" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
              <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Assign Member</button>
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
