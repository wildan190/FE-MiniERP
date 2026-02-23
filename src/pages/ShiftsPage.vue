<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Shifts Management</h1>
          <p class="text-gray-600 mt-1">Define and manage employee working hours.</p>
        </div>
        <button
          @click="openAddModal"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all active:scale-95 shadow-sm shadow-primary-200 font-semibold"
        >
          <Plus class="h-5 w-5" />
          <span>Add New Shift</span>
        </button>
      </div>

      <!-- Table Section -->
      <div class="space-y-4">
        <ShiftTable
          :shifts="shiftStore.shifts"
          :loading="shiftStore.loading"
          @edit="handleEdit"
          @delete="handleDelete"
        />

        <!-- Pagination -->
        <ResponsivePagination
          v-if="shiftStore.totalPages > 1"
          :current-page="shiftStore.currentPage"
          :last-page="shiftStore.totalPages"
          :from="shiftStore.from"
          :to="shiftStore.to"
          :total="shiftStore.total"
          :links="shiftStore.links"
          @page-change="handlePageChange"
        />
      </div>

      <!-- Modals -->
      <ShiftModal
        :is-open="isModalOpen"
        :loading="shiftStore.loading"
        :shift="selectedShift"
        @close="closeModal"
        @submit="handleModalSubmit"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import { useShiftStore } from '@/stores/shift'
import ShiftTable from '@/components/hrm/ShiftTable.vue'
import ShiftModal from '@/components/hrm/ShiftModal.vue'
import ResponsivePagination from '@/components/common/ResponsivePagination.vue'
import type { Shift, CreateShiftRequest, UpdateShiftRequest } from '@/services/hrm/types/shift.types'
import Swal from 'sweetalert2'

const shiftStore = useShiftStore()

const isModalOpen = ref(false)
const selectedShift = ref<Shift | null>(null)

const loadData = async (page: number = 1) => {
  try {
    await shiftStore.fetchShifts(page)
  } catch (error: any) {
    Swal.fire({ title: 'Error!', text: error.message || 'Failed to load shifts', icon: 'error' })
  }
}

onMounted(() => {
  loadData()
})

const handlePageChange = (page: number) => {
  loadData(page)
}

const openAddModal = () => {
  selectedShift.value = null
  isModalOpen.value = true
}

const handleEdit = (shift: Shift) => {
  selectedShift.value = shift
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedShift.value = null
}

const handleModalSubmit = async (data: CreateShiftRequest | UpdateShiftRequest) => {
  try {
    if (selectedShift.value) {
      await shiftStore.updateShift(selectedShift.value.uuid, data as UpdateShiftRequest)
      Swal.fire({ title: 'Success!', text: 'Shift updated successfully', icon: 'success' })
    } else {
      await shiftStore.createShift(data as CreateShiftRequest)
      Swal.fire({ title: 'Success!', text: 'Shift created successfully', icon: 'success' })
    }
    closeModal()
  } catch (error: any) {
    Swal.fire({ title: 'Error!', text: error.message || 'Failed to save shift', icon: 'error' })
  }
}

const handleDelete = async (shift: Shift) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete shift "${shift.name}". This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      await shiftStore.deleteShift(shift.uuid)
      Swal.fire({ title: 'Deleted!', text: 'Shift deleted successfully', icon: 'success' })
    } catch (error: any) {
      Swal.fire({ title: 'Error!', text: error.message || 'Failed to delete shift', icon: 'error' })
    }
  }
}
</script>
