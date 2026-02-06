<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>
    <Input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
    />
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import Input from "./Input.vue";

defineProps<{
  label: string;
  type?: string;
  placeholder?: string;
  modelValue?: string;
  error?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
