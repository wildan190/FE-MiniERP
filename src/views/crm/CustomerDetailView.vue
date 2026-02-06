<template>
  <div class="space-y-6">
    <!-- Header with customer info -->
    <div class="flex items-start justify-between">
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
    <div class="flex gap-2 border-b border-gray-200">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Customer, Quotation, Order, Interaction } from "../../services";
import { crmServiceInstance } from "../../services";
import Card from "../../components/common/Card.vue";
import QuotationTable from "../../components/crm/QuotationTable.vue";
import OrderTable from "../../components/crm/OrderTable.vue";
import InteractionTimeline from "../../components/crm/InteractionTimeline.vue";

const route = useRoute();
const customerId = parseInt(route.params.id as string);

const customer = ref<Customer | null>(null);
const customerQuotations = ref<Quotation[]>([]);
const customerOrders = ref<Order[]>([]);
const customerInteractions = ref<Interaction[]>([]);
const notes = ref<string>("");
const activeTab = ref<string>("Quotations");
const tabs = ["Quotations", "Orders", "Interactions", "Notes"];

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
    customer.value = await crmServiceInstance.getCustomerById(customerId);
    customerQuotations.value = customer.value
      ? await crmServiceInstance.getCustomerQuotations(customerId)
      : [];
    customerOrders.value = customer.value
      ? await crmServiceInstance.getCustomerOrders(customerId)
      : [];
    customerInteractions.value = customer.value
      ? await crmServiceInstance.getCustomerInteractions(customerId)
      : [];
  } catch (error) {
    console.error("Failed to load customer details:", error);
  }
};

onMounted(() => {
  loadCustomerDetails();
});
</script>
