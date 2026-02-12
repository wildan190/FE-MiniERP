<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>
    <Select
      :placeholder="placeholder"
      :value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      v-bind="$attrs"
    >
      <slot />
    </Select>
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import Select from "./Select.vue";

defineProps<{
  label: string;
  placeholder?: string;
  modelValue?: string;
  error?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
