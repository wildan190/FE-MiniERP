<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
          <p class="text-gray-600 mt-1">Manage and view all your customers</p>
        </div>
        <button
          @click="isCreateModalOpen = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Customer
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Customers</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ pagination.total }}</p>
          </div>
        </Card>
      </div>

      <!-- Customer List -->
      <Card>
        <div class="space-y-4">
           <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center py-12">
            <Spinner />
          </div>

          <!-- Customer Table -->
          <div v-else>
            <CustomerTable :customers="customers" />

            <!-- Pagination -->
            <div v-if="pagination.total > 0" class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
              <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                   <p class="text-sm text-gray-700">
                    Showing
                    <span class="font-medium">{{ pagination.from }}</span>
                    to
                    <span class="font-medium">{{ pagination.to }}</span>
                    of
                    <span class="font-medium">{{ pagination.total }}</span>
                    results
                  </p>
                </div>
                <div>
                  <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      v-for="link in pagination.links"
                      :key="link.label"
                      @click="link.url ? loadData(link.page || 1) : null"
                      :disabled="!link.url"
                      :class="[
                        link.active ? 'bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
                        !link.url ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer',
                        'relative inline-flex items-center px-4 py-2 text-sm font-semibold first:rounded-l-md last:rounded-r-md'
                      ]"
                      v-html="link.label"
                    >
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Create Customer Modal -->
      <CreateCustomerModal
        :is-open="isCreateModalOpen"
        :errors="createErrors"
        :error-message="createErrorMessage"
        @close="isCreateModalOpen = false"
        @submit="handleCreateCustomer"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppLayout from "../layouts/AppLayout.vue";
import Card from "../components/common/Card.vue";
import Spinner from "../components/common/Spinner.vue";
import CustomerTable from "../components/crm/CustomerTable.vue";
import CreateCustomerModal from "../components/crm/CreateCustomerModal.vue";
import { crmServiceInstance } from "../services";
import type { Customer, PaginationLink, CreateCustomerRequest } from "../services";

const customers = ref<Customer[]>([]);
const isLoading = ref(false);
const isCreateModalOpen = ref(false);
const pagination = ref({
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  links: [] as PaginationLink[],
  last_page: 1
});

const loadData = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await crmServiceInstance.getCustomers(page);
    customers.value = response.data;
    pagination.value = {
      current_page: response.current_page,
      from: response.from,
      to: response.to,
      total: response.total,
      links: response.links,
      last_page: response.last_page
    };
  } catch (error) {
    console.error("Failed to load customers:", error);
  } finally {
    isLoading.value = false;
  }
};

const createErrors = ref<Record<string, string[]> | null>(null);
const createErrorMessage = ref<string | null>(null);

const handleCreateCustomer = async (data: CreateCustomerRequest) => {
  createErrors.value = null;
  createErrorMessage.value = null;
  
  try {
    await crmServiceInstance.createCustomer(data);
    isCreateModalOpen.value = false;
    loadData(1); // Reload to first page
  } catch (error: any) {
    console.error("Failed to create customer:", error);
    if (error.response?.status === 422) {
      createErrors.value = error.response.data.errors;
      createErrorMessage.value = "Please correct the errors below.";
    } else {
      createErrorMessage.value = error.response?.data?.message || "Failed to create customer. Please try again.";
    }
  }
};

onMounted(() => {
  loadData();
});
</script>
