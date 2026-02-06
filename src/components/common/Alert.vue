<template>
  <div
    class="flex items-center justify-between p-4 bg-blue-50 border-l-4 border-primary-500 rounded"
  >
    <div class="flex items-center gap-3">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <p class="text-sm text-primary-700">{{ message }}</p>
    </div>
    <button
      @click="$emit('close')"
      class="text-primary-400 hover:text-primary-600 transition-colors"
    >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();

defineEmits<{
  close: [];
}>();
</script>
