<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-6"
  >
    <div class="max-w-md w-full text-center">
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div
          class="h-24 w-24 rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-700/20 border border-red-500/30 flex items-center justify-center shadow-2xl"
        >
          <ShieldX class="h-12 w-12 text-red-400" />
        </div>
      </div>

      <!-- Status code -->
      <p class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600 mb-2">
        403
      </p>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-white mb-3">Access Denied</h1>

      <!-- Description -->
      <p class="text-gray-400 text-sm leading-relaxed mb-2">
        You don't have permission to access this module.
      </p>
      <p class="text-gray-500 text-xs mb-8">
        Your current role:
        <span
          v-for="role in authStore.userRoles"
          :key="role"
          class="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-gray-300 text-xs font-medium capitalize"
        >
          {{ role.replace(/-/g, ' ') }}
        </span>
        <span v-if="authStore.userRoles.length === 0" class="text-amber-400 ml-1">
          No role assigned
        </span>
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <RouterLink
          to="/"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40"
        >
          <LayoutGrid class="h-4 w-4" />
          Back to Menu
        </RouterLink>
        <RouterLink
          to="/dashboard"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <LayoutDashboard class="h-4 w-4" />
          Go to Dashboard
        </RouterLink>
      </div>

      <!-- Contact info -->
      <p class="mt-8 text-xs text-gray-600">
        Need access? Contact your system administrator to update your role permissions.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ShieldX, LayoutGrid, LayoutDashboard } from 'lucide-vue-next'

const authStore = useAuthStore()
</script>
