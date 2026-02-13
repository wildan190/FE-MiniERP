<template>
  <div v-if="total > 0" class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
    <!-- Mobile View: Simple Prev/Next -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="onPageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="onPageChange(currentPage + 1)"
        :disabled="currentPage === lastPage"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Desktop View: Full Pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ from }}</span>
          to
          <span class="font-medium">{{ to }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            v-for="link in links"
            :key="link.label"
            @click="link.url ? handleLinkClick(link) : null"
            :disabled="!link.url || link.active"
            :class="[
              link.active ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
              !link.url ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer',
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold first:rounded-l-md last:rounded-r-md transition-colors'
            ]"
            v-html="link.label"
          />
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaginationLink } from "../../services/types";

interface Props {
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
  total: number;
  links: PaginationLink[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

const onPageChange = (page: number) => {
  if (page >= 1 && page <= props.lastPage) {
    emit('page-change', page);
  }
};

const handleLinkClick = (link: PaginationLink) => {
  if (link.page) {
    onPageChange(link.page);
  }
};
</script>
