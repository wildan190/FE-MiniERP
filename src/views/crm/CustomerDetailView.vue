<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <!-- Header with customer info -->
        <!-- Mobile Layout -->
        <div class="md:hidden">
          <!-- Avatar and Name - Centered on Mobile -->
          <div class="flex flex-col items-center text-center mb-4">
            <div
              class="h-20 w-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-bold text-3xl mb-3"
            >
              {{ (customer?.name || "C").charAt(0).toUpperCase() }}
            </div>
            <h1 class="text-2xl font-bold text-gray-900">{{ customer?.name }}</h1>
            <p class="mt-1 text-gray-600">{{ customer?.email }}</p>
            <div class="mt-2 flex flex-col gap-2 text-sm text-gray-600">
              <span v-if="customer?.phone" class="flex items-center justify-center gap-1">
                📞 {{ customer.phone }}
              </span>
              <span v-if="customer?.address" class="flex items-center justify-center gap-1">
                📍 {{ customer.address }}
              </span>
            </div>
          </div>
          
          <!-- Action Buttons - Full Width on Mobile -->
          <div class="flex flex-col gap-2">
            <button
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Edit
            </button>
            <button
              class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="hidden md:flex items-start justify-between">
          <div class="flex items-start gap-4">
            <div
              class="h-16 w-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-bold text-2xl"
            >
              {{ (customer?.name || "C").charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ customer?.name }}</h1>
              <p class="mt-1 text-gray-600">{{ customer?.email }}</p>
              <div class="mt-2 flex gap-4 text-sm text-gray-600">
                <span v-if="customer?.phone" class="flex items-center gap-1">
                  📞 {{ customer.phone }}
                </span>
                <span v-if="customer?.address" class="flex items-center gap-1">
                  📍 {{ customer.address }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Edit
            </button>
            <button
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div class="text-center">
              <p class="text-gray-600 text-sm">Total Orders</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalOrders }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-gray-600 text-sm">Total Revenue</p>
              <p class="text-3xl font-bold text-green-600 mt-2">
                {{ formatCurrency(stats.totalRevenue) }}
              </p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-gray-600 text-sm">Active Quotations</p>
              <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.activeQuotations }}</p>
            </div>
          </Card>
          <Card>
            <div class="text-center">
              <p class="text-gray-600 text-sm">Last Interaction</p>
              <p class="text-sm font-semibold text-gray-900 mt-2">
                {{ stats.lastInteraction ? formatDate(stats.lastInteraction) : "N/A" }}
              </p>
            </div>
          </Card>
        </div>

        <!-- Tabs -->
        <!-- Mobile: Dropdown -->
        <div class="md:hidden mb-4">
          <select
            id="tab-select"
            v-model="activeTab"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option v-for="tab in tabs" :key="tab" :value="tab">
              {{ tab }}
            </option>
          </select>
        </div>

        <!-- Desktop: Tab Bar -->
        <div class="hidden md:flex gap-2 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="
              activeTab === tab
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            "
            class="px-4 py-2 font-medium text-sm transition-colors"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Tab content -->
        <div>
          <!-- Details Tab -->
          <Card v-if="activeTab === 'Details'" class="p-6">
            <div class="space-y-8">
              <!-- General Information -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">General Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Name</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.name || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Email</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.email || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Phone</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.phone || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Alt Phone</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.alt_phone || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Company Name</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.company_name || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Website</p>
                    <a v-if="customer?.website" :href="customer.website" target="_blank" class="text-base font-medium text-primary-600 hover:underline">{{ customer.website }}</a>
                    <p v-else class="text-base font-medium text-gray-900">N/A</p>
                  </div>
                </div>
              </div>

              <!-- Business Details -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Business Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Customer Type</p>
                    <p class="text-base font-medium text-gray-900 capitalize">{{ customer?.customer_type || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Industry</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.industry || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Segment</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.segment || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Tax ID</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.tax_id || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Currency</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.currency || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Status</p>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                      :class="{
                        'bg-green-100 text-green-800': customer?.status === 'active',
                        'bg-gray-100 text-gray-800': customer?.status === 'inactive',
                        'bg-red-100 text-red-800': customer?.status === 'blocked'
                      }"
                    >
                      {{ customer?.status || 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Address Information -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Address Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <p class="text-sm text-gray-600">Billing Address</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.billing_address || 'N/A' }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <p class="text-sm text-gray-600">Shipping Address</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.shipping_address || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">City</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.city || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Province</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.province || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Postal Code</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.postal_code || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Country</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.country || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Financial & Other Information -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Financial & Other Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Credit Limit</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.credit_limit ? formatCurrency(Number(customer.credit_limit)) : 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Payment Terms</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.payment_terms || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Department</p>
                    <p class="text-base font-medium text-gray-900">{{ customer?.department || 'N/A' }}</p>
                  </div>
                  <div class="md:col-span-2" v-if="customer?.notes">
                    <p class="text-sm text-gray-600">Notes</p>
                    <p class="text-base font-medium text-gray-900 whitespace-pre-wrap">{{ customer?.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Quotations Tab -->
          <QuotationTable
            v-if="activeTab === 'Quotations'"
            :quotations="customerQuotations"
            :customer-map="{
              [customer?.id || 0]: { name: customer?.name || '', email: customer?.email || '' },
            }"
          />

          <!-- Orders Tab -->
          <OrderTable
            v-if="activeTab === 'Orders'"
            :orders="customerOrders"
            :customer-map="{
              [customer?.id || 0]: { name: customer?.name || '', email: customer?.email || '' },
            }"
          />

          <!-- Interactions Tab -->
          <InteractionTimeline
            v-if="activeTab === 'Interactions'"
            :interactions="customerInteractions"
          />

          <!-- Notes Tab -->
          <Card v-if="activeTab === 'Notes'">
            <div class="space-y-4">
              <textarea
                v-model="notes"
                placeholder="Add notes about this customer..."
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                rows="6"
              />
              <button
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Save Notes
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppLayout from "../../layouts/AppLayout.vue";
import type { Customer, Quotation, Order, Interaction } from "../../services";
import { crmServiceInstance } from "../../services";
import Card from "../../components/common/Card.vue";
import QuotationTable from "../../components/crm/QuotationTable.vue";
import OrderTable from "../../components/crm/OrderTable.vue";
import InteractionTimeline from "../../components/crm/InteractionTimeline.vue";

const route = useRoute();
const customerUuid = route.params.uuid as string;

const customer = ref<Customer | null>(null);
const customerQuotations = ref<Quotation[]>([]);
const customerOrders = ref<Order[]>([]);
const customerInteractions = ref<Interaction[]>([]);
const notes = ref<string>("");
const activeTab = ref<string>("Details");
const tabs = ["Details", "Quotations", "Orders", "Interactions", "Notes"];

const stats = computed(() => ({
  totalOrders: customerOrders.value.length,
  totalRevenue: customerOrders.value.reduce(
    (sum, order) => sum + parseFloat(String(order.total_amount)),
    0,
  ),
  activeQuotations: customerQuotations.value.filter((q) => new Date(q.valid_until) > new Date())
    .length,
  lastInteraction: customerInteractions.value.length
    ? customerInteractions.value[customerInteractions.value.length - 1]?.created_at
    : null,
}));

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Load customer details
const loadCustomerDetails = async () => {
  try {
    customer.value = await crmServiceInstance.getCustomerByUuid(customerUuid);
    
    if (customer.value) {
      // Use the numeric ID for other services that still require it
      const customerId = customer.value.id;
      
      const [quotations, orders, interactions] = await Promise.all([
        crmServiceInstance.getCustomerQuotations(customerId),
        crmServiceInstance.getCustomerOrders(customerId),
        crmServiceInstance.getCustomerInteractions(customerId)
      ]);
      
      customerQuotations.value = quotations;
      customerOrders.value = orders;
      customerInteractions.value = interactions;
    }
  } catch (error) {
    console.error("Failed to load customer details:", error);
  }
};

onMounted(() => {
  loadCustomerDetails();
});
</script>
