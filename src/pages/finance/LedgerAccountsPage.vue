<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
          <p class="text-gray-600 mt-1">Manage your company's accounting structure</p>
        </div>
        <button
          class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          New Account
        </button>
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

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Account</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="account in financeStore.accounts" :key="account.uuid" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ account.code }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ account.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span 
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getTypeClass(account.type)"
                  >
                    {{ account.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ account.parent ? account.parent.name : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                  <button class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr v-if="financeStore.accounts.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                  No accounts found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/common/Card.vue'
import Alert from '@/components/common/Alert.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import { Plus } from 'lucide-vue-next'

const financeStore = useFinanceStore()

const getTypeClass = (type: string) => {
  switch (type) {
    case 'asset': return 'bg-blue-100 text-blue-800'
    case 'liability': return 'bg-red-100 text-red-800'
    case 'equity': return 'bg-purple-100 text-purple-800'
    case 'revenue': return 'bg-green-100 text-green-800'
    case 'expense': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  financeStore.fetchAccounts()
})
</script>
