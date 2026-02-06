<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
        <p class="text-gray-600 mt-1">Manage and view all your customers</p>
      </div>

      <!-- Create Customer Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-1">
          <Card>
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Add New Customer</h2>
              <p class="text-sm text-gray-600 mt-1">Create a new customer record</p>
            </div>

            <form @submit.prevent="handleCreateCustomer" class="space-y-4">
              <FormField
                label="Customer Name"
                v-model="form.name"
                placeholder="e.g., PT Maju Jaya"
                :error="formErrors.name"
              />

              <FormField
                label="Email"
                type="email"
                v-model="form.email"
                placeholder="e.g., contact@majujaya.co.id"
                :error="formErrors.email"
              />

              <Button
                variant="primary"
                type="submit"
                :disabled="isSubmitting || !form.name || !form.email"
                class="w-full"
              >
                <span v-if="isSubmitting" class="flex items-center gap-2">
                  <Spinner />
                  Creating...
                </span>
                <span v-else>Create Customer</span>
              </Button>
            </form>
          </Card>

          <!-- Stats Card -->
          <Card class="mt-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ customerStore.totalCustomers }}
              </div>
              <p class="text-sm text-gray-600 mt-2">Total Customers</p>
            </div>
          </Card>
        </div>

        <!-- Customer List -->
        <div class="lg:col-span-2">
          <!-- Error Alert -->
          <Alert
            v-if="customerStore.hasError"
            :message="customerStore.error || 'An error occurred'"
            class="mb-4"
          />

          <!-- Loading State -->
          <div
            v-if="customerStore.isLoading && customerStore.isEmpty"
            class="flex justify-center py-12"
          >
            <Spinner />
          </div>

          <!-- Customer Table -->
          <div v-else>
            <CustomerTable :customers="customerStore.customers" />

            <!-- Pagination -->
            <div v-if="customerStore.totalPages > 1" class="mt-6 flex items-center justify-between">
              <p class="text-sm text-gray-600">
                Page {{ customerStore.currentPage }} of {{ customerStore.totalPages }}
              </p>
              <div class="flex gap-2">
                <Button
                  variant="outline"
                  @click="previousPage"
                  :disabled="customerStore.currentPage === 1"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  @click="nextPage"
                  :disabled="customerStore.currentPage === customerStore.totalPages"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useCustomerStore } from "../stores/customer";
import AppLayout from "../layouts/AppLayout.vue";
import Card from "../components/common/Card.vue";
import Button from "../components/common/Button.vue";
import FormField from "../components/common/FormField.vue";
import Alert from "../components/common/Alert.vue";
import Spinner from "../components/common/Spinner.vue";
import CustomerTable from "../components/crm/CustomerTable.vue";

const customerStore = useCustomerStore();
const isSubmitting = ref(false);

const form = reactive({
  name: "",
  email: "",
});

const formErrors = reactive({
  name: "",
  email: "",
});

// Validate form
const validateForm = (): boolean => {
  formErrors.name = "";
  formErrors.email = "";

  if (!form.name.trim()) {
    formErrors.name = "Customer name is required";
    return false;
  }

  if (!form.email.trim()) {
    formErrors.email = "Email is required";
    return false;
  }

  if (!form.email.includes("@")) {
    formErrors.email = "Please enter a valid email";
    return false;
  }

  return true;
};

// Create customer
const handleCreateCustomer = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    await customerStore.createCustomer({
      name: form.name,
      email: form.email,
    });

    // Reset form
    form.name = "";
    form.email = "";
  } finally {
    isSubmitting.value = false;
  }
};

// Pagination
const nextPage = () => {
  if (customerStore.currentPage < customerStore.totalPages) {
    customerStore.fetchCustomers(customerStore.currentPage + 1);
  }
};

const previousPage = () => {
  if (customerStore.currentPage > 1) {
    customerStore.fetchCustomers(customerStore.currentPage - 1);
  }
};

// Load customers on mount
if (customerStore.customers.length === 0) {
  customerStore.fetchCustomers();
}
</script>
