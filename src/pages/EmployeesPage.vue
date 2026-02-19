<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Employees</h1>
          <p class="text-gray-600 mt-1">Manage and view all your organization employees</p>
        </div>
        <button
          @click="openCreateModal"
          class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          New Employee
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Employees</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ pagination.total }}</p>
          </div>
        </Card>
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Active Employees</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ activeEmployeesCount }}</p>
          </div>
        </Card>
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Departments</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ uniqueDepartmentsCount }}</p>
          </div>
        </Card>
      </div>

      <!-- Employee List -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <Spinner />
        </div>

        <!-- Table -->
        <div v-else>
          <EmployeeTable :employees="employees" @edit="handleEdit" @delete="handleDelete" />

          <!-- Pagination -->
          <ResponsivePagination
            v-if="pagination.total > 0"
            :current-page="pagination.current_page"
            :last-page="pagination.last_page"
            :from="pagination.from"
            :to="pagination.to"
            :total="pagination.total"
            :links="pagination.links"
            @page-change="loadData"
          />
        </div>
      </div>

      <!-- Create Modal -->
      <CreateEmployeeModal
        :is-open="isModalOpen"
        :loading="isSubmitting"
        :editing-employee="selectedEmployee"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeModal"
        @submit="handleSave"
      />

      <!-- Mobile Floating Action -->
      <MobileActions
        :primary-action="{
          label: 'New Employee',
          icon: Plus,
          onClick: openCreateModal,
        }"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import AppLayout from "../layouts/AppLayout.vue";
import Card from "../components/common/Card.vue";
import Spinner from "../components/common/Spinner.vue";
import EmployeeTable from "../components/hrm/EmployeeTable.vue";
import CreateEmployeeModal from "../components/hrm/CreateEmployeeModal.vue";
import MobileActions from "../components/common/MobileActions.vue";
import ResponsivePagination from "../components/common/ResponsivePagination.vue";
import { Plus } from "lucide-vue-next";
import { employeeRepository } from "../repositories/hrm/employee.repository";
import type { Employee, CreateEmployeeRequest } from "../services/hrm/types/employee.types";
import type { PaginationLink } from "../services/types";

const employees = ref<Employee[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const isModalOpen = ref(false);
const selectedEmployee = ref<Employee | null>(null);

const pagination = ref({
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  links: [] as PaginationLink[],
  last_page: 1,
  per_page: 15,
  prev_page_url: null as string | null,
  next_page_url: null as string | null,
  path: "",
  first_page_url: "",
  last_page_url: "",
});

const submitErrors = ref<Record<string, string[]> | null>(null);
const submitErrorMessage = ref<string | null>(null);

// Computed properties
const activeEmployeesCount = computed(() => {
  return employees.value.filter((emp) => emp.status === "active").length;
});

const uniqueDepartmentsCount = computed(() => {
  const departments = new Set(employees.value.map((emp) => emp.department?.id).filter(Boolean));
  return departments.size;
});

const loadData = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await employeeRepository.getEmployees(page);

    employees.value = response.data.data;
    pagination.value = {
      current_page: response.data.current_page,
      from: response.data.from,
      to: response.data.to,
      total: response.data.total,
      links: response.data.links,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      prev_page_url: response.data.prev_page_url,
      next_page_url: response.data.next_page_url,
      path: response.data.path,
      first_page_url: response.data.first_page_url,
      last_page_url: response.data.last_page_url,
    };
  } catch (error) {
    console.error("Failed to load employees:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to load employees. Please try again later.",
      icon: "error",
      confirmButtonColor: "#4f46e5",
    });
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedEmployee.value = null;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  isModalOpen.value = true;
};

const handleEdit = (employee: Employee) => {
  selectedEmployee.value = employee;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedEmployee.value = null;
};

const handleSave = async (data: CreateEmployeeRequest) => {
  isSubmitting.value = true;
  submitErrors.value = null;
  submitErrorMessage.value = null;

  try {
    await employeeRepository.createEmployee(data);
    await Swal.fire({
      title: "Success!",
      text: "Employee created successfully",
      icon: "success",
      confirmButtonColor: "#10b981",
    });
    closeModal();
    loadData(pagination.value.current_page);
  } catch (error: any) {
    console.error("Failed to save employee:", error);
    if (error.response?.status === 422) {
      submitErrors.value = error.response.data.errors;
      submitErrorMessage.value = "Please correct the errors below.";
    } else {
      submitErrorMessage.value =
        error.response?.data?.message || "Failed to save employee. Please try again.";
      Swal.fire({
        title: "Error!",
        text: submitErrorMessage.value || "Failed to save employee",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (uuid: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      // Note: Since there's no delete endpoint specified, we'll show a message
      await Swal.fire({
        title: "Info",
        text: "Delete functionality not implemented in the API yet.",
        icon: "info",
        confirmButtonColor: "#4f46e5",
      });
    } catch (error: any) {
      console.error("Failed to delete employee:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete employee",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  }
};

onMounted(() => {
  loadData();
});
</script>
