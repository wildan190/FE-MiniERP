<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ isHrUser ? (currentTab === 'all' ? 'All Attendance Records' : 'My Attendance') : 'My Attendance' }}</h1>
          <p class="text-gray-600 mt-1">{{ isHrUser ? 'Track organization-wide attendance or view your personal records' : 'View your personal clock events and presence history' }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            @click="openClockInModal"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            <LogIn class="h-5 w-5" />
            Clock In
          </button>
          <button
            @click="isClockOutModalOpen = true"
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            <LogOut class="h-5 w-5" />
            Clock Out
          </button>
        </div>
      </div>

      <!-- Tab Switcher (Visible only to HR/Admin) -->
      <div v-if="isHrUser" class="flex gap-2 border-b border-gray-200 mb-6">
        <button
          @click="switchTab('all')"
          :class="currentTab === 'all' ? 'border-b-2 border-primary-600 text-primary-600 font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'"
          class="px-4 py-2.5 text-sm transition-colors"
        >
          All Employees
        </button>
        <button
          @click="switchTab('mine')"
          :class="currentTab === 'mine' ? 'border-b-2 border-primary-600 text-primary-600 font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'"
          class="px-4 py-2.5 text-sm transition-colors"
        >
          My Attendance
        </button>
      </div>

      <!-- Filters (Search employee & Department only for HR when viewing all) -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div v-if="isHrUser && currentTab === 'all'">
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Search Employee</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by name..."
            @keyup.enter="handleSearch"
            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Date</label>
          <input
            v-model="filters.date"
            type="date"
            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>

        <div v-if="isHrUser">
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Department</label>
          <select
            v-model="filters.department_uuid"
            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.uuid" :value="dept.uuid">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="flex items-end gap-2">
          <button
            @click="handleSearch"
            class="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm flex items-center justify-center gap-1.5"
          >
            <Search class="h-4 w-4" /> Search
          </button>
          <button
            @click="handleReset"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Real-time Clock Timer -->
      <div class="mb-8 p-6 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl shadow-xl text-white overflow-hidden relative group">
        <div class="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
          <Clock class="h-32 w-32 animate-pulse-slow" />
        </div>
        <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="text-center sm:text-left">
            <h2 class="text-lg font-medium text-primary-100 mb-1 flex items-center justify-center sm:justify-start gap-2">
              <Calendar class="h-4 w-4" />
              {{ currentDateFormatted }}
            </h2>
            <p class="text-sm text-primary-200 capitalize tracking-wide font-medium">{{ currentDay }}</p>
          </div>
          <div class="flex flex-col items-center sm:items-end gap-1">
            <div class="flex items-baseline gap-2">
              <span class="text-5xl sm:text-7xl font-black tracking-tighter font-mono tabular-nums leading-none drop-shadow-lg">
                {{ currentTime }}
              </span>
              <span class="text-xl font-bold opacity-80 uppercase tracking-widest">{{ currentAmPm }}</span>
            </div>
            <div class="h-1 w-24 bg-white/20 rounded-full overflow-hidden mt-2">
              <div class="h-full bg-white/60 animate-progress" style="width: 100%"></div>
            </div>
          </div>
          <div class="hidden lg:block border-l border-white/20 pl-6 py-2">
            <p class="text-xs text-primary-200 uppercase tracking-widest font-bold mb-1">Company Time</p>
            <p class="text-sm font-medium flex items-center gap-2">
              <span class="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
              Live Sync
            </p>
          </div>
        </div>
      </div>

      <!-- Attendance List -->
      <div class="space-y-4">
        <AttendanceTable :attendances="attendanceStore.attendances" :loading="attendanceStore.loading" />

        <!-- Pagination -->
        <ResponsivePagination
          v-if="!attendanceStore.loading && attendanceStore.total > 0"
          :current-page="attendanceStore.currentPage"
          :last-page="attendanceStore.totalPages"
          :from="(attendanceStore.currentPage - 1) * attendanceStore.perPage + 1"
          :to="Math.min(attendanceStore.currentPage * attendanceStore.perPage, attendanceStore.total)"
          :total="attendanceStore.total"
          :links="[]" 
          @page-change="loadData"
        />
      </div>

      <!-- Modals -->
      <ClockInModal
        :is-open="isClockInModalOpen"
        :loading="isSubmitting"
        :office-locations="officeLocations"
        @close="isClockInModalOpen = false"
        @submit="handleClockIn"
      />

      <ClockOutModal
        :is-open="isClockOutModalOpen"
        :loading="isSubmitting"
        @close="isClockOutModalOpen = false"
        @submit="handleClockOut"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layouts/AppLayout.vue'
import AttendanceTable from '../components/hrm/AttendanceTable.vue'
import ClockInModal from '../components/hrm/ClockInModal.vue'
import ClockOutModal from '../components/hrm/ClockOutModal.vue'
import ResponsivePagination from '../components/common/ResponsivePagination.vue'
import { LogIn, LogOut, Clock, Calendar, Search } from 'lucide-vue-next'
import { useAttendanceStore } from '../stores/attendance'
import { useAuthStore } from '../stores/auth'
import { officeLocationRepository } from '../repositories/hrm/office-location.repository'
import { departmentRepository } from '../repositories/hrm/department.repository'
import type { OfficeLocation } from '../services/hrm/types/office-location.types'
import type { Department } from '../services/hrm/types/department.types'
import type { ClockInRequest, ClockOutRequest } from '../services/hrm/types/attendance.types'

const authStore = useAuthStore()
const attendanceStore = useAttendanceStore()
const officeLocations = ref<OfficeLocation[]>([])
const departments = ref<Department[]>([])
const isClockInModalOpen = ref(false)
const isClockOutModalOpen = ref(false)
const isSubmitting = ref(false)

const isHrUser = computed(() => {
  return authStore.hasHrAccess || authStore.hasPermission('hrm.attendances.view')
})

// Clock Logic
const now = ref(new Date())
let timerInterval: any = null

const updateTime = () => {
  now.value = new Date()
}

const currentTime = computed(() => {
  const hours = now.value.getHours() % 12 || 12
  const minutes = now.value.getMinutes()
  const seconds = now.value.getSeconds()
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const currentAmPm = computed(() => {
  return now.value.getHours() >= 12 ? 'PM' : 'AM'
})

const currentDateFormatted = computed(() => {
  return now.value.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const currentDay = computed(() => {
  return now.value.toLocaleDateString('id-ID', { weekday: 'long' })
})

const currentTab = ref<'all' | 'mine'>('mine')

const switchTab = (tab: 'all' | 'mine') => {
  currentTab.value = tab
  if (tab === 'mine') {
    filters.value.search = ''
    filters.value.department_uuid = ''
  }
  loadData(1)
}

const filters = ref({
  search: '',
  date: new Date().toISOString().split('T')[0],
  employee_uuid: '',
  department_uuid: '',
})

const loadData = async (page = 1) => {
  try {
    const queryParams: any = { ...filters.value }
    if (isHrUser.value) {
      queryParams.view = currentTab.value
    } else {
      queryParams.view = 'mine'
    }
    await attendanceStore.fetchAttendances(queryParams, page)
  } catch (err) {
    console.error('Failed to load attendances:', err)
  }
}

const loadOfficeLocations = async () => {
  try {
    const response: any = await officeLocationRepository.getOfficeLocations()
    if (!response) return
    
    // Support all API response formats:
    // 1. { data: { data: [...] } } (Standard Laravel Paginated response)
    // 2. { data: [...] } (Direct array in data)
    // 3. [...] (Direct array root)
    if (Array.isArray(response.data?.data)) {
      officeLocations.value = response.data.data
    } else if (Array.isArray(response.data)) {
      officeLocations.value = response.data
    } else if (Array.isArray(response)) {
      officeLocations.value = response
    }
  } catch (err) {
    console.error('Failed to load office locations:', err)
  }
}

const openClockInModal = async () => {
  if (officeLocations.value.length === 0) {
    await loadOfficeLocations()
  }
  isClockInModalOpen.value = true
}

const loadDepartments = async () => {
  try {
    const response = await departmentRepository.getDepartments()
    if (response && response.data) {
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        departments.value = responseData;
      } else if (responseData && Array.isArray((responseData as any).data)) {
        departments.value = (responseData as any).data;
      }
    }
  } catch (err) {
    console.error('Failed to load departments:', err)
  }
}

const handleSearch = () => {
  loadData(1)
}

const handleReset = () => {
  filters.value = {
    search: '',
    date: '',
    employee_uuid: '',
    department_uuid: '',
  }
  loadData(1)
}

const handleClockIn = async (data: ClockInRequest) => {
  isSubmitting.value = true
  try {
    await attendanceStore.clockIn(data)
    await Swal.fire({ title: 'Success!', text: 'Clocked in successfully', icon: 'success', confirmButtonColor: '#10b981' })
    isClockInModalOpen.value = false
    loadData(1)
  } catch (err: any) {
    Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Failed to clock in', icon: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleClockOut = async (data: ClockOutRequest) => {
  isSubmitting.value = true
  try {
    await attendanceStore.clockOut(data)
    await Swal.fire({ title: 'Success!', text: 'Clocked out successfully', icon: 'success', confirmButtonColor: '#fbbf24' })
    isClockOutModalOpen.value = false
    loadData(1)
  } catch (err: any) {
    Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Failed to clock out', icon: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  currentTab.value = isHrUser.value ? 'all' : 'mine'
  loadData()
  loadOfficeLocations()
  loadDepartments()
  timerInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1) translate(1rem, -1rem); }
  50% { opacity: 0.15; transform: scale(1.1) translate(1.5rem, -1.5rem); }
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}

.animate-pulse-slow {
  animation: pulse-slow 8s infinite ease-in-out;
}

.animate-progress {
  animation: progress 1s linear;
}
</style>
