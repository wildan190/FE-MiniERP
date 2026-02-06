<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
        <p class="mt-2 text-gray-600">Manage and organize your customer information.</p>
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
        New Customer
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
              placeholder="Search by name, email..."
              class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <select
            v-model="sortBy"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="name">Sort by Name</option>
            <option value="created_at">Sort by Date</option>
            <option value="orders">Sort by Orders</option>
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
        </div>
      </div>
    </Card>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div class="text-center">
          <p class="text-gray-600 text-sm">Total Customers</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ customers.length }}</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <p class="text-gray-600 text-sm">Total Revenue</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ formatCurrency(totalRevenue) }}</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <p class="text-gray-600 text-sm">Avg Orders/Customer</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ avgOrdersPerCustomer }}</p>
        </div>
      </Card>
    </div>

    <!-- Customers Grid -->
    <div
      v-if="filteredCustomers.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <Card
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
      >
        <router-link :to="`/crm/customers/${customer.id}`" class="block h-full">
          <div class="flex items-start gap-4">
            <div
              class="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
            >
              {{ customer.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ customer.name }}</h3>
              <p class="text-xs text-gray-600 truncate">{{ customer.email }}</p>
              <p v-if="customer.phone" class="text-xs text-gray-600 mt-1">{{ customer.phone }}</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-gray-600">Total Orders</span>
              <span class="font-semibold text-gray-900">{{
                customerStats[customer.id]?.orderCount || 0
              }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-600">Total Spent</span>
              <span class="font-semibold text-green-600">{{
                formatCurrency(customerStats[customer.id]?.revenue || 0)
              }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500">Added {{ formatDate(customer.created_at) }}</p>
          </div>
        </router-link>
      </Card>
    </div>

    <!-- Empty State -->
    <Card v-else class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 00-6-6 6 6 0 00-6 6z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No customers</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by adding your first customer.</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Customer, Order } from "../../services";
import { crmServiceInstance } from "../../services";
import Card from "../../components/common/Card.vue";

const customers = ref<Customer[]>([]);
const orders = ref<Order[]>([]);
const searchQuery = ref<string>("");
const sortBy = ref<string>("name");

const customerStats = computed(() => {
  return customers.value.reduce(
    (stats, customer) => {
      const customerOrders = orders.value.filter((order) => order.customer_id === customer.id);
      stats[customer.id] = {
        orderCount: customerOrders.length,
        revenue: customerOrders.reduce(
          (sum, order) => sum + parseFloat(String(order.total_amount)),
          0,
        ),
      };
      return stats;
    },
    {} as Record<number, { orderCount: number; revenue: number }>,
  );
});

const filteredCustomers = computed(() => {
  let filtered = customers.value.filter((customer) => {
    return (
      !searchQuery.value ||
      customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // Sort
  if (sortBy.value === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "created_at") {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortBy.value === "orders") {
    filtered.sort(
      (a, b) =>
        (customerStats.value[b.id]?.orderCount || 0) - (customerStats.value[a.id]?.orderCount || 0),
    );
  }

  return filtered;
});

const totalRevenue = computed(() => {
  return customers.value.reduce(
    (sum, customer) => sum + (customerStats.value[customer.id]?.revenue || 0),
    0,
  );
});

const avgOrdersPerCustomer = computed(() => {
  if (customers.value.length === 0) return 0;
  const totalOrders = customers.value.reduce(
    (sum, customer) => sum + (customerStats.value[customer.id]?.orderCount || 0),
    0,
  );
  return (totalOrders / customers.value.length).toFixed(1);
});

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

// Load data
const loadData = async () => {
  try {
    customers.value = await crmServiceInstance.getCustomers();
    orders.value = await crmServiceInstance.getOrders();
  } catch (error) {
    console.error("Failed to load customers:", error);
  }
};

onMounted(() => {
  loadData();
});
</script>
