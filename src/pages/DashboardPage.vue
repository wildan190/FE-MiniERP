<template>
  <AppLayout>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Selamat datang, {{ authStore.user?.name }}! 👋
      </h2>
      <p class="text-gray-600">
        {{ greeting }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardStore.isLoading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center gap-4">
        <Spinner />
        <p class="text-gray-600">Loading dashboard...</p>
      </div>
    </div>

    <!-- Error State -->
    <Alert
      v-if="dashboardStore.error"
      :message="dashboardStore.error"
      @close="dashboardStore.clearError()"
      class="mb-6"
    />

    <!-- User Info Card -->
    <div
      v-if="dashboardStore.dashboardData && !dashboardStore.isLoading"
      class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
    >
      <Card>
        <div class="flex items-center gap-4">
          <div
            class="h-16 w-16 rounded-lg bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-bold text-2xl"
          >
            {{ authStore.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ authStore.user?.name }}</h3>
            <p class="text-sm text-gray-600">{{ authStore.user?.email }}</p>
            <p class="text-xs text-gray-500 mt-1">
              Bergabung {{ formatDate(authStore.user?.created_at) }}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Account Status</h3>
            <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Email Verified</span>
              <span v-if="authStore.user?.email_verified_at" class="text-green-600 font-medium"
                >✓ Yes</span
              >
              <span v-else class="text-yellow-600 font-medium">⚠ No</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Last Updated</span>
              <span class="text-sm font-medium text-gray-900">{{
                formatDate(authStore.user?.updated_at)
              }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useDashboardStore } from "@/stores/dashboard";
import AppLayout from "@/layouts/AppLayout.vue";
import Card from "@/components/common/Card.vue";
import Alert from "@/components/common/Alert.vue";
import Spinner from "@/components/common/Spinner.vue";

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat pagi! Mulai hari yang produktif.";
  if (hour < 18) return "Selamat siang! Terus bekerja dengan semangat.";
  return "Selamat malam! Jangan lupa istirahat yang cukup.";
});

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(async () => {
  await dashboardStore.fetchDashboard();
});
</script>
