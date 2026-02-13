<template>
  <div 
    v-if="isVisible"
    class="fixed left-0 top-1/2 -translate-y-1/2 z-[60] pointer-events-none"
  >
    <div class="flex items-center gap-2 px-2 py-4 bg-primary-600/20 backdrop-blur-sm rounded-r-2xl border-y border-r border-white/10 animate-pulse-horizontal">
      <div class="flex flex-col items-center gap-1">
        <svg 
          class="w-6 h-6 text-primary-400 rotate-90" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-[10px] font-bold text-primary-300 uppercase tracking-widest [writing-mode:vertical-lr]">Swipe</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isVisible = ref(false);
const STORAGE_KEY = 'sidebar_gesture_count';
const MAX_HINTS = 5;

onMounted(() => {
  const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
  if (count < MAX_HINTS) {
    // Show hint with a slight delay
    setTimeout(() => {
      isVisible.value = true;
    }, 1500);

    // Hide hint after 6 seconds
    setTimeout(() => {
      isVisible.value = false;
    }, 7500);
  }
});
</script>

<style scoped>
@keyframes pulse-horizontal {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(8px); }
}

.animate-pulse-horizontal {
  animation: pulse-horizontal 2s ease-in-out infinite;
}
</style>
