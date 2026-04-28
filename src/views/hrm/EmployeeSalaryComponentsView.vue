<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto px-4 py-6">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <button
          @click="$router.back()"
          class="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-gray-900 truncate">
            {{ employeeName }}
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">Salary Components · {{ employee?.emp_code || '...' }}</p>
        </div>
        <button
          @click="openAssignModal"
          class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-semibold shadow-sm shrink-0"
        >
          <Plus class="h-4 w-4" />
          Assign Component
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center shadow-sm">
          <p class="text-xs text-gray-500 mb-1">Total Earnings</p>
          <p class="text-base font-bold text-green-600">+{{ formatCurrency(totalEarnings) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center shadow-sm">
          <p class="text-xs text-gray-500 mb-1">Total Deductions</p>
          <p class="text-base font-bold text-red-600">-{{ formatCurrency(totalDeductions) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center shadow-sm">
          <p class="text-xs text-gray-500 mb-1">Components</p>
          <p class="text-base font-bold text-gray-900">{{ employeeComponents.length }}</p>
        </div>
      </div>

      <!-- Table Card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p class="text-sm font-medium text-gray-500">
            {{ isLoading ? 'Loading...' : `${employeeComponents.length} assigned component${employeeComponents.length !== 1 ? 's' : ''}` }}
          </p>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Component</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Default Value</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Value</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Effective Value</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-if="isLoading">
                <tr v-for="i in 4" :key="i">
                  <td class="px-6 py-4"><Skeleton width="8rem" height="1rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="5rem" height="1.25rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
                  <td class="px-6 py-4"><Skeleton width="6rem" height="1rem" /></td>
                  <td class="px-6 py-4 text-right"><Skeleton width="5rem" height="1rem" class="ml-auto" /></td>
                </tr>
              </template>

              <template v-else>
                <tr
                  v-for="item in employeeComponents"
                  :key="item.uuid"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <span class="text-sm font-semibold text-gray-900">{{ item.name }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize"
                      :class="item.type === 'earning' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    >
                      {{ item.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ formatCurrency(item.default_value) }}
                  </td>
                  <td class="px-6 py-4">
                    <span v-if="item.custom_value" class="text-sm font-medium text-primary-600">
                      {{ formatCurrency(item.custom_value) }}
                    </span>
                    <span v-else class="text-sm text-gray-400 italic">—</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm font-bold text-gray-900">
                      {{ formatCurrency(item.effective_value) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      @click="openEditModal(item)"
                      class="text-primary-600 hover:text-primary-900 font-medium text-sm transition-colors mr-3"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleRemove(item)"
                      class="text-red-600 hover:text-red-900 font-medium text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card List -->
        <div class="md:hidden divide-y divide-gray-100">
          <template v-if="isLoading">
            <div v-for="i in 3" :key="i" class="p-4 space-y-2">
              <Skeleton width="60%" height="1rem" />
              <Skeleton width="40%" height="0.875rem" />
            </div>
          </template>
          <template v-else>
            <div v-for="item in employeeComponents" :key="`m-${item.uuid}`" class="p-4">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
                  <span
                    class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize mt-1"
                    :class="item.type === 'earning' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  >{{ item.type }}</span>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-bold text-gray-900">{{ formatCurrency(item.effective_value) }}</p>
                  <p v-if="item.custom_value" class="text-xs text-primary-500 mt-0.5">Custom Override</p>
                </div>
              </div>
              <div class="flex gap-2 mt-3">
                <button
                  @click="openEditModal(item)"
                  class="flex-1 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  Edit Value
                </button>
                <button
                  @click="handleRemove(item)"
                  class="flex-1 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && employeeComponents.length === 0" class="text-center py-16">
          <div class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Banknote class="h-6 w-6 text-gray-400" />
          </div>
          <p class="text-sm font-medium text-gray-900">No components assigned</p>
          <p class="text-xs text-gray-500 mt-1 mb-4">Assign salary components to this employee.</p>
          <button
            @click="openAssignModal"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus class="h-4 w-4" />
            Assign Component
          </button>
        </div>
      </div>
    </div>

    <!-- Assign Modal -->
    <div v-if="isAssignModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeAssignModal"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-5">Assign Salary Component</h3>
          <div v-if="assignError" class="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
            <p class="text-sm text-red-700">{{ assignError }}</p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Component <span class="text-red-500">*</span></label>
              <select
                v-model="assignForm.salary_component_uuid"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                <option value="">— Select a component —</option>
                <option v-for="comp in availableComponents" :key="comp.id" :value="comp.uuid">
                  [{{ comp.type === 'earning' ? '▲' : '▼' }}] {{ comp.name }} —
                  {{ comp.is_fixed ? formatCurrency(comp.value) : comp.value + '%' }}
                </option>
              </select>
              <p v-if="availableComponents.length === 0 && !isLoading" class="text-xs text-gray-400 mt-1">All available components are already assigned.</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                Custom Value
                <span class="font-normal text-gray-400">(optional — overrides default)</span>
              </label>
              <input
                v-model="assignForm.custom_value"
                type="number"
                step="0.01"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Leave blank to use default value"
              />
            </div>
          </div>
        </div>
        <div class="px-6 pb-6 flex gap-3 justify-end border-t border-gray-100 pt-4">
          <button @click="closeAssignModal" class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            @click="handleAssign"
            :disabled="isSubmitting || !assignForm.salary_component_uuid"
            class="px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Assigning...' : 'Assign' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Custom Value Modal -->
    <div v-if="isEditModalOpen && editingItem" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeEditModal"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10">
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-1">Edit Custom Value</h3>
          <p class="text-sm text-gray-500 mb-5">{{ editingItem.name }}</p>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Custom Value</label>
            <input
              v-model="editForm.custom_value"
              type="number"
              step="0.01"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              :placeholder="`Default: ${formatCurrency(editingItem.default_value)}`"
            />
            <p class="text-xs text-gray-400 mt-1">Leave blank to revert to the default component value.</p>
          </div>
        </div>
        <div class="px-6 pb-6 flex gap-3 justify-end border-t border-gray-100 pt-4">
          <button @click="closeEditModal" class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            @click="handleUpdate"
            :disabled="isSubmitting"
            class="px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import AppLayout from '../../layouts/AppLayout.vue'
import Skeleton from '../../components/common/Skeleton.vue'
import { ArrowLeft, Plus, Banknote } from 'lucide-vue-next'

import { employeeSalaryComponentRepository } from '../../repositories/hrm/employee-salary-component.repository'
import { employeeRepository } from '../../repositories/hrm/employee.repository'
import { salaryComponentRepository } from '../../repositories/hrm/salary-component.repository'
import type { EmployeeSalaryComponent } from '../../services/hrm/types/employee-salary-component.types'
import type { SalaryComponent } from '../../services/hrm/types/salary-component.types'
import type { Employee } from '../../services/hrm/types/employee.types'

const route = useRoute()
const employeeUuid = route.params.uuid as string

const employee = ref<Employee | null>(null)
const employeeComponents = ref<EmployeeSalaryComponent[]>([])
const allComponents = ref<SalaryComponent[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)

const isAssignModalOpen = ref(false)
const assignError = ref<string | null>(null)
const assignForm = ref({ salary_component_uuid: '', custom_value: '' })

const isEditModalOpen = ref(false)
const editingItem = ref<EmployeeSalaryComponent | null>(null)
const editForm = ref({ custom_value: '' })

const employeeName = computed(() => {
  if (!employee.value) return 'Employee'
  return employee.value.user?.name || `${employee.value.first_name} ${employee.value.last_name}`
})

const availableComponents = computed(() => {
  const assignedUuids = new Set(employeeComponents.value.map(c => c.uuid))
  return allComponents.value.filter(c => !assignedUuids.has(c.uuid))
})

const totalEarnings = computed(() =>
  employeeComponents.value
    .filter(c => c.type === 'earning')
    .reduce((sum, c) => sum + parseFloat(c.effective_value || '0'), 0)
)

const totalDeductions = computed(() =>
  employeeComponents.value
    .filter(c => c.type === 'deduction')
    .reduce((sum, c) => sum + parseFloat(c.effective_value || '0'), 0)
)

const loadData = async () => {
  isLoading.value = true
  try {
    const [compResponse, globalResponse] = await Promise.all([
      employeeSalaryComponentRepository.getEmployeeSalaryComponents(employeeUuid),
      salaryComponentRepository.getSalaryComponents(),
    ])
    employeeComponents.value = compResponse.data
    allComponents.value = globalResponse.data
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
  }
}

const loadEmployee = async () => {
  try {
    const response = await employeeRepository.getEmployeeDetail(employeeUuid)
    employee.value = response.data
  } catch (error) {
    console.error('Failed to load employee:', error)
  }
}

const openAssignModal = () => {
  assignError.value = null
  assignForm.value = { salary_component_uuid: '', custom_value: '' }
  isAssignModalOpen.value = true
}
const closeAssignModal = () => { isAssignModalOpen.value = false }

const handleAssign = async () => {
  if (!assignForm.value.salary_component_uuid) return
  isSubmitting.value = true
  assignError.value = null
  try {
    await employeeSalaryComponentRepository.assignSalaryComponent(employeeUuid, {
      salary_component_uuid: assignForm.value.salary_component_uuid,
      custom_value: assignForm.value.custom_value || null,
    })
    closeAssignModal()
    await loadData()
  } catch (error: any) {
    assignError.value = error.response?.data?.message || 'Failed to assign component.'
  } finally {
    isSubmitting.value = false
  }
}

const openEditModal = (item: EmployeeSalaryComponent) => {
  editingItem.value = item
  editForm.value = { custom_value: item.custom_value || '' }
  isEditModalOpen.value = true
}
const closeEditModal = () => { isEditModalOpen.value = false; editingItem.value = null }

const handleUpdate = async () => {
  if (!editingItem.value) return
  isSubmitting.value = true
  try {
    await employeeSalaryComponentRepository.updateSalaryComponent(
      employeeUuid,
      editingItem.value.uuid,
      { custom_value: editForm.value.custom_value || null }
    )
    closeEditModal()
    await loadData()
  } catch (error: any) {
    Swal.fire({ title: 'Error!', text: error.response?.data?.message || 'Failed to update.', icon: 'error', confirmButtonColor: '#ef4444' })
  } finally {
    isSubmitting.value = false
  }
}

const handleRemove = async (item: EmployeeSalaryComponent) => {
  const result = await Swal.fire({
    title: 'Remove Component?',
    text: `Remove "${item.name}" from this employee?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, remove it',
  })
  if (result.isConfirmed) {
    try {
      await employeeSalaryComponentRepository.removeSalaryComponent(employeeUuid, item.uuid)
      await loadData()
    } catch (error: any) {
      Swal.fire({ title: 'Error!', text: error.response?.data?.message || 'Failed to remove.', icon: 'error', confirmButtonColor: '#ef4444' })
    }
  }
}

const formatCurrency = (amount: string | number | undefined) => {
  if (amount === undefined || amount === null || amount === '') return 'Rp 0'
  const val = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val)
}

onMounted(async () => {
  await Promise.all([loadEmployee(), loadData()])
})
</script>
