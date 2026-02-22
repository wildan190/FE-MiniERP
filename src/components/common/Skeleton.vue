<template>
  <div
    :class="[
      'animate-pulse bg-gray-200',
      rounded ? 'rounded-lg' : '',
      customClass
    ]"
    :style="{
      width: width,
      height: height
    }"
  ></div>
</template>

<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  rounded?: boolean;
  customClass?: string;
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: true,
  customClass: ''
});
</script>
