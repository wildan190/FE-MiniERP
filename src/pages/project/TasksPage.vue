<script setup lang="ts">
import { onMounted, ref } from 'vue'; // test write
import { useProjectStore } from '@/stores/project';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User,
  CheckCircle2,
  Clock
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import TaskModal from '@/components/project/TaskModal.vue';
const projectStore = useProjectStore();
const searchQuery = ref('');
const isModalOpen = ref(false);

onMounted(async () => {
  await projectStore.fetchTasks();
  await projectStore.fetchProjects();
});

const handleTaskSaved = async () => {
  await projectStore.fetchTasks();
};
</script>

<template>
  <AppLayout>
    <TaskModal 
      :is-open="isModalOpen" 
      @close="isModalOpen = false" 
      @saved="handleTaskSaved"
    />
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Task List</h1>
          <p class="text-gray-500">Detailed view of all project tasks and milestones.</p>
        </div>
        <button 
          @click="isModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> New Task
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search tasks by name or description..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div class="flex gap-2">
          <select class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
            <option>All Projects</option>
            <option v-for="p in projectStore.projects" :key="p.uuid" :value="p.uuid">{{ p.name }}</option>
          </select>
          <select class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
            <option>All Status</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Done</option>
          </select>
        </div>
      </div>

      <!-- Tasks Table -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Task Name</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Project</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Assignee</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Due Date</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="task in projectStore.tasks" :key="task.uuid" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-gray-900">{{ task.name }}</span>
                  <span v-if="task.is_milestone" class="text-[10px] font-bold text-purple-600 uppercase">Milestone</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ task.project?.name }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                    {{ task.assigned_employee?.first_name?.charAt(0) || '?' }}
                  </div>
                  <span class="text-sm text-gray-600">
                    {{ task.assigned_employee ? `${task.assigned_employee.first_name} ${task.assigned_employee.last_name || ''}` : 'Unassigned' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ task.due_date || 'N/A' }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-primary-500 rounded-full" :style="{ width: task.progress_percentage + '%' }"></div>
                  </div>
                  <span class="text-[10px] font-bold text-gray-600">{{ task.progress_percentage }}%</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="{
                    'bg-gray-100 text-gray-600': task.status === 'todo',
                    'bg-blue-50 text-blue-600': task.status === 'in_progress',
                    'bg-amber-50 text-amber-600': task.status === 'review',
                    'bg-emerald-50 text-emerald-600': task.status === 'done'
                  }"
                >
                  {{ task.status }}
                </span>
              </td>
            </tr>
            <tr v-if="!projectStore.tasks.length">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500 italic">
                <div class="inline-flex items-center justify-center h-16 w-16 bg-gray-50 rounded-full mb-4">
                  <ClipboardList class="h-8 w-8 text-gray-300" />
                </div>
                <p>No tasks found.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>
