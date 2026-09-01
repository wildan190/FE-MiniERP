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
  X,
  GripVertical,
  CheckCircle2,
  Clock,
  Edit3
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import TaskModal from '@/components/project/TaskModal.vue';

const projectStore = useProjectStore();
const viewMode = ref<'kanban' | 'list'>('kanban');
const isModalOpen = ref(false);
const selectedStatus = ref('todo');
const selectedTask = ref<any | null>(null);
const draggedTask = ref<any | null>(null);
const dragOverColumn = ref<string | null>(null);
const isDragging = ref(false);

const openCreateModal = (status = 'todo') => {
  selectedTask.value = null;
  selectedStatus.value = status;
  isModalOpen.value = true;
};

const openEditModal = (task: any) => {
  // Only open modal if not currently dragging
  if (isDragging.value) return;
  selectedTask.value = { ...task };
  selectedStatus.value = task.status || 'todo';
  isModalOpen.value = true;
};

onMounted(async () => {
  await projectStore.fetchTasks();
  await projectStore.fetchProjects();
});

const columns = [
  { id: 'todo', name: 'To Do', color: 'bg-gray-100 text-gray-700', border: 'border-gray-200' },
  { id: 'in_progress', name: 'In Progress', color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
  { id: 'review', name: 'Review', color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
  { id: 'done', name: 'Done', color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' }
];

const tasksByStatus = computed(() => {
  const groups: Record<string, any[]> = { todo: [], in_progress: [], review: [], done: [] };
  (projectStore.tasks || []).filter(Boolean).forEach(task => {
    if (task && groups[task.status]) {
      groups[task.status].push(task);
    }
  });
  return groups;
});

// Drag and Drop Handlers
const onDragStart = (task: any, e: DragEvent) => {
  isDragging.value = true;
  draggedTask.value = task;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.uuid);
  }
};

const onDragEnd = () => {
  // Small delay so click event doesn't trigger immediately after drop
  setTimeout(() => {
    isDragging.value = false;
    draggedTask.value = null;
  }, 100);
};

const onDragOver = (status: string, e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
  dragOverColumn.value = status;
};

const onDragLeave = (status: string) => {
  if (dragOverColumn.value === status) {
    dragOverColumn.value = null;
  }
};

const onDrop = async (status: string, e: DragEvent) => {
  e.preventDefault();
  dragOverColumn.value = null;
  if (!draggedTask.value) return;

  const targetTask = draggedTask.value;
  if (targetTask.status === status) return;

  const oldStatus = targetTask.status;
  // Optimistic UI update
  targetTask.status = status;

  try {
    await projectStore.updateTask(targetTask.uuid, {
      status,
      project_uuid: targetTask.project_uuid,
    });
  } catch (err) {
    console.error('Failed to move task:', err);
    targetTask.status = oldStatus;
  }
};

const handleTaskSaved = async () => {
  await projectStore.fetchTasks();
};
</script>

<template>
  <AppLayout>
    <TaskModal 
      :is-open="isModalOpen" 
      :task="selectedTask"
      :initial-status="selectedStatus"
      @close="isModalOpen = false" 
      @saved="handleTaskSaved"
    />
    <div class="p-6 max-w-[1600px] mx-auto space-y-6 h-[calc(100vh-64px)] flex flex-col">
      <div class="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Task Management</h1>
          <p class="text-gray-500">Click any card to inspect or edit details. Drag and drop to move between stages.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-white border border-gray-100 p-1 rounded-xl flex gap-1 shadow-sm">
            <button 
              @click="viewMode = 'kanban'"
              class="p-2 rounded-lg transition-all"
              :class="viewMode === 'kanban' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
              title="Kanban View"
            >
              <LayoutGrid class="h-4 w-4" />
            </button>
            <button 
              @click="viewMode = 'list'"
              class="p-2 rounded-lg transition-all"
              :class="viewMode === 'list' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
              title="List View"
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
        <div 
          v-for="col in columns" 
          :key="col.id" 
          class="flex-shrink-0 w-80 flex flex-col gap-3 rounded-2xl p-3 bg-gray-50/60 border border-gray-100 transition-colors"
          :class="{ 'bg-primary-50/40 border-dashed border-primary-300': dragOverColumn === col.id }"
          @dragover="onDragOver(col.id, $event)"
          @dragleave="onDragLeave(col.id)"
          @drop="onDrop(col.id, $event)"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" :class="col.color">
                {{ col.name }}
              </span>
              <span class="text-xs font-semibold text-gray-400">{{ tasksByStatus[col.id]?.length || 0 }}</span>
            </div>
            <button 
              @click="openCreateModal(col.id)"
              class="p-1 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              title="Add task in this column"
            >
              <Plus class="h-4 w-4" />
            </button>
          </div>

          <!-- Column Task List / Drop Zone -->
          <div class="flex-1 space-y-3 min-h-[300px]">
            <div 
              v-for="task in tasksByStatus[col.id]" 
              :key="task.uuid"
              draggable="true"
              @dragstart="onDragStart(task, $event)"
              @dragend="onDragEnd"
              @click="openEditModal(task)"
              class="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group select-none relative"
            >
              <!-- Top Row: Project Code + Milestone + Edit Icon -->
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-1.5">
                  <GripVertical class="h-3.5 w-3.5 text-gray-300 group-hover:text-primary-400 transition-colors cursor-grab active:cursor-grabbing" />
                  <span class="text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded-md">
                    {{ task.project?.code || 'PRJ' }}
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <span v-if="task.is_milestone" class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">
                    Milestone
                  </span>
                  <button 
                    @click.stop="openEditModal(task)" 
                    class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary-600 transition-all"
                    title="Edit Task"
                  >
                    <Edit3 class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <!-- Task Title & Description -->
              <h4 class="text-sm font-bold text-gray-900 mb-1.5 leading-snug group-hover:text-primary-600 transition-colors">{{ task.name }}</h4>
              <p v-if="task.description" class="text-xs text-gray-400 line-clamp-2 mb-3">{{ task.description }}</p>
              
              <!-- Footer: Due Date + Assignee Avatar -->
              <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                <div class="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                  <Calendar class="h-3 w-3" />
                  {{ task.due_date ? new Date(task.due_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : 'No due' }}
                </div>
                <div class="flex items-center gap-1.5">
                  <div class="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">
                    {{ task.assigned_employee?.first_name ? task.assigned_employee.first_name.charAt(0).toUpperCase() : '?' }}
                  </div>
                  <span class="text-xs font-semibold text-gray-700">
                    {{ task.assigned_employee ? `${task.assigned_employee.first_name} ${task.assigned_employee.last_name || ''}`.trim() : 'Unassigned' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div 
              v-if="!tasksByStatus[col.id]?.length" 
              class="h-28 border-2 border-dashed border-gray-200/80 rounded-2xl flex flex-col items-center justify-center text-xs text-gray-400 gap-1"
            >
              <span>No tasks</span>
              <span class="text-[10px] text-gray-300">Drag items here</span>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
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
            <tr 
              v-for="task in (projectStore.tasks || []).filter(Boolean)" 
              :key="task.uuid || task.id" 
              @click="openEditModal(task)"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer group"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-2 w-2 rounded-full" :class="columns.find(c => c.id === task.status)?.color?.split(' ')[1]?.replace('text-', 'bg-') || 'bg-gray-400'"></div>
                  <span class="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{{ task.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600 text-sm">{{ task.project?.name || '-' }}</td>
              <td class="px-6 py-4 text-gray-700 text-sm">
                {{ task.assigned_employee ? `${task.assigned_employee.first_name} ${task.assigned_employee.last_name || ''}`.trim() : 'Unassigned' }}
              </td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ task.due_date || 'N/A' }}</td>
              <td class="px-6 py-4 capitalize text-xs font-medium">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" :class="columns.find(c => c.id === task.status)?.color || 'bg-gray-100 text-gray-600'">
                  {{ (task.status || 'todo').replace('_', ' ') }}
                </span>
              </td>
            </tr>
            <tr v-if="!projectStore.tasks?.length">
              <td colspan="5" class="px-6 py-12 text-center text-gray-400 text-sm italic">
                No tasks found.
              </td>
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
