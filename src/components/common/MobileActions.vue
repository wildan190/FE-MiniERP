<template>
  <div class="fixed bottom-6 right-6 z-40 md:hidden flex flex-col items-end gap-3">
    <!-- Main FAB -->
    <button
      v-if="primaryAction"
      @click="primaryAction.onClick()"
      class="h-14 w-14 rounded-full bg-primary-600 text-white shadow-xl flex items-center justify-center transition-all active:scale-90 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-600/20"
      :title="primaryAction.label"
    >
      <component 
        :is="primaryAction.icon || Plus" 
        class="h-6 w-6"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

interface Action {
  label: string;
  icon: any;
  onClick: () => void;
}

defineProps<{
  primaryAction?: Action;
}>();
</script>

<style scoped>
.actions-enter-active,
.actions-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.actions-enter-from,
.actions-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
</style>
