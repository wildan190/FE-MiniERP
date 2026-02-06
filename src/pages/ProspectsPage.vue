<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Prospects</h1>
        <p class="text-gray-600 mt-1">Manage and track all your prospects</p>
      </div>

      <!-- Create Prospect Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-1">
          <Card>
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Add New Prospect</h2>
              <p class="text-sm text-gray-600 mt-1">Create a new prospect record</p>
            </div>

            <form @submit.prevent="handleCreateProspect" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                <select
                  v-model.number="form.customer_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select customer...</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.name }}
                  </option>
                </select>
                <p v-if="formErrors.customer_id" class="text-red-600 text-sm mt-1">
                  {{ formErrors.customer_id }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Initial Status</label>
                <select
                  v-model="form.status"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select status...</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
                <p v-if="formErrors.status" class="text-red-600 text-sm mt-1">
                  {{ formErrors.status }}
                </p>
              </div>

              <Button
                variant="primary"
                type="submit"
                :disabled="isSubmitting || !form.customer_id || !form.status"
                class="w-full"
              >
                <span v-if="isSubmitting" class="flex items-center gap-2">
                  <Spinner />
                  Creating...
                </span>
                <span v-else>Create Prospect</span>
              </Button>
            </form>
          </Card>

          <!-- Stats Card -->
          <Card class="mt-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">
                {{ prospectStore.totalProspects }}
              </div>
              <p class="text-sm text-gray-600 mt-2">Total Prospects</p>
            </div>
          </Card>
        </div>

        <!-- Prospect List -->
        <div class="lg:col-span-2">
          <!-- Error Alert -->
          <Alert
            v-if="prospectStore.hasError"
            :message="prospectStore.error || 'An error occurred'"
            class="mb-4"
          />

          <!-- Loading State -->
          <div
            v-if="prospectStore.isLoading && prospectStore.isEmpty"
            class="flex justify-center py-12"
          >
            <Spinner />
          </div>

          <!-- Prospect Table -->
          <div v-else>
            <ProspectTable
              :prospects="prospectStore.prospects"
              :customerMap="customerMap"
              @updateStatus="handleOpenStatusModal"
            />

            <!-- Pagination -->
            <div v-if="prospectStore.totalPages > 1" class="mt-6 flex items-center justify-between">
              <p class="text-sm text-gray-600">
                Page {{ prospectStore.currentPage }} of {{ prospectStore.totalPages }}
              </p>
              <div class="flex gap-2">
                <Button
                  variant="outline"
                  @click="previousPage"
                  :disabled="prospectStore.currentPage === 1"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  @click="nextPage"
                  :disabled="prospectStore.currentPage === prospectStore.totalPages"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Update Modal -->
      <div
        v-if="showStatusModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showStatusModal = false"
      >
        <Card class="w-full max-w-md">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Update Prospect Status</h2>
            <button @click="showStatusModal = false" class="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600 mb-2">
                Prospect ID:
                <span class="font-semibold text-gray-900">#{{ selectedProspect?.id }}</span>
              </p>
              <p class="text-sm text-gray-600">
                Current Status:
                <span class="font-semibold text-gray-900">{{ selectedProspect?.status }}</span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <select
                v-model="statusForm.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select status...</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div class="flex gap-3">
              <Button variant="outline" @click="showStatusModal = false" class="flex-1">
                Cancel
              </Button>
              <Button
                variant="primary"
                @click="handleUpdateStatus"
                :disabled="isUpdating || !statusForm.status"
                class="flex-1"
              >
                <span v-if="isUpdating" class="flex items-center gap-2">
                  <Spinner />
                  Updating...
                </span>
                <span v-else>Update Status</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useProspectStore } from "../stores/prospect";
import { customerRepository } from "../repositories";
import AppLayout from "../layouts/AppLayout.vue";
import Card from "../components/common/Card.vue";
import Button from "../components/common/Button.vue";
import Alert from "../components/common/Alert.vue";
import Spinner from "../components/common/Spinner.vue";
import ProspectTable from "../components/crm/ProspectTable.vue";
import type { Prospect, Customer } from "../services";

const prospectStore = useProspectStore();
const isSubmitting = ref(false);
const isUpdating = ref(false);
const showStatusModal = ref(false);
const selectedProspect = ref<Prospect | null>(null);
const customers = ref<Customer[]>([]);
const isLoadingCustomers = ref(false);

// Computed customer map
const customerMap = computed(() => {
  return customers.value.reduce(
    (map, customer) => {
      map[customer.id] = { name: customer.name, email: customer.email };
      return map;
    },
    {} as Record<number, { name: string; email: string }>,
  );
});

const form = reactive({
  customer_id: 0,
  status: "",
});

const formErrors = reactive({
  customer_id: "",
  status: "",
});

const statusForm = reactive({
  status: "",
});

// Validate create form
const validateForm = (): boolean => {
  formErrors.customer_id = "";
  formErrors.status = "";

  if (!form.customer_id) {
    formErrors.customer_id = "Customer ID is required";
    return false;
  }

  if (!form.status.trim()) {
    formErrors.status = "Status is required";
    return false;
  }

  return true;
};

// Create prospect
const handleCreateProspect = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    await prospectStore.createProspect({
      customer_id: form.customer_id,
      status: form.status,
    });

    // Reset form
    form.customer_id = 0;
    form.status = "";
  } finally {
    isSubmitting.value = false;
  }
};

// Open status update modal
const handleOpenStatusModal = (prospect: Prospect) => {
  selectedProspect.value = prospect;
  statusForm.status = prospect.status;
  showStatusModal.value = true;
};

// Update status
const handleUpdateStatus = async () => {
  if (!selectedProspect.value || !statusForm.status) return;

  isUpdating.value = true;

  try {
    await prospectStore.updateProspectStatus(selectedProspect.value.id, {
      status: statusForm.status,
    });

    showStatusModal.value = false;
    selectedProspect.value = null;
    statusForm.status = "";
  } finally {
    isUpdating.value = false;
  }
};

// Pagination
const nextPage = () => {
  if (prospectStore.currentPage < prospectStore.totalPages) {
    prospectStore.fetchProspects(prospectStore.currentPage + 1);
  }
};

const previousPage = () => {
  if (prospectStore.currentPage > 1) {
    prospectStore.fetchProspects(prospectStore.currentPage - 1);
  }
};

// Load customers
const loadCustomers = async () => {
  isLoadingCustomers.value = true;
  try {
    const response = await customerRepository.getCustomers(1);
    customers.value = response.data.data;
  } catch (err) {
    console.error("Error loading customers:", err);
  } finally {
    isLoadingCustomers.value = false;
  }
};

// Load data on mount
if (prospectStore.prospects.length === 0) {
  prospectStore.fetchProspects();
}

if (customers.value.length === 0) {
  loadCustomers();
}
</script>
