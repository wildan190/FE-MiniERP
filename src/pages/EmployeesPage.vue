<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">

      <!-- ── Header ─────────────────────────────────────────────── -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div class="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Users class="h-5 w-5" />
            </div>
            Employees
          </h1>
          <p class="text-gray-500 text-sm mt-1">Manage and view all organisation employees, grouped by department.</p>
        </div>
        <button
          v-if="canManageEmployees"
          @click="openCreateModal"
          class="flex px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold items-center gap-2 text-sm transition-all shadow-md shadow-indigo-200 self-start sm:self-auto"
        >
          <Plus class="h-4 w-4" />
          New Employee
        </button>
      </div>

      <!-- ── KPI Cards ──────────────────────────────────────────── -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div class="h-11 w-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Users class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p>
            <p class="text-2xl font-black text-gray-900">
              <span v-if="isLoading" class="inline-block h-6 w-10 bg-gray-200 rounded animate-pulse" />
              <template v-else>{{ pagination.total }}</template>
            </p>
            <p class="text-[10px] text-gray-400">Employees</p>
          </div>
        </div>
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div class="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <UserCheck class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</p>
            <p class="text-2xl font-black text-emerald-600">
              <span v-if="isLoading" class="inline-block h-6 w-10 bg-gray-200 rounded animate-pulse" />
              <template v-else>{{ activeEmployeesCount }}</template>
            </p>
            <p class="text-[10px] text-gray-400">On this page</p>
          </div>
        </div>
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div class="h-11 w-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Departments</p>
            <p class="text-2xl font-black text-blue-600">
              <span v-if="isLoading" class="inline-block h-6 w-10 bg-gray-200 rounded animate-pulse" />
              <template v-else>{{ uniqueDepartmentsCount }}</template>
            </p>
            <p class="text-[10px] text-gray-400">On this page</p>
          </div>
        </div>
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div class="h-11 w-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <CalendarOff class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">On Leave</p>
            <p class="text-2xl font-black text-amber-600">
              <span v-if="isLoading" class="inline-block h-6 w-10 bg-gray-200 rounded animate-pulse" />
              <template v-else>{{ onLeaveCount }}</template>
            </p>
            <p class="text-[10px] text-gray-400">Currently away</p>
          </div>
        </div>
      </div>

      <!-- ── Toolbar: Search + View Toggle ─────────────────────── -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[220px] max-w-sm">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="searchQuery"
            @input="handleSearchInput"
            placeholder="Search name, code, email..."
            class="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-xs"
          />
          <button v-if="searchQuery" @click="clearSearch" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Department filter pills -->
        <div class="flex flex-wrap gap-1.5">
          <button
            @click="selectedDept = null"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            :class="selectedDept === null ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
          >
            All
          </button>
          <button
            v-for="dept in departmentList"
            :key="dept"
            @click="selectedDept = dept"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            :class="selectedDept === dept ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
          >
            {{ dept }}
          </button>
        </div>

        <!-- View mode toggle -->
        <div class="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 ml-auto">
          <button
            @click="viewMode = 'grouped'"
            class="p-1.5 rounded-lg transition-all"
            :class="viewMode === 'grouped' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            title="Grouped by Department"
          >
            <LayoutList class="h-4 w-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            class="p-1.5 rounded-lg transition-all"
            :class="viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            title="Card Grid"
          >
            <LayoutGrid class="h-4 w-4" />
          </button>
          <button
            @click="viewMode = 'table'"
            class="p-1.5 rounded-lg transition-all"
            :class="viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            title="Table View"
          >
            <TableProperties class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- ── Loading Skeleton ───────────────────────────────────── -->
      <div v-if="isLoading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="space-y-3">
          <div class="h-7 w-48 bg-gray-200 rounded-xl animate-pulse" />
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="j in 3" :key="j" class="h-32 bg-gray-100 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>

      <!-- ── GROUPED BY DEPARTMENT VIEW ────────────────────────── -->
      <div v-else-if="viewMode === 'grouped'" class="space-y-8">
        <div v-if="filteredEmployees.length === 0" class="text-center py-20">
          <Users class="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 class="font-bold text-gray-900">No employees found</h3>
          <p class="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
        </div>

        <section v-for="(group, dept) in groupedEmployees" :key="dept" class="space-y-4">
          <!-- Department Header -->
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
              :style="{ background: deptColor(String(dept)) }">
              {{ String(dept).charAt(0).toUpperCase() }}
            </div>
            <div class="flex items-center gap-3 flex-1">
              <h2 class="text-base font-extrabold text-gray-900">{{ dept }}</h2>
              <span class="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
                {{ group.length }} karyawan
              </span>
            </div>
            <div class="flex-1 h-px bg-gray-100" />
          </div>

          <!-- Employee cards grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="employee in group"
              :key="employee.uuid"
              class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all group flex flex-col gap-4"
            >
              <!-- Top: Avatar + Name + Status -->
              <div class="flex items-start gap-3">
                <div
                  class="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0"
                  :style="{ background: deptColor(employee.department?.name || 'X') }"
                >
                  {{ getInitials(employee) }}
                </div>
                <div class="flex-1 min-w-0">
                  <RouterLink
                    :to="`/hrm/employees/${employee.uuid}`"
                    class="text-sm font-extrabold text-gray-900 hover:text-indigo-600 transition-colors leading-tight block truncate"
                  >
                    {{ getFullName(employee) }}
                  </RouterLink>
                  <p class="text-xs text-gray-400 font-mono mt-0.5 truncate">{{ employee.designation?.name || '—' }}</p>
                  <p class="text-[10px] text-gray-300 font-mono">{{ employee.emp_code || 'No code' }}</p>
                </div>
                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full capitalize"
                    :class="getStatusClass(employee.status)"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-current" />
                    {{ employee.status || 'N/A' }}
                  </span>
                  <span
                    v-if="employee.leave_requests && employee.leave_requests.length > 0"
                    class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800"
                  >
                    <CalendarOff class="h-2.5 w-2.5" />
                    On Leave
                  </span>
                </div>
              </div>

              <!-- Role badges -->
              <div v-if="employee.user?.roles?.length" class="flex flex-wrap gap-1">
                <span
                  v-for="r in employee.user.roles"
                  :key="r.uuid || r.slug"
                  class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                >
                  <ShieldCheck class="h-2.5 w-2.5" />
                  {{ r.name }}
                </span>
              </div>

              <!-- Bottom: Join date + actions -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                <div class="text-xs text-gray-400">
                  <span class="font-bold text-gray-500">Joined</span>
                  {{ employee.joining_date ? formatDate(employee.joining_date) : '—' }}
                </div>
                <!-- Action icons -->
                <div class="inline-flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5 gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                  <RouterLink
                    :to="`/hrm/employees/${employee.uuid}`"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title="View Profile"
                  >
                    <Eye class="h-3.5 w-3.5" />
                  </RouterLink>
                  <button
                    v-if="canManageRoles"
                    v-tooltip="'Manage Roles'"
                    @click="handleManageRoles(employee)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  >
                    <ShieldCheck class="h-3.5 w-3.5" />
                  </button>
                  <button
                    v-if="canManageEmployees"
                    @click="handleEdit(employee)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                    title="Edit"
                  >
                    <Edit3 class="h-3.5 w-3.5" />
                  </button>
                  <RouterLink
                    v-if="canManagePayroll"
                    :to="`/hrm/employees/${employee.uuid}/salary-components`"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                    title="Salary"
                  >
                    <Banknote class="h-3.5 w-3.5" />
                  </RouterLink>
                  <button
                    v-if="canManageEmployees"
                    @click="handleDelete(employee.uuid)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    title="Delete"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- ── CARD GRID VIEW ─────────────────────────────────────── -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-if="filteredEmployees.length === 0" class="col-span-full text-center py-20">
          <Users class="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-400 font-semibold">No employees found</p>
        </div>
        <div
          v-for="employee in filteredEmployees"
          :key="employee.uuid"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all group flex flex-col gap-3 text-center"
        >
          <div class="flex flex-col items-center gap-2">
            <div
              class="h-14 w-14 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md"
              :style="{ background: deptColor(employee.department?.name || 'X') }"
            >
              {{ getInitials(employee) }}
            </div>
            <div>
              <RouterLink
                :to="`/hrm/employees/${employee.uuid}`"
                class="text-sm font-extrabold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {{ getFullName(employee) }}
              </RouterLink>
              <p class="text-[11px] text-gray-400 font-mono mt-0.5">{{ employee.designation?.name || '—' }}</p>
            </div>
          </div>
          <div class="flex items-center justify-center gap-2 flex-wrap">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600">
              {{ employee.department?.name || 'No Dept' }}
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full capitalize"
              :class="getStatusClass(employee.status)"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-current" />
              {{ employee.status || 'N/A' }}
            </span>
          </div>
          <div class="flex items-center justify-center gap-1 pt-2 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-all">
            <RouterLink :to="`/hrm/employees/${employee.uuid}`" class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="View">
              <Eye class="h-3.5 w-3.5" />
            </RouterLink>
            <button v-if="employee.user && canManageRoles" @click="handleManageRoles(employee)" class="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
              <ShieldCheck class="h-3.5 w-3.5" />
            </button>
            <button v-if="canManageEmployees" @click="handleEdit(employee)" class="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
              <Edit3 class="h-3.5 w-3.5" />
            </button>
            <button v-if="canManageEmployees" @click="handleDelete(employee.uuid)" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
              <Trash2 class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- ── TABLE VIEW ─────────────────────────────────────────── -->
      <div v-else>
        <EmployeeTable
          :employees="filteredEmployees"
          :loading="isLoading"
          :search-query="searchQuery"
          :start-index="pagination.from || 1"
          @search="handleSearch"
          @edit="handleEdit"
          @manage-roles="handleManageRoles"
          @delete="handleDelete"
        />
      </div>

      <!-- ── Pagination ─────────────────────────────────────────── -->
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

      <!-- ── Modals ─────────────────────────────────────────────── -->
      <AssignUserRoleModal
        :is-open="isRolesModalOpen"
        :user="selectedEmployeeForRoles?.user || null"
        :user-name="selectedEmployeeForRoles?.user?.name || (selectedEmployeeForRoles?.first_name + ' ' + (selectedEmployeeForRoles?.last_name || ''))"
        @close="closeRolesModal"
        @updated="handleRolesUpdated"
      />

      <CreateEmployeeModal
        :is-open="isModalOpen"
        :loading="isSubmitting"
        :editing-employee="selectedEmployee"
        :errors="submitErrors"
        :error-message="submitErrorMessage"
        @close="closeModal"
        @submit="handleSave"
      />

      <MobileActions
        :primary-action="{
          label: 'New Employee',
          icon: Plus,
          onClick: openCreateModal,
        }"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { RouterLink } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import EmployeeTable from '../components/hrm/EmployeeTable.vue'
import CreateEmployeeModal from '../components/hrm/CreateEmployeeModal.vue'
import AssignUserRoleModal from '../components/system/AssignUserRoleModal.vue'
import MobileActions from '../components/common/MobileActions.vue'
import ResponsivePagination from '../components/common/ResponsivePagination.vue'
import {
  Plus, Users, UserCheck, Building2, CalendarOff, Search, X, Eye, Edit3,
  Banknote, Trash2, ShieldCheck, LayoutList, LayoutGrid, TableProperties
} from 'lucide-vue-next'
import { employeeRepository } from '../repositories/hrm/employee.repository'
import { useAuthStore } from '../stores/auth'
import type { Employee, CreateEmployeeRequest } from '../services/hrm/types/employee.types'
import type { PaginationLink } from '../services/types'

// ── Auth Guards ──────────────────────────────────────────────────
const authStore = useAuthStore()
const canManageEmployees = computed(() => authStore.isSuperAdmin || authStore.hasPermission('hrm.employees.manage'))
const canManageRoles     = computed(() => authStore.isSuperAdmin)
const canManagePayroll   = computed(() => authStore.isSuperAdmin || authStore.hasPermission('hrm.payroll.manage'))

// ── State ────────────────────────────────────────────────────────
const employees    = ref<Employee[]>([])
const isLoading    = ref(false)
const isSubmitting = ref(false)
const isModalOpen  = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const isRolesModalOpen = ref(false)
const selectedEmployeeForRoles = ref<Employee | null>(null)
const submitErrors = ref<Record<string, string[]> | null>(null)
const submitErrorMessage = ref<string | null>(null)
const searchQuery  = ref('')
const selectedDept = ref<string | null>(null)
const viewMode     = ref<'grouped' | 'grid' | 'table'>('grouped')
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

const pagination = ref({
  current_page: 1,
  from: 0, to: 0, total: 0,
  links: [] as PaginationLink[],
  last_page: 1, per_page: 15,
  prev_page_url: null as string | null,
  next_page_url: null as string | null,
  path: '', first_page_url: '', last_page_url: ''
})

// ── Computed ─────────────────────────────────────────────────────
const filteredEmployees = computed(() => {
  let list = employees.value
  if (selectedDept.value) {
    list = list.filter(e => (e.department?.name || 'No Department') === selectedDept.value)
  }
  return list
})

const groupedEmployees = computed(() => {
  const groups: Record<string, Employee[]> = {}
  for (const emp of filteredEmployees.value) {
    const dept = emp.department?.name || 'No Department'
    if (!groups[dept]) groups[dept] = []
    groups[dept].push(emp)
  }
  // Sort departments alphabetically
  const sorted: Record<string, Employee[]> = {}
  Object.keys(groups).sort((a, b) => a === 'No Department' ? 1 : b === 'No Department' ? -1 : a.localeCompare(b))
    .forEach(k => { sorted[k] = groups[k] || [] })
  return sorted
})

const departmentList = computed(() => Object.keys(groupedEmployees.value))

const activeEmployeesCount = computed(() => employees.value.filter(e => e.status === 'active').length)
const uniqueDepartmentsCount = computed(() => new Set(employees.value.map(e => e.department?.id).filter(Boolean)).size)
const onLeaveCount = computed(() => employees.value.filter(e => e.leave_requests && e.leave_requests.length > 0).length)

// ── Helpers ───────────────────────────────────────────────────────
const getFullName = (e: Employee) =>
  e.user?.name || `${e.first_name || ''} ${e.last_name || ''}`.trim() || 'N/A'

const getInitials = (e: Employee) => {
  const name = getFullName(e)
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2) || 'NA'
}

const getStatusClass = (status: string | null) => {
  switch (status) {
    case 'active':     return 'bg-emerald-100 text-emerald-800'
    case 'inactive':   return 'bg-amber-100 text-amber-800'
    case 'terminated': return 'bg-rose-100 text-rose-800'
    case 'resigned':   return 'bg-gray-100 text-gray-800'
    default:           return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })

// Deterministic pastel gradient per department name
const deptColor = (name: string) => {
  const palettes = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#0ea5e9,#6366f1)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#ec4899,#8b5cf6)',
    'linear-gradient(135deg,#14b8a6,#0ea5e9)',
    'linear-gradient(135deg,#f97316,#eab308)',
    'linear-gradient(135deg,#64748b,#475569)',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palettes[Math.abs(hash) % palettes.length]
}

// ── Data Loading ─────────────────────────────────────────────────
const loadData = async (page = 1) => {
  isLoading.value = true
  try {
    const res = await employeeRepository.getEmployees(page, searchQuery.value)
    employees.value = res.data.data
    Object.assign(pagination.value, {
      current_page: res.data.current_page,
      from: res.data.from, to: res.data.to, total: res.data.total,
      links: res.data.links, last_page: res.data.last_page,
      per_page: res.data.per_page, prev_page_url: res.data.prev_page_url,
      next_page_url: res.data.next_page_url, path: res.data.path,
      first_page_url: res.data.first_page_url, last_page_url: res.data.last_page_url
    })
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const handleSearchInput = () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => loadData(1), 400)
}

const handleSearch = (q: string) => {
  searchQuery.value = q
  handleSearchInput()
}

const clearSearch = () => {
  searchQuery.value = ''
  loadData(1)
}

// ── Modal actions ─────────────────────────────────────────────────
const openCreateModal = () => {
  selectedEmployee.value = null
  submitErrors.value = null
  submitErrorMessage.value = null
  isModalOpen.value = true
}

const handleEdit = (e: Employee) => {
  selectedEmployee.value = e
  submitErrors.value = null
  submitErrorMessage.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedEmployee.value = null
}

const handleManageRoles = (e: Employee) => {
  selectedEmployeeForRoles.value = e
  isRolesModalOpen.value = true
}

const closeRolesModal = () => {
  isRolesModalOpen.value = false
  selectedEmployeeForRoles.value = null
}

const handleRolesUpdated = (updatedUser: any) => {
  if (selectedEmployeeForRoles.value?.user) {
    selectedEmployeeForRoles.value.user.roles = updatedUser.roles || []
  }
  Swal.fire({ title: 'Success!', text: 'Roles updated successfully', icon: 'success', confirmButtonColor: '#10b981' })
  loadData(pagination.value.current_page)
}

const handleSave = async (data: CreateEmployeeRequest) => {
  isSubmitting.value = true
  submitErrors.value = null
  submitErrorMessage.value = null
  try {
    if (selectedEmployee.value) {
      await employeeRepository.updateEmployee(selectedEmployee.value.uuid, data as any)
      await Swal.fire({ title: 'Updated!', text: 'Employee updated successfully', icon: 'success', confirmButtonColor: '#10b981' })
    } else {
      await employeeRepository.createEmployee(data)
      await Swal.fire({ title: 'Created!', text: 'Employee created successfully', icon: 'success', confirmButtonColor: '#10b981' })
    }
    closeModal()
    loadData(pagination.value.current_page)
  } catch (error: any) {
    if (error.response?.status === 422) {
      submitErrors.value = error.response.data.errors
      submitErrorMessage.value = 'Please correct the errors below.'
    } else {
      submitErrorMessage.value = error.response?.data?.message || 'Failed to save employee.'
      Swal.fire({ title: 'Error!', text: submitErrorMessage.value || 'Failed', icon: 'error', confirmButtonColor: '#ef4444' })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (uuid: string) => {
  const result = await Swal.fire({
    title: 'Are you sure?', text: "You won't be able to revert this!",
    icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!'
  })
  if (result.isConfirmed) {
    Swal.fire({ title: 'Info', text: 'Delete functionality not yet available.', icon: 'info', confirmButtonColor: '#4f46e5' })
  }
}

onMounted(() => loadData())
</script>

<style scoped>
.group:hover .opacity-0 { opacity: 1; }
</style>
