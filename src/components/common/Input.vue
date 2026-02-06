<template>
  <input :type="type" :placeholder="placeholder" class="input" v-bind="$attrs" />
</template>

<script setup lang="ts">
defineProps<{
  type?: string;
  placeholder?: string;
}>();
</script>
