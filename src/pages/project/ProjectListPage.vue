<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import { 
  Plus, 
  Search, 
  Briefcase, 
  MoreVertical, 
  Calendar, 
  TrendingUp,
  Kanban,
  CheckSquare,
  DollarSign,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import ProjectModal from '@/components/project/ProjectModal.vue';

const projectStore = useProjectStore();
const authStore = useAuthStore();
const router = useRouter();
const searchQuery = ref('');
const statusFilter = ref('All Status');
const priorityFilter = ref('All Priority');
const isAddModalOpen = ref(false);
const activeDropdown = ref<string | null>(null);

// Check if user has Project Approval rights (Project Director / Admin)
const canApproveProject = computed(() => {
  return authStore.isSuperAdmin || 
    authStore.hasRole('admin') || 
    authStore.hasRole('project-manager') || 
    authStore.hasRole('director') ||
    authStore.hasPermission('projects.manage');
});

onMounted(async () => {
  await projectStore.fetchProjects();
});

const handleProjectSaved = async () => {
  await projectStore.fetchProjects();
};

const handleApproveProject = async (uuid: string, e: Event) => {
  e.stopPropagation();
  const result = await Swal.fire({
    title: 'Approve Project?',
    text: 'This will authorize the project initiation and mark it as Active.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Approve Project',
    confirmButtonColor: '#10B981',
  });

  if (result.isConfirmed) {
    try {
      await projectStore.updateProjectStatus(uuid, 'active');
      Swal.fire({ title: 'Approved!', text: 'Project is now active.', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message || 'Failed to approve project', icon: 'error' });
    }
  }
};

const handleRejectProject = async (uuid: string, e: Event) => {
  e.stopPropagation();
  const result = await Swal.fire({
    title: 'Reject Project?',
    text: 'This will reject the project proposal.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Reject',
    confirmButtonColor: '#EF4444',
  });

  if (result.isConfirmed) {
    try {
      await projectStore.updateProjectStatus(uuid, 'rejected');
      Swal.fire({ title: 'Rejected!', text: 'Project marked as rejected.', icon: 'info', timer: 1500, showConfirmButton: false });
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.message || 'Failed to reject project', icon: 'error' });
    }
  }
};

const toggleDropdown = (uuid: string, e: Event) => {
  e.stopPropagation();
  if (activeDropdown.value === uuid) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = uuid;
  }
};

const navigateToTasks = (projectUuid: string, e?: Event) => {
  if (e) e.stopPropagation();
  router.push({ path: '/project/tasks', query: { project: projectUuid } });
};

const navigateToKanban = (projectUuid: string, e?: Event) => {
  if (e) e.stopPropagation();
  router.push({ path: '/project/kanban', query: { project: projectUuid } });
};

const filteredProjects = computed(() => {
  return (projectStore.projects || []).filter((project: any) => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q || 
      (project.name && project.name.toLowerCase().includes(q)) ||
      (project.code && project.code.toLowerCase().includes(q)) ||
      (project.client_name && project.client_name.toLowerCase().includes(q));

    const matchesStatus = statusFilter.value === 'All Status' || 
      (project.status && project.status.toLowerCase() === statusFilter.value.toLowerCase().replace(' ', '_'));

    return matchesSearch && matchesStatus;
  });
});
</script>

<template>
  <AppLayout>
    <ProjectModal 
      :is-open="isAddModalOpen" 
      @close="isAddModalOpen = false" 
      @saved="handleProjectSaved"
    />
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
          <p class="text-gray-500">Manage and monitor all company projects.</p>
        </div>
        <button 
          @click="isAddModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> New Project
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search projects by name, client, or code..." 
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="statusFilter" class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
            <option>All Status</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <select v-model="priorityFilter" class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <!-- Project Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="project in filteredProjects" 
          :key="project.uuid"
          @click="navigateToTasks(project.uuid)"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all overflow-hidden group cursor-pointer relative flex flex-col justify-between"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="h-12 w-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                {{ project.name ? project.name.charAt(0).toUpperCase() : 'P' }}
              </div>
              
              <!-- Action Dropdown Trigger -->
              <div class="relative">
                <button 
                  @click="toggleDropdown(project.uuid, $event)"
                  class="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-700"
                  title="Actions Menu"
                >
                  <MoreVertical class="h-5 w-5" />
                </button>

                <!-- Dropdown Menu -->
                <div 
                  v-if="activeDropdown === project.uuid"
                  class="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-20"
                >
                  <button 
                    @click="navigateToTasks(project.uuid, $event)"
                    class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                  >
                    <CheckSquare class="h-4 w-4" /> View Tasks
                  </button>
                  <button 
                    @click="navigateToKanban(project.uuid, $event)"
                    class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                  >
                    <Kanban class="h-4 w-4" /> Task Kanban
                  </button>
                  <RouterLink 
                    :to="`/project/budget`"
                    @click.stop
                    class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                  >
                    <DollarSign class="h-4 w-4" /> Budget & Cost
                  </RouterLink>
                </div>
              </div>
            </div>
            
            <h3 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{{ project.name }}</h3>
            <p class="text-xs text-gray-500 mb-4 font-mono">{{ project.code || 'NO-CODE' }} &bull; {{ project.client_name || 'Internal' }}</p>

            <div class="space-y-3 pt-4 border-t border-gray-50">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 flex items-center gap-2 text-xs"><Calendar class="h-4 w-4 text-gray-400" /> Start Date</span>
                <span class="font-semibold text-gray-900 text-xs">{{ project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 flex items-center gap-2 text-xs"><TrendingUp class="h-4 w-4 text-emerald-500" /> Progress</span>
                <span class="font-bold text-primary-600 text-xs">65%</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500 rounded-full" style="width: 65%"></div>
            </div>
          </div>
          
          <!-- Card Footer Action Toolbar -->
          <div class="px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between gap-2">
            <span 
              class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :class="{
                'bg-emerald-100 text-emerald-700': project.status === 'active' || project.status === 'approved',
                'bg-amber-100 text-amber-700': project.status === 'pending_approval' || project.status === 'draft',
                'bg-rose-100 text-rose-700': project.status === 'rejected',
                'bg-blue-100 text-blue-700': project.status === 'completed',
                'bg-gray-100 text-gray-700': project.status === 'on_hold' || project.status === 'planning'
              }"
            >
              {{ (project.status || 'Active').replace('_', ' ') }}
            </span>
            
            <div class="flex items-center gap-1.5">
              <template v-if="(project.status === 'pending_approval' || project.status === 'draft') && canApproveProject">
                <button 
                  @click="handleApproveProject(project.uuid, $event)"
                  class="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-2xs"
                  title="Approve Project"
                >
                  <CheckCircle class="h-3.5 w-3.5" />
                  Approve
                </button>
                <button 
                  @click="handleRejectProject(project.uuid, $event)"
                  class="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1 shadow-2xs"
                  title="Reject Project"
                >
                  <XCircle class="h-3.5 w-3.5" />
                  Reject
                </button>
              </template>
              <button 
                @click="navigateToTasks(project.uuid, $event)"
                class="px-2.5 py-1 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <CheckSquare class="h-3.5 w-3.5" />
                Tasks
              </button>
              <button 
                @click="navigateToKanban(project.uuid, $event)"
                class="px-2.5 py-1 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <Kanban class="h-3.5 w-3.5" />
                Kanban
              </button>
            </div>
          </div>
        </div>

        <div v-if="!filteredProjects.length" class="col-span-full py-20 text-center">
          <div class="inline-flex items-center justify-center h-20 w-20 bg-gray-50 rounded-full mb-4">
            <Briefcase class="h-10 w-10 text-gray-300" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">
            {{ searchQuery ? `No projects match "${searchQuery}"` : 'No projects yet' }}
          </h3>
          <p class="text-gray-500 mt-1">
            {{ searchQuery ? 'Try adjusting your search query or filters.' : 'Create your first project to start tracking work.' }}
          </p>
        </div>
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
</style>
