<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden"
  >
    <!-- Header / User Profile -->
    <div class="absolute top-8 right-8 flex items-center gap-4 text-white z-10">
      <div class="text-right hidden sm:block">
        <p class="font-semibold">{{ authStore.user?.name }}</p>
        <p class="text-xs text-gray-400">{{ authStore.user?.email }}</p>
        <!-- Role badges -->
        <div class="flex justify-end gap-1 mt-1 flex-wrap">
          <span
            v-for="role in authStore.roles"
            :key="role.slug"
            class="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-gray-300 font-medium"
          >
            {{ role.name }}
          </span>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 group"
        title="Logout"
      >
        <svg class="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>

    <!-- Title -->
    <div class="mb-10 text-center animate-fade-in">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
        Mini<span class="text-primary-400">ERP</span>
      </h1>
      <p class="text-gray-400 text-lg">Select a module to get started</p>

      <!-- Warning: no roles assigned -->
      <p
        v-if="authStore.isAuthenticated && authStore.roles.length === 0"
        class="mt-3 text-amber-400 text-sm bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-2 inline-block"
      >
        ⚠️ No role assigned — contact your administrator
      </p>
    </div>

    <!-- Carousel Container -->
    <div class="relative w-full max-w-2xl animate-fade-in">

      <!-- Prev Button -->
      <button
        v-if="currentPage > 0"
        @click="prevPage"
        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 h-11 w-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 backdrop-blur-sm shadow-xl"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Slides wrapper -->
      <div
        class="overflow-hidden rounded-3xl"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentPage * 100}%)` }"
        >
          <!-- Each slide = 4 apps (2x2) -->
          <div
            v-for="(slide, sIdx) in slides"
            :key="sIdx"
            class="min-w-full grid grid-cols-3 gap-6 sm:gap-8 px-2 py-4"
          >
            <RouterLink
              v-for="app in slide"
              :key="app.path"
              :to="app.path"
              class="group flex flex-col items-center gap-4 transition-all hover:-translate-y-2"
            >
              <div
                :class="app.color"
                class="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl shadow-2xl flex items-center justify-center text-white relative overflow-hidden transition-all group-hover:shadow-primary-500/30 group-hover:scale-105 active:scale-95"
              >
                <!-- Glassmorphism overlay -->
                <div class="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                <!-- App Icon -->
                <component :is="ICON_MAP[app.iconKey]" class="h-11 w-11 sm:h-13 sm:w-13 drop-shadow-lg z-10" />
                <!-- Shine sweep -->
                <div
                  class="absolute -inset-full bg-gradient-to-tr from-white/0 via-white/15 to-white/0 rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                />
              </div>
              <span class="text-gray-300 font-medium group-hover:text-white transition-colors text-sm sm:text-base text-center leading-tight">
                {{ app.name }}
              </span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <button
        v-if="currentPage < slides.length - 1"
        @click="nextPage"
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 h-11 w-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 backdrop-blur-sm shadow-xl"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Dot Indicators -->
    <div class="flex gap-2 mt-8" v-if="slides.length > 1">
      <button
        v-for="(_, idx) in slides"
        :key="idx"
        @click="currentPage = idx"
        class="rounded-full transition-all duration-300"
        :class="idx === currentPage
          ? 'bg-primary-400 w-6 h-2.5'
          : 'bg-white/25 hover:bg-white/40 w-2.5 h-2.5'"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="accessibleApps.length === 0"
      class="text-center text-gray-500 mt-10 bg-white/5 border border-white/10 rounded-2xl p-10 max-w-sm"
    >
      <ShieldAlert class="h-12 w-12 mx-auto mb-3 text-gray-600" />
      <p class="text-lg font-semibold text-gray-400">No modules available</p>
      <p class="text-sm text-gray-600 mt-1">
        Your account has no permissions assigned. Please contact your administrator.
      </p>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-8 left-0 w-full text-center text-gray-500 text-xs sm:text-sm">
      &copy; 2026 MiniERP Platform &bull; v1.2.0
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { MODULE_LIST } from '@/config/role-access.config'
import {
  LayoutDashboard,
  Users,
  Zap,
  Banknote,
  ShoppingCart,
  LayoutGrid,
  Package,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ClipboardList,
  FileText,
} from 'lucide-vue-next'

// Map iconKey string → actual component (avoids dynamic import issues)
const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Users,
  Zap,
  Banknote,
  ShoppingCart,
  LayoutGrid,
  Package,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ClipboardList,
  FileText,
}

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.fetchMyRoles()
})

/**
 * Filter MODULE_LIST using authStore.accessibleModules.
 * accessibleModules is a Set computed from permission.module fields in the DB.
 * No role slug is hardcoded here — super admin controls this entirely via RBAC UI.
 */
const accessibleApps = computed(() =>
  MODULE_LIST.filter((app) => authStore.accessibleModules.has(app.key))
)

// ── Carousel logic ──────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6
const currentPage = ref(0)

/** Split accessibleApps into chunks of ITEMS_PER_PAGE */
const slides = computed(() => {
  const apps = accessibleApps.value
  const pages = []
  for (let i = 0; i < apps.length; i += ITEMS_PER_PAGE) {
    pages.push(apps.slice(i, i + ITEMS_PER_PAGE))
  }
  return pages.length ? pages : [[]] // ensure at least one slide for empty state
})

function prevPage() {
  if (currentPage.value > 0) currentPage.value--
}

function nextPage() {
  if (currentPage.value < slides.value.length - 1) currentPage.value++
}

// ── Touch/swipe support ─────────────────────────────────────────────────────
let touchStartX = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (dx < -50) nextPage()
  else if (dx > 50) prevPage()
}

// ── Logout ──────────────────────────────────────────────────────────────────
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
