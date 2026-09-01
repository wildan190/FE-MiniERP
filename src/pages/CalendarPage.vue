<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div class="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
              <CalendarIcon class="h-7 w-7" />
            </div>
            Company Calendar &amp; Agenda
          </h1>
          <p class="text-gray-500 text-sm mt-1">
            Enterprise schedule management, event planning, cross-department deadlines, and automated recruitment interviews.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="openTaskModal()"
            class="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all font-semibold flex items-center gap-2 shadow-xs"
          >
            <CheckSquare class="h-4 w-4 text-emerald-600" />
            Add Task
          </button>
          <button
            @click="openEventModal()"
            class="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold flex items-center gap-2 shadow-sm hover:shadow"
          >
            <Plus class="h-4 w-4" />
            Create Event
          </button>
        </div>
      </div>

      <!-- Calendar & Task Summary Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div class="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <CalendarIcon class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Events</p>
            <p class="text-2xl font-black text-gray-900 mt-0.5">{{ store.events.length }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div class="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
            <Users class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">HR Interviews</p>
            <p class="text-2xl font-black text-purple-600 mt-0.5">{{ store.interviews.length }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div class="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Tasks</p>
            <p class="text-2xl font-black text-amber-600 mt-0.5">{{ pendingTasksCount }}</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 class="h-6 w-6" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed Tasks</p>
            <p class="text-2xl font-black text-emerald-600 mt-0.5">{{ completedTasksCount }}</p>
          </div>
        </div>
      </div>

      <!-- Main Layout: Month Grid + Task & Agenda Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Left 2 Cols: Interactive Calendar View -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <!-- Month Switcher & Controls -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-extrabold text-gray-900">
                {{ monthNames[currentMonth] }} {{ currentYear }}
              </h2>
              <button
                @click="goToToday"
                class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Today
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="prevMonth"
                class="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition border border-gray-200/60"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <button
                @click="nextMonth"
                class="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition border border-gray-200/60"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Day of week headers -->
          <div class="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="d">{{ d }}</span>
          </div>

          <!-- Calendar Grid Cells -->
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(day, idx) in calendarDays"
              :key="idx"
              @click="selectDate(day.dateStr)"
              :class="[
                'min-h-[96px] p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group',
                day.isCurrentMonth ? 'bg-white border-gray-100 hover:border-primary-300 hover:shadow-xs' : 'bg-gray-50/50 border-gray-50 opacity-40',
                day.isToday ? 'ring-2 ring-primary-500 bg-primary-50/20' : '',
                selectedDateStr === day.dateStr ? 'border-primary-600 bg-primary-50/30' : ''
              ]"
            >
              <div class="flex items-center justify-between">
                <span
                  :class="[
                    'text-xs font-bold rounded-lg w-6 h-6 flex items-center justify-center',
                    day.isToday ? 'bg-primary-600 text-white shadow-2xs' : 'text-gray-700'
                  ]"
                >
                  {{ day.dayNum }}
                </span>
                <span v-if="day.itemsCount > 0" class="w-2 h-2 rounded-full bg-primary-500"></span>
              </div>

              <!-- Badges list inside cell -->
              <div class="space-y-1 mt-1 overflow-hidden">
                <div
                  v-for="item in day.items.slice(0, 2)"
                  :key="item.id || item.uuid"
                  class="text-[10px] font-semibold px-1.5 py-0.5 rounded truncate flex items-center gap-1"
                  :style="{ backgroundColor: item.color + '20', color: item.color || '#3B82F6' }"
                  :title="item.title"
                >
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: item.color || '#3B82F6' }"></span>
                  <span class="truncate">{{ item.title }}</span>
                </div>
                <div v-if="day.items.length > 2" class="text-[9px] font-bold text-gray-400 pl-1">
                  +{{ day.items.length - 2 }} more
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Col: Selected Date Agenda & Tasks -->
        <div class="space-y-6">
          
          <!-- Agenda for Selected Date -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 class="font-bold text-gray-900 text-base">Agenda Details</h3>
                <p class="text-xs text-gray-500">{{ formatDateDisplay(selectedDateStr) }}</p>
              </div>
              <button
                @click="openEventModal(selectedDateStr)"
                class="p-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl transition"
                title="Add event on this date"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>

            <!-- List of events on selected date -->
            <div class="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              <div
                v-for="item in selectedDateAgendaItems"
                :key="item.uuid || item.id"
                class="p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 transition bg-gray-50/70 space-y-2"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-2.5 h-2.5 rounded-full shrink-0"
                      :style="{ backgroundColor: item.color || '#3B82F6' }"
                    ></span>
                    <h4 class="font-bold text-gray-900 text-sm leading-snug">{{ item.title }}</h4>
                  </div>
                  <button
                    v-if="!item.is_synced_interview"
                    @click="handleDeleteEvent(item.uuid)"
                    class="text-gray-400 hover:text-rose-600 transition"
                    title="Delete Event"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </button>
                </div>

                <p v-if="item.description" class="text-xs text-gray-600 line-clamp-2">
                  {{ item.description }}
                </p>

                <div class="flex flex-wrap gap-2 text-[11px] text-gray-500 pt-1">
                  <span class="flex items-center gap-1 font-medium text-gray-700">
                    <Clock class="h-3 w-3 text-primary-500" />
                    {{ item.all_day ? 'All Day' : formatTime(item.start_time) }}
                  </span>
                  <span v-if="item.location" class="flex items-center gap-1 text-blue-600 truncate max-w-[180px]">
                    <MapPin class="h-3 w-3 shrink-0" />
                    {{ item.location }}
                  </span>
                  <span v-if="item.attendees" class="flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-semibold">
                    👤 {{ item.attendees }}
                  </span>
                </div>
              </div>

              <div
                v-if="selectedDateAgendaItems.length === 0"
                class="text-center py-8 text-gray-400 text-xs font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200"
              >
                No scheduled events for this date
              </div>
            </div>
          </div>

          <!-- Pending Tasks List -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 class="font-bold text-gray-900 text-base">To-Do Tasks</h3>
                <p class="text-xs text-gray-500">Cross-department action items &amp; deadlines</p>
              </div>
              <button
                @click="openTaskModal(selectedDateStr)"
                class="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition"
                title="Add Task"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>

            <div class="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <div
                v-for="task in store.tasks"
                :key="task.uuid"
                class="p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition bg-white flex items-start gap-3 shadow-2xs"
              >
                <input
                  type="checkbox"
                  :checked="task.status === 'completed'"
                  @change="toggleTaskStatus(task)"
                  class="mt-1 h-4 w-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <div class="flex-1 min-w-0">
                  <p
                    :class="[
                      'text-sm font-semibold truncate',
                      task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
                    ]"
                  >
                    {{ task.title }}
                  </p>
                  <div class="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                    <span class="flex items-center gap-1 font-mono">
                      📅 {{ task.due_date }}
                    </span>
                    <span
                      :class="[
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                        task.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                        task.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      ]"
                    >
                      {{ task.priority }}
                    </span>
                  </div>
                </div>
                <button
                  @click="handleDeleteTask(task.uuid)"
                  class="text-gray-300 hover:text-rose-500 transition p-1"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>

              <div
                v-if="store.tasks.length === 0"
                class="text-center py-6 text-gray-400 text-xs font-medium"
              >
                No pending tasks
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- MODAL: CREATE EVENT -->
      <!-- ========================================================================= -->
      <Teleport to="body">
        <div v-if="showEventModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-lg text-gray-900">Create Calendar Event</h3>
              <button @click="showEventModal = false" class="text-gray-400 hover:text-gray-600"><X class="h-5 w-5" /></button>
            </div>
            <form @submit.prevent="saveEvent" class="space-y-4 text-sm">
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Event Title *</label>
                <input v-model="eventForm.title" type="text" required placeholder="e.g. Quarterly Business Review" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Start Date &amp; Time *</label>
                  <input v-model="eventForm.start_time" type="datetime-local" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">End Date &amp; Time</label>
                  <input v-model="eventForm.end_time" type="datetime-local" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Category</label>
                  <select v-model="eventForm.category" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white">
                    <option value="meeting">Meeting</option>
                    <option value="interview">Interview</option>
                    <option value="milestone">Milestone</option>
                    <option value="holiday">Holiday</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Badge Color</label>
                  <div class="flex items-center gap-2 mt-1">
                    <input v-model="eventForm.color" type="color" class="h-9 w-12 rounded border border-gray-200 cursor-pointer p-0.5 bg-white" />
                    <span class="text-xs font-mono text-gray-500">{{ eventForm.color }}</span>
                  </div>
                </div>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Meeting Link or Location</label>
                <input v-model="eventForm.location" type="text" placeholder="e.g. Google Meet URL or Room 401" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Attendees / Participants</label>
                <input v-model="eventForm.attendees" type="text" placeholder="e.g. John Doe, Jane Smith, Dev Team" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea v-model="eventForm.description" rows="2.5" placeholder="Agenda points..." class="w-full px-3 py-2 rounded-xl border border-gray-200"></textarea>
              </div>
              <div class="flex justify-end gap-2 pt-3 border-t">
                <button type="button" @click="showEventModal = false" class="px-4 py-2 border rounded-xl font-semibold text-gray-600">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- ========================================================================= -->
      <!-- MODAL: CREATE TASK -->
      <!-- ========================================================================= -->
      <Teleport to="body">
        <div v-if="showTaskModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-bold text-lg text-gray-900">Add New Task</h3>
              <button @click="showTaskModal = false" class="text-gray-400 hover:text-gray-600"><X class="h-5 w-5" /></button>
            </div>
            <form @submit.prevent="saveTask" class="space-y-4 text-sm">
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Task Title *</label>
                <input v-model="taskForm.title" type="text" required placeholder="e.g. Finalize payroll report" class="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Due Date *</label>
                  <input v-model="taskForm.due_date" type="date" required class="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select v-model="taskForm.priority" class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block font-semibold text-gray-700 mb-1">Description / Notes</label>
                <textarea v-model="taskForm.description" rows="2" placeholder="Task checklist..." class="w-full px-3 py-2 rounded-xl border border-gray-200"></textarea>
              </div>
              <div class="flex justify-end gap-2 pt-3 border-t">
                <button type="button" @click="showTaskModal = false" class="px-4 py-2 border rounded-xl font-semibold text-gray-600">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useCalendarStore } from '@/stores/calendar'
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  CheckCircle2,
  CheckSquare,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Trash2,
  X
} from 'lucide-vue-next'

const store = useCalendarStore()

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const selectedDateStr = ref(formatDateIso(today))

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const pendingTasksCount = computed(() => store.tasks.filter(t => t.status === 'pending').length)
const completedTasksCount = computed(() => store.tasks.filter(t => t.status === 'completed').length)

// Calendar Grid Builder
const calendarDays = computed(() => {
  const days = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const daysInCurrentMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate()

  // Prev month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const date = new Date(currentYear.value, currentMonth.value - 1, d)
    const dateStr = formatDateIso(date)
    days.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: false,
      isToday: dateStr === formatDateIso(today),
      items: getItemsForDate(dateStr),
      itemsCount: getItemsForDate(dateStr).length
    })
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const date = new Date(currentYear.value, currentMonth.value, d)
    const dateStr = formatDateIso(date)
    days.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: dateStr === formatDateIso(today),
      items: getItemsForDate(dateStr),
      itemsCount: getItemsForDate(dateStr).length
    })
  }

  // Next month padding to fill 35 or 42 grid cells
  const remaining = 35 - days.length > 0 ? 35 - days.length : (42 - days.length > 0 ? 42 - days.length : 0)
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, d)
    const dateStr = formatDateIso(date)
    days.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: false,
      isToday: dateStr === formatDateIso(today),
      items: getItemsForDate(dateStr),
      itemsCount: getItemsForDate(dateStr).length
    })
  }

  return days
})

function getItemsForDate(dateStr: string) {
  const list: any[] = []
  
  // Events
  store.events.forEach(e => {
    const eDate = e.start_time?.split('T')[0] || e.start_time?.split(' ')[0]
    if (eDate === dateStr) {
      list.push(e)
    }
  })

  // Interviews
  store.interviews.forEach(i => {
    const iDate = i.start_time?.split('T')[0] || i.start_time?.split(' ')[0]
    if (iDate === dateStr) {
      list.push(i)
    }
  })

  // Tasks
  store.tasks.forEach(t => {
    if (t.due_date === dateStr) {
      list.push({
        id: 'task-' + t.id,
        title: 'Task: ' + t.title,
        color: t.priority === 'urgent' ? '#EF4444' : '#10B981',
      })
    }
  })

  return list
}

const selectedDateAgendaItems = computed(() => {
  const items: any[] = []
  store.events.forEach(e => {
    const eDate = e.start_time?.split('T')[0] || e.start_time?.split(' ')[0]
    if (eDate === selectedDateStr.value) items.push(e)
  })
  store.interviews.forEach(i => {
    const iDate = i.start_time?.split('T')[0] || i.start_time?.split(' ')[0]
    if (iDate === selectedDateStr.value) items.push(i)
  })
  return items
})

function selectDate(dateStr: string) {
  selectedDateStr.value = dateStr
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function goToToday() {
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
  selectedDateStr.value = formatDateIso(today)
}

// ==========================================
// EVENT MODAL
// ==========================================
const showEventModal = ref(false)
const eventForm = ref({
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  all_day: false,
  location: '',
  category: 'meeting',
  color: '#3B82F6',
  attendees: '',
})

function openEventModal(defaultDate?: string) {
  const dt = defaultDate ? `${defaultDate}T09:00` : `${formatDateIso(new Date())}T09:00`
  eventForm.value = {
    title: '',
    description: '',
    start_time: dt,
    end_time: defaultDate ? `${defaultDate}T10:00` : '',
    all_day: false,
    location: '',
    category: 'meeting',
    color: '#3B82F6',
    attendees: '',
  }
  showEventModal.value = true
}

async function saveEvent() {
  try {
    await store.createEvent(eventForm.value)
    showEventModal.value = false
  } catch (e: any) {
    alert(e.response?.data?.message || 'Failed to create event')
  }
}

async function handleDeleteEvent(uuid: string) {
  if (confirm('Delete this calendar event?')) {
    await store.deleteEvent(uuid)
  }
}

// ==========================================
// TASK MODAL
// ==========================================
const showTaskModal = ref(false)
const taskForm = ref({
  title: '',
  description: '',
  due_date: '',
  priority: 'medium',
  status: 'pending',
})

function openTaskModal(defaultDate?: string) {
  taskForm.value = {
    title: '',
    description: '',
    due_date: defaultDate || formatDateIso(new Date()),
    priority: 'medium',
    status: 'pending',
  }
  showTaskModal.value = true
}

async function saveTask() {
  try {
    await store.createTask(taskForm.value)
    showTaskModal.value = false
  } catch (e: any) {
    alert(e.response?.data?.message || 'Failed to create task')
  }
}

async function toggleTaskStatus(task: any) {
  const newStatus = task.status === 'completed' ? 'pending' : 'completed'
  await store.updateTask(task.uuid, {
    title: task.title,
    due_date: task.due_date,
    priority: task.priority,
    status: newStatus,
  })
}

async function handleDeleteTask(uuid: string) {
  if (confirm('Delete this task?')) {
    await store.deleteTask(uuid)
  }
}

// Helpers
function formatDateIso(d: Date) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dtStr: string) {
  if (!dtStr) return ''
  return new Date(dtStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  await store.fetchCalendarData()
})
</script>
