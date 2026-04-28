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
            @click="openEnrollFaceModal"
            class="hidden md:flex px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium items-center gap-2"
          >
            <Camera class="h-5 w-5" />
            Enroll Face
          </button>
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
      <div v-if="isLoading" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <Card>
              <div class="flex items-start gap-6">
                <Skeleton width="5rem" height="5rem" borderRadius="0.5rem" />
                <div class="flex-1 space-y-3">
                  <Skeleton width="15rem" height="2rem" />
                  <Skeleton width="10rem" height="1rem" />
                  <Skeleton width="12rem" height="1rem" />
                  <div class="flex items-center gap-4 mt-3">
                    <Skeleton width="6rem" height="1.5rem" borderRadius="9999px" />
                    <Skeleton width="8rem" height="1rem" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card>
              <Skeleton width="8rem" height="1.5rem" customClass="mb-4" />
              <div class="space-y-3">
                <div v-for="i in 3" :key="i" class="flex justify-between items-center">
                  <Skeleton width="6rem" height="1rem" />
                  <Skeleton width="8rem" height="1rem" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card v-for="i in 2" :key="i">
            <Skeleton width="12rem" height="1.5rem" customClass="mb-4" />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="j in 6" :key="j" class="space-y-2">
                <Skeleton width="5rem" height="0.875rem" />
                <Skeleton width="8rem" height="1.25rem" />
              </div>
            </div>
          </Card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card v-for="i in 2" :key="i">
            <Skeleton width="12rem" height="1.5rem" customClass="mb-4" />
            <div class="space-y-4">
              <div v-for="j in 2" :key="j" class="space-y-2">
                <Skeleton width="5rem" height="0.875rem" />
                <Skeleton width="10rem" height="1.25rem" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="k in 2" :key="k" class="space-y-2">
                  <Skeleton width="8rem" height="0.875rem" />
                  <Skeleton width="10rem" height="1.25rem" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <Skeleton width="10rem" height="1.5rem" customClass="mb-4" />
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="space-y-2">
              <Skeleton width="6rem" height="0.875rem" />
              <Skeleton width="10rem" height="1.25rem" />
            </div>
          </div>
        </Card>
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
                    <span v-if="employee.requires_face_verification" class="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      <ShieldCheck class="h-4 w-4" />
                      Face Enrolled
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
                    {{ formatCurrency(employee.basic_salary) }}
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

            <!-- Salary Components Summary -->
            <Card class="mt-6 border-primary-100 bg-primary-50/30">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Salary Overview</h3>
                <RouterLink 
                  :to="`/hrm/employees/${employee.uuid}/salary-components`"
                  class="text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  Manage Components
                </RouterLink>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Earnings</span>
                  <span class="text-sm font-bold text-green-600">+{{ formatCurrency(totalEarnings) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Deductions</span>
                  <span class="text-sm font-bold text-red-600">-{{ formatCurrency(totalDeductions) }}</span>
                </div>
                <div class="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span class="text-sm font-bold text-gray-900">Take Home Pay</span>
                  <span class="text-sm font-black text-primary-600">{{ formatCurrency(takeHomePay) }}</span>
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
                  {{ formatCurrency(employee.basic_salary) }}
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

        <!-- Employee Documents -->
        <!-- Added pt-6 for spacing between cards -->
        <div class="pt-6 border-t border-gray-200 mt-6">
          <EmployeeDocumentList 
            :documents="documents" 
            :loading="isDocumentsLoading"
            @upload="openUploadModal"
            @delete="handleDeleteDocument"
          />
        </div>
      </div>

      <!-- Mobile Floating Action -->
      <MobileActions
        :primary-action="{
          label: 'Edit Employee',
          icon: Edit,
          onClick: openEditModal,
        }"
        :secondary-actions="[
          {
            label: 'Enroll Face',
            icon: Camera,
            onClick: openEnrollFaceModal,
          }
        ]"
      />
      
      <!-- Edit Employee Modal -->
      <CreateEmployeeModal
        :is-open="isEditModalOpen"
        :loading="isUpdating"
        :editing-employee="employee"
        :errors="updateErrors"
        :error-message="updateErrorMessage"
        @close="closeEditModal"
        @submit="handleUpdateEmployee"
      />

      <!-- Upload Document Modal -->
      <UploadDocumentModal
        :is-open="isUploadModalOpen"
        :loading="isUploading"
        :errors="uploadErrors"
        @close="closeUploadModal"
        @submit="handleUploadDocument"
      />

      <!-- Enroll Face Modal -->
      <EnrollFaceModal
        :is-open="isEnrollFaceModalOpen"
        :loading="isEnrolling"
        :errors="enrollErrors"
        @close="closeEnrollFaceModal"
        @submit="handleEnrollFace"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import Swal from "sweetalert2";
import CreateEmployeeModal from "../../components/hrm/CreateEmployeeModal.vue";
import EmployeeDocumentList from "../../components/hrm/EmployeeDocumentList.vue";
import UploadDocumentModal from "../../components/hrm/UploadDocumentModal.vue";
import EnrollFaceModal from "../../components/hrm/EnrollFaceModal.vue";
import { useEmployeeStore } from "../../stores/employee";
import { Camera, ShieldCheck, ArrowLeft, Edit } from "lucide-vue-next";
import { employeeSalaryComponentRepository } from "../../repositories/hrm/employee-salary-component.repository";
import type { Employee, UpdateEmployeeRequest, CreateEmployeeRequest } from "../../services/hrm/types/employee.types";
import type { EmployeeSalaryComponent } from "../../services/hrm/types/employee-salary-component.types";
import type { EmployeeDocument } from "../../services/hrm/types/employee-document.types";

const route = useRoute();
const employeeStore = useEmployeeStore();

const employee = ref<Employee | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Documents state
const documents = ref<EmployeeDocument[]>([]);
const isDocumentsLoading = ref(false);
const isUploadModalOpen = ref(false);
const isUploading = ref(false);
const uploadErrors = ref<Record<string, string[]> | null>(null);

// Edit modal state
const isEditModalOpen = ref(false);
const isUpdating = ref(false);
const updateErrors = ref<Record<string, string[]> | null>(null);
const updateErrorMessage = ref<string | null>(null);

// Enroll face state
const isEnrollFaceModalOpen = ref(false);
const isEnrolling = ref(false);
const enrollErrors = ref<Record<string, string[]> | null>(null);

// Salary components overview state
const assignedComponents = ref<EmployeeSalaryComponent[]>([]);
const totalEarnings = computed(() => 
  assignedComponents.value
    .filter(c => c.type === 'earning')
    .reduce((sum, c) => sum + parseFloat(c.effective_value || '0'), 0)
);
const totalDeductions = computed(() => 
  assignedComponents.value
    .filter(c => c.type === 'deduction')
    .reduce((sum, c) => sum + parseFloat(c.effective_value || '0'), 0)
);
const takeHomePay = computed(() => {
  const basic = parseFloat(employee.value?.basic_salary || '0');
  return basic + totalEarnings.value - totalDeductions.value;
});

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

const formatCurrency = (amount: string | number | null | undefined) => {
  if (amount === undefined || amount === null || amount === "") return "Rp 0";
  const val = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
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

const openUploadModal = () => {
  uploadErrors.value = null;
  isUploadModalOpen.value = true;
};

const closeUploadModal = () => {
  isUploadModalOpen.value = false;
  uploadErrors.value = null;
};

const openEnrollFaceModal = () => {
  enrollErrors.value = null;
  isEnrollFaceModalOpen.value = true;
};

const closeEnrollFaceModal = () => {
  isEnrollFaceModalOpen.value = false;
  enrollErrors.value = null;
};

const fetchSalaryOverview = async (uuid: string) => {
  try {
    const response = await employeeSalaryComponentRepository.getEmployeeSalaryComponents(uuid);
    assignedComponents.value = response.data;
  } catch (error) {
    console.error("Failed to load salary overview:", error);
  }
};

const fetchDocuments = async (uuid: string) => {
  if (!uuid) return;
  isDocumentsLoading.value = true;
  try {
    const data = await employeeStore.fetchEmployeeDocuments(uuid);
    documents.value = data || [];
  } catch (error) {
    console.error("Failed to load documents:", error);
  } finally {
    isDocumentsLoading.value = false;
  }
};

const handleUploadDocument = async (data: FormData) => {
  if (!employee.value) return;
  
  isUploading.value = true;
  uploadErrors.value = null;

  try {
    await employeeStore.uploadEmployeeDocument(employee.value.uuid, data);
    await Swal.fire({
      title: "Success!",
      text: "Document uploaded successfully",
      icon: "success",
      confirmButtonColor: "#10b981",
    });
    closeUploadModal();
    // Refresh documents
    await fetchDocuments(employee.value.uuid);
  } catch (error: any) {
    console.error("Failed to upload document:", error);
    if (error.response?.status === 422) {
      uploadErrors.value = error.response.data.errors;
    } else {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to upload document",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  } finally {
    isUploading.value = false;
  }
};

const handleEnrollFace = async (file: File) => {
  if (!employee.value) return;

  isEnrolling.value = true;
  enrollErrors.value = null;

  try {
    await employeeStore.enrollFace(employee.value.uuid, file);
    await Swal.fire({
      title: "Success!",
      text: "Face enrolled successfully",
      icon: "success",
      confirmButtonColor: "#10b981",
    });
    closeEnrollFaceModal();
    // Refresh employee data
    await employeeStore.fetchEmployeeDetail(employee.value.uuid);
    employee.value = employeeStore.currentEmployee;
  } catch (error: any) {
    console.error("Failed to enroll face:", error);
    if (error.response?.status === 422) {
      enrollErrors.value = error.response.data.errors;
    } else {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to enroll face",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  } finally {
    isEnrolling.value = false;
  }
};

const handleDeleteDocument = async (uuid: string) => {
  if (!employee.value) return;

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
      await employeeStore.deleteEmployeeDocument(uuid);
      await Swal.fire({
        title: "Deleted!",
        text: "Document has been deleted.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      // Refresh documents
      await fetchDocuments(employee.value.uuid);
    } catch (error: any) {
      console.error("Failed to delete document:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete document",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  }
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
    await Promise.all([
      employeeStore.fetchEmployeeDetail(uuid),
      fetchDocuments(uuid),
      fetchSalaryOverview(uuid)
    ]);
    employee.value = employeeStore.currentEmployee;
    error.value = employeeStore.error;
  }
});
</script>
