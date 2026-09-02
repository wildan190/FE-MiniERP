<template>
  <Card class="!p-0 overflow-hidden">
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr class="bg-gray-50/75">
            <th class="table-th">Employee</th>
            <th class="table-th">Type</th>
            <th class="table-th">Amount</th>
            <th class="table-th">Status</th>
            <th class="table-th">Date</th>
            <th class="table-th text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
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
              <td colspan="6" class="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                No reimbursement claims found.
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(claim, index) in reimbursements" :key="claim?.uuid || index" class="table-tr-hover">
              <template v-if="claim">
                <td class="table-td">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs shadow-sm flex-shrink-0">
                      {{ claim.employee?.user?.name ? claim.employee.user.name.charAt(0) : '?' }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ claim.employee?.user?.name || '-' }}</p>
                      <p class="text-xs text-gray-500 font-mono">{{ claim.employee?.user?.email || '-' }}</p>
                    </div>
                  </div>
                </td>
                <td class="table-td">
                  <span class="text-sm font-medium text-gray-700">{{ claim.type || '-' }}</span>
                </td>
                <td class="table-td font-bold text-gray-900">
                  {{ formatCurrency(claim.amount || 0) }}
                </td>
                <td class="table-td">
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1"
                    :class="getStatusClass(claim.status)"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {{ claim.status ? claim.status.toUpperCase() : '-' }}
                  </span>
                </td>
                <td class="table-td text-xs text-gray-500 font-medium">
                  {{ formatDate(claim.created_at) }}
                </td>
                <td class="table-td text-right">
                  <div class="table-action-toolbar justify-end">
                    <a 
                      v-if="claim.proof_file"
                      :href="getProofUrl(claim.proof_file)"
                      target="_blank"
                      class="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View Proof File"
                    >
                      <FileText class="h-4 w-4" />
                    </a>
                    <button
                      v-if="isAdmin && claim.status && (claim.status === 'pending' || claim.status === 'approved')"
                      @click="$emit('update-status', claim)"
                      class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Update Status"
                    >
                      <CheckCircle2 class="h-4 w-4" />
                    </button>
                    <button
                      @click="$emit('view', claim)"
                      class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
    <div class="md:hidden p-3">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="p-4 space-y-3 border-b border-gray-100">
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
        </div>
      </template>

      <!-- Empty State -->
      <template v-else-if="reimbursements.length === 0">
        <div class="p-8 text-center text-gray-500 text-sm">
          No reimbursement claims found.
        </div>
      </template>

      <!-- Claims List Accordion -->
      <template v-else>
        <MobileExpandableRow 
          v-for="(claim, index) in reimbursements" 
          :key="claim?.uuid || index" 
          :title="claim?.employee?.user?.name || '-'"
          :subtitle="`${claim?.type || '-'} • ${formatCurrency(claim?.amount || 0)}`"
          :badge="claim?.status?.toUpperCase() || '-'"
          :badgeClass="getStatusClass(claim?.status)"
          :index="index + 1"
        >
          <template #header-icon>
            <div class="h-9 w-9 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-700 font-bold text-xs">
              {{ claim?.employee?.user?.name ? claim.employee.user.name.charAt(0) : '?' }}
            </div>
          </template>

          <template #details>
            <div class="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-gray-200/80 text-xs">
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Email</span>
                <span class="font-medium text-gray-800 break-all">{{ claim?.employee?.user?.email || '-' }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Date</span>
                <span class="font-medium text-gray-800">{{ formatDate(claim?.created_at) }}</span>
              </div>
              <div class="col-span-2 pt-1 border-t border-gray-100">
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Amount</span>
                <span class="font-bold text-gray-900 text-sm">{{ formatCurrency(claim?.amount || 0) }}</span>
              </div>
            </div>
          </template>

          <template #actions>
            <a 
              v-if="claim?.proof_file"
              :href="getProofUrl(claim.proof_file)"
              target="_blank"
              class="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors flex items-center gap-1.5"
            >
              <FileText class="h-3.5 w-3.5" />
              Proof
            </a>
            <button
              v-if="isAdmin && claim?.status && (claim.status === 'pending' || claim.status === 'approved')"
              @click="$emit('update-status', claim)"
              class="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 class="h-3.5 w-3.5" />
              Update Status
            </button>
            <button
              @click="$emit('view', claim)"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >
              <Eye class="h-3.5 w-3.5" />
              Details
            </button>
          </template>
        </MobileExpandableRow>
      </template>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { FileText, Eye, CheckCircle2 } from 'lucide-vue-next'
import Card from '../common/Card.vue'
import Skeleton from '../common/Skeleton.vue'
import MobileExpandableRow from '../common/MobileExpandableRow.vue'
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
  return `/storage/${path}`
}
</script>
