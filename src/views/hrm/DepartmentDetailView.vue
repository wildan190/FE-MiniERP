<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <Spinner class="w-10 h-10 text-primary-600" />
        <p class="mt-4 text-gray-500 font-medium">Loading department details...</p>
      </div>

      <div v-else-if="department" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="h-16 w-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {{ department.name?.charAt(0).toUpperCase() || 'D' }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ department.name }}</h1>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span class="text-gray-600 text-sm">Created {{ formatDate(department.created_at) }}</span>
                <span class="text-gray-400">•</span>
                <span class="text-gray-600 text-sm">UUID: {{ department.uuid }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              @click="openEditModal"
              class="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Edit class="w-5 h-5" />
              Edit Department
            </button>
            <button
              @click="handleDelete"
              class="flex-1 sm:flex-none px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Trash2 class="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-6">
            <Card>
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info class="w-5 h-5 text-gray-500" />
                Department Information
              </h2>
              <div class="space-y-6">
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Name</label>
                  <p class="text-gray-900 font-medium text-lg">{{ department.name }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                  <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ department.description || 'No description provided' }}</p>
                </div>
              </div>
            </Card>
          </div>

          <!-- Sidebar Info -->
          <div class="space-y-6">
            <Card>
              <h2 class="text-lg font-bold text-gray-900 mb-4">Metadata</h2>
              <div class="space-y-4">
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-1">ID</label>
                  <p class="text-sm font-medium text-gray-900">{{ department.id }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-1">UUID</label>
                  <code class="text-[10px] bg-gray-50 p-1 rounded text-gray-600 break-all">{{ department.uuid }}</code>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-1">Created At</label>
                  <p class="text-sm text-gray-900">{{ formatDate(department.created_at) }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase block mb-1">Last Updated</label>
                  <p class="text-sm text-gray-900">{{ formatDate(department.updated_at) }}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <h2 class="text-xl font-bold text-gray-900">Department Not Found</h2>
        <p class="text-gray-500 mt-2">The department you are looking for might have been moved or deleted.</p>
        <router-link
          to="/hrm/departments"
          class="inline-flex items-center mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Back to Departments
        </router-link>
      </div>

      <!-- Edit Modal -->
      <CreateDepartmentModal
        v-if="department"
        :is-open="isEditModalOpen"
        :loading="isSubmitting"
        :editing-department="department"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="isEditModalOpen = false"
        @submit="handleUpdate"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import AppLayout from '../../layouts/AppLayout.vue'
import Card from '../../components/common/Card.vue'
import Spinner from '../../components/common/Spinner.vue'
import CreateDepartmentModal from '../../components/hrm/CreateDepartmentModal.vue'
import { departmentRepository } from '../../repositories/hrm/department.repository'
import type { Department, CreateDepartmentRequest } from '../../services/hrm/types/department.types'
import { Edit, Trash2, Info, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const department = ref<Department | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const isEditModalOpen = ref(false)
const submitErrors = ref<Record<string, string[]> | null>(null)
const submitErrorMessage = ref<string | null>(null)

const fetchDepartment = async () => {
  loading.value = true
  try {
    const uuid = route.params.uuid as string
    const response = await departmentRepository.getDepartmentDetail(uuid)
    department.value = response.data
  } catch (error) {
    console.error('Failed to fetch department:', error)
  } finally {
    loading.value = false
  }
}

const openEditModal = () => {
  submitErrors.value = null
  submitErrorMessage.value = null
  isEditModalOpen.value = true
}

const handleUpdate = async (data: CreateDepartmentRequest) => {
  if (!department.value) return
  
  isSubmitting.value = true
  submitErrors.value = null
  submitErrorMessage.value = null
  
  try {
    await departmentRepository.updateDepartment(department.value.uuid, data)
    await Swal.fire({
      title: 'Success!',
      text: 'Department updated successfully',
      icon: 'success',
      confirmButtonColor: '#10b981'
    })
    isEditModalOpen.value = false
    await fetchDepartment()
  } catch (error: any) {
    console.error('Failed to update department:', error)
    if (error.response?.status === 422) {
      submitErrors.value = error.response.data.errors
      submitErrorMessage.value = 'Please correct the errors below.'
    } else {
      submitErrorMessage.value = error.response?.data?.message || 'Failed to update department. Please try again.'
      Swal.fire({
        title: 'Error!',
        text: submitErrorMessage.value || 'Failed to update department',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!department.value) return
  
  const result = await Swal.fire({
    title: 'Delete Department?',
    text: `Are you sure you want to delete "${department.value.name}"? This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    try {
      await departmentRepository.deleteDepartment(department.value.uuid)
      await Swal.fire({
        title: 'Deleted!',
        text: 'Department has been deleted.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      })
      router.push('/hrm/departments')
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete department',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      })
    }
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchDepartment()
})
</script>
