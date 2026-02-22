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
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layouts/AppLayout.vue'
import AttendanceTable from '../components/hrm/AttendanceTable.vue'
import ClockInModal from '../components/hrm/ClockInModal.vue'
import ClockOutModal from '../components/hrm/ClockOutModal.vue'
import ResponsivePagination from '../components/common/ResponsivePagination.vue'
import { LogIn, LogOut } from 'lucide-vue-next'
import { useAttendanceStore } from '../stores/attendance'
import { officeLocationRepository } from '../repositories/hrm/office-location.repository'
import type { OfficeLocation } from '../services/hrm/types/office-location.types'
import type { ClockInRequest, ClockOutRequest } from '../services/hrm/types/attendance.types'

const attendanceStore = useAttendanceStore()
const officeLocations = ref<OfficeLocation[]>([])
const isClockInModalOpen = ref(false)
const isClockOutModalOpen = ref(false)
const isSubmitting = ref(false)

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
    // Simplified extraction based on what I saw in OfficeLocationsPage.vue
    if (Array.isArray(response.data)) {
      officeLocations.value = response.data
    } else if (response.data && Array.isArray((response.data as any).data)) {
      officeLocations.value = (response.data as any).data
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
})
</script>
