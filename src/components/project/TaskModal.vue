<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProjectStore } from '@/stores/project';
import { useEmployeeStore } from '@/stores/employee';
import { X, Calendar, User, AlignLeft, Flag, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  task?: any;
  initialStatus?: string;
}>();

const emit = defineEmits(['close', 'saved']);

const projectStore = useProjectStore();
const employeeStore = useEmployeeStore();

const formData = ref({
  project_uuid: '',
  name: '',
  description: '',
  assigned_employee_uuid: '',
  start_date: '',
  due_date: '',
  status: 'todo',
  is_milestone: false
});

const isSubmitting = ref(false);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.task) {
      formData.value = { ...props.task };
    } else {
      formData.value = {
        project_uuid: '',
        name: '',
        description: '',
        assigned_employee_uuid: '',
        start_date: '',
        due_date: '',
        status: props.initialStatus || 'todo',
        is_milestone: false
      };
    }
    
    // Ensure data is loaded
    if (projectStore.projects.length === 0) projectStore.fetchProjects();
    if (employeeStore.employees.length === 0) employeeStore.fetchEmployees();
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (props.task?.uuid) {
      await projectStore.updateTask(props.task.uuid, formData.value);
    } else {
      await projectStore.createTask(formData.value);
    }
    emit('saved');
    emit('close');
  } catch (error) {
    console.error('Error saving task:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 class="text-xl font-bold text-gray-900">{{ task ? 'Edit Task' : 'Create New Task' }}</h2>
            <button @click="emit('close')" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Flag class="h-3 w-3" /> Project
                </label>
                <select v-model="formData.project_uuid" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                  <option value="" disabled>Select a project</option>
                  <option v-for="p in projectStore.projects" :key="p.uuid" :value="p.uuid">{{ p.name }}</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 class="h-3 w-3" /> Status
                </label>
                <select v-model="formData.status" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">Task Name</label>
              <input v-model="formData.name" type="text" required class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <AlignLeft class="h-3 w-3" /> Description
              </label>
              <textarea v-model="formData.description" rows="3" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User class="h-3 w-3" /> Assignee
                </label>
                <select v-model="formData.assigned_employee_uuid" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                  <option value="">Unassigned</option>
                  <option v-for="emp in employeeStore.employees" :key="emp.uuid" :value="emp.uuid">
                    {{ emp.first_name }} {{ emp.last_name || '' }}
                  </option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar class="h-3 w-3" /> Due Date
                </label>
                <input v-model="formData.due_date" type="date" class="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
              <input type="checkbox" id="is_milestone" v-model="formData.is_milestone" class="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-purple-200" />
              <label for="is_milestone" class="cursor-pointer">
                <span class="text-sm font-bold text-purple-900">Mark as Milestone</span>
              </label>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" @click="emit('close')" class="flex-1 px-4 py-3 border border-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-50">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="flex-1 px-4 py-3 bg-primary-600 text-white rounded-2xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 disabled:opacity-50">
                {{ isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task') }}
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
