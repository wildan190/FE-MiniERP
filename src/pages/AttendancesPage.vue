<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Attendance</h1>
          <p class="text-gray-600 mt-1">Track employee presence and clock events</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            @click="isClockInModalOpen = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
          >
            <LogIn class="h-5 w-5" />
            Clock In
          </button>
          <button
            @click="isClockOutModalOpen = true"
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
          >
            <LogOut class="h-5 w-5" />
            Clock Out
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200">
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Date</label>
          <input
            v-model="filters.date"
            type="date"
            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <!-- Department Filter could go here -->
        <div class="flex items-end">
          <button
            @click="handleSearch"
            class="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>

      <!-- Real-time Clock Timer -->
      <div class="mb-8 p-6 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl shadow-xl text-white overflow-hidden relative group">
        <div class="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
          <Clock class="h-32 w-32" />
        </div>
        <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="text-center sm:text-left">
            <h2 class="text-lg font-medium text-primary-100 mb-1 flex items-center justify-center sm:justify-start gap-2">
              <Calendar class="h-4 w-4" />
              {{ currentDateFormatted }}
            </h2>
            <p class="text-sm text-primary-200 capitalize tracking-wide">{{ currentDay }}</p>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-5xl sm:text-6xl font-black tracking-tight font-mono tabular-nums leading-none">
              {{ currentTime }}
            </span>
            <span class="text-xl font-bold opacity-80 uppercase tracking-widest">{{ currentAmPm }}</span>
          </div>
          <div class="hidden lg:block border-l border-white/20 pl-6 py-2">
            <p class="text-xs text-primary-200 uppercase tracking-widest font-bold mb-1">Company Time</p>
            <p class="text-sm font-medium">Automatic Sync Enabled</p>
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
import { LogIn, LogOut, Clock, Calendar } from 'lucide-vue-next'
import { useAttendanceStore } from '../stores/attendance'
import { officeLocationRepository } from '../repositories/hrm/office-location.repository'
import type { OfficeLocation } from '../services/hrm/types/office-location.types'
import type { ClockInRequest, ClockOutRequest } from '../services/hrm/types/attendance.types'

const attendanceStore = useAttendanceStore()
const officeLocations = ref<OfficeLocation[]>([])
const isClockInModalOpen = ref(false)
const isClockOutModalOpen = ref(false)
const isSubmitting = ref(false)

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

const filters = ref({
  date: new Date().toISOString().split('T')[0],
  employee_uuid: '',
  department_uuid: '',
})

const loadData = async (page = 1) => {
  try {
    await attendanceStore.fetchAttendances({ ...filters.value }, page)
  } catch (err) {
    console.error('Failed to load attendances:', err)
  }
}

const loadOfficeLocations = async () => {
  try {
    const response = await officeLocationRepository.getOfficeLocations()
    if (response) {
      // Handle both { data: [...] } and { data: { data: [...] } }
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        officeLocations.value = responseData;
      } else if (responseData && Array.isArray((responseData as any).data)) {
        officeLocations.value = (responseData as any).data;
      } else if (Array.isArray(response)) {
        officeLocations.value = response as any;
      }
    }
  } catch (err) {
    console.error('Failed to load office locations:', err)
  }
}

const handleSearch = () => {
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
  loadData()
  loadOfficeLocations()
  timerInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
