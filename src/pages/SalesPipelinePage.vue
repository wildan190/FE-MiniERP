<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Sales Pipelines</h1>
          <p class="mt-2 text-gray-600">Manage your sales pipelines and stages.</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="showCreateModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Pipeline
          </button>
          <button
            @click="fetchPipelines"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <Card>
        <div>
          <SalesPipelineTable :pipelines="store.pipelines" />
        </div>
      </Card>
    </div>

    <!-- Create Modal -->
    <CreateSalesPipelineModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handlePipelineCreated"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import Card from "@/components/common/Card.vue";
import SalesPipelineTable from "@/components/crm/SalesPipelineTable.vue";
import CreateSalesPipelineModal from "@/components/crm/CreateSalesPipelineModal.vue";
import { useSalesPipelineStore } from "@/stores/salesPipeline";

const store = useSalesPipelineStore();
const showCreateModal = ref(false);

const fetchPipelines = async () => {
  await store.fetchSalesPipelines(1);
};

const handlePipelineCreated = () => {
  fetchPipelines();
};

onMounted(() => {
  fetchPipelines();
});
</script>
