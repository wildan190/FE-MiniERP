<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 print:hidden">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            class="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600 text-white"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">MiniERP</h1>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink
            to="/dashboard"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': route.path === '/dashboard' }"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            to="/crm"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': route.path === '/crm' }"
          >
            CRM
          </RouterLink>
          <RouterLink
            to="/customers"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': route.path === '/customers' }"
          >
            Customers
          </RouterLink>
          <RouterLink
            to="/leads"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': route.path === '/leads' }"
          >
            Leads
          </RouterLink>
          <RouterLink
            to="/prospects"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': route.path === '/prospects' }"
          >
            Prospects
          </RouterLink>
          <RouterLink
            to="/crm/quotations"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': route.path === '/crm/quotations' }"
          >
            Quotations
          </RouterLink>
          <RouterLink
            to="/crm/pipelines"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': route.path === '/crm/pipelines' }"
          >
            Pipelines
          </RouterLink>
        </nav>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-600">{{ authStore.user?.email }}</p>
            </div>
            <div
              class="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
          >
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 print:p-0 print:m-0 print:max-w-none">
      <Breadcrumb class="mb-6 print:hidden" />
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Breadcrumb from "@/components/common/Breadcrumb.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const showUserMenu = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>
