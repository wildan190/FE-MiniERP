<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import { 
  Clock, 
  Plus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';

const projectStore = useProjectStore();
const isLogModalOpen = ref(false);

const newEntry = ref({
  project_uuid: '',
  task_uuid: '',
  date: new Date().toISOString().split('T')[0],
  hours: 0,
  notes: ''
});

onMounted(async () => {
  await projectStore.fetchProjects();
  await projectStore.fetchTasks();
});

const handleLogTime = async () => {
  // Logic to call API would go here
  isLogModalOpen.value = false;
};
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Timesheets</h1>
          <p class="text-gray-500">Log your work hours and track productivity.</p>
        </div>
        <button 
          @click="isLogModalOpen = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-md shadow-primary-100"
        >
          <Plus class="h-4 w-4" /> Log Hours
        </button>
      </div>

      <!-- Weekly Selector -->
      <div class="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div class="flex items-center gap-4">
          <button class="p-2 hover:bg-gray-50 rounded-xl transition-all"><ChevronLeft class="h-5 w-5 text-gray-400" /></button>
          <div class="text-center">
            <h3 class="font-bold text-gray-900">May 11 - May 17, 2026</h3>
            <p class="text-xs text-gray-500">Current Week</p>
          </div>
          <button class="p-2 hover:bg-gray-50 rounded-xl transition-all"><ChevronRight class="h-5 w-5 text-gray-400" /></button>
        </div>
        <div class="flex items-center gap-6">
          <div class="text-right">
            <p class="text-xs font-medium text-gray-400 uppercase">Weekly Total</p>
            <p class="text-xl font-bold text-primary-600">32.5 hrs</p>
          </div>
          <div class="h-10 w-[1px] bg-gray-100"></div>
          <div class="text-right">
            <p class="text-xs font-medium text-gray-400 uppercase">Target</p>
            <p class="text-xl font-bold text-gray-900">40.0 hrs</p>
          </div>
        </div>
      </div>

      <!-- Timesheet Grid -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-4">Project / Task</th>
              <th class="px-4 py-4 text-center">Mon</th>
              <th class="px-4 py-4 text-center">Tue</th>
              <th class="px-4 py-4 text-center">Wed</th>
              <th class="px-4 py-4 text-center">Thu</th>
              <th class="px-4 py-4 text-center">Fri</th>
              <th class="px-4 py-4 text-center">Sat</th>
              <th class="px-4 py-4 text-center">Sun</th>
              <th class="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="i in 3" :key="i" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4">
                <p class="text-sm font-bold text-gray-900">ERP Module Development</p>
                <p class="text-[10px] text-gray-500">Frontend Implementation</p>
              </td>
              <td v-for="d in 7" :key="d" class="px-4 py-4 text-center">
                <input type="text" placeholder="-" class="w-10 h-10 text-center bg-transparent border-none rounded-xl text-sm font-medium focus:bg-gray-100 transition-all" />
              </td>
              <td class="px-6 py-4 text-right font-bold text-gray-900">8.0</td>
            </tr>
            <tr v-if="i === 1" class="bg-gray-50/30">
              <td class="px-6 py-4 font-bold text-gray-900">Total</td>
              <td v-for="d in 7" :key="d" class="px-4 py-4 text-center font-bold text-gray-900">8.0</td>
              <td class="px-6 py-4 text-right font-bold text-primary-600">32.5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Log Time Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isLogModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 class="text-xl font-bold text-gray-900">Log Work Hours</h2>
              <button @click="isLogModalOpen = false" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form @submit.prevent="handleLogTime" class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Project</label>
                  <select v-model="newEntry.project_uuid" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option value="" disabled>Select project...</option>
                    <option v-for="p in projectStore.projects" :key="p.uuid" :value="p.uuid">{{ p.name }}</option>
                  </select>
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Task</label>
                  <select v-model="newEntry.task_uuid" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
                    <option value="">General Work</option>
                    <option v-for="t in projectStore.tasks" :key="t.uuid" :value="t.uuid">{{ t.name }}</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Date</label>
                  <input v-model="newEntry.date" type="date" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Hours</label>
                  <input v-model.number="newEntry.hours" type="number" step="0.5" required class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Notes</label>
                  <textarea v-model="newEntry.notes" rows="3" placeholder="What did you work on?" class="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isLogModalOpen = false" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200">Submit Log</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
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
