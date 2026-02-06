<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Leads</h1>
        <p class="text-gray-600 mt-1">Manage and track all your leads</p>
      </div>

      <!-- Create Lead Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-1">
          <Card>
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Add New Lead</h2>
              <p class="text-sm text-gray-600 mt-1">Create a new lead record</p>
            </div>

            <form @submit.prevent="handleCreateLead" class="space-y-4">
              <FormField
                label="Lead Name"
                v-model="form.lead_name"
                placeholder="e.g., Andi - Procurement"
                :error="formErrors.lead_name"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Source</label>
                <select
                  v-model="form.source"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select source...</option>
                  <option value="Website">Website</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="Referral">Referral</option>
                  <option value="Social">Social Media</option>
                </select>
                <p v-if="formErrors.source" class="text-red-600 text-sm mt-1">
                  {{ formErrors.source }}
                </p>
              </div>

              <Button
                variant="primary"
                type="submit"
                :disabled="isSubmitting || !form.lead_name || !form.source"
                class="w-full"
              >
                <span v-if="isSubmitting" class="flex items-center gap-2">
                  <Spinner />
                  Creating...
                </span>
                <span v-else>Create Lead</span>
              </Button>
            </form>
          </Card>

          <!-- Stats Card -->
          <Card class="mt-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600">{{ leadStore.totalLeads }}</div>
              <p class="text-sm text-gray-600 mt-2">Total Leads</p>
            </div>
          </Card>
        </div>

        <!-- Lead List -->
        <div class="lg:col-span-2">
          <!-- Error Alert -->
          <Alert
            v-if="leadStore.hasError"
            :message="leadStore.error || 'An error occurred'"
            class="mb-4"
          />

          <!-- Loading State -->
          <div v-if="leadStore.isLoading && leadStore.isEmpty" class="flex justify-center py-12">
            <Spinner />
          </div>

          <!-- Lead Table -->
          <div v-else>
            <LeadTable :leads="leadStore.leads" />

            <!-- Pagination -->
            <div v-if="leadStore.totalPages > 1" class="mt-6 flex items-center justify-between">
              <p class="text-sm text-gray-600">
                Page {{ leadStore.currentPage }} of {{ leadStore.totalPages }}
              </p>
              <div class="flex gap-2">
                <Button
                  variant="outline"
                  @click="previousPage"
                  :disabled="leadStore.currentPage === 1"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  @click="nextPage"
                  :disabled="leadStore.currentPage === leadStore.totalPages"
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
import { useLeadStore } from "../stores/lead";
import AppLayout from "../layouts/AppLayout.vue";
import Card from "../components/common/Card.vue";
import Button from "../components/common/Button.vue";
import FormField from "../components/common/FormField.vue";
import Alert from "../components/common/Alert.vue";
import Spinner from "../components/common/Spinner.vue";
import LeadTable from "../components/crm/LeadTable.vue";

const leadStore = useLeadStore();
const isSubmitting = ref(false);

const form = reactive({
  lead_name: "",
  source: "",
});

const formErrors = reactive({
  lead_name: "",
  source: "",
});

// Validate form
const validateForm = (): boolean => {
  formErrors.lead_name = "";
  formErrors.source = "";

  if (!form.lead_name.trim()) {
    formErrors.lead_name = "Lead name is required";
    return false;
  }

  if (!form.source.trim()) {
    formErrors.source = "Source is required";
    return false;
  }

  return true;
};

// Create lead
const handleCreateLead = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    await leadStore.createLead({
      lead_name: form.lead_name,
      source: form.source,
    });

    // Reset form
    form.lead_name = "";
    form.source = "";
  } finally {
    isSubmitting.value = false;
  }
};

// Pagination
const nextPage = () => {
  if (leadStore.currentPage < leadStore.totalPages) {
    leadStore.fetchLeads(leadStore.currentPage + 1);
  }
};

const previousPage = () => {
  if (leadStore.currentPage > 1) {
    leadStore.fetchLeads(leadStore.currentPage - 1);
  }
};

// Load leads on mount
if (leadStore.leads.length === 0) {
  leadStore.fetchLeads();
}
</script>
