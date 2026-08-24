<template>
  <Card>
    <!-- Search Bar -->
    <div class="px-4 pt-4 pb-2 md:px-6">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4 w-4 text-gray-400" />
        </div>
        <input
          id="employee-search"
          type="text"
          :value="searchQuery"
          @input="$emit('search', ($event.target as HTMLInputElement).value)"
          placeholder="Search by name, employee code, or email..."
          class="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white placeholder-gray-400 transition"
        />
        <button
          v-if="searchQuery"
          @click="$emit('search', '')"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/75">
            <th class="px-4 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-12">
              No.
            </th>
            <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Designation
            </th>
            <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Joining Date
            </th>
            <th class="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-48">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-gray-100">
              <td class="px-4 py-4 text-center"><Skeleton width="1.5rem" height="1rem" class="mx-auto" /></td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.75rem" />
                  <div class="space-y-2">
                    <Skeleton width="10rem" height="1rem" />
                    <Skeleton width="6rem" height="0.75rem" />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4"><Skeleton width="8rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="10rem" height="1rem" /></td>
              <td class="px-6 py-4"><Skeleton width="4rem" height="1.25rem" borderRadius="9999px" /></td>
              <td class="px-6 py-4"><Skeleton width="7rem" height="1rem" /></td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-1.5">
                  <Skeleton width="2rem" height="2rem" borderRadius="0.5rem" />
                  <Skeleton width="2rem" height="2rem" borderRadius="0.5rem" />
                  <Skeleton width="2rem" height="2rem" borderRadius="0.5rem" />
                  <Skeleton width="2rem" height="2rem" borderRadius="0.5rem" />
                </div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(employee, idx) in employees"
              :key="employee.id"
              class="hover:bg-gray-50/80 transition-colors group"
            >
              <!-- Numbering -->
              <td class="px-4 py-4 text-center whitespace-nowrap text-xs font-mono font-bold text-gray-400 group-hover:text-primary-600">
                {{ (startIndex || 1) + idx }}
              </td>

              <!-- Employee Details -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-indigo-100 flex-shrink-0"
                  >
                    {{ getInitials(employee) }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <RouterLink
                        :to="`/hrm/employees/${employee.uuid}`"
                        class="text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {{ getFullName(employee) }}
                      </RouterLink>
                      <span
                        v-if="employee.leave_requests && employee.leave_requests.length > 0"
                        class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300"
                        :title="`On Leave: ${employee.leave_requests[0]?.leave_type?.name || 'Leave'}`"
                      >
                        <CalendarOff class="h-3 w-3 text-amber-600" />
                        On Leave ({{ employee.leave_requests[0]?.leave_type?.name || 'Leave' }})
                      </span>
                    </div>
                    <p class="text-xs text-gray-400 font-mono mt-0.5">{{ employee.emp_code || "No code" }}</p>
                    <!-- Role badges -->
                    <div v-if="employee.user?.roles && employee.user.roles.length" class="flex flex-wrap gap-1 mt-1">
                      <span
                        v-for="r in employee.user.roles"
                        :key="r.uuid || r.slug"
                        class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      >
                        <ShieldCheck class="h-2.5 w-2.5" />
                        {{ r.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded-lg">
                  {{ employee.department?.name || "—" }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm font-semibold text-gray-800">{{ employee.designation?.name || "—" }}</p>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(employee.status)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full capitalize"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {{ employee.status || "N/A" }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-500">
                {{ employee.joining_date ? formatDate(employee.joining_date) : "—" }}
              </td>

              <!-- Modern Action Toolbar -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="inline-flex items-center bg-gray-50/80 border border-gray-200/80 rounded-xl p-1 gap-1 shadow-sm">
                  <!-- View Profile -->
                  <RouterLink
                    :to="`/hrm/employees/${employee.uuid}`"
                    class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title="View Profile"
                  >
                    <Eye class="h-4 w-4" />
                  </RouterLink>

                  <!-- Manage Roles (if user account exists) -->
                  <button
                    v-if="employee.user"
                    @click="$emit('manage-roles', employee)"
                    class="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                    title="Manage Roles & Permissions"
                  >
                    <ShieldCheck class="h-4 w-4" />
                  </button>

                  <!-- Edit Employee -->
                  <button
                    @click="$emit('edit', employee)"
                    class="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                    title="Edit Employee"
                  >
                    <Edit3 class="h-4 w-4" />
                  </button>

                  <!-- Salary Components -->
                  <RouterLink
                    :to="`/hrm/employees/${employee.uuid}/salary-components`"
                    class="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all"
                    title="Salary Components"
                  >
                    <Banknote class="h-4 w-4" />
                  </RouterLink>

                  <div class="h-4 w-[1px] bg-gray-200 mx-0.5"></div>

                  <!-- Delete Employee -->
                  <button
                    @click="$emit('delete', employee.uuid)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    title="Delete Employee"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="border-b border-gray-100 p-4 space-y-4">
          <div class="flex items-center gap-3">
            <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.75rem" />
            <div class="space-y-2">
              <Skeleton width="12rem" height="1rem" />
              <Skeleton width="8rem" height="0.75rem" />
            </div>
          </div>
          <div class="space-y-2">
            <Skeleton width="100%" height="0.875rem" />
            <Skeleton width="80%" height="0.875rem" />
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="(employee, idx) in employees" :key="employee.id" class="border-b border-gray-100 last:border-b-0">
          <div class="p-4 space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="text-xs font-mono font-bold text-gray-400">#{{ (startIndex || 1) + idx }}</span>
                <div
                  class="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center text-white font-bold text-xs"
                >
                  {{ getInitials(employee) }}
                </div>
                <div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <p class="text-sm font-bold text-gray-900">{{ getFullName(employee) }}</p>
                    <span
                      v-if="employee.leave_requests && employee.leave_requests.length > 0"
                      class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300"
                    >
                      <CalendarOff class="h-2.5 w-2.5 text-amber-600" />
                      On Leave
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 font-mono">{{ employee.emp_code || "No code" }}</p>
                </div>
              </div>
              <span
                :class="getStatusClass(employee.status)"
                class="inline-flex px-2 py-0.5 text-xs font-bold rounded-full capitalize"
              >
                {{ employee.status || "N/A" }}
              </span>
            </div>

            <!-- Meta details -->
            <div class="grid grid-cols-2 gap-2 text-xs bg-gray-50/80 p-3 rounded-xl border border-gray-100">
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Department</span>
                <span class="font-semibold text-gray-800">{{ employee.department?.name || "—" }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Designation</span>
                <span class="font-semibold text-gray-800">{{ employee.designation?.name || "—" }}</span>
              </div>
            </div>

            <!-- Mobile Action Grid -->
            <div class="flex items-center gap-1.5 pt-1">
              <RouterLink
                :to="`/hrm/employees/${employee.uuid}`"
                class="flex-1 py-2 rounded-xl bg-primary-50 text-primary-700 text-xs font-bold text-center hover:bg-primary-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye class="h-3.5 w-3.5" />
                View
              </RouterLink>
              <button
                v-if="employee.user"
                @click="$emit('manage-roles', employee)"
                class="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                title="Manage Roles"
              >
                <ShieldCheck class="h-4 w-4" />
              </button>
              <button
                @click="$emit('edit', employee)"
                class="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                title="Edit Employee"
              >
                <Edit3 class="h-4 w-4" />
              </button>
              <RouterLink
                :to="`/hrm/employees/${employee.uuid}/salary-components`"
                class="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                title="Salary Components"
              >
                <Banknote class="h-4 w-4" />
              </RouterLink>
              <button
                @click="$emit('delete', employee.uuid)"
                class="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Delete Employee"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && employees.length === 0" class="text-center py-12">
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
      <h3 class="text-sm font-medium text-gray-900">
        {{ searchQuery ? `No employees found for "${searchQuery}"` : 'No employees found' }}
      </h3>
      <p class="mt-1 text-sm text-gray-600">
        {{ searchQuery ? 'Try a different search term.' : 'Get started by creating a new employee.' }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { Employee } from "../../services/hrm/types/employee.types";
import Card from "../common/Card.vue";
import Skeleton from "../common/Skeleton.vue";
import { Search, X, Eye, Edit3, Banknote, Trash2, ShieldCheck, CalendarOff } from "lucide-vue-next";

interface Props {
  employees: Employee[];
  loading?: boolean;
  searchQuery?: string;
  startIndex?: number;
}

defineProps<Props>();
defineEmits<{
  (e: "edit", employee: Employee): void;
  (e: "manage-roles", employee: Employee): void;
  (e: "delete", uuid: string): void;
  (e: "search", query: string): void;
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
