<template>
  <button
    :class="[
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-outline': variant === 'outline',
      },
      {
        'opacity-50 cursor-not-allowed': disabled,
      },
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
}>();
</script>
