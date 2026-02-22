<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Office Locations</h1>
          <p class="text-gray-600 mt-1">Manage office coordinates and attendance geofencing</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          New Location
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Locations</p>
            <div v-if="isLoading" class="flex justify-center mt-2">
              <Skeleton width="4rem" height="2rem" />
            </div>
            <p v-else class="text-3xl font-bold text-gray-900 mt-2">{{ pagination.total }}</p>
          </div>
        </Card>
      </div>

      <!-- Office Location List -->
      <div class="space-y-4">
        <!-- Table -->
        <div>
          <OfficeLocationTable
            :locations="locations"
            :loading="isLoading"
            @edit="handleEdit"
            @delete="handleDelete"
          />

          <!-- Pagination -->
          <ResponsivePagination
            v-if="!isLoading && pagination.total > 0"
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
      <OfficeLocationModal
        :is-open="isModalOpen"
        :loading="isSubmitting"
        :editing-location="selectedLocation"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeModal"
        @submit="handleSave"
      />

      <!-- Mobile Floating Action -->
      <MobileActions 
        :primary-action="{
          label: 'New Location',
          icon: Plus,
          onClick: openCreateModal
        }"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Swal from 'sweetalert2';
import AppLayout from "../layouts/AppLayout.vue";
import Card from "../components/common/Card.vue";
import Skeleton from "../components/common/Skeleton.vue";
import OfficeLocationTable from "../components/hrm/OfficeLocationTable.vue";
import OfficeLocationModal from "../components/hrm/OfficeLocationModal.vue";
import MobileActions from "../components/common/MobileActions.vue";
import ResponsivePagination from "../components/common/ResponsivePagination.vue";
import { Plus } from 'lucide-vue-next';
import { officeLocationRepository } from "../repositories/hrm/office-location.repository";
import type { OfficeLocation, CreateOfficeLocationRequest, UpdateOfficeLocationRequest } from "../services/hrm/types/office-location.types";
import type { PaginationLink } from "../services/types";

const locations = ref<OfficeLocation[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const isModalOpen = ref(false);
const selectedLocation = ref<OfficeLocation | null>(null);

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
    const response = await officeLocationRepository.getOfficeLocations(page);
    
    if (response) {
      // Handle both { data: [...] } and { data: { data: [...] } }
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        locations.value = responseData;
      } else if (responseData && Array.isArray((responseData as any).data)) {
        locations.value = (responseData as any).data;
      } else if (Array.isArray(response)) {
        locations.value = response as any;
      }
      
      // Extract pagination from either root or 'meta'
      const meta = response.meta || response;
      if (meta && typeof meta === 'object') {
        pagination.value = {
          current_page: meta.current_page || 1,
          from: meta.from || 1,
          to: meta.to || locations.value.length,
          total: meta.total || locations.value.length,
          links: meta.links || [],
          last_page: meta.last_page || 1
        };
      }
    }
  } catch (error) {
    console.error("Failed to load office locations:", error);
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load office locations. Please try again later.',
      icon: 'error',
      confirmButtonColor: '#4f46e5'
    });
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  selectedLocation.value = null;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  isModalOpen.value = true;
};

const handleEdit = (location: OfficeLocation) => {
  selectedLocation.value = location;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedLocation.value = null;
};

const handleSave = async (data: CreateOfficeLocationRequest | UpdateOfficeLocationRequest) => {
  isSubmitting.value = true;
  submitErrors.value = null;
  submitErrorMessage.value = null;
  
  try {
    if (selectedLocation.value) {
      await officeLocationRepository.updateOfficeLocation(selectedLocation.value.uuid, data as UpdateOfficeLocationRequest);
      await Swal.fire({
        title: 'Success!',
        text: 'Office location updated successfully',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    } else {
      await officeLocationRepository.createOfficeLocation(data as CreateOfficeLocationRequest);
      await Swal.fire({
        title: 'Success!',
        text: 'Office location created successfully',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    }
    closeModal();
    loadData(pagination.value.current_page);
  } catch (error: any) {
    console.error("Failed to save office location:", error);
    if (error.response?.status === 422) {
      submitErrors.value = error.response.data.errors;
      submitErrorMessage.value = "Validation failed. Please check the fields below.";
    } else {
      const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
      submitErrorMessage.value = message;
      Swal.fire({
        title: 'Error!',
        text: message,
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
      await officeLocationRepository.deleteOfficeLocation(uuid);
      await Swal.fire({
        title: 'Deleted!',
        text: 'Office location has been deleted.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
      loadData(pagination.value.current_page);
    } catch (error: any) {
      console.error("Failed to delete office location:", error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete office location',
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
