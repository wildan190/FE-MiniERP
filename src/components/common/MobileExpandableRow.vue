<template>
  <div class="table-mobile-card border-b border-gray-100 last:border-b-0 mb-3">
    <!-- Header Bar (Always Visible) -->
    <div
      @click="toggleExpand"
      class="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/80 transition-colors select-none"
    >
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <!-- Numbering/Index badge if provided -->
        <span v-if="index !== undefined" class="text-xs font-mono font-bold text-gray-400 flex-shrink-0">
          #{{ index }}
        </span>

        <!-- Header Icon Slot -->
        <slot name="header-icon" />

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="text-sm font-bold text-gray-900 truncate">{{ title }}</h4>
            <!-- Badge if provided -->
            <span
              v-if="badge"
              :class="badgeClass || 'bg-gray-100 text-gray-800'"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
            >
              {{ badge }}
            </span>
            <slot name="title-extra" />
          </div>
          <p v-if="subtitle" class="text-xs text-gray-500 truncate mt-0.5">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Quick Meta & Chevron Toggle -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <slot name="quick-meta" />
        <button
          type="button"
          class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          :aria-expanded="isExpanded"
          title="Toggle details"
        >
          <ChevronDown v-if="!isExpanded" class="h-4 w-4 transition-transform duration-200" />
          <ChevronUp v-else class="h-4 w-4 transition-transform duration-200 text-primary-600" />
        </button>
      </div>
    </div>

    <!-- Expanded Body Content -->
    <div v-show="isExpanded" class="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50/40 space-y-3 animate-fade-in">
      <!-- Details Grid Slot -->
      <slot name="details" />

      <!-- Action Buttons Toolbar Slot -->
      <div v-if="$slots.actions" class="pt-2 border-t border-gray-100 flex items-center gap-2 flex-wrap justify-end">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';

const props = defineProps<{
  title: string;
  subtitle?: string;
  badge?: string;
  badgeClass?: string;
  index?: number;
  defaultExpanded?: boolean;
}>();

const isExpanded = ref(props.defaultExpanded ?? false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
