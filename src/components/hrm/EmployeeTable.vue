<template>
  <Card>
    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Employee
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Department
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Designation
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Joining Date
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="employee in employees"
            :key="employee.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
                >
                  {{ getInitials(employee) }}
                </div>
                <div>
                  <RouterLink
                    :to="`/hrm/employees/${employee.uuid}`"
                    class="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {{ getFullName(employee) }}
                  </RouterLink>
                  <p class="text-xs text-gray-600">{{ employee.emp_code || "No code" }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-900">{{ employee.department?.name || "-" }}</p>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-900">{{ employee.designation?.name || "-" }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusClass(employee.status)"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ employee.status || "N/A" }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ employee.joining_date ? formatDate(employee.joining_date) : "-" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <RouterLink
                :to="`/hrm/employees/${employee.uuid}`"
                class="text-blue-600 hover:text-blue-900 font-medium transition-colors mr-3"
              >
                View
              </RouterLink>
              <button
                @click="$emit('edit', employee)"
                class="text-primary-600 hover:text-primary-900 font-medium transition-colors mr-3"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', employee.uuid)"
                class="text-red-600 hover:text-red-900 font-medium transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden">
      <div v-for="employee in employees" :key="employee.id" class="border-b border-gray-200">
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
              >
                {{ getInitials(employee) }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ getFullName(employee) }}</p>
                <p class="text-xs text-gray-500">{{ employee.emp_code || "No code" }}</p>
              </div>
            </div>
          </div>
          <div class="space-y-1 mb-4">
            <p class="text-sm text-gray-600">
              <span class="font-medium">Department:</span> {{ employee.department?.name || "N/A" }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Designation:</span>
              {{ employee.designation?.name || "N/A" }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Status:</span>
              <span
                :class="getStatusClass(employee.status)"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-1"
              >
                {{ employee.status || "N/A" }}
              </span>
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Joined:</span>
              {{ employee.joining_date ? formatDate(employee.joining_date) : "N/A" }}
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <RouterLink
              :to="`/hrm/employees/${employee.uuid}`"
              class="w-full text-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Details
            </RouterLink>
            <div class="flex gap-2">
              <button
                @click="$emit('edit', employee)"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', employee.uuid)"
                class="flex-1 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="employees.length === 0" class="text-center py-12">
      <div class="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      </div>
      <h3 class="text-sm font-medium text-gray-900">No employees found</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by creating a new employee.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { Employee } from "../../services/hrm/types/employee.types";
import Card from "../common/Card.vue";

interface Props {
  employees: Employee[];
}

defineProps<Props>();
defineEmits<{
  (e: "edit", employee: Employee): void;
  (e: "delete", uuid: string): void;
}>();

const getFullName = (employee: Employee) => {
  if (employee.user) {
    return employee.user.name;
  }
  return `${employee.first_name || ""} ${employee.last_name || ""}`.trim() || "N/A";
};

const getInitials = (employee: Employee) => {
  const name = getFullName(employee);
  return (
    name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2) || "NA"
  );
};

const getStatusClass = (status: string | null) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-yellow-100 text-yellow-800";
    case "terminated":
      return "bg-red-100 text-red-800";
    case "resigned":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
