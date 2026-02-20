<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Designations</h1>
          <p class="text-gray-600 mt-1">Manage and view all employee designations</p>
        </div>
        <button
          @click="openCreateModal"
          class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          New Designation
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Designations</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ pagination.total }}</p>
          </div>
        </Card>
      </div>

      <!-- Designation List -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <Spinner />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Table -->
        <div v-else>
          <DesignationTable
            :designations="designations"
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
      <CreateDesignationModal
        :is-open="isModalOpen"
        :loading="isSubmitting"
        :editing-designation="selectedDesignation"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeModal"
        @submit="handleSave"
      />

      <!-- Mobile Floating Action -->
      <MobileActions 
        :primary-action="{
          label: 'New Designation',
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
import DesignationTable from "../components/hrm/DesignationTable.vue";
import CreateDesignationModal from "../components/hrm/CreateDesignationModal.vue";
import MobileActions from "../components/common/MobileActions.vue";
import ResponsivePagination from "../components/common/ResponsivePagination.vue";
import { Plus } from 'lucide-vue-next';
import { useDesignationStore } from "../stores/designation";
import type { Designation, CreateDesignationRequest } from "../services/hrm/types/designation.types";
import type { PaginationLink } from "../services/types";

const designationStore = useDesignationStore();

const designations = ref<Designation[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const isSubmitting = ref(false);

const isModalOpen = ref(false);
const selectedDesignation = ref<Designation | null>(null);

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
  error.value = null;
  try {
    // In actual implementation, we'd pass page if backend supported it for designations
    await designationStore.fetchDesignations();
    designations.value = designationStore.designations;
    
    // Simulate basic pagination mapping for non-paginated endpoints
    pagination.value = {
      current_page: 1,
      from: 1,
      to: designations.value.length,
      total: designations.value.length,
      links: [],
      last_page: 1
    };
  } catch (err: any) {
    console.error("Failed to load designations:", err);
    error.value = designationStore.error;
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load designations. Please try again later.',
      icon: 'error',
      confirmButtonColor: '#4f46e5'
    });
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedDesignation.value = null;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  isModalOpen.value = true;
};

const handleEdit = (dept: Designation) => {
  selectedDesignation.value = dept;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDesignation.value = null;
};

const handleSave = async (data: CreateDesignationRequest) => {
  isSubmitting.value = true;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  
  try {
    if (selectedDesignation.value) {
      await designationStore.updateDesignation(selectedDesignation.value.uuid, data);
      await Swal.fire({
        title: 'Success!',
        text: 'Designation updated successfully',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    } else {
      await designationStore.createDesignation(data);
      await Swal.fire({
        title: 'Success!',
        text: 'Designation created successfully',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    }
    closeModal();
    loadData(pagination.value.current_page);
  } catch (err: any) {
    console.error("Failed to save designation:", err);
    if (err.response?.status === 422) {
      submitErrors.value = err.response.data.errors;
      submitErrorMessage.value = "Please correct the errors below.";
    } else {
      submitErrorMessage.value = err.response?.data?.message || "Failed to save designation. Please try again.";
      Swal.fire({
        title: 'Error!',
        text: submitErrorMessage.value || 'Failed to save designation',
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
      await designationStore.deleteDesignation(uuid);
      await Swal.fire({
        title: 'Deleted!',
        text: 'Designation has been deleted.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
      loadData(pagination.value.current_page);
    } catch (err: any) {
      console.error("Failed to delete designation:", err);
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to delete designation',
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
