<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Quotations</h1>
        <p class="mt-2 text-gray-600">Manage quotations and proposals for your customers.</p>
      </div>
      <button
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
        New Quotation
      </button>
    </div>

    <!-- Search and filters -->
    <Card>
      <div class="space-y-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by customer name, ID..."
              class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <select
            v-model="selectedStatus"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div class="flex gap-2 flex-wrap">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            v-if="searchQuery"
          >
            <span>Search: {{ searchQuery }}</span>
            <button class="ml-1 hover:text-blue-900" @click="searchQuery = ''">✕</button>
          </span>
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            v-if="selectedStatus"
          >
            <span>Status: {{ selectedStatus }}</span>
            <button class="ml-1 hover:text-blue-900" @click="selectedStatus = ''">✕</button>
          </span>
        </div>
      </div>
    </Card>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <div class="text-center">
          <p class="text-gray-600 text-sm">Total Quotations</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ quotations.length }}</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <p class="text-gray-600 text-sm">Total Value</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ formatCurrency(totalValue) }}</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <p class="text-gray-600 text-sm">Pending</p>
          <p class="text-3xl font-bold text-yellow-600 mt-2">{{ pendingCount }}</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <p class="text-gray-600 text-sm">Accepted</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ acceptedCount }}</p>
        </div>
      </Card>
    </div>

    <!-- Quotations Table -->
    <QuotationTable :quotations="filteredQuotations" :customer-map="customerMap" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Quotation, Customer } from "../../services";
import { crmServiceInstance } from "../../services";
import Card from "../../components/common/Card.vue";
import QuotationTable from "../../components/crm/QuotationTable.vue";

const quotations = ref<Quotation[]>([]);
const customers = ref<Customer[]>([]);
const searchQuery = ref<string>("");
const selectedStatus = ref<string>("");

const customerMap = computed(() => {
  return customers.value.reduce(
    (map, customer) => {
      map[customer.id] = {
        name: customer.name,
        email: customer.email,
      };
      return map;
    },
    {} as Record<number, { name: string; email: string }>,
  );
});

const filteredQuotations = computed(() => {
  return quotations.value.filter((quotation) => {
    const customer = customerMap.value[quotation.customer_id];
    const matchesSearch =
      !searchQuery.value ||
      (customer?.name || "").toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(quotation.customer_id).includes(searchQuery.value);

    const matchesStatus = !selectedStatus.value || quotation.status === selectedStatus.value;

    return matchesSearch && matchesStatus;
  });
});

const totalValue = computed(() => {
  return filteredQuotations.value.reduce((sum, q) => sum + parseFloat(String(q.amount)), 0);
});

const pendingCount = computed(() => {
  return filteredQuotations.value.filter((q) => q.status === "pending").length;
});

const acceptedCount = computed(() => {
  return filteredQuotations.value.filter((q) => q.status === "accepted").length;
});

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Load data
const loadData = async () => {
  try {
    quotations.value = await crmServiceInstance.getQuotations();
    customers.value = await crmServiceInstance.getCustomers();
  } catch (error) {
    console.error("Failed to load quotations:", error);
  }
};

onMounted(() => {
  loadData();
});
</script>
