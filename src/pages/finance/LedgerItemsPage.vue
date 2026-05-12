<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">General Ledger</h1>
        <p class="text-gray-600 mt-1">Detailed list of all journal transactions</p>
      </div>

      <!-- Content -->
      <Card>
        <div v-if="financeStore.isLoading" class="space-y-4">
          <Skeleton v-for="i in 10" :key="i" width="100%" height="40px" />
        </div>
        
        <Alert
          v-else-if="financeStore.error"
          :message="financeStore.error"
          class="mb-4"
        />

        <div v-else class="space-y-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in itemsData.data" :key="item.uuid" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ item.entry ? item.entry.date : '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ item.account ? item.account.name : '-' }}
                    <span class="block text-xs text-gray-400">{{ item.account ? item.account.code : '' }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.entry ? item.entry.entry_number : '-' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {{ item.description || (item.entry ? item.entry.description : '-') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {{ item.debit > 0 ? formatCurrency(item.debit) : '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {{ item.credit > 0 ? formatCurrency(item.credit) : '-' }}
                  </td>
                </tr>
                <tr v-if="!itemsData.data || itemsData.data.length === 0">
                  <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                    No ledger items found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <ResponsivePagination
            v-if="itemsData.total > itemsData.per_page"
            :current-page="itemsData.current_page"
            :last-page="itemsData.last_page"
            :from="itemsData.from"
            :to="itemsData.to"
            :total="itemsData.total"
            :links="itemsData.links"
            @page-change="financeStore.fetchLedgerItems"
          />
        </div>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/common/Card.vue'
import Alert from '@/components/common/Alert.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import ResponsivePagination from '@/components/common/ResponsivePagination.vue'

const financeStore = useFinanceStore()

const itemsData = computed(() => {
  const defaultState = { data: [], total: 0, current_page: 1, last_page: 1, per_page: 20, from: 0, to: 0, links: [] }
  if (!financeStore.ledgerItems) return defaultState
  if (Array.isArray(financeStore.ledgerItems)) {
    return { ...defaultState, data: financeStore.ledgerItems, total: financeStore.ledgerItems.length }
  }
  return financeStore.ledgerItems
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

onMounted(() => {
  financeStore.fetchLedgerItems()
})
</script>
