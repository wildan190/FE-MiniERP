<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
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
            <tr v-for="(claim, index) in reimbursements" :key="claim?.uuid || index" class="hover:bg-gray-50 transition-colors">
              <template v-if="claim">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                      {{ claim.employee?.user?.name ? claim.employee.user.name.charAt(0) : '?' }}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900">{{ claim.employee?.user?.name || '-' }}</p>
                      <p class="text-xs text-gray-500">{{ claim.employee?.user?.email || '-' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-700">{{ claim.type || '-' }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-bold text-gray-900">{{ formatCurrency(claim.amount || 0) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="getStatusClass(claim.status)"
                  >
                    {{ claim.status ? claim.status.toUpperCase() : '-' }}
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
                      v-if="isAdmin && claim.status && (claim.status === 'pending' || claim.status === 'approved')"
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
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Mobile Accordion/Card View (Expand/Collapse) -->
    <div class="md:hidden divide-y divide-gray-200">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Skeleton width="2.5rem" height="2.5rem" borderRadius="9999px" />
              <div class="space-y-1">
                <Skeleton width="8rem" height="1rem" />
                <Skeleton width="5rem" height="0.75rem" />
              </div>
            </div>
            <Skeleton width="4rem" height="1.25rem" borderRadius="9999px" />
          </div>
          <Skeleton width="100%" height="0.875rem" />
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="reimbursements.length === 0">
        <div class="p-8 text-center text-gray-500 text-sm">
          No reimbursement claims found.
        </div>
      </template>

      <!-- Claims List -->
      <template v-else>
        <div 
          v-for="(claim, index) in reimbursements" 
          :key="claim?.uuid || index" 
          class="p-4 space-y-3 transition-colors hover:bg-gray-50/50"
        >
          <template v-if="claim">
            <!-- Header (Click to expand/collapse) -->
            <div 
              @click="toggleExpand(claim?.uuid || index)" 
              class="flex items-center justify-between gap-3 cursor-pointer select-none"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="h-9 w-9 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-700 font-bold text-xs">
                  {{ claim.employee?.user?.name ? claim.employee.user.name.charAt(0) : '?' }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ claim.employee?.user?.name || '-' }}</p>
                  <p class="text-xs text-gray-500 font-medium truncate">
                    {{ claim.type || '-' }} • <span class="font-bold text-gray-900">{{ formatCurrency(claim.amount || 0) }}</span>
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span 
                  class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  :class="getStatusClass(claim.status)"
                >
                  {{ claim.status ? claim.status.toUpperCase() : '-' }}
                </span>
                <button 
                  type="button"
                  class="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                  :aria-label="isExpanded(claim?.uuid || index) ? 'Collapse' : 'Expand'"
                >
                  <ChevronUp v-if="isExpanded(claim?.uuid || index)" class="h-5 w-5" />
                  <ChevronDown v-else class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Expanded Content -->
            <div 
              v-if="isExpanded(claim?.uuid || index)" 
              class="pt-3 space-y-3 text-xs border-t border-gray-100 mt-2"
            >
              <div class="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Email</span>
                  <span class="font-medium text-gray-800 break-all">{{ claim.employee?.user?.email || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Date</span>
                  <span class="font-medium text-gray-800">{{ formatDate(claim.created_at) }}</span>
                </div>
                <div v-if="claim.description" class="col-span-2">
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Description</span>
                  <span class="font-medium text-gray-800 whitespace-pre-line">{{ claim.description }}</span>
                </div>
                <div v-if="claim.approver" class="col-span-2">
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Approver</span>
                  <span class="font-medium text-gray-800">{{ claim.approver.name }} ({{ claim.approver.email }})</span>
                </div>
                <div v-if="claim.approved_at" class="col-span-2">
                  <span class="text-gray-400 block text-[10px] uppercase font-bold">Processed At</span>
                  <span class="font-medium text-gray-800">{{ new Date(claim.approved_at).toLocaleString('id-ID') }}</span>
                </div>
                <div v-if="claim.rejection_reason" class="col-span-2 text-red-600">
                  <span class="text-red-400 block text-[10px] uppercase font-bold">Rejection Reason</span>
                  <span class="font-medium">{{ claim.rejection_reason }}</span>
                </div>
              </div>

              <!-- Actions Bar -->
              <div class="flex items-center gap-2 pt-1 flex-wrap">
                <a 
                  v-if="claim.proof_file"
                  :href="getProofUrl(claim.proof_file)"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold hover:bg-primary-100 transition-colors"
                >
                  <FileText class="h-3.5 w-3.5" />
                  View Proof
                </a>
                <button
                  v-if="isAdmin && claim.status && (claim.status === 'pending' || claim.status === 'approved')"
                  @click.stop="$emit('update-status', claim)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
                  :class="{ 'ml-auto': !claim.proof_file }"
                >
                  <CheckCircle2 class="h-3.5 w-3.5" />
                  Update Status
                </button>
                <button
                  @click.stop="$emit('view', claim)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                  :class="{ 'ml-auto': !claim.proof_file && !(isAdmin && claim.status && (claim.status === 'pending' || claim.status === 'approved')) }"
                >
                  <Eye class="h-3.5 w-3.5" />
                  Details
                </button>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference types="vite/client" />
import { ref } from 'vue'
import { FileText, Eye, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-vue-next'
import Skeleton from '../common/Skeleton.vue'
import type { Reimbursement } from '../../services/hrm/types/reimbursement.types'

defineProps<{
  reimbursements: Reimbursement[]
  loading: boolean
  isAdmin: boolean
}>()

defineEmits(['view', 'update-status'])

const expandedRows = ref<Record<string | number, boolean>>({})

const toggleExpand = (key: string | number) => {
  expandedRows.value[key] = !expandedRows.value[key]
}

const isExpanded = (key: string | number) => {
  return !!expandedRows.value[key]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status?: string | null) => {
  if (!status) return 'bg-gray-100 text-gray-700'
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
