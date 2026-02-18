<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 flex flex-col items-center justify-center p-6 sm:p-12">
    <!-- Header/User Profile -->
    <div class="absolute top-8 right-8 flex items-center gap-4 text-white">
      <div class="text-right hidden sm:block">
        <p class="font-semibold">{{ authStore.user?.name }}</p>
        <p class="text-xs text-gray-400">{{ authStore.user?.email }}</p>
      </div>
      <button 
        @click="handleLogout"
        class="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 group"
        title="Logout"
      >
        <svg class="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>

    <!-- App Grid -->
    <div class="max-w-4xl w-full">
      <div class="mb-12 text-center animate-fade-in">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Mini<span class="text-primary-400">ERP</span>
        </h1>
        <p class="text-gray-400 text-lg">Select a module to get started</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-10">
        <RouterLink 
          v-for="app in apps" 
          :key="app.name"
          :to="app.path"
          class="group flex flex-col items-center gap-4 transition-all hover:-translate-y-2"
        >
          <div 
            :class="app.color"
            class="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl shadow-2xl flex items-center justify-center text-white relative overflow-hidden transition-all group-hover:shadow-primary-500/20 group-hover:scale-105 active:scale-95"
          >
            <!-- Glassmorphism overlay -->
            <div class="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
            
            <!-- App Icon -->
            <component :is="app.icon" class="h-10 w-10 sm:h-12 sm:w-12 drop-shadow-lg z-10" />
            
            <!-- Subtle gradient shine -->
            <div class="absolute -inset-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </div>
          <span class="text-gray-300 font-medium group-hover:text-white transition-colors text-sm sm:text-base">
            {{ app.name }}
          </span>
        </RouterLink>
      </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-8 text-gray-500 text-xs sm:text-sm">
      &copy; 2026 MiniERP Platform &bull; v1.2.0
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  Settings,
  LogOut,
  Zap
} from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

const apps = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, color: "bg-gradient-to-br from-blue-500 to-indigo-700" },
  { name: "CRM", path: "/crm", icon: Users, color: "bg-gradient-to-br from-emerald-500 to-teal-700" },
  { name: "HRM", path: "/hrm/departments", icon: Zap, color: "bg-gradient-to-br from-purple-500 to-indigo-700" },
  { name: "Inventory", path: "#", icon: Box, color: "bg-gradient-to-br from-orange-500 to-red-700 opacity-50 cursor-not-allowed" },
  { name: "Settings", path: "#", icon: Settings, color: "bg-gradient-to-br from-slate-500 to-gray-700 opacity-50 cursor-not-allowed" },
];

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
