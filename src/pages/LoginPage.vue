<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-gray-50 font-outfit">
    <!-- Branding Side: Visible on all devices now -->
    <div class="w-full h-64 lg:h-auto lg:w-3/5 relative overflow-hidden flex-shrink-0">
      <!-- Background Image -->
      <img 
        src="@/assets/images/login-bg.png" 
        alt="Enterprise Efficiency" 
        class="absolute inset-0 w-full h-full object-cover scale-105 animate-subtle-zoom"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-tr from-primary-900/90 via-primary-800/50 to-transparent lg:bg-gradient-to-tr lg:from-primary-900/90 lg:via-primary-800/50 lg:to-transparent bg-gradient-to-b from-primary-900/60 to-primary-900/90 lg:from-transparent"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between p-8 lg:p-12 h-full w-full">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-2xl font-bold text-white tracking-tight">MiniERP</span>
        </div>

        <div class="max-w-xl self-start mb-4 lg:mb-0">
          <h2 class="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
            Elevate Your <span class="text-primary-400">Business</span> Efficiency.
          </h2>
          <p class="hidden lg:block mt-6 text-lg text-primary-100/80 leading-relaxed font-light">
            Innovative solutions for smarter, modern, and professional enterprise management. Manage all aspects of your business in one integrated platform.
          </p>
        </div>

        <div class="hidden lg:block text-primary-200/50 text-sm">
          © 2026 MiniERP. Crafted for innovation.
        </div>
      </div>
    </div>

    <!-- Login Form Side -->
    <div class="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 sm:p-12 bg-white relative -mt-8 lg:mt-0 rounded-t-3xl lg:rounded-none z-20 shadow-2xl lg:shadow-none flex-1">
      <div class="w-full max-w-md space-y-8 animate-fade-in-up">
        <div class="text-left space-y-2">
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Login to Your Account</h1>
          <p class="text-gray-500 font-light">Please enter your login details to proceed.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <Alert
            v-if="authStore.error"
            :message="authStore.error"
            @close="authStore.clearError()"
          />

          <div class="space-y-4">
            <FormField
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              v-model="form.email"
              required
              class="group"
            />

            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              v-model="form.password"
              required
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span class="text-gray-600 group-hover:text-primary-600 transition-colors">Remember me</span>
            </label>
            <a href="#" class="font-medium text-primary-600 hover:text-primary-700 transition-colors">Forgot password?</a>
          </div>

          <Button
            variant="primary"
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-md font-semibold bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-100 active:scale-[0.98] transition-all"
          >
            <Spinner v-if="authStore.isLoading" />
            <span>{{ authStore.isLoading ? "Signing in..." : "Sign in to Dashboard" }}</span>
          </Button>
        </form>

        <!-- Demo Credentials -->
        <div class="relative py-4">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-100"></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="bg-white px-3 text-gray-400 uppercase tracking-widest font-semibold">Demo Access</span>
          </div>
        </div>

        <div class="p-4 bg-primary-50/50 rounded-2xl border border-primary-100/50 group hover:border-primary-200 transition-colors">
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Email:</span>
              <span class="font-medium text-gray-700">wildanbelfiore@example.com</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Password:</span>
              <span class="font-medium text-gray-700">password123</span>
            </div>
          </div>
        </div>

        <p class="text-center text-xs text-gray-400 pt-4 lg:pt-8">
          Need help? <a href="#" class="text-primary-600 font-medium hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes subtle-zoom {
  0% { transform: scale(1.05); }
  100% { transform: scale(1.15); }
}

@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-subtle-zoom {
  animation: subtle-zoom 20s infinite alternate ease-in-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.font-outfit {
  font-family: 'Outfit', sans-serif;
}
</style>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
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
