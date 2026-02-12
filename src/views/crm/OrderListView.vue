<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
        <p class="mt-2 text-gray-600">Manage and track all customer orders.</p>
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
        New Order
      </button>
    </div>

    <!-- Search and filters -->
    <Card>
      <div class="space-y-4">
        <div class="flex gap-4 flex-wrap">
          <div class="flex-1 min-w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by customer name, order ID..."
              class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <select
            v-model="selectedStatus"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
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
          <p class="text-gray-600 text-sm">Total Orders</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ orders.length }}</p>
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
          <p class="text-gray-600 text-sm">Pending</p>
          <p class="text-3xl font-bold text-yellow-600 mt-2">{{ pendingCount }}</p>
        </div>
      </Card>
      <Card>
        <div class="text-center">
          <p class="text-gray-600 text-sm">Delivered</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ deliveredCount }}</p>
        </div>
      </Card>
    </div>

    <!-- Orders Table -->
    <OrderTable :orders="filteredOrders" :customer-map="customerMap" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Order, Customer } from "../../services";
import { crmServiceInstance } from "../../services";
import Card from "../../components/common/Card.vue";
import OrderTable from "../../components/crm/OrderTable.vue";

const orders = ref<Order[]>([]);
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

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const customer = customerMap.value[order.customer_id];
    const matchesSearch =
      !searchQuery.value ||
      (customer?.name || "").toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(order.id).includes(searchQuery.value);

    const matchesStatus = !selectedStatus.value || order.status === selectedStatus.value;

    return matchesSearch && matchesStatus;
  });
});

const totalRevenue = computed(() => {
  return filteredOrders.value.reduce(
    (sum, order) => sum + parseFloat(String(order.total_amount)),
    0,
  );
});

const pendingCount = computed(() => {
  return filteredOrders.value.filter((order) => order.status === "pending").length;
});

const deliveredCount = computed(() => {
  return filteredOrders.value.filter((order) => order.status === "delivered").length;
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
    orders.value = await crmServiceInstance.getOrders();
    customers.value = (await crmServiceInstance.getCustomers()).data;
  } catch (error) {
    console.error("Failed to load orders:", error);
  }
};

onMounted(() => {
  loadData();
});
</script>
