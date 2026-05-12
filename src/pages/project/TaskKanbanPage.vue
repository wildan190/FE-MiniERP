<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useProjectStore } from '@/stores/project';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User,
  LayoutGrid,
  List as ListIcon,
  X
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import TaskModal from '@/components/project/TaskModal.vue';

const projectStore = useProjectStore();
const viewMode = ref('kanban'); // kanban or list
const isModalOpen = ref(false);
const selectedStatus = ref('todo');

const openCreateModal = (status = 'todo') => {
  selectedStatus.value = status;
  isModalOpen.value = true;
};

onMounted(async () => {
  await projectStore.fetchTasks();
  await projectStore.fetchProjects();
});

const columns = [
  { id: 'todo', name: 'To Do', color: 'bg-gray-100 text-gray-600' },
  { id: 'in_progress', name: 'In Progress', color: 'bg-blue-50 text-blue-600' },
  { id: 'review', name: 'Review', color: 'bg-amber-50 text-amber-600' },
  { id: 'done', name: 'Done', color: 'bg-emerald-50 text-emerald-600' }
];

const tasksByStatus = computed(() => {
  const groups: any = { todo: [], in_progress: [], review: [], done: [] };
  projectStore.tasks.forEach(task => {
    if (groups[task.status]) {
      groups[task.status].push(task);
    }
  });
  return groups;
});

const handleTaskSaved = async () => {
  await projectStore.fetchTasks();
};
</script>

<template>
  <AppLayout>
    <TaskModal 
      :is-open="isModalOpen" 
      :initial-status="selectedStatus"
      @close="isModalOpen = false" 
      @saved="handleTaskSaved"
    />
    <div class="p-6 max-w-[1600px] mx-auto space-y-6 h-[calc(100vh-64px)] flex flex-col">
      <div class="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Task Management</h1>
          <p class="text-gray-500">Organize, track, and manage your team's work.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-white border border-gray-100 p-1 rounded-xl flex gap-1 shadow-sm">
            <button 
              @click="viewMode = 'kanban'"
              class="p-2 rounded-lg transition-all"
              :class="viewMode === 'kanban' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            >
              <LayoutGrid class="h-4 w-4" />
            </button>
            <button 
              @click="viewMode = 'list'"
              class="p-2 rounded-lg transition-all"
              :class="viewMode === 'list' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            >
              <ListIcon class="h-4 w-4" />
            </button>
          </div>
          <button 
            @click="openCreateModal('todo')"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
          >
            <Plus class="h-4 w-4" /> Add Task
          </button>
        </div>
      </div>

      <!-- Kanban View -->
      <div v-if="viewMode === 'kanban'" class="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        <div v-for="col in columns" :key="col.id" class="flex-shrink-0 w-80 flex flex-col gap-4">
          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" :class="col.color">
                {{ col.name }}
              </span>
              <span class="text-xs font-medium text-gray-400">{{ tasksByStatus[col.id]?.length || 0 }}</span>
            </div>
            <button 
              @click="openCreateModal(col.id)"
              class="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Plus class="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div class="flex-1 space-y-3 min-h-[200px]">
            <div 
              v-for="task in tasksByStatus[col.id]" 
              :key="task.uuid"
              class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all cursor-pointer group"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{{ task.project?.code || 'PRJ' }}</span>
                <button class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-50 rounded transition-all">
                  <MoreVertical class="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
              <h4 class="text-sm font-bold text-gray-900 mb-3 leading-tight">{{ task.name }}</h4>
              
              <div class="flex items-center justify-between mt-auto">
                <div class="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                  <Calendar class="h-3 w-3" />
                  {{ task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date' }}
                </div>
                <div class="flex items-center gap-2">
                  <div class="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600">
                    {{ task.assigned_employee?.first_name?.charAt(0) || '?' }}
                  </div>
                  <span class="text-[10px] text-gray-500">{{ task.assigned_employee?.first_name || 'Unassigned' }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="!tasksByStatus[col.id]?.length" class="h-24 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center text-xs text-gray-300 italic">
              No tasks here
            </div>
          </div>
        </div>
      </div>

      <!-- List View Placeholder -->
      <div v-else class="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-y-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Task</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Project</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Assignee</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Due Date</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="task in projectStore.tasks" :key="task.uuid" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-2 w-2 rounded-full" :class="columns.find(c => c.id === task.status)?.color.split(' ')[1].replace('text-', 'bg-')"></div>
                  <span class="font-medium text-gray-900">{{ task.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ task.project?.name }}</td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ task.assigned_employee?.name || 'Unassigned' }}</td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ task.due_date }}</td>
              <td class="px-6 py-4 capitalize text-xs font-medium">{{ task.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
</style>
