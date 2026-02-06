<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Sales Pipelines</h1>
          <p class="mt-2 text-gray-600">Manage your sales pipelines and stages.</p>
        </div>
        <button
          @click="fetchPipelines"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Refresh
        </button>
      </div>

      <Card>
        <div>
          <SalesPipelineTable :pipelines="pipelines" />
        </div>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import Card from "@/components/common/Card.vue";
import SalesPipelineTable from "@/components/crm/SalesPipelineTable.vue";
import { useSalesPipelineStore } from "@/stores/salesPipeline";

const store = useSalesPipelineStore();

const fetchPipelines = async () => {
  await store.fetchSalesPipelines(1);
};

onMounted(() => {
  fetchPipelines();
});

const pipelines = store.pipelines;
</script>
