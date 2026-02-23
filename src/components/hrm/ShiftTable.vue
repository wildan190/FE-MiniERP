<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td class="px-6 py-4"><Skeleton width="10rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="12rem" height="1rem" /></td>
              <td class="px-6 py-4 text-right"><Skeleton width="4rem" height="1.5rem" class="ml-auto" /></td>
            </tr>
          </template>
          <template v-else-if="shifts.length === 0">
            <tr>
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                No shifts found.
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="shift in shifts" :key="shift.uuid" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold text-gray-900">{{ shift.name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <div class="flex items-center gap-2">
                  <Clock class="h-4 w-4 text-primary-500" />
                  {{ formatTime(shift.start_time) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <div class="flex items-center gap-2">
                  <Clock class="h-4 w-4 text-primary-500" />
                  {{ formatTime(shift.end_time) }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {{ shift.description || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="$emit('edit', shift)"
                    class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit Shift"
                  >
                    <Edit2 class="h-4 w-4" />
                  </button>
                  <button
                    @click="$emit('delete', shift)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Shift"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Edit2, Trash2 } from 'lucide-vue-next'
import Skeleton from '../common/Skeleton.vue'
import type { Shift } from '../../services/hrm/types/shift.types'

defineProps<{
  shifts: Shift[]
  loading: boolean
}>()

defineEmits(['edit', 'delete'])

const formatTime = (time: string | undefined) => {
  if (!time) return '-'
  const parts = time.split(':')
  if (parts.length < 2) return time
  
  const hours = parts[0] || '0'
  const minutes = parts[1] || '00'
  
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${minutes} ${ampm}`
}
</script>
