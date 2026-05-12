<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ChevronRight,
  Plus
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import ProjectModal from '@/components/project/ProjectModal.vue';

const projectStore = useProjectStore();
const isModalOpen = ref(false);

onMounted(async () => {
  await projectStore.fetchDashboard();
});

const handleProjectSaved = async () => {
  await projectStore.fetchDashboard();
};
</script>

<template>
  <AppLayout>
    <ProjectModal 
      :is-open="isModalOpen" 
      @close="isModalOpen = false" 
      @saved="handleProjectSaved"
    />
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Project Overview</h1>
          <p class="text-gray-500 mt-1">Track your team's progress and project health.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            Export Report
          </button>
          <button 
            @click="isModalOpen = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-200"
          >
            <Plus class="h-4 w-4 inline mr-1" /> New Project
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
              <Briefcase class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Projects</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ projectStore.dashboardData?.stats?.total_projects || 0 }}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
              <TrendingUp class="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Projects</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ projectStore.dashboardData?.stats?.active_projects || 0 }}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-50 rounded-2xl group-hover:bg-amber-100 transition-colors">
              <Clock class="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Tasks</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ projectStore.dashboardData?.stats?.pending_tasks || 0 }}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
              <CheckCircle2 class="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Value</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-1">Rp {{ (projectStore.dashboardData?.stats?.total_value || 0).toLocaleString() }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Projects -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-xl font-bold text-gray-900">Recent Projects</h3>
            <RouterLink to="/project/list" class="text-sm font-medium text-primary-600 hover:text-primary-700">View All</RouterLink>
          </div>
          
          <div class="grid gap-4">
            <div v-for="prj in projectStore.dashboardData?.recent_projects" :key="prj.uuid" class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                  <Briefcase class="h-6 w-6" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-900">{{ prj.name }}</h4>
                  <p class="text-xs text-gray-500">{{ prj.client_name || 'Internal Project' }} &bull; {{ prj.code }}</p>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div class="hidden md:block text-right">
                  <p class="text-xs font-medium text-gray-400 uppercase">Status</p>
                  <p class="text-sm font-bold capitalize" :class="{
                    'text-emerald-600': prj.status === 'active',
                    'text-amber-600': prj.status === 'on_hold',
                    'text-blue-600': prj.status === 'completed'
                  }">{{ prj.status }}</p>
                </div>
                <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary-50 transition-all">
                  <ChevronRight class="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                </div>
              </div>
            </div>
            <div v-if="!projectStore.dashboardData?.recent_projects?.length" class="bg-white p-12 rounded-3xl border border-gray-100 border-dashed text-center text-gray-500">
              No recent projects found.
            </div>
          </div>
        </div>

        <!-- Productivity / Timeline teaser -->
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Upcoming Deadlines</h3>
          <div class="space-y-6">
            <div class="flex gap-4 items-start">
              <div class="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <div class="h-2 w-2 rounded-full bg-rose-600"></div>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">UI Design Review</p>
                <p class="text-xs text-gray-500">Project Phoenix &bull; Due in 2 days</p>
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <div class="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <div class="h-2 w-2 rounded-full bg-amber-600"></div>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">Client Feedback Session</p>
                <p class="text-xs text-gray-500">Project Neo &bull; Due in 5 days</p>
              </div>
            </div>
          </div>

          <div class="mt-12 pt-8 border-t border-gray-50">
            <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Top Contributors</h4>
            <div class="flex -space-x-3">
              <div v-for="i in 5" :key="i" class="h-10 w-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {{ String.fromCharCode(64 + i) }}
              </div>
              <div class="h-10 w-10 rounded-full border-2 border-white bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-600">
                +3
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
