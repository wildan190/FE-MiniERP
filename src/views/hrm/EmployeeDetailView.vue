<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <RouterLink
            to="/hrm/employees"
            class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors mb-2"
          >
            <ArrowLeft class="h-5 w-5" />
            Back to Employees
          </RouterLink>
          <h1 class="text-3xl font-bold text-gray-900">Employee Details</h1>
          <p class="text-gray-600 mt-1">View detailed information about this employee</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="openEditModal"
            class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
          >
            <Edit class="h-5 w-5" />
            Edit Employee
          </button>
        </div>
      </div>

      <!-- Edit Modal -->
      <CreateEmployeeModal
        :is-open="isEditModalOpen"
        :loading="isUpdating"
        :editing-employee="employee"
        :errors="updateErrors"
        :error-message="updateErrorMessage"
        @close="closeEditModal"
        @submit="handleUpdateEmployee"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <Spinner />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>

      <!-- Employee Details -->
      <div v-else-if="employee" class="space-y-6">
        <!-- Basic Information & Employment Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Basic Information Card -->
          <div class="lg:col-span-2">
            <Card>
              <div class="flex items-start gap-6">
                <div
                  class="h-20 w-20 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl"
                >
                  {{ getInitials(employee) }}
                </div>
                <div class="flex-1">
                  <h2 class="text-2xl font-bold text-gray-900">{{ getFullName(employee) }}</h2>
                  <p class="text-gray-600">{{ employee.designation?.name || "No designation" }}</p>
                  <p class="text-gray-600">{{ employee.department?.name || "No department" }}</p>
                  <div class="flex items-center gap-4 mt-3">
                    <span
                      :class="getStatusClass(employee.status)"
                      class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                    >
                      {{ employee.status || "N/A" }}
                    </span>
                    <span class="text-sm text-gray-600">
                      Code: {{ employee.emp_code || "N/A" }}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- Quick Stats Card -->
          <div>
            <Card>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Joining Date</span>
                  <span class="text-sm font-medium">
                    {{ employee.joining_date ? formatDate(employee.joining_date) : "N/A" }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Basic Salary</span>
                  <span class="text-sm font-medium">
                    {{ employee.basic_salary ? `$${employee.basic_salary}` : "N/A" }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Created</span>
                  <span class="text-sm font-medium">
                    {{ formatDate(employee.created_at) }}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <!-- Personal & Employment Information -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <Card>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">First Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.first_name || "N/A" }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Last Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.last_name || "N/A" }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">NIK</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.nik || "N/A" }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ employee.date_of_birth ? formatDate(employee.date_of_birth) : "N/A" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Gender</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{
                    employee.gender
                      ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)
                      : "N/A"
                  }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Marital Status</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{
                    employee.marital_status
                      ? employee.marital_status.charAt(0).toUpperCase() +
                        employee.marital_status.slice(1)
                      : "N/A"
                  }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Religion</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.religion || "N/A" }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Place of Birth</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.place_of_birth || "N/A" }}</p>
              </div>
            </div>
          </Card>

          <!-- Employment Information -->
          <Card>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Department</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.department?.name || "N/A" }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Designation</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.designation?.name || "N/A" }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Joining Date</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ employee.joining_date ? formatDate(employee.joining_date) : "N/A" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Employee Code</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.emp_code || "N/A" }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Basic Salary</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ employee.basic_salary ? `$${employee.basic_salary}` : "N/A" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <span
                  :class="getStatusClass(employee.status)"
                  class="inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1"
                >
                  {{ employee.status || "N/A" }}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <!-- Contact Information & User Account -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Contact Information -->
          <Card>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.phone || "N/A" }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Address</label>
                <p class="mt-1 text-sm text-gray-900 break-words">
                  {{ employee.address || "N/A" }}
                </p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Emergency Contact Name</label
                  >
                  <p class="mt-1 text-sm text-gray-900">
                    {{ employee.emergency_contact_name || "N/A" }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Emergency Contact Phone</label
                  >
                  <p class="mt-1 text-sm text-gray-900">
                    {{ employee.emergency_contact_phone || "N/A" }}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <!-- User Account Information -->
          <Card v-if="employee.user">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">User Account Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ employee.user.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-sm text-gray-900 break-all">{{ employee.user.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email Verified</label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ employee.user.email_verified_at ? "Yes" : "No" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Account Created</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(employee.user.created_at) }}</p>
              </div>
            </div>
          </Card>
        </div>

        <!-- Record Information (Compact) -->
        <Card>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Record Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Created At</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(employee.created_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Updated At</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(employee.updated_at) }}</p>
            </div>
            <div v-if="employee.deleted_at">
              <label class="block text-sm font-medium text-gray-700">Deleted At</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(employee.deleted_at) }}</p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Mobile Floating Action -->
      <MobileActions
        :primary-action="{
          label: 'Edit Employee',
          icon: Edit,
          onClick: openEditModal,
        }"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { ArrowLeft, Edit } from "lucide-vue-next";
import Swal from "sweetalert2";
import AppLayout from "../../layouts/AppLayout.vue";
import Card from "../../components/common/Card.vue";
import Spinner from "../../components/common/Spinner.vue";
import MobileActions from "../../components/common/MobileActions.vue";
import CreateEmployeeModal from "../../components/hrm/CreateEmployeeModal.vue";
import { useEmployeeStore } from "../../stores/employee";
import type { Employee, UpdateEmployeeRequest, CreateEmployeeRequest } from "../../services/hrm/types/employee.types";

const route = useRoute();
const employeeStore = useEmployeeStore();

const employee = ref<Employee | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Edit modal state
const isEditModalOpen = ref(false);
const isUpdating = ref(false);
const updateErrors = ref<Record<string, string[]> | null>(null);
const updateErrorMessage = ref<string | null>(null);

const getFullName = (emp: Employee) => {
  if (emp.user) {
    return emp.user.name;
  }
  return `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "N/A";
};

const getInitials = (emp: Employee) => {
  const name = getFullName(emp);
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
    month: "long",
    day: "numeric",
  });
};

const openEditModal = () => {
  updateErrors.value = null;
  updateErrorMessage.value = null;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  updateErrors.value = null;
  updateErrorMessage.value = null;
};

const handleUpdateEmployee = async (data: CreateEmployeeRequest | UpdateEmployeeRequest) => {
  if (!employee.value) return;

  isUpdating.value = true;
  updateErrors.value = null;
  updateErrorMessage.value = null;

  try {
    await employeeStore.updateEmployee(employee.value.uuid, data);
    await Swal.fire({
      title: "Success!",
      text: "Employee updated successfully",
      icon: "success",
      confirmButtonColor: "#10b981",
    });
    closeEditModal();
    // Refresh employee data
    await employeeStore.fetchEmployeeDetail(employee.value.uuid);
    employee.value = employeeStore.currentEmployee;
  } catch (error: any) {
    console.error("Failed to update employee:", error);
    if (error.response?.status === 422) {
      updateErrors.value = error.response.data.errors;
      updateErrorMessage.value = "Please correct the errors below.";
    } else {
      updateErrorMessage.value =
        error.response?.data?.message || "Failed to update employee. Please try again.";
      Swal.fire({
        title: "Error!",
        text: updateErrorMessage.value || "Failed to update employee",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  } finally {
    isUpdating.value = false;
  }
};

onMounted(async () => {
  const uuid = route.params.uuid as string;
  if (uuid) {
    await employeeStore.fetchEmployeeDetail(uuid);
    employee.value = employeeStore.currentEmployee;
    error.value = employeeStore.error;
  }
});
</script>
