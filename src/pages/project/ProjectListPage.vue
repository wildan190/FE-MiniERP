<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import { 
  Plus, 
  Search, 
  Briefcase, 
  MoreVertical, 
  Calendar, 
  User, 
  TrendingUp,
  X
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import ProjectModal from '@/components/project/ProjectModal.vue';

const projectStore = useProjectStore();
const searchQuery = ref('');
const isAddModalOpen = ref(false);

onMounted(async () => {
  await projectStore.fetchProjects();
});

const handleProjectSaved = async () => {
  await projectStore.fetchProjects();
};
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
          <select class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
            <option>All Status</option>
            <option>Active</option>
            <option>On Hold</option>
            <option>Completed</option>
          </select>
          <select class="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
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
          v-for="project in projectStore.projects" 
          :key="project.uuid"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="h-12 w-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all">
                {{ project.name.charAt(0) }}
              </div>
              <button class="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <MoreVertical class="h-4 w-4 text-gray-400" />
              </button>
            </div>
            
            <h3 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{{ project.name }}</h3>
            <p class="text-xs text-gray-500 mb-4">{{ project.code }} &bull; {{ project.client_name || 'Internal' }}</p>

            <div class="space-y-3 pt-4 border-t border-gray-50">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 flex items-center gap-2"><Calendar class="h-4 w-4" /> Timeline</span>
                <span class="font-medium text-gray-900">{{ new Date(project.start_date).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 flex items-center gap-2"><TrendingUp class="h-4 w-4" /> Progress</span>
                <span class="font-medium text-primary-600">65%</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500 rounded-full" style="width: 65%"></div>
            </div>
          </div>
          
          <div class="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
            <span 
              class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              :class="{
                'bg-emerald-100 text-emerald-700': project.status === 'active',
                'bg-amber-100 text-amber-700': project.status === 'on_hold',
                'bg-blue-100 text-blue-700': project.status === 'completed'
              }"
            >
              {{ project.status }}
            </span>
            <div class="flex -space-x-2">
              <div v-for="i in 3" :key="i" class="h-7 w-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                {{ String.fromCharCode(64 + i) }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="!projectStore.projects.length" class="col-span-full py-20 text-center">
          <div class="inline-flex items-center justify-center h-20 w-20 bg-gray-50 rounded-full mb-4">
            <Briefcase class="h-10 w-10 text-gray-300" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">No projects yet</h3>
          <p class="text-gray-500 mt-1">Create your first project to start tracking work.</p>
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
