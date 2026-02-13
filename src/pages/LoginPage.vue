<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary-600 text-white mb-4"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">MiniERP</h1>
        <p class="text-gray-600 mt-2">Selamat datang kembali</p>
      </div>

      <!-- Login Card -->
      <Card>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Alert -->
          <Alert
            v-if="authStore.error"
            :message="authStore.error"
            @close="authStore.clearError()"
          />

          <!-- Email Field -->
          <FormField
            label="Email"
            type="email"
            placeholder="Masukkan email Anda"
            v-model="form.email"
            required
          />

          <!-- Password Field -->
          <FormField
            label="Password"
            type="password"
            placeholder="Masukkan password Anda"
            v-model="form.password"
            required
          />

          <!-- Submit Button -->
          <Button
            variant="primary"
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full flex items-center justify-center gap-2"
          >
            <Spinner v-if="authStore.isLoading" />
            <span>{{ authStore.isLoading ? "Logging in..." : "Login" }}</span>
          </Button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-xs font-semibold text-gray-700 mb-3">Demo Credentials</p>
          <div class="space-y-2 text-xs">
            <p>
              <span class="font-medium text-gray-700">Email:</span>
              <span class="text-gray-600">wildanbelfiore@example.com</span>
            </p>
            <p>
              <span class="font-medium text-gray-700">Password:</span>
              <span class="text-gray-600">password123</span>
            </p>
          </div>
        </div>
      </Card>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-600 mt-6">© 2026 MiniERP. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Card from "@/components/common/Card.vue";
import Button from "@/components/common/Button.vue";
import FormField from "@/components/common/FormField.vue";
import Alert from "@/components/common/Alert.vue";
import Spinner from "@/components/common/Spinner.vue";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  try {
    await authStore.login(form.email, form.password);
    router.push('/')
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>
