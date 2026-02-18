<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Departments</h1>
          <p class="text-gray-600 mt-1">Manage and view all your organization departments</p>
        </div>
        <button
          @click="openCreateModal"
          class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          New Department
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Departments</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ pagination.total }}</p>
          </div>
        </Card>
      </div>

      <!-- Department List -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <Spinner />
        </div>

        <!-- Table -->
        <div v-else>
          <DepartmentTable
            :departments="departments"
            @edit="handleEdit"
            @delete="handleDelete"
          />

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

      <!-- Create/Edit Modal -->
      <CreateDepartmentModal
        :is-open="isModalOpen"
        :loading="isSubmitting"
        :editing-department="selectedDepartment"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeModal"
        @submit="handleSave"
      />

      <!-- Mobile Floating Action -->
      <MobileActions 
        :primary-action="{
          label: 'New Department',
          icon: Plus,
          onClick: openCreateModal
        }"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Swal from 'sweetalert2';
import AppLayout from "../layouts/AppLayout.vue";
import Card from "../components/common/Card.vue";
import Spinner from "../components/common/Spinner.vue";
import DepartmentTable from "../components/hrm/DepartmentTable.vue";
import CreateDepartmentModal from "../components/hrm/CreateDepartmentModal.vue";
import MobileActions from "../components/common/MobileActions.vue";
import ResponsivePagination from "../components/common/ResponsivePagination.vue";
import { Plus } from 'lucide-vue-next';
import { departmentRepository } from "../repositories/hrm/department.repository";
import type { Department, CreateDepartmentRequest } from "../services/hrm/types/department.types";
import type { PaginationLink } from "../services/types";

const departments = ref<Department[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const isModalOpen = ref(false);
const selectedDepartment = ref<Department | null>(null);

const pagination = ref({
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  links: [] as PaginationLink[],
  last_page: 1
});

const submitErrors = ref<Record<string, string[]> | null>(null);
const submitErrorMessage = ref<string | null>(null);

const loadData = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await departmentRepository.getDepartments(page);
    
    // Check if response has paginated data or direct array
    if (response && response.data) {
      if (Array.isArray(response.data)) {
         departments.value = response.data;
         // Map pagination meta if available, otherwise fallback to basic
         const meta = response as any;
         pagination.value = {
           current_page: meta.current_page || 1,
           from: meta.from || 1,
           to: meta.to || response.data.length,
           total: meta.total || response.data.length,
           links: meta.links || [],
           last_page: meta.last_page || 1
         };
      }
    }
  } catch (error) {
    console.error("Failed to load departments:", error);
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load departments. Please try again later.',
      icon: 'error',
      confirmButtonColor: '#4f46e5'
    });
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedDepartment.value = null;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  isModalOpen.value = true;
};

const handleEdit = (dept: Department) => {
  selectedDepartment.value = dept;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDepartment.value = null;
};

const handleSave = async (data: CreateDepartmentRequest) => {
  isSubmitting.value = true;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  
  try {
    if (selectedDepartment.value) {
      await departmentRepository.updateDepartment(selectedDepartment.value.uuid, data);
      await Swal.fire({
        title: 'Success!',
        text: 'Department updated successfully',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    } else {
      await departmentRepository.createDepartment(data);
      await Swal.fire({
        title: 'Success!',
        text: 'Department created successfully',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    }
    closeModal();
    loadData(pagination.value.current_page);
  } catch (error: any) {
    console.error("Failed to save department:", error);
    if (error.response?.status === 422) {
      submitErrors.value = error.response.data.errors;
      submitErrorMessage.value = "Please correct the errors below.";
    } else {
      submitErrorMessage.value = error.response?.data?.message || "Failed to save department. Please try again.";
      Swal.fire({
        title: 'Error!',
        text: submitErrorMessage.value || 'Failed to save department',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (uuid: string) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      await departmentRepository.deleteDepartment(uuid);
      await Swal.fire({
        title: 'Deleted!',
        text: 'Department has been deleted.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
      loadData(pagination.value.current_page);
    } catch (error: any) {
      console.error("Failed to delete department:", error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete department',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  }
};

onMounted(() => {
  loadData();
});
</script>
