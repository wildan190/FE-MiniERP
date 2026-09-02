<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex-1">
          <h1 class="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div class="h-10 w-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-200">
              <UserCircle class="h-5 w-5" />
            </div>
            My Profile
          </h1>
          <p class="text-gray-500 text-sm mt-1">View your employee profile and manage face enrollment for attendance.</p>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <template v-if="isLoading">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 animate-pulse">
              <div class="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-4"></div>
              <div class="h-4 bg-gray-200 rounded mx-auto w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-100 rounded mx-auto w-1/2"></div>
            </div>
          </div>
          <div class="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 animate-pulse space-y-3">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      </template>

      <!-- No Employee Record (e.g., Super Admin without employee record) -->
      <div v-else-if="!employee" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center max-w-lg mx-auto space-y-4">
        <div class="h-16 w-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <UserX class="h-8 w-8" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">No Employee Profile Linked</h2>
          <p class="text-sm text-gray-500 mt-1 leading-relaxed">
            Your user account <strong class="text-gray-800">({{ authStore.user?.email }})</strong> is logged in as 
            <span class="font-semibold text-primary-600">{{ authStore.user?.name }}</span>, but has not been associated with an employee record in HR Management yet.
          </p>
        </div>
        <div v-if="authStore.isSuperAdmin" class="pt-2">
          <RouterLink
            to="/hrm/employees"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-primary-200"
          >
            Go to Employees to Link User
          </RouterLink>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="errorMsg" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
          <AlertCircle class="h-7 w-7 text-red-400" />
        </div>
        <p class="text-gray-700 font-semibold">{{ errorMsg }}</p>
        <button @click="loadProfile" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700">Retry</button>
      </div>

      <!-- Profile Content -->
      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Left: Identity & Face Card -->
          <div class="lg:col-span-1 space-y-4">

            <!-- Identity Card -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div class="h-24 bg-gradient-to-br from-primary-500 via-indigo-500 to-violet-600"></div>
              <div class="flex flex-col items-center -mt-12 px-6 pb-6">
                <div class="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-extrabold select-none">
                  {{ getInitials(employee) }}
                </div>
                <h2 class="mt-3 text-xl font-extrabold text-gray-900 text-center">{{ fullName }}</h2>
                <p class="text-sm text-gray-500">{{ employee.emp_code }}</p>
                <span class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize" :class="statusClass">
                  <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {{ employee.status || 'Active' }}
                </span>
              </div>
              <div class="border-t border-gray-50 divide-y divide-gray-50">
                <div class="flex items-center gap-3 px-5 py-3">
                  <Building2 class="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span class="text-sm text-gray-600 truncate">{{ employee.department?.name || 'No Department' }}</span>
                </div>
                <div class="flex items-center gap-3 px-5 py-3">
                  <Briefcase class="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span class="text-sm text-gray-600 truncate">{{ employee.designation?.name || 'No Designation' }}</span>
                </div>
                <div v-if="employee.user?.email" class="flex items-center gap-3 px-5 py-3">
                  <Mail class="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span class="text-sm text-gray-600 truncate">{{ employee.user.email }}</span>
                </div>
                <div v-if="employee.phone" class="flex items-center gap-3 px-5 py-3">
                  <Phone class="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span class="text-sm text-gray-600">{{ employee.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Face Enrollment Card -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Face Enrollment</h3>
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  :class="employee.has_face_enrolled ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'">
                  <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {{ employee.has_face_enrolled ? 'Enrolled' : 'Not Enrolled' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed">
                {{ employee.has_face_enrolled
                  ? 'Your face is registered for clock-in/out. You can re-enroll to update your photo.'
                  : 'Enroll your face to enable face-recognition attendance clock-in and clock-out.' }}
              </p>
              <button
                @click="openEnrollModal"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all"
                :class="employee.has_face_enrolled
                  ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-200'"
              >
                <Camera class="h-4 w-4" />
                {{ employee.has_face_enrolled ? 'Re-enroll Face' : 'Enroll My Face' }}
              </button>
            </div>
          </div>

          <!-- Right: Profile Details -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Personal Information -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <UserCircle class="h-4 w-4 text-primary-500" />
                Personal Information
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                  <p class="text-sm font-semibold text-gray-900">{{ fullName }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Employee Code</label>
                  <p class="text-sm font-semibold text-gray-900 font-mono">{{ employee.emp_code }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</label>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ employee.gender || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</label>
                  <p class="text-sm font-semibold text-gray-900">{{ formatDate(employee.date_of_birth) || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Religion</label>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ employee.religion || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Marital Status</label>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ employee.marital_status || '—' }}</p>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</label>
                  <p class="text-sm font-semibold text-gray-900">{{ employee.address || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Work Information -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Briefcase class="h-4 w-4 text-primary-500" />
                Work Information
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Department</label>
                  <p class="text-sm font-semibold text-gray-900">{{ employee.department?.name || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Designation</label>
                  <p class="text-sm font-semibold text-gray-900">{{ employee.designation?.name || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Employment Type</label>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ employee.employment_type || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Join Date</label>
                  <p class="text-sm font-semibold text-gray-900">{{ formatDate(employee.joining_date) || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Office Location</label>
                  <p class="text-sm font-semibold text-gray-900">{{ employee.office_location?.name || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Shift</label>
                  <p class="text-sm font-semibold text-gray-900">{{ employee.shift?.name || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Emergency Contact -->
            <div v-if="employee.emergency_contact_name" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <PhoneCall class="h-4 w-4 text-rose-500" />
                Emergency Contact
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                  <p class="text-sm font-semibold text-gray-900">{{ employee.emergency_contact_name || '—' }}</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                  <p class="text-sm font-semibold text-gray-900">{{ employee.emergency_contact_phone || '—' }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </template>

      <!-- Face Enrollment Modal -->
      <EnrollFaceModal
        :is-open="isEnrollModalOpen"
        :loading="isEnrolling"
        :errors="enrollErrors"
        @close="closeEnrollModal"
        @submit="handleEnrollFace"
      />

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import EnrollFaceModal from '../components/hrm/EnrollFaceModal.vue'
import {
  UserCircle, Building2, Briefcase, Mail, Phone, Camera,
  AlertCircle, UserX, PhoneCall
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { employeeRepository } from '../repositories/hrm/employee.repository'
import type { Employee } from '../services/hrm/types/employee.types'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const employee = ref<Employee | null>(null)
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)
const isEnrollModalOpen = ref(false)
const isEnrolling = ref(false)
const enrollErrors = ref<Record<string, string[]> | null>(null)

const fullName = computed(() => {
  if (!employee.value) return ''
  if (employee.value.user?.name) return employee.value.user.name
  return `${employee.value.first_name || ''} ${employee.value.last_name || ''}`.trim()
})

const statusClass = computed(() => {
  const s = employee.value?.status
  if (s === 'active') return 'bg-green-50 text-green-700'
  if (s === 'inactive') return 'bg-gray-100 text-gray-500'
  if (s === 'resigned') return 'bg-red-50 text-red-600'
  return 'bg-green-50 text-green-700'
})

function getInitials(emp: Employee): string {
  if (emp.user?.name) return emp.user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  return `${emp.first_name?.[0] || ''}${emp.last_name?.[0] || ''}`.toUpperCase() || 'ME'
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function loadProfile() {
  isLoading.value = true
  errorMsg.value = null
  try {
    const response = await employeeRepository.getMyProfile()
    employee.value = response.data
  } catch (err: any) {
    if (err.response?.status === 404) {
      // User account is authenticated but not linked to an employee record
      employee.value = null
      errorMsg.value = null
    } else {
      errorMsg.value = err.response?.data?.message || 'Failed to load profile. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const openEnrollModal = () => {
  enrollErrors.value = null
  isEnrollModalOpen.value = true
}

const closeEnrollModal = () => {
  isEnrollModalOpen.value = false
}

const handleEnrollFace = async (file: File) => {
  if (!employee.value) return
  isEnrolling.value = true
  enrollErrors.value = null
  try {
    await employeeRepository.enrollMyFace(file)
    if (employee.value) employee.value.has_face_enrolled = true
    closeEnrollModal()
    Swal.fire({
      title: 'Face Enrolled!',
      text: 'Your face has been registered successfully. You can now use face recognition for attendance.',
      icon: 'success',
      confirmButtonColor: '#4f46e5',
    })
  } catch (err: any) {
    if (err.response?.data?.errors) {
      enrollErrors.value = err.response.data.errors
    } else {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to enroll face. Please try again.',
        icon: 'error',
        confirmButtonColor: '#4f46e5',
      })
    }
  } finally {
    isEnrolling.value = false
  }
}

onMounted(() => loadProfile())
</script>
