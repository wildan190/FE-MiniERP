<template>
  <div
    class="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden flex flex-col"
    @touchstart.passive="handleTouchStart"
    @touchmove.passive="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Mobile Sidebar Backdrop Overlay -->
    <Teleport to="body">
      <Transition name="overlay">
        <div
          v-if="isMobileSidebarOpen"
          class="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 md:hidden"
          @click="isMobileSidebarOpen = false"
        ></div>
      </Transition>

      <!-- Mobile Sidebar Drawer -->
      <Transition name="sidebar">
        <aside
          v-if="isMobileSidebarOpen"
          class="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 md:hidden flex flex-col shadow-xl"
        >
          <!-- Sidebar Header -->
          <div class="h-16 px-5 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Zap class="h-5 w-5 fill-current" />
              </div>
              <span class="text-lg font-bold text-gray-900 tracking-tight">MiniERP</span>
            </div>
            <button
              @click="isMobileSidebarOpen = false"
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              title="Close Navigation"
            >
              <X class="h-5 w-5" />
            </button>
          </div>



          <!-- Sidebar Nav Links -->
          <nav class="flex-1 overflow-y-auto p-4 space-y-6">
            <!-- Standalone Items -->
            <div v-if="moduleConfig?.items?.length" class="space-y-1">
              <RouterLink
                v-for="item in moduleConfig.items"
                :key="item.to"
                :to="item.to"
                @click="isMobileSidebarOpen = false"
                class="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                :class="
                  isItemActive(item.to)
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                "
              >
                <div class="flex items-center gap-3">
                  <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                  <span>{{ item.label }}</span>
                </div>
              </RouterLink>
            </div>

            <!-- Grouped Items -->
            <div
              v-for="(groupItems, groupName) in moduleConfig?.groups"
              :key="groupName"
              class="space-y-1"
            >
              <div class="px-3 pt-2 pb-1">
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {{ groupName.replace('-', ' ') }}
                </p>
              </div>
              <RouterLink
                v-for="item in groupItems"
                :key="item.to"
                :to="item.to"
                @click="isMobileSidebarOpen = false"
                class="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                :class="
                  route.path.startsWith(item.to)
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                "
              >
                <div class="flex items-center gap-3">
                  <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                  <span>{{ item.label }}</span>
                </div>
              </RouterLink>
            </div>
          </nav>

          <!-- Sidebar Footer -->
          <div class="p-4 border-t border-gray-200 bg-gray-50/50 flex-shrink-0 space-y-3">
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ authStore.user?.name || 'User' }}
                </p>
                <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email || '-' }}</p>
                <!-- Role badge -->
                <span class="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                  <ShieldCheck class="h-3 w-3" />
                  {{ primaryRoleLabel }}
                </span>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white border border-gray-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut class="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </Transition>
    </Teleport>

    <!-- Desktop Desktop Fixed Left Sidebar -->
    <aside class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 bg-white border-r border-gray-200">
      <!-- Sidebar Header -->
      <div class="h-16 px-6 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <div class="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <Zap class="h-5 w-5 fill-current" />
        </div>
        <span class="text-xl font-bold text-gray-900 tracking-tight">MiniERP</span>
      </div>



      <!-- Sidebar Nav Links -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-6">
        <!-- Standalone Items -->
        <div v-if="moduleConfig?.items?.length" class="space-y-1">
          <RouterLink
            v-for="item in moduleConfig.items"
            :key="item.to"
            :to="item.to"
            class="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="
              isItemActive(item.to)
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            "
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span>{{ item.label }}</span>
            </div>
          </RouterLink>
        </div>

        <!-- Grouped Items -->
        <div
          v-for="(groupItems, groupName) in moduleConfig?.groups"
          :key="groupName"
          class="space-y-1"
        >
          <div class="px-3 pt-2 pb-1">
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {{ groupName.replace('-', ' ') }}
            </p>
          </div>
          <RouterLink
            v-for="item in groupItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="
              route.path.startsWith(item.to)
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            "
          >
            <div class="flex items-center gap-3">
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span>{{ item.label }}</span>
            </div>
          </RouterLink>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-200 bg-gray-50/50 flex-shrink-0 space-y-3">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">
              {{ authStore.user?.name || 'User' }}
            </p>
            <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email || '-' }}</p>
            <!-- Role badge -->
            <span class="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
              <ShieldCheck class="h-3 w-3" />
              {{ primaryRoleLabel }}
            </span>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white border border-gray-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
        >
          <LogOut class="h-4 w-4" />
          <span>Logout Account</span>
        </button>
      </div>
    </aside>

    <!-- Main Workspace (Shifted Right on Desktop) -->
    <div class="flex-1 md:pl-64 pt-16 flex flex-col min-w-0">
      <!-- Top Bar Header (Fixed Position) -->
      <header class="fixed top-0 left-0 right-0 md:left-64 bg-white border-b border-gray-200 z-30 print:hidden h-16 flex items-center px-4 md:px-6 justify-between">
        <div class="flex items-center gap-3">
          <!-- Mobile Hamburger Toggle -->
          <button
            class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            @click="isMobileSidebarOpen = true"
            title="Open Menu"
          >
            <Menu class="h-6 w-6" />
          </button>

          <!-- Mobile App Title -->
          <div class="flex items-center gap-2 md:hidden">
            <div class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Zap class="h-4 w-4 fill-current" />
            </div>
            <span class="text-base font-bold text-gray-900">MiniERP</span>
          </div>

          <!-- Desktop Current Module Title Indicator -->
          <div class="hidden md:flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              {{ activeModule }}
            </span>
          </div>
        </div>

        <!-- Right Side Header Controls -->
        <div class="flex items-center gap-3">
          <!-- Main Menu Grid Jump -->
          <RouterLink
            to="/"
            class="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Main Dashboard Launcher"
          >
            <LayoutGrid class="h-5 w-5" />
          </RouterLink>

          <!-- User Menu Dropdown -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="hidden sm:block text-right">
                <p class="text-xs font-bold text-gray-900">{{ authStore.user?.name || 'User' }}</p>
                <p class="text-[10px] text-gray-500 uppercase font-semibold">{{ activeModule }}</p>
              </div>
              <div class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <div class="px-4 py-2 border-b border-gray-100 sm:hidden">
                <p class="text-xs font-bold text-gray-900">{{ authStore.user?.name }}</p>
                <p class="text-[10px] text-gray-500">{{ authStore.user?.email }}</p>
              </div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut class="h-4 w-4" />
                <span>Logout Account</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Page Content -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:p-8 print:p-0 print:m-0 print:max-w-none">
        <Breadcrumb class="mb-6 print:hidden" />
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import { NAVIGATION_CONFIG } from "@/config/navigation.config";
import { getModuleByPath } from "@/config/role-access.config";
import {
  LayoutGrid,
  LogOut,
  Zap,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const showUserMenu = ref(false);

const activeModule = computed(() => getModuleByPath(route.path));
const moduleConfig = computed(() => {
  const base = NAVIGATION_CONFIG[activeModule.value] || NAVIGATION_CONFIG.default;
  if (!base) return { items: [] };

  const isHr = authStore.hasHrAccess;

  const checkItemAccess = (item: any) => {
    if (item.requiresHr && !isHr) return false;
    if (item.permission) {
      if (Array.isArray(item.permission)) {
        return item.permission.some((p: string) => authStore.hasPermission(p));
      }
      return authStore.hasPermission(item.permission);
    }
    return true;
  };

  // Filter standalone items
  const filteredItems = (base.items || []).filter(checkItemAccess);

  // Filter grouped items
  let filteredGroups: Record<string, any[]> | undefined = undefined;
  if (base.groups) {
    filteredGroups = {};
    for (const [groupKey, items] of Object.entries(base.groups)) {
      const validItems = items.filter(checkItemAccess);
      if (validItems.length > 0) {
        filteredGroups[groupKey] = validItems;
      }
    }
  }

  return {
    items: filteredItems,
    groups: filteredGroups,
  };
});

/** Use primaryRoleLabel from auth store (computed from actual role names) */
const primaryRoleLabel = computed(() => authStore.primaryRoleLabel)

const moduleList = [
  { id: 'attendance', label: '⏱️ Attendance', path: '/hrm/attendances' },
  { id: 'leaves', label: '📋 Leaves', path: '/hrm/leave-requests' },
  { id: 'reimbursement', label: '💳 Reimbursement', path: '/hrm/reimbursements' },
  { id: 'payslips', label: '💵 Payslips', path: '/hrm/payslips' },
  { id: 'resignations', label: '📄 Resignation', path: '/hrm/resignations' },
  { id: 'hrm', label: '👥 HR Management', path: '/hrm/employees' },
  { id: 'crm', label: '📊 CRM', path: '/crm' },
  { id: 'finance', label: '💰 Finance', path: '/finance' },
  { id: 'purchasing', label: '🛒 Purchasing', path: '/purchasing' },
  { id: 'inventory', label: '📦 Inventory', path: '/inventory' },
  { id: 'system', label: '⚙️ System', path: '/system/roles' },
];

/**
 * Module switcher only shows modules the user can access.
 * Uses authStore.canAccessModule() which is data-driven — no hardcode.
 */
const accessibleModuleList = computed(() =>
  moduleList.filter((m) => authStore.canAccessModule(m.id))
);

const switchModule = (moduleId: string) => {
  const target = moduleList.find(m => m.id === moduleId);
  if (target) {
    router.push(target.path);
    isMobileSidebarOpen.value = false;
  }
};

const isItemActive = (path: string) => {
  if (path === '/finance' || path === '/crm' || path === '/dashboard' || path === '/purchasing' || path === '/project') {
    return route.path === path;
  }
  return route.path.startsWith(path);
};

const closeUserMenu = (e: MouseEvent) => {
  if (!(e.target as Element).closest('.relative')) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", closeUserMenu);
});

onUnmounted(() => {
  window.removeEventListener("click", closeUserMenu);
});

// Mobile Sidebar Logic
const isMobileSidebarOpen = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
const minSwipeDistance = 50;

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

  if (distance > minSwipeDistance && touchStartX.value < 100) {
    isMobileSidebarOpen.value = true;
  }

  if (distance < -minSwipeDistance && isMobileSidebarOpen.value) {
    isMobileSidebarOpen.value = false;
  }

  touchStartX.value = 0;
  touchEndX.value = 0;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
