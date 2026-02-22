<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td class="px-6 py-4"><Skeleton width="10rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="5rem" height="1.25rem" /></td>
              <td class="px-6 py-4"><Skeleton width="8rem" height="1rem" /></td>
            </tr>
          </template>
          <template v-else-if="attendances.length === 0">
            <tr>
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                No attendance records found.
              </td>
            </tr>
          </template>
          <template v-else>
            <template v-for="attendance in attendances" :key="attendance?.uuid">
              <tr v-if="attendance" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                      {{ getInitials(attendance.employee?.user?.name || 'N/A') }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ attendance.employee?.user?.name || 'N/A' }}</p>
                      <p class="text-xs text-gray-500">{{ attendance.employee?.department?.name || '-' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ formatDate(attendance.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  {{ formatTime(attendance.clock_in) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ attendance.clock_out ? formatTime(attendance.clock_out) : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(attendance.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {{ attendance.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-1.5">
                      <component :is="getVerificationIcon(attendance.face_verification_status)" :class="getVerificationClass(attendance.face_verification_status)" class="h-3 w-3" />
                      <span class="text-[10px] text-gray-500">Face: {{ attendance.face_verification_status }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <component :is="getVerificationIcon(attendance.location_verification_status)" :class="getVerificationClass(attendance.location_verification_status)" class="h-3 w-3" />
                      <span class="text-[10px] text-gray-500">Loc: {{ attendance.location_verification_status }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, XCircle, Clock, SkipForward } from 'lucide-vue-next'
import Skeleton from '../common/Skeleton.vue'
import type { Attendance } from '../../services/hrm/types/attendance.types'

defineProps<{
  attendances: Attendance[]
  loading: boolean
}>()

const getInitials = (name: string) => 
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const formatDate = (date: string) => 
  new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const formatTime = (time: string) => 
  new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

const getStatusClass = (status: string) => {
  switch (status) {
    case 'present': return 'bg-emerald-100 text-emerald-700'
    case 'late': return 'bg-amber-100 text-amber-700'
    case 'absent': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getVerificationIcon = (status: string) => {
  switch (status) {
    case 'verified': return CheckCircle2
    case 'failed': return XCircle
    case 'pending': return Clock
    case 'skipped': return SkipForward
    default: return Clock
  }
}

const getVerificationClass = (status: string) => {
  switch (status) {
    case 'verified': return 'text-emerald-500'
    case 'failed': return 'text-red-500'
    case 'pending': return 'text-amber-500'
    case 'skipped': return 'text-gray-400'
    default: return 'text-gray-400'
  }
}
</script>
