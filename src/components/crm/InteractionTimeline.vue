<template>
  <Card>
    <div class="space-y-6">
      <div v-if="interactions.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No interactions</h3>
        <p class="mt-1 text-sm text-gray-600">No customer interactions recorded yet.</p>
      </div>

      <div v-else class="relative">
        <!-- Timeline line -->
        <div
          class="absolute left-3 top-2 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-secondary-600"
        ></div>

        <!-- Interactions -->
        <div
          v-for="(interaction, index) in interactions"
          :key="interaction.id"
          class="relative pl-12"
        >
          <!-- Timeline dot -->
          <div
            :class="getInteractionDotClass(interaction.type)"
            class="absolute -left-2 top-1 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center text-xs"
          >
            <component :is="getInteractionIcon(interaction.type)" class="h-3 w-3" />
          </div>

          <!-- Card with interaction details -->
          <div class="rounded-lg border border-gray-200 bg-white p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-gray-900">
                  {{ interaction.type }}
                </h4>
                <p class="mt-1 text-sm text-gray-600">{{ interaction.notes }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-medium text-gray-500">
                  {{ formatDate(interaction.created_at) }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ formatTime(interaction.created_at) }}
                </p>
              </div>
            </div>

            <!-- Contact person -->
            <div
              v-if="interaction.contacted_by"
              class="mt-3 flex items-center gap-2 text-xs text-gray-600"
            >
              <div
                class="h-6 w-6 rounded-full bg-gradient-to-br from-primary-300 to-secondary-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
              >
                {{ interaction.contacted_by.charAt(0).toUpperCase() }}
              </div>
              <span>{{ interaction.contacted_by }}</span>
            </div>

            <!-- Status badge -->
            <div v-if="interaction.status" class="mt-3">
              <span
                :class="getStatusBadgeClass(interaction.status)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
              >
                {{ interaction.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import type { Interaction } from "../../services";
import Card from "../common/Card.vue";

// Icons for different interaction types
const PhoneIcon = defineComponent({
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.437a1 1 0 01-.54 1.06l-2.341 1.39c.635 1.404 2.346 3.114 3.75 3.75l1.39-2.341a1 1 0 011.06-.54l4.437.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2.154a9 9 0 01-8.846-8.846V3z"/></svg>',
});

const EmailIcon = defineComponent({
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>',
});

const MeetingIcon = defineComponent({
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/><path fill-opacity="0.5" d="M2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z"/></svg>',
});

const NoteIcon = defineComponent({
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"/><path fill-opacity="0.5" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/></svg>',
});

interface Props {
  interactions: Interaction[];
}

defineProps<Props>();

// Get icon based on interaction type
const getInteractionIcon = (type: string) => {
  const typeMap: Record<string, any> = {
    call: PhoneIcon,
    email: EmailIcon,
    meeting: MeetingIcon,
    note: NoteIcon,
  };
  return typeMap[type?.toLowerCase()] || NoteIcon;
};

// Get dot class based on interaction type
const getInteractionDotClass = (type: string) => {
  const dotClasses: Record<string, string> = {
    call: "bg-blue-500",
    email: "bg-purple-500",
    meeting: "bg-green-500",
    note: "bg-gray-500",
  };
  return dotClasses[type?.toLowerCase()] || "bg-gray-500";
};

// Get status badge class
const getStatusBadgeClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return statusClasses[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format time helper
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
