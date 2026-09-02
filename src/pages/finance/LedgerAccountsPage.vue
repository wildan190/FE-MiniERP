<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div class="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
              <BookOpen class="h-6 w-6" />
            </div>
            Chart of Accounts
          </h1>
          <p class="text-gray-500 text-sm mt-1">Manage your company's accounting structure (assets, liabilities, equity, revenue, and expenses).</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold items-center gap-2 text-sm transition-all shadow-md shadow-indigo-200"
        >
          <Plus class="h-4 w-4" />
          New Account
        </button>
      </div>

      <!-- Loading -->
      <div v-if="financeStore.isLoading && !allAccounts.length" class="space-y-3">
        <div v-for="i in 8" :key="i" class="h-14 bg-gray-100 rounded-2xl animate-pulse" />
      </div>

      <!-- Error -->
      <Alert v-else-if="financeStore.error" :message="financeStore.error" class="mb-4" />

      <!-- Table -->
      <div v-else class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Search & Filter -->
        <div class="p-5 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
          <div class="relative flex-1 min-w-[200px] max-w-xs">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="search"
              placeholder="Search account name or code..."
              class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div class="flex gap-2">
            <button
              v-for="t in ['all', 'asset', 'liability', 'equity', 'revenue', 'expense']"
              :key="t"
              @click="filterType = t"
              class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize"
              :class="filterType === t
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left min-w-[700px]">
            <thead>
              <tr class="bg-gray-50/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th class="px-6 py-4">Code</th>
                <th class="px-6 py-4">Account Name</th>
                <th class="px-6 py-4">Type</th>
                <th class="px-6 py-4">Parent Account</th>
                <th class="px-6 py-4">Reconcilable</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-sm">
              <tr
                v-for="account in paginatedAccounts"
                :key="account.uuid"
                class="hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <span class="font-mono font-bold text-gray-700 text-xs bg-gray-100 px-2 py-1 rounded-lg">{{ account.code }}</span>
                </td>
                <td class="px-6 py-4 font-semibold text-gray-900">{{ account.name }}</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 text-xs font-bold rounded-xl capitalize" :class="getTypeClass(account.type)">
                    {{ account.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs text-gray-500">
                  {{ account.parent?.name || '—' }}
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold" :class="account.is_reconcilable ? 'text-emerald-600' : 'text-gray-400'">
                    {{ account.is_reconcilable ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openEditModal(account)"
                      class="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button
                      @click="confirmDelete(account)"
                      class="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAccounts.length === 0">
                <td colspan="6" class="px-6 py-16 text-center">
                  <BookOpen class="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p class="text-gray-500 font-semibold">No accounts found.</p>
                  <p class="text-gray-400 text-xs mt-1">Try adjusting your filter or create a new account.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredAccounts.length > pageSize" class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p class="text-xs text-gray-400">
            Showing {{ startIndex + 1 }} – {{ endIndex }} of {{ filteredAccounts.length }}
          </p>
          <div class="flex gap-1.5">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============= CREATE / EDIT MODAL ============= -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            <!-- Modal Header -->
            <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-indigo-50/50">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-2xl text-white flex items-center justify-center shadow-xs"
                  :class="editingAccount ? 'bg-amber-500' : 'bg-indigo-600'">
                  <component :is="editingAccount ? Pencil : Plus" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ editingAccount ? 'Edit Account' : 'New Account' }}</h3>
                  <p class="text-xs text-gray-500">{{ editingAccount ? 'Update this account\'s details.' : 'Add a new account to the Chart of Accounts.' }}</p>
                </div>
              </div>
              <button @click="closeModal" class="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <!-- Modal Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
              <!-- Code & Type row -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1.5">Account Code <span class="text-rose-500">*</span></label>
                  <input
                    v-model="form.code"
                    required
                    maxlength="50"
                    placeholder="e.g. 1001"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1.5">Account Type <span class="text-rose-500">*</span></label>
                  <select
                    v-model="form.type"
                    required
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                  >
                    <option value="" disabled>Select type...</option>
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>

              <!-- Account Name -->
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5">Account Name <span class="text-rose-500">*</span></label>
                <input
                  v-model="form.name"
                  required
                  maxlength="255"
                  placeholder="e.g. Cash and Cash Equivalents"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                />
              </div>

              <!-- Parent Account -->
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5">Parent Account <span class="text-gray-400">(optional)</span></label>
                <select
                  v-model="form.parent_uuid"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                >
                  <option :value="null">— No Parent (Root Account) —</option>
                  <option
                    v-for="acc in parentCandidates"
                    :key="acc.uuid"
                    :value="acc.uuid"
                  >
                    [{{ acc.code }}] {{ acc.name }}
                  </option>
                </select>
              </div>

              <!-- Reconcilable toggle -->
              <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <input
                  id="is_reconcilable"
                  v-model="form.is_reconcilable"
                  type="checkbox"
                  class="h-4 w-4 accent-indigo-600 rounded"
                />
                <label for="is_reconcilable" class="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                  This account can be reconciled
                  <p class="text-xs font-normal text-gray-400 mt-0.5">Enable reconciliation against bank statements or invoices.</p>
                </label>
              </div>

              <!-- Validation error -->
              <div v-if="formError" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {{ formError }}
              </div>

              <!-- Footer buttons -->
              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="flex-1 px-4 py-3 text-white rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  :class="editingAccount ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'"
                >
                  <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
                  <component :is="editingAccount ? Pencil : Plus" v-else class="h-4 w-4" />
                  {{ editingAccount ? 'Save Changes' : 'Create Account' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import AppLayout from '@/layouts/AppLayout.vue'
import Alert from '@/components/common/Alert.vue'
import Swal from 'sweetalert2'
import {
  Plus, BookOpen, Search, ChevronLeft, ChevronRight, Pencil, Trash2, X, Loader2
} from 'lucide-vue-next'

const financeStore = useFinanceStore()

// ── Pagination & Filter ───────────────────────────────────────────
const currentPage = ref(1)
const pageSize = ref(15)
const search = ref('')
const filterType = ref('all')

const allAccounts = computed(() => financeStore.accounts || [])

const filteredAccounts = computed(() => {
  return allAccounts.value.filter((a: any) => {
    const matchesType = filterType.value === 'all' || a.type === filterType.value
    const q = search.value.toLowerCase()
    const matchesSearch = !q || a.name?.toLowerCase().includes(q) || a.code?.toLowerCase().includes(q)
    return matchesType && matchesSearch
  })
})

const totalPages = computed(() => Math.ceil(filteredAccounts.value.length / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, filteredAccounts.value.length))
const paginatedAccounts = computed(() => filteredAccounts.value.slice(startIndex.value, endIndex.value))

// Parent candidates: exclude the account being edited
const parentCandidates = computed(() => {
  return allAccounts.value.filter((a: any) => !editingAccount.value || a.uuid !== editingAccount.value.uuid)
})

// ── Modal State ───────────────────────────────────────────────────
const isModalOpen = ref(false)
const editingAccount = ref<any | null>(null)
const submitting = ref(false)
const formError = ref<string | null>(null)

const defaultForm = () => ({
  code: '',
  name: '',
  type: '',
  parent_uuid: null as string | null,
  is_reconcilable: false
})

const form = ref(defaultForm())

const openCreateModal = () => {
  editingAccount.value = null
  form.value = defaultForm()
  formError.value = null
  isModalOpen.value = true
}

const openEditModal = (account: any) => {
  editingAccount.value = account
  form.value = {
    code: account.code,
    name: account.name,
    type: account.type,
    parent_uuid: account.parent_uuid || null,
    is_reconcilable: account.is_reconcilable || false
  }
  formError.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingAccount.value = null
  formError.value = null
}

const handleSubmit = async () => {
  formError.value = null
  submitting.value = true
  try {
    if (editingAccount.value) {
      await financeStore.updateAccount(editingAccount.value.uuid, form.value)
      closeModal()
      Swal.fire({ icon: 'success', title: 'Account Updated', timer: 1500, showConfirmButton: false })
    } else {
      await financeStore.createAccount(form.value)
      closeModal()
      Swal.fire({ icon: 'success', title: 'Account Created', timer: 1500, showConfirmButton: false })
    }
  } catch (err: any) {
    const apiErrors = err?.response?.data?.errors
    if (apiErrors) {
      formError.value = Object.values(apiErrors).flat().join(' ')
    } else {
      formError.value = err?.response?.data?.message || err.message || 'An error occurred.'
    }
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async (account: any) => {
  const result = await Swal.fire({
    title: `Delete "${account.name}"?`,
    text: 'This account will be soft-deleted. Existing journal entries will not be affected.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    confirmButtonColor: '#EF4444',
    cancelButtonText: 'Cancel'
  })
  if (result.isConfirmed) {
    try {
      await financeStore.deleteAccount(account.uuid)
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1200, showConfirmButton: false })
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || err.message, 'error')
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────
const getTypeClass = (type: string) => {
  switch (type) {
    case 'asset':     return 'bg-blue-100 text-blue-800'
    case 'liability': return 'bg-red-100 text-red-800'
    case 'equity':    return 'bg-purple-100 text-purple-800'
    case 'revenue':   return 'bg-emerald-100 text-emerald-800'
    case 'expense':   return 'bg-orange-100 text-orange-800'
    default:          return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  financeStore.fetchAccounts()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up { animation: scaleUp 0.25s ease-out; }
</style>
