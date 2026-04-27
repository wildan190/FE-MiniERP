<template>
  <div
    class="min-h-screen bg-gray-50 overflow-x-hidden"
    @touchstart.passive="handleTouchStart"
    @touchmove.passive="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Gesture Hint (Mobile Only) -->
    <GestureHint class="md:hidden" />

    <!-- Mobile Sidebar -->
    <Teleport to="body">
      <Transition name="overlay">
        <div
          v-if="isMobileSidebarOpen"
          class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[70] md:hidden"
          @click="isMobileSidebarOpen = false"
        ></div>
      </Transition>

      <Transition name="sidebar">
        <aside
          v-if="isMobileSidebarOpen"
          class="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-[80] md:hidden flex flex-col"
        >
          <!-- Sidebar Header -->
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                class="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white"
              >
                <Zap class="h-5 w-5 fill-current" />
              </div>
              <span class="text-xl font-bold text-gray-900">MiniERP</span>
            </div>
            <button
              @click="isMobileSidebarOpen = false"
              class="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <ChevronRight class="h-6 w-6 rotate-180" />
            </button>
          </div>

          <!-- Sidebar Nav -->
          <nav class="flex-1 overflow-y-auto p-4 space-y-2">
            <div class="px-2 py-4">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Navigation
              </p>
              <div class="space-y-1">
                <template v-if="activeModule === 'crm'">
                  <RouterLink
                    to="/crm"
                    @click="isMobileSidebarOpen = false"
                    class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    :class="
                      route.path === '/crm'
                        ? 'bg-primary-50 text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    "
                  >
                    <div class="flex items-center gap-3">
                      <LayoutDashboard class="h-5 w-5" />
                      <span>CRM Dashboard</span>
                    </div>
                  </RouterLink>

                  <RouterLink
                    to="/customers"
                    @click="isMobileSidebarOpen = false"
                    class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    :class="
                      route.path.startsWith('/customers')
                        ? 'bg-primary-50 text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    "
                  >
                    <div class="flex items-center gap-3">
                      <Users class="h-5 w-5" />
                      <span>Customers</span>
                    </div>
                  </RouterLink>

                  <RouterLink
                    to="/leads"
                    @click="isMobileSidebarOpen = false"
                    class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    :class="
                      route.path.startsWith('/leads')
                        ? 'bg-primary-50 text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    "
                  >
                    <div class="flex items-center gap-3">
                      <Users class="h-5 w-5" />
                      <span>Leads</span>
                    </div>
                  </RouterLink>

                  <RouterLink
                    to="/prospects"
                    @click="isMobileSidebarOpen = false"
                    class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    :class="
                      route.path.startsWith('/prospects')
                        ? 'bg-primary-50 text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    "
                  >
                    <div class="flex items-center gap-3">
                      <Users class="h-5 w-5" />
                      <span>Prospects</span>
                    </div>
                  </RouterLink>

                  <RouterLink
                    to="/crm/quotations"
                    @click="isMobileSidebarOpen = false"
                    class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    :class="
                      route.path.startsWith('/crm/quotations')
                        ? 'bg-primary-50 text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    "
                  >
                    <div class="flex items-center gap-3">
                      <Box class="h-5 w-5" />
                      <span>Quotations</span>
                    </div>
                  </RouterLink>

                  <RouterLink
                    to="/crm/pipelines"
                    @click="isMobileSidebarOpen = false"
                    class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    :class="
                      route.path.startsWith('/crm/pipelines')
                        ? 'bg-primary-50 text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    "
                  >
                    <div class="flex items-center gap-3">
                      <LayoutGrid class="h-5 w-5" />
                      <span>Pipelines</span>
                    </div>
                  </RouterLink>
                </template>

                <template v-if="activeModule === 'hrm'">
                  <div class="pt-2 pb-2">
                    <!-- Personnel Section -->
                    <div class="px-3 mb-2 mt-4 first:mt-0">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Employment</p>
                    </div>
                    
                    <RouterLink
                      to="/hrm/employees"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/employees') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <Users class="h-5 w-5" />
                        <span>Employees</span>
                      </div>
                    </RouterLink>

                    <RouterLink
                      to="/hrm/departments"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/departments') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <Zap class="h-5 w-5" />
                        <span>Departments</span>
                      </div>
                    </RouterLink>

                    <RouterLink
                      to="/hrm/designations"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/designations') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <Briefcase class="h-5 w-5" />
                        <span>Designations</span>
                      </div>
                    </RouterLink>

                    <RouterLink
                      to="/hrm/office-locations"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/office-locations') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <MapPin class="h-5 w-5" />
                        <span>Office Locations</span>
                      </div>
                    </RouterLink>

                    <!-- Tracking Section -->
                    <div class="px-3 mb-2 mt-6">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Time Tracking</p>
                    </div>

                    <RouterLink
                      to="/hrm/attendances"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/attendances') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <Clock class="h-5 w-5" />
                        <span>Attendance</span>
                      </div>
                    </RouterLink>

                    <RouterLink
                      to="/hrm/shifts"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/shifts') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <CalendarRange class="h-5 w-5" />
                        <span>Shifts</span>
                      </div>
                    </RouterLink>

                    <RouterLink
                      to="/hrm/leave-requests"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/leave-requests') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <ClipboardList class="h-5 w-5" />
                        <span>Leave Management</span>
                      </div>
                    </RouterLink>

                    <!-- Payroll Section -->
                    <div class="px-3 mb-2 mt-6">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Payroll</p>
                    </div>

                    <RouterLink
                      to="/hrm/payroll-periods"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/payroll-periods') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <Banknote class="h-5 w-5" />
                        <span>Payroll Periods</span>
                      </div>
                    </RouterLink>

                    <!-- Analytics Section -->
                    <div class="px-3 mb-2 mt-6">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Analytics</p>
                    </div>

                    <RouterLink
                      to="/hrm/reports"
                      @click="isMobileSidebarOpen = false"
                      class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      :class="route.path.startsWith('/hrm/reports') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
                    >
                      <div class="flex items-center gap-3">
                        <BarChart3 class="h-5 w-5" />
                        <span>Reports</span>
                      </div>
                    </RouterLink>
                  </div>
                </template>
              </div>
            </div>
          </nav>

          <!-- Sidebar Footer -->
          <div class="p-6 border-t border-gray-100 bg-gray-50/50">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase"
              >
                {{ authStore.user?.name?.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ authStore.user?.name }}
                </p>
                <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-red-100 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors"
            >
              <LogOut class="h-4 w-4" />
              <span>Logout Account</span>
            </button>
          </div>
        </aside>
      </Transition>
    </Teleport>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 print:hidden">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- App Drawer Button -->
          <RouterLink
            to="/"
            class="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95 group"
            title="Main Menu"
          >
            <LayoutGrid
              class="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors"
            />
          </RouterLink>

          <div class="flex items-center gap-2">
            <div
              class="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600 text-white shadow-sm"
            >
              <Zap class="h-5 w-5 fill-current" />
            </div>
            <h1 class="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">MiniERP</h1>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <!-- Render Groups (Dropdowns) -->
          <div v-for="(groupItems, groupName) in moduleConfig.groups" :key="groupName" class="relative dropdown-container">
            <button 
              @click="toggleDropdown(groupName)"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              :class="{ 'bg-primary-50 text-primary-600': isGroupActive(groupItems) }"
            >
              <span class="capitalize">{{ groupName.replace('-', ' ') }}</span>
              <ChevronDown class="h-4 w-4 transition-transform" :class="{ 'rotate-180': activeDropdown === groupName }" />
            </button>
            <div v-if="activeDropdown === groupName" class="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
              <RouterLink 
                v-for="item in groupItems"
                :key="item.to"
                :to="item.to" 
                class="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                :class="{ 'text-primary-600 font-semibold bg-primary-50': route.path.startsWith(item.to) }"
              >
                {{ item.label }}
              </RouterLink>
            </div>
          </div>

          <!-- Render Individual Items -->
          <RouterLink
            v-for="item in moduleConfig.items"
            :key="item.to"
            :to="item.to"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to)) }"
          >
            {{ item.label }}
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
              <LogOut class="h-4 w-4" />
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
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import GestureHint from "@/components/common/GestureHint.vue";
import { NAVIGATION_CONFIG, getModuleByPath } from "@/config/navigation.config";
import {
  LayoutGrid,
  LogOut,
  Zap,
  LayoutDashboard,
  Users,
  Box,
  ChevronRight,
  Briefcase,
  ClipboardList,
  BarChart3,
  MapPin,
  Clock,
  CalendarRange,
  ChevronDown,
  Banknote,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const showUserMenu = ref(false);

const activeModule = computed(() => getModuleByPath(route.path));
const moduleConfig = computed(() => NAVIGATION_CONFIG[activeModule.value] || NAVIGATION_CONFIG.default);

// Dropdown logic for desktop
const activeDropdown = ref<string | null>(null);

const toggleDropdown = (name: string) => {
  activeDropdown.value = activeDropdown.value === name ? null : name;
};

const closeDropdowns = (e: MouseEvent) => {
  if (!(e.target as Element).closest(".dropdown-container")) {
    activeDropdown.value = null;
  }
};

const isGroupActive = (items: any[]) => {
  return items.some(item => route.path.startsWith(item.to));
};

onMounted(() => {
  window.addEventListener("click", closeDropdowns);
});

onUnmounted(() => {
  window.removeEventListener("click", closeDropdowns);
});

watch(
  () => route.path,
  () => {
    activeDropdown.value = null; // Close dropdowns on navigation
  }
);

// Mobile Sidebar Logic
const isMobileSidebarOpen = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
const minSwipeDistance = 50; // Minimum distance for a swipe to be recognized

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches && e.touches[0]) {
    touchStartX.value = e.touches[0].clientX;
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches && e.touches[0]) {
    touchEndX.value = e.touches[0].clientX;
  }
};

const handleTouchEnd = () => {
  const distance = touchEndX.value - touchStartX.value;

  // Open if swiped from left to right on the left side of the screen
  if (distance > minSwipeDistance && touchStartX.value < 100) {
    openMobileSidebar();
  }

  // Close if swiped from right to left while open
  if (distance < -minSwipeDistance && isMobileSidebarOpen.value) {
    isMobileSidebarOpen.value = false;
  }

  // Reset
  touchStartX.value = 0;
  touchEndX.value = 0;
};

const openMobileSidebar = () => {
  isMobileSidebarOpen.value = true;

  // Update hint count
  const STORAGE_KEY = "sidebar_gesture_count";
  const count = parseInt(localStorage.getItem(STORAGE_KEY) || "0");
  localStorage.setItem(STORAGE_KEY, (count + 1).toString());
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
