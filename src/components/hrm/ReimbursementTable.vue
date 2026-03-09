<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="loading">
            <tr v-for="i in 5" :key="i">
              <td class="px-6 py-4"><Skeleton width="10rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="5rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="8rem" height="1rem" /></td>
              <td class="px-6 py-4 text-right"><Skeleton width="4rem" height="1.5rem" class="ml-auto" /></td>
            </tr>
          </template>
          <template v-else-if="reimbursements.length === 0">
            <tr>
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                No reimbursement claims found.
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="claim in reimbursements" :key="claim.uuid" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                    {{ claim.employee?.user?.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ claim.employee?.user?.name }}</p>
                    <p class="text-xs text-gray-500">{{ claim.employee?.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-700">{{ claim.type }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-bold text-gray-900">{{ formatCurrency(claim.amount) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusClass(claim.status)"
                >
                  {{ claim.status.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(claim.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <a 
                    v-if="claim.proof_file"
                    :href="getProofUrl(claim.proof_file)"
                    target="_blank"
                    class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View Proof"
                  >
                    <FileText class="h-4 w-4" />
                  </a>
                  <button
                    v-if="isAdmin && (claim.status === 'pending' || claim.status === 'approved')"
                    @click="$emit('update-status', claim)"
                    class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Update Status"
                  >
                    <CheckCircle2 class="h-4 w-4" />
                  </button>
                  <button
                    @click="$emit('view', claim)"
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye class="h-4 w-4" />
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
import { FileText, Eye, CheckCircle2 } from 'lucide-vue-next'
import Skeleton from '../common/Skeleton.vue'
import type { Reimbursement } from '../../services/hrm/types/reimbursement.types'

defineProps<{
  reimbursements: Reimbursement[]
  loading: boolean
  isAdmin: boolean
}>()

defineEmits(['view', 'update-status'])

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-700'
    case 'approved': return 'bg-blue-100 text-blue-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    case 'paid': return 'bg-emerald-100 text-emerald-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getProofUrl = (path: string) => {
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL}/storage/${path}`
}
</script>
