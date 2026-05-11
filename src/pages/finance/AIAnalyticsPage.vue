<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">AI Financial Analytics</h1>
        <p class="text-gray-600 mt-1">Advanced insights and forecasting powered by AI</p>
      </div>

      <!-- Loading State -->
      <div v-if="financeStore.isLoading" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton v-for="i in 3" :key="i" width="100%" height="200px" />
        </div>
        <Skeleton width="100%" height="400px" />
      </div>

      <!-- Content -->
      <div v-else-if="financeStore.aiInsights" class="space-y-8">
        <!-- Top Insights -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Revenue Analysis -->
          <Card class="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp class="h-5 w-5" />
              Profitability AI
            </h3>
            <div class="space-y-4">
              <div>
                <p class="text-blue-100 text-xs uppercase tracking-wider">Growth Prediction</p>
                <p class="text-2xl font-bold">+{{ financeStore.aiInsights?.revenue?.projected_growth || 0 }}%</p>
              </div>
              <p class="text-sm text-blue-100 italic">"{{ financeStore.aiInsights?.revenue?.ai_insight }}"</p>
            </div>
          </Card>

          <!-- Cash Forecast -->
          <Card class="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-none">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap class="h-5 w-5" />
              Liquidity AI
            </h3>
            <div class="space-y-4">
              <div>
                <p class="text-emerald-100 text-xs uppercase tracking-wider">Projected Cash</p>
                <p class="text-2xl font-bold">{{ formatCurrency(financeStore.aiInsights?.forecast?.projected_cash_next_month || 0) }}</p>
              </div>
              <p class="text-sm text-emerald-100 italic">"{{ financeStore.aiInsights?.forecast?.recommendation }}"</p>
            </div>
          </Card>

          <!-- Risk Assessment -->
          <Card class="bg-gradient-to-br from-orange-600 to-orange-700 text-white border-none">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle class="h-5 w-5" />
              Supply Chain Risk
            </h3>
            <div class="space-y-4">
              <div>
                <p class="text-orange-100 text-xs uppercase tracking-wider">Risk Level</p>
                <p class="text-2xl font-bold uppercase">{{ financeStore.aiInsights?.risk?.risk_level }}</p>
              </div>
              <p class="text-sm text-orange-100 italic">"{{ financeStore.aiInsights?.risk?.mitigation_strategy }}"</p>
            </div>
          </Card>
        </div>

        <!-- Detailed Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Revenue Trends -->
          <Card>
            <h3 class="text-lg font-bold text-gray-900 mb-6">Revenue Breakdown (AI Analyzed)</h3>
            <div class="space-y-4">
            <div v-for="item in financeStore.aiInsights?.revenue?.breakdown || []" :key="item.category" class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 font-medium">{{ item.category }}</span>
                  <span class="text-gray-900 font-bold">{{ formatCurrency(item.amount) }}</span>
                </div>
                <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div class="bg-blue-500 h-full" :style="{ width: (item.amount / financeStore.aiInsights.revenue.total * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Supplier Risk -->
          <Card>
            <h3 class="text-lg font-bold text-gray-900 mb-6">Supplier Risk Scores</h3>
            <div class="space-y-4">
              <div v-for="supplier in financeStore.aiInsights?.risk?.supplier_scores || []" :key="supplier.name" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs',
                    supplier.score < 40 ? 'bg-red-100 text-red-600' : (supplier.score < 70 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600')
                  ]">
                    {{ supplier.score }}
                  </div>
                  <span class="font-medium text-gray-800">{{ supplier.name }}</span>
                </div>
                <span :class="[
                  'px-2 py-1 rounded text-[10px] font-bold uppercase',
                  supplier.score < 40 ? 'bg-red-500 text-white' : (supplier.score < 70 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white')
                ]">
                  {{ supplier.score < 40 ? 'High Risk' : (supplier.score < 70 ? 'Medium' : 'Low Risk') }}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/common/Card.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import { TrendingUp, Zap, AlertTriangle } from 'lucide-vue-next'

const financeStore = useFinanceStore()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

onMounted(() => {
  financeStore.fetchAIInsights()
})
</script>
