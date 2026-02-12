<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-2">
      <li v-for="(breadcrumb, index) in breadcrumbs" :key="index">
        <div class="flex items-center">
          <svg
            v-if="index > 0"
            class="h-5 w-5 flex-shrink-0 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
          <RouterLink
            v-if="breadcrumb.to && index < breadcrumbs.length - 1"
            :to="breadcrumb.to"
            class="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {{ breadcrumb.label }}
          </RouterLink>
          <span
            v-else
            class="ml-4 text-sm font-medium text-gray-500"
            :class="{ 'text-gray-700 font-semibold': index === breadcrumbs.length - 1 }"
          >
            {{ breadcrumb.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export interface BreadcrumbItem {
  label: string;
  to?: string | object;
}

const route = useRoute();

const breadcrumbs = computed(() => {
  const metaBreadcrumbs = route.meta.breadcrumbs as BreadcrumbItem[] | undefined;
  // If breadcrumbs is defined as a function, execute it with route params?
  // For now, let's stick to simple array in meta first.
  return metaBreadcrumbs || [];
});
</script>
