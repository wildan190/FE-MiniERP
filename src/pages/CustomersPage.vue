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
          class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
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
            <ResponsivePagination
              v-if="pagination.total > 0"
              :current-page="pagination.current_page"
              :last-page="pagination.last_page"
              :from="pagination.from"
              :to="pagination.to"
              :total="pagination.total"
              :links="pagination.links"
              @page-change="loadData"
            />
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
      <!-- Mobile Floating Actions -->
      <MobileActions 
        :primary-action="{
          label: 'New Customer',
          icon: Plus,
          onClick: () => isCreateModalOpen = true
        }"
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
import MobileActions from "../components/common/MobileActions.vue";
import ResponsivePagination from "../components/common/ResponsivePagination.vue";
import { Plus } from 'lucide-vue-next';
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
