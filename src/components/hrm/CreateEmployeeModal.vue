<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen px-2 py-4 sm:px-4 sm:py-0 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="handleClose"
      ></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-2xl"
      >
        <div class="bg-white px-3 py-4 sm:px-6 sm:py-6 max-h-[90vh] overflow-y-auto">
          <div class="sm:flex sm:items-start text-left w-full">
            <div class="w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900 mb-6" id="modal-title">
                {{ editingEmployee ? "Edit Employee" : "Create Employee" }}
              </h3>

              <div v-if="errorMessage" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Personal Information -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Personal Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="formData.first_name"
                        required
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter first name"
                      />
                      <p v-if="errors?.first_name" class="mt-1 text-xs text-red-600">
                        {{ errors.first_name[0] }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="formData.last_name"
                        required
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter last name"
                      />
                      <p v-if="errors?.last_name" class="mt-1 text-xs text-red-600">
                        {{ errors.last_name[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Email <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="formData.email"
                        required
                        type="email"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter email address"
                      />
                      <p v-if="errors?.email" class="mt-1 text-xs text-red-600">
                        {{ errors.email[0] }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Password <span v-if="!editingEmployee" class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="formData.password"
                        :required="!editingEmployee"
                        type="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter password"
                      />
                      <p v-if="errors?.password" class="mt-1 text-xs text-red-600">
                        {{ errors.password[0] }}
                      </p>
                    </div>
                    <div v-if="editingEmployee">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        User UUID
                      </label>
                      <input
                        v-model="formData.user_uuid"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter user UUID"
                      />
                      <p v-if="errors?.user_uuid" class="mt-1 text-xs text-red-600">
                        {{ errors.user_uuid[0] }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Employment Details -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Employment Details</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        v-model="formData.department_uuid"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select department</option>
                        <option v-for="dept in departments" :key="dept.uuid" :value="dept.uuid">
                          {{ dept.name }}
                        </option>
                      </select>
                      <p v-if="errors?.department_uuid" class="mt-1 text-xs text-red-600">
                        {{ errors.department_uuid[0] }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Designation
                      </label>
                      <select
                        v-model="formData.designation_uuid"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select designation</option>
                        <option
                          v-for="designation in designations"
                          :key="designation.uuid"
                          :value="designation.uuid"
                        >
                          {{ designation.name }}
                        </option>
                      </select>
                      <p v-if="errors?.designation_uuid" class="mt-1 text-xs text-red-600">
                        {{ errors.designation_uuid[0] }}
                      </p>
                    </div>
                    <div v-if="editingEmployee">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Employee Code
                      </label>
                      <input
                        v-model="formData.emp_code"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter employee code"
                      />
                      <p v-if="errors?.emp_code" class="mt-1 text-xs text-red-600">
                        {{ errors.emp_code[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Joining Date
                      </label>
                      <input
                        v-model="formData.joining_date"
                        type="date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <p v-if="errors?.joining_date" class="mt-1 text-xs text-red-600">
                        {{ errors.joining_date[0] }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2"> Status </label>
                      <select
                        v-model="formData.status"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="terminated">Terminated</option>
                        <option value="resigned">Resigned</option>
                      </select>
                      <p v-if="errors?.status" class="mt-1 text-xs text-red-600">
                        {{ errors.status[0] }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Additional Information -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2"> NIK </label>
                      <input
                        v-model="formData.nik"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter NIK"
                      />
                      <p v-if="errors?.nik" class="mt-1 text-xs text-red-600">
                        {{ errors.nik[0] }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Place of Birth
                      </label>
                      <input
                        v-model="formData.place_of_birth"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter place of birth"
                      />
                      <p v-if="errors?.place_of_birth" class="mt-1 text-xs text-red-600">
                        {{ errors.place_of_birth[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        v-model="formData.date_of_birth"
                        type="date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <p v-if="errors?.date_of_birth" class="mt-1 text-xs text-red-600">
                        {{ errors.date_of_birth[0] }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2"> Gender </label>
                      <select
                        v-model="formData.gender"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <p v-if="errors?.gender" class="mt-1 text-xs text-red-600">
                        {{ errors.gender[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Marital Status
                      </label>
                      <select
                        v-model="formData.marital_status"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select marital status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                      <p v-if="errors?.marital_status" class="mt-1 text-xs text-red-600">
                        {{ errors.marital_status[0] }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2"> Religion </label>
                      <input
                        v-model="formData.religion"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter religion"
                      />
                      <p v-if="errors?.religion" class="mt-1 text-xs text-red-600">
                        {{ errors.religion[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2"> Address </label>
                    <textarea
                      v-model="formData.address"
                      rows="3"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter address"
                    ></textarea>
                    <p v-if="errors?.address" class="mt-1 text-xs text-red-600">
                      {{ errors.address[0] }}
                    </p>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2"> Phone </label>
                      <input
                        v-model="formData.phone"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter phone number"
                      />
                      <p v-if="errors?.phone" class="mt-1 text-xs text-red-600">
                        {{ errors.phone[0] }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        v-model="formData.emergency_contact_name"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter emergency contact name"
                      />
                      <p v-if="errors?.emergency_contact_name" class="mt-1 text-xs text-red-600">
                        {{ errors.emergency_contact_name[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Phone
                    </label>
                    <input
                      v-model="formData.emergency_contact_phone"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter emergency contact phone"
                    />
                    <p v-if="errors?.emergency_contact_phone" class="mt-1 text-xs text-red-600">
                      {{ errors.emergency_contact_phone[0] }}
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <button
            @click="handleSubmit"
            :disabled="
              loading ||
              !formData.first_name ||
              !formData.last_name ||
              !formData.email ||
              (!editingEmployee && !formData.password)
            "
            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {{
              loading
                ? editingEmployee
                  ? "Updating..."
                  : "Creating..."
                : editingEmployee
                  ? "Update Employee"
                  : "Create Employee"
            }}
          </button>
          <button
            type="button"
            @click="handleClose"
            class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeFormData,
  Employee,
} from "../../services/hrm/types/employee.types";
import type { Department } from "../../services/hrm/types/department.types";
import type { Designation } from "../../services/hrm/types/designation.types";
import { departmentRepository } from "../../repositories/hrm/department.repository";
import { designationRepository } from "../../repositories/hrm/designation.repository";

interface Props {
  isOpen: boolean;
  loading?: boolean;
  editingEmployee?: Employee | null;
  errors?: Record<string, string[]> | null;
  errorMessage?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", data: EmployeeFormData): void;
}>();

const departments = ref<Department[]>([]);
const designations = ref<Designation[]>([]);

const formData = ref<EmployeeFormData>({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  user_uuid: "",
  department_uuid: "",
  designation_uuid: "",
  emp_code: "",
  joining_date: "",
  status: "active",
  nik: "",
  place_of_birth: "",
  date_of_birth: "",
  gender: undefined,
  marital_status: undefined,
  religion: "",
  address: "",
  phone: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
});

const loadDepartments = async () => {
  try {
    const response = await departmentRepository.getDepartments();
    departments.value = response.data;
  } catch (error) {
    console.error("Failed to load departments:", error);
  }
};

const loadDesignations = async () => {
  try {
    const response = await designationRepository.getDesignations();
    designations.value = response.data;
  } catch (error) {
    console.error("Failed to load designations:", error);
  }
};

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      // Load departments and designations when modal opens
      await Promise.all([loadDepartments(), loadDesignations()]);

      if (props.editingEmployee) {
        // Populate form with existing employee data for editing
        formData.value = {
          first_name: props.editingEmployee.first_name || "",
          last_name: props.editingEmployee.last_name || "",
          email: props.editingEmployee.user?.email || "",
          password: "", // Don't populate password for security
          user_uuid: props.editingEmployee.user?.uuid || "",
          department_uuid: props.editingEmployee.department?.uuid || "",
          designation_uuid: props.editingEmployee.designation?.uuid || "",
          emp_code: props.editingEmployee.emp_code || "",
          joining_date: props.editingEmployee.joining_date || "",
          status: props.editingEmployee.status || "active",
          nik: props.editingEmployee.nik || "",
          place_of_birth: props.editingEmployee.place_of_birth || "",
          date_of_birth: props.editingEmployee.date_of_birth || "",
          gender: props.editingEmployee.gender || undefined,
          marital_status: props.editingEmployee.marital_status || undefined,
          religion: props.editingEmployee.religion || "",
          address: props.editingEmployee.address || "",
          phone: props.editingEmployee.phone || "",
          emergency_contact_name: props.editingEmployee.emergency_contact_name || "",
          emergency_contact_phone: props.editingEmployee.emergency_contact_phone || "",
        };
      } else {
        formData.value = {
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          user_uuid: "",
          department_uuid: "",
          designation_uuid: "",
          emp_code: "",
          joining_date: "",
          status: "active",
          nik: "",
          place_of_birth: "",
          date_of_birth: "",
          gender: undefined,
          marital_status: undefined,
          religion: "",
          address: "",
          phone: "",
          emergency_contact_name: "",
          emergency_contact_phone: "",
        };
      }
    }
  },
);

const handleSubmit = () => {
  emit("submit", { ...formData.value });
};

const handleClose = () => {
  emit("close");
};
</script>
