<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link
            to="/crm/pipelines"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </router-link>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Pipeline Detail</h1>
            <p class="text-sm text-gray-500 mt-1" v-if="pipeline">
              UUID: {{ pipeline.uuid }}
            </p>
          </div>
        </div>
        <div class="flex space-x-3" v-if="pipeline">
          <span
            :class="getStageBadgeClass(pipeline.stage)"
            class="px-4 py-2 rounded-full text-sm font-semibold"
          >
            {{ pipeline.stage.toUpperCase() }}
          </span>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
        ></div>
      </div>

      <div v-else-if="pipeline" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Prospect Details -->
          <Card>
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Prospect Information
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-sm font-medium text-gray-500">Title</label>
                  <p class="mt-1 text-lg text-gray-900">
                    {{ pipeline.prospect.title }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Status</label>
                  <p class="mt-1 text-gray-900">{{ pipeline.prospect.status }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500"
                    >Expected Value</label
                  >
                  <p class="mt-1 text-gray-900">
                    {{ formatCurrency(pipeline.prospect.expected_value) }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500"
                    >Expected Closing Date</label
                  >
                  <p class="mt-1 text-gray-900">
                    {{ formatDate(pipeline.prospect.expected_closing_date) }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label class="text-sm font-medium text-gray-500">Notes</label>
                  <p class="mt-1 text-gray-900 whitespace-pre-wrap">
                    {{ pipeline.prospect.notes || "-" }}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <!-- Pipeline Notes -->
          <Card>
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Pipeline Notes
              </h2>
              <p class="text-gray-900 whitespace-pre-wrap">
                {{ pipeline.notes || "No additional notes for this stage." }}
              </p>
            </div>
          </Card>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- Customer Info -->
          <Card>
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
              <div class="space-y-4" v-if="pipeline.prospect.customer">
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase"
                    >Name</label
                  >
                  <p class="text-sm font-medium text-gray-900">
                    {{ pipeline.prospect.customer.name }}
                  </p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase"
                    >Email</label
                  >
                  <p class="text-sm text-gray-900">
                    {{ pipeline.prospect.customer.email }}
                  </p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 uppercase"
                    >Phone</label
                  >
                  <p class="text-sm text-gray-900">
                    {{ pipeline.prospect.customer.phone || "-" }}
                  </p>
                </div>
                <div class="pt-4 border-t border-gray-100">
                  <router-link
                    :to="{
                      name: 'crm-customer-detail',
                      params: { uuid: pipeline.prospect.customer.uuid },
                    }"
                    class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Customer Profile →
                  </router-link>
                </div>
              </div>
            </div>
          </Card>

          <!-- Timeline / Metadata -->
          <Card>
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Created At</span>
                  <span class="text-sm text-gray-900">{{
                    formatDate(pipeline.created_at)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">Updated At</span>
                  <span class="text-sm text-gray-900">{{
                    formatDate(pipeline.updated_at)
                  }}</span>
                </div>
                <div class="flex justify-between" v-if="pipeline.user_id">
                  <span class="text-sm text-gray-500">Assigned User ID</span>
                  <span class="text-sm text-gray-900">{{
                    pipeline.user_id
                  }}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 font-medium">{{ error }}</p>
        <button
          @click="loadPipeline"
          class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useSalesPipelineStore } from "../../stores/salesPipeline";
import AppLayout from "../../layouts/AppLayout.vue";
import Card from "../../components/common/Card.vue";

const route = useRoute();
const store = useSalesPipelineStore();

const uuid = route.params.uuid as string;

const pipeline = computed(() => store.selectedPipeline);
const isLoading = computed(() => store.isLoading);
const error = computed(() => store.error);

const loadPipeline = async () => {
  await store.fetchSalesPipelineDetail(uuid);
};

onMounted(() => {
  loadPipeline();
});

// Helpers
const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value: string | number | null) => {
  if (value === null || value === undefined) return "IDR 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(Number(value));
};

const getStageBadgeClass = (stage: string) => {
  const badgeClasses: Record<string, string> = {
    proposal: "bg-blue-100 text-blue-800",
    negotiation: "bg-yellow-100 text-yellow-800",
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
    qualified: "bg-indigo-100 text-indigo-800",
    contacted: "bg-orange-100 text-orange-800"
  };
  return badgeClasses[stage] || "bg-gray-100 text-gray-800";
};
</script>
