<template>
  <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)" class="input" v-bind="$attrs">
    <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
    <slot />
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
