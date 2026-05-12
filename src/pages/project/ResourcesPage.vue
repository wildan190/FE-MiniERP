<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import { 
  Users, 
  Plus, 
  Search, 
  UserPlus, 
  TrendingUp,
  BarChart3
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import ResourceModal from '@/components/project/ResourceModal.vue';

const projectStore = useProjectStore();
const isModalOpen = ref(false);

onMounted(async () => {
  await projectStore.fetchResources();
});

const handleSaved = async () => {
  await projectStore.fetchResources();
};
</script>

<template>
  <AppLayout>
    <ResourceModal 
      :is-open="isModalOpen" 
      @close="isModalOpen = false" 
      @saved="handleSaved"
    />
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Resource Management</h1>
          <p class="text-gray-500">Manage employee allocation and project assignments.</p>
        </div>
        <button 
          @click="isModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <UserPlus class="h-4 w-4" /> Assign Resource
        </button>
      </div>

      <!-- Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div class="flex items-center gap-4 mb-2">
            <div class="p-2 bg-blue-50 rounded-xl"><Users class="h-5 w-5 text-blue-600" /></div>
            <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Resources</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">{{ projectStore.resourceData?.stats?.total_resources || 0 }} Employees</h3>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div class="flex items-center gap-4 mb-2">
            <div class="p-2 bg-emerald-50 rounded-xl"><TrendingUp class="h-5 w-5 text-emerald-600" /></div>
            <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg. Allocation</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">{{ Math.round(projectStore.resourceData?.stats?.avg_allocation || 0) }}%</h3>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div class="flex items-center gap-4 mb-2">
            <div class="p-2 bg-amber-50 rounded-xl"><BarChart3 class="h-5 w-5 text-amber-600" /></div>
            <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">Over-allocated</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">{{ projectStore.resourceData?.stats?.over_allocated || 0 }} Employees</h3>
        </div>
      </div>

      <!-- Resource Allocation Table -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-50">
          <h3 class="font-bold text-gray-900">Team Workload</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Employee</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Project</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Load %</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="member in projectStore.resourceData?.members" :key="member.uuid" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold">
                      {{ member.employee?.name?.charAt(0) }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ member.employee?.name }}</p>
                      <p class="text-xs text-gray-500">{{ member.employee?.designation || 'Staff' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ member.project?.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ member.role }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex-1 h-2 min-w-[100px] bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-primary-500 rounded-full" :style="{ width: member.allocation_percentage + '%' }"></div>
                    </div>
                    <span class="text-xs font-bold text-gray-900">{{ member.allocation_percentage }}%</span>
                  </div>
                </td>
              </tr>
              <tr v-if="!projectStore.resourceData?.members?.length">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500 italic">No resources assigned.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
