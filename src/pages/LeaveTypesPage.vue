<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Leave Types</h1>
          <p class="text-gray-600 mt-1">Manage leave type policies for your organization</p>
        </div>
        <button
          @click="openCreateModal"
          class="hidden md:flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          New Leave Type
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Leave Types</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ leaveTypes.length }}</p>
          </div>
        </Card>
        <Card>
          <div class="text-center">
            <p class="text-gray-600 text-sm">Total Days Allowed</p>
            <p class="text-3xl font-bold text-primary-600 mt-2">{{ totalDaysAllowed }}</p>
          </div>
        </Card>
      </div>

      <!-- Leave Type List -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <Spinner />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="leaveTypes.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <CalendarDays class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 class="text-base font-semibold text-gray-900">No leave types yet</h3>
          <p class="text-sm text-gray-500 mt-1 mb-4">Start by creating a leave type like Annual Leave or Sick Leave.</p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
          >
            <Plus class="h-4 w-4" />
            New Leave Type
          </button>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <!-- Desktop Table -->
          <table class="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Allowed</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="lt in leaveTypes" :key="lt.uuid" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CalendarDays class="h-4 w-4 text-emerald-600" />
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ lt.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {{ lt.days_allowed }} days
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ lt.description || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="handleEdit(lt)"
                      class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button
                      @click="handleDelete(lt.uuid)"
                      class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile Card List -->
          <div class="md:hidden divide-y divide-gray-200">
            <div v-for="lt in leaveTypes" :key="lt.uuid" class="p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CalendarDays class="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ lt.name }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ lt.days_allowed }} days allowed</p>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <button @click="handleEdit(lt)" class="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                  <Pencil class="h-4 w-4" />
                </button>
                <button @click="handleDelete(lt.uuid)" class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <CreateLeaveTypeModal
        :is-open="isModalOpen"
        :loading="isSubmitting"
        :editing="selectedLeaveType"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeModal"
        @submit="handleSave"
      />

      <!-- Mobile Floating Action -->
      <MobileActions
        :primary-action="{
          label: 'New Leave Type',
          icon: Plus,
          onClick: openCreateModal,
        }"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layouts/AppLayout.vue'
import Card from '../components/common/Card.vue'
import Spinner from '../components/common/Spinner.vue'
import MobileActions from '../components/common/MobileActions.vue'
import CreateLeaveTypeModal from '../components/hrm/CreateLeaveTypeModal.vue'
import { Plus, Pencil, Trash2, CalendarDays } from 'lucide-vue-next'
import { useLeaveTypeStore } from '../stores/leave-type'
import type { LeaveType, CreateLeaveTypeRequest } from '../services/hrm/types/leave-type.types'

const leaveTypeStore = useLeaveTypeStore()

const leaveTypes = ref<LeaveType[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isSubmitting = ref(false)
const isModalOpen = ref(false)
const selectedLeaveType = ref<LeaveType | null>(null)
const submitErrors = ref<Record<string, string[]> | null>(null)
const submitErrorMessage = ref<string | null>(null)

const totalDaysAllowed = computed(() =>
  leaveTypes.value.reduce((sum, lt) => sum + Number(lt.days_allowed), 0),
)

const loadData = async () => {
  isLoading.value = true
  error.value = null
  try {
    await leaveTypeStore.fetchLeaveTypes()
    leaveTypes.value = leaveTypeStore.leaveTypes
  } catch (err: any) {
    console.error('Failed to load leave types:', err)
    error.value = leaveTypeStore.error
    Swal.fire({
      title: 'Error!',
      text: 'Failed to load leave types. Please try again later.',
      icon: 'error',
      confirmButtonColor: '#4f46e5',
    })
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  selectedLeaveType.value = null
  submitErrors.value = null
  submitErrorMessage.value = null
  isModalOpen.value = true
}

const handleEdit = (lt: LeaveType) => {
  selectedLeaveType.value = lt
  submitErrors.value = null
  submitErrorMessage.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedLeaveType.value = null
}

const handleSave = async (data: CreateLeaveTypeRequest) => {
  isSubmitting.value = true
  submitErrors.value = null
  submitErrorMessage.value = null

  try {
    if (selectedLeaveType.value) {
      await leaveTypeStore.updateLeaveType(selectedLeaveType.value.uuid, data)
      await Swal.fire({ title: 'Success!', text: 'Leave type updated successfully', icon: 'success', confirmButtonColor: '#10b981' })
    } else {
      await leaveTypeStore.createLeaveType(data)
      await Swal.fire({ title: 'Success!', text: 'Leave type created successfully', icon: 'success', confirmButtonColor: '#10b981' })
    }
    closeModal()
    loadData()
  } catch (err: any) {
    console.error('Failed to save leave type:', err)
    if (err.response?.status === 422) {
      submitErrors.value = err.response.data.errors
      submitErrorMessage.value = 'Please correct the errors below.'
    } else {
      submitErrorMessage.value = err.response?.data?.message || 'Failed to save leave type.'
      Swal.fire({ title: 'Error!', text: submitErrorMessage.value || 'Error', icon: 'error', confirmButtonColor: '#ef4444' })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (uuid: string) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
  })

  if (result.isConfirmed) {
    try {
      await leaveTypeStore.deleteLeaveType(uuid)
      await Swal.fire({ title: 'Deleted!', text: 'Leave type has been deleted.', icon: 'success', confirmButtonColor: '#10b981' })
      loadData()
    } catch (err: any) {
      Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Failed to delete leave type', icon: 'error', confirmButtonColor: '#ef4444' })
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
