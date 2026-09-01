<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useProjectStore } from '@/stores/project';
import Swal from 'sweetalert2';
import { 
  Clock, 
  Plus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';

const projectStore = useProjectStore();
const isLogModalOpen = ref(false);
const isSubmitting = ref(false);

// Current selected week start (Monday)
const currentWeekStart = ref<Date>(getMonday(new Date()));

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setHours(0, 0, 0, 0);
  return new Date(date.setDate(diff));
}

interface DayInfo {
  dateStr: string;
  dayName: string;
  formatted: string;
}

const weekDays = computed<DayInfo[]>(() => {
  const days: DayInfo[] = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentWeekStart.value);
    d.setDate(d.getDate() + i);
    days.push({
      dateStr: d.toISOString().split('T')[0] || '',
      dayName: dayNames[i] || '',
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  return days;
});

const weekLabel = computed(() => {
  const start = weekDays.value[0]?.formatted;
  const end = weekDays.value[6]?.formatted;
  const year = currentWeekStart.value.getFullYear();
  return `${start} - ${end}, ${year}`;
});

const prevWeek = () => {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() - 7);
  currentWeekStart.value = d;
  loadTimesheets();
};

const nextWeek = () => {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() + 7);
  currentWeekStart.value = d;
  loadTimesheets();
};

const newEntry = ref({
  project_uuid: '',
  task_uuid: '',
  date: new Date().toISOString().split('T')[0],
  hours: 1,
  notes: ''
});

// Filter tasks based on selected project
const filteredTasks = computed(() => {
  if (!newEntry.value.project_uuid) return projectStore.tasks;
  return projectStore.tasks.filter((t: any) => t.project_uuid === newEntry.value.project_uuid);
});

const loadTimesheets = async () => {
  const dateFrom = weekDays.value[0]?.dateStr;
  const dateTo = weekDays.value[6]?.dateStr;
  await projectStore.fetchTimesheets({ date_from: dateFrom, date_to: dateTo });
};

onMounted(async () => {
  await Promise.all([
    projectStore.fetchProjects(),
    projectStore.fetchTasks(),
    loadTimesheets()
  ]);
});

// Group timesheets by project/task
const groupedTimesheets = computed(() => {
  const groups: Record<string, { project_name: string; task_name: string; hoursByDate: Record<string, number>; total: number }> = {};

  for (const item of projectStore.timesheets) {
    const key = `${item.project_uuid}_${item.task_uuid || 'general'}`;
    if (!groups[key]) {
      groups[key] = {
        project_name: item.project?.name || 'Unknown Project',
        task_name: item.task?.name || 'General Work',
        hoursByDate: {},
        total: 0
      };
    }
    const dateStr = item.date;
    const hours = Number(item.hours) || 0;
    groups[key].hoursByDate[dateStr] = (groups[key].hoursByDate[dateStr] || 0) + hours;
    groups[key].total += hours;
  }

  return Object.values(groups);
});

// Weekly totals per day
const dayTotals = computed(() => {
  const totals: Record<string, number> = {};
  for (const day of weekDays.value) {
    totals[day.dateStr] = 0;
  }
  for (const group of groupedTimesheets.value) {
    for (const [date, hrs] of Object.entries(group.hoursByDate)) {
      if (totals[date] !== undefined) {
        totals[date] += hrs;
      }
    }
  }
  return totals;
});

const weeklyTotal = computed(() => {
  return Object.values(dayTotals.value).reduce((sum, h) => sum + h, 0);
});

const handleLogTime = async () => {
  if (!newEntry.value.project_uuid || !newEntry.value.date || !newEntry.value.hours) {
    Swal.fire({ title: 'Validation Error', text: 'Please fill in all required fields.', icon: 'warning' });
    return;
  }

  isSubmitting.value = true;
  try {
    await projectStore.logTimesheet({
      project_uuid: newEntry.value.project_uuid,
      task_uuid: newEntry.value.task_uuid || undefined,
      date: newEntry.value.date,
      hours: Number(newEntry.value.hours),
      notes: newEntry.value.notes
    });

    isLogModalOpen.value = false;
    newEntry.value = {
      project_uuid: '',
      task_uuid: '',
      date: new Date().toISOString().split('T')[0],
      hours: 1,
      notes: ''
    };

    Swal.fire({
      title: 'Success!',
      text: 'Hours logged successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });

    await loadTimesheets();
  } catch (err: any) {
    Swal.fire({
      title: 'Error!',
      text: err.response?.data?.message || err.message || 'Failed to log hours.',
      icon: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
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
      <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div class="flex items-center gap-4">
          <button @click="prevWeek" class="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronLeft class="h-5 w-5 text-gray-600" /></button>
          <div class="text-center min-w-[200px]">
            <h3 class="font-bold text-gray-900">{{ weekLabel }}</h3>
            <p class="text-xs text-gray-500">Weekly View</p>
          </div>
          <button @click="nextWeek" class="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight class="h-5 w-5 text-gray-600" /></button>
        </div>
        <div class="flex items-center gap-6">
          <div class="text-right">
            <p class="text-xs font-medium text-gray-400 uppercase">Weekly Total</p>
            <p class="text-xl font-bold text-primary-600">{{ weeklyTotal.toFixed(1) }} hrs</p>
          </div>
          <div class="h-10 w-[1px] bg-gray-100"></div>
          <div class="text-right">
            <p class="text-xs font-medium text-gray-400 uppercase">Target</p>
            <p class="text-xl font-bold text-gray-900">40.0 hrs</p>
          </div>
        </div>
      </div>

      <!-- Timesheet Grid -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th class="px-6 py-4 min-w-[220px]">Project / Task</th>
              <th v-for="day in weekDays" :key="day.dateStr" class="px-4 py-4 text-center min-w-[70px]">
                <div>{{ day.dayName }}</div>
                <div class="text-[9px] font-normal text-gray-400">{{ day.formatted }}</div>
              </th>
              <th class="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="projectStore.isLoading && projectStore.timesheets.length === 0">
              <td :colspan="9" class="px-6 py-12 text-center text-gray-400">Loading timesheets...</td>
            </tr>
            <tr v-else-if="groupedTimesheets.length === 0">
              <td :colspan="9" class="px-6 py-12 text-center text-gray-400">
                <FileText class="h-8 w-8 mx-auto mb-2 text-gray-300" />
                No logged hours for this week. Click <strong>"Log Hours"</strong> to get started.
              </td>
            </tr>
            <template v-else>
              <tr v-for="group in groupedTimesheets" :key="group.project_name + group.task_name" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <p class="text-sm font-bold text-gray-900">{{ group.project_name }}</p>
                  <p class="text-[11px] text-gray-500">{{ group.task_name }}</p>
                </td>
                <td v-for="day in weekDays" :key="day.dateStr" class="px-4 py-4 text-center font-medium text-sm">
                  <span v-if="group.hoursByDate[day.dateStr]" class="px-2 py-1 bg-primary-50 text-primary-700 rounded-lg font-bold">
                    {{ group.hoursByDate[day.dateStr] }}h
                  </span>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <td class="px-6 py-4 text-right font-bold text-gray-900">{{ group.total.toFixed(1) }}h</td>
              </tr>
              <tr class="bg-gray-50/70 border-t-2 border-gray-100">
                <td class="px-6 py-4 font-bold text-gray-900">Total</td>
                <td v-for="day in weekDays" :key="day.dateStr" class="px-4 py-4 text-center font-bold text-gray-900 text-sm">
                  {{ dayTotals[day.dateStr] ? `${dayTotals[day.dateStr]}h` : '-' }}
                </td>
                <td class="px-6 py-4 text-right font-black text-primary-600 text-base">{{ weeklyTotal.toFixed(1) }}h</td>
              </tr>
            </template>
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
                  <label class="text-sm font-semibold text-gray-700">Project <span class="text-red-500">*</span></label>
                  <select v-model="newEntry.project_uuid" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
                    <option value="" disabled>Select project...</option>
                    <option v-for="p in projectStore.projects" :key="p.uuid" :value="p.uuid">{{ p.name }}</option>
                  </select>
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Task (Optional)</label>
                  <select v-model="newEntry.task_uuid" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
                    <option value="">General Work (No specific task)</option>
                    <option v-for="t in filteredTasks" :key="t.uuid" :value="t.uuid">{{ t.name }}</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Date <span class="text-red-500">*</span></label>
                  <input v-model="newEntry.date" type="date" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Hours <span class="text-red-500">*</span></label>
                  <input v-model.number="newEntry.hours" type="number" step="0.25" min="0.25" max="24" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700">Notes</label>
                  <textarea v-model="newEntry.notes" rows="3" placeholder="What did you work on?" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"></textarea>
                </div>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isLogModalOpen = false" :disabled="isSubmitting" class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                <button type="submit" :disabled="isSubmitting" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 disabled:opacity-50">
                  {{ isSubmitting ? 'Submitting...' : 'Submit Log' }}
                </button>
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
