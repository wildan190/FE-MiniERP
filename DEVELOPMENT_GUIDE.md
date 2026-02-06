# Development Guide - Menambah Fitur Baru

Panduan lengkap untuk menambahkan fitur baru ke dalam aplikasi MiniERP.

## 📋 Checklist untuk Fitur Baru

- [ ] Buat Service (jika perlu API call)
- [ ] Buat Repository (untuk data access)
- [ ] Buat atau update Pinia Store
- [ ] Buat atau update Router
- [ ] Buat Page Component
- [ ] Buat UI Components (jika perlu)
- [ ] Test responsiveness
- [ ] Update documentation

---

## 📝 Contoh: Menambahkan Halaman Customers List

### Step 1: Buat Service

File: `src/services/index.ts`

```typescript
export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface CustomersResponse {
  data: Customer[]
  total: number
  per_page: number
  current_page: number
}

export class CustomerService {
  async getCustomers(page: number = 1): Promise<CustomersResponse> {
    const response = await apiClient.getClient().get<CustomersResponse>(
      `/customers?page=${page}`
    )
    return response.data
  }

  async getCustomer(id: number): Promise<Customer> {
    const response = await apiClient.getClient().get<Customer>(`/customers/${id}`)
    return response.data
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.getClient().post<Customer>('/customers', data)
    return response.data
  }

  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.getClient().put<Customer>(`/customers/${id}`, data)
    return response.data
  }

  async deleteCustomer(id: number): Promise<void> {
    await apiClient.getClient().delete(`/customers/${id}`)
  }
}

export const customerService = new CustomerService()
```

### Step 2: Buat Repository

File: `src/repositories/index.ts`

```typescript
export class CustomerRepository {
  async getCustomers(page: number = 1): Promise<CustomersResponse> {
    return await customerService.getCustomers(page)
  }

  async getCustomer(id: number): Promise<Customer> {
    return await customerService.getCustomer(id)
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return await customerService.createCustomer(data)
  }

  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
    return await customerService.updateCustomer(id, data)
  }

  async deleteCustomer(id: number): Promise<void> {
    await customerService.deleteCustomer(id)
  }
}

export const customerRepository = new CustomerRepository()
```

### Step 3: Buat Pinia Store

File: `src/stores/customer.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { customerRepository } from '@/repositories'
import type { Customer, CustomersResponse } from '@/services'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalCustomers = ref(0)
  const perPage = ref(10)

  // Computed
  const hasCustomers = computed(() => customers.value.length > 0)
  const totalPages = computed(() => Math.ceil(totalCustomers.value / perPage.value))

  // Actions
  async function fetchCustomers(page: number = 1) {
    isLoading.value = true
    error.value = null

    try {
      const response = await customerRepository.getCustomers(page)
      customers.value = response.data
      currentPage.value = response.current_page
      totalCustomers.value = response.total
      perPage.value = response.per_page
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch customers'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getCustomer(id: number) {
    isLoading.value = true
    error.value = null

    try {
      currentCustomer.value = await customerRepository.getCustomer(id)
      return currentCustomer.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch customer'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createCustomer(data: Partial<Customer>) {
    isLoading.value = true
    error.value = null

    try {
      const newCustomer = await customerRepository.createCustomer(data)
      customers.value.unshift(newCustomer)
      totalCustomers.value++
      return newCustomer
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create customer'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateCustomer(id: number, data: Partial<Customer>) {
    isLoading.value = true
    error.value = null

    try {
      const updated = await customerRepository.updateCustomer(id, data)
      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value[index] = updated
      }
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = updated
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update customer'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteCustomer(id: number) {
    isLoading.value = true
    error.value = null

    try {
      await customerRepository.deleteCustomer(id)
      customers.value = customers.value.filter(c => c.id !== id)
      totalCustomers.value--
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete customer'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    customers,
    currentCustomer,
    isLoading,
    error,
    currentPage,
    totalCustomers,
    perPage,

    // Computed
    hasCustomers,
    totalPages,

    // Actions
    fetchCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    clearError,
  }
})
```

### Step 4: Buat UI Component - Customers Table

File: `src/components/customers/CustomerTable.vue`

```vue
<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
            Name
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
            Email
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
            Company
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
            Status
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 text-sm text-gray-900">{{ customer.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ customer.email }}</td>
          <td class="px-6 py-4 text-sm text-gray-600">{{ customer.company }}</td>
          <td class="px-6 py-4 text-sm">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                customer.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              {{ customer.status }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm space-x-2">
            <button @click="$emit('edit', customer)" class="text-primary-600 hover:text-primary-700">
              Edit
            </button>
            <button @click="$emit('delete', customer.id)" class="text-red-600 hover:text-red-700">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '@/services'

defineProps<{
  customers: Customer[]
}>()

defineEmits<{
  edit: [customer: Customer]
  delete: [id: number]
}>()
</script>
```

### Step 5: Buat Page Component

File: `src/pages/CustomersPage.vue`

```vue
<template>
  <AppLayout>
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Customers</h2>
        <p class="text-gray-600 mt-1">Manage your customer database</p>
      </div>
      <Button variant="primary" @click="showCreateModal = true">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Customer
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="customerStore.isLoading" class="flex items-center justify-center py-12">
      <Spinner />
    </div>

    <!-- Error State -->
    <Alert
      v-if="customerStore.error"
      :message="customerStore.error"
      @close="customerStore.clearError()"
      class="mb-6"
    />

    <!-- Customers Table -->
    <div v-if="!customerStore.isLoading && customerStore.hasCustomers" class="card">
      <CustomerTable
        :customers="customerStore.customers"
        @edit="editCustomer"
        @delete="deleteCustomer"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!customerStore.isLoading && !customerStore.hasCustomers" class="card text-center py-12">
      <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900">No customers yet</h3>
      <p class="text-gray-600 mt-1">Create your first customer to get started</p>
      <Button variant="primary" @click="showCreateModal = true" class="mt-4">
        Create First Customer
      </Button>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import AppLayout from '@/layouts/AppLayout.vue'
import Button from '@/components/common/Button.vue'
import Alert from '@/components/common/Alert.vue'
import Spinner from '@/components/common/Spinner.vue'
import CustomerTable from '@/components/customers/CustomerTable.vue'

const customerStore = useCustomerStore()
const showCreateModal = ref(false)

onMounted(async () => {
  await customerStore.fetchCustomers()
})

const editCustomer = (customer: any) => {
  console.log('Edit customer:', customer)
  // Implement edit modal
}

const deleteCustomer = async (id: number) => {
  if (confirm('Are you sure?')) {
    await customerStore.deleteCustomer(id)
  }
}
</script>
```

### Step 6: Update Router

File: `src/router/index.ts`

```typescript
// Add import
import CustomersPage from '@/pages/CustomersPage.vue'

// Add route
{
  path: '/customers',
  name: 'customers',
  component: CustomersPage,
  meta: { requiresAuth: true },
}
```

### Step 7: Update Layout Navigation

File: `src/layouts/AppLayout.vue`

```vue
<nav class="hidden md:flex items-center gap-1">
  <RouterLink to="/dashboard" class="...">Dashboard</RouterLink>
  <RouterLink to="/crm" class="...">CRM</RouterLink>
  <RouterLink to="/customers" class="...">Customers</RouterLink>
</nav>
```

---

## 🎯 Best Practices untuk Penambahan Fitur

### 1. **Separation of Concerns**
✅ Pisahkan logic di berbagai layer:
- Service: API calls & business logic
- Repository: Data access abstraction
- Store: State management
- Component: UI rendering only

### 2. **Type Safety**
✅ Gunakan TypeScript untuk semua data structures:
```typescript
interface Customer {
  id: number
  name: string
  email: string
}

async function getCustomer(id: number): Promise<Customer> {
  // ...
}
```

### 3. **Error Handling**
✅ Handle errors di setiap layer:
```typescript
try {
  await customerStore.fetchCustomers()
} catch (error) {
  console.error('Failed to fetch customers:', error)
  // Error sudah tertangani di store
}
```

### 4. **Loading States**
✅ Selalu tampilkan loading indicator:
```vue
<div v-if="store.isLoading">
  <Spinner />
</div>
<div v-else>
  <!-- Content -->
</div>
```

### 5. **Reusable Components**
✅ Buat components yang reusable:
```vue
<!-- Good -->
<FormField label="Name" v-model="name" />

<!-- Not good -->
<input placeholder="Name" />
```

### 6. **Responsive Design**
✅ Test di berbagai ukuran screen:
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <!-- Responsive layout -->
</div>
```

### 7. **Code Organization**
✅ Organize files by feature:
```
src/
├── components/
│   └── customers/
│       ├── CustomerTable.vue
│       ├── CustomerForm.vue
│       └── CustomerCard.vue
├── pages/
│   └── CustomersPage.vue
└── stores/
    └── customer.ts
```

---

## 📚 Folder Structure untuk Fitur Besar

Untuk fitur yang kompleks, gunakan struktur yang terorganisir:

```
src/
├── modules/
│   └── customers/
│       ├── api/
│       │   └── CustomerService.ts
│       ├── repositories/
│       │   └── CustomerRepository.ts
│       ├── stores/
│       │   └── customer.ts
│       ├── components/
│       │   ├── CustomerTable.vue
│       │   ├── CustomerForm.vue
│       │   └── CustomerCard.vue
│       ├── pages/
│       │   ├── CustomersPage.vue
│       │   ├── CustomerDetailPage.vue
│       │   └── CustomerEditPage.vue
│       ├── types.ts
│       └── index.ts
```

---

## 🧪 Testing

### Unit Testing untuk Store

File: `src/stores/__tests__/customer.spec.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCustomerStore } from '@/stores/customer'
import { customerRepository } from '@/repositories'

vi.mock('@/repositories')

describe('Customer Store', () => {
  let store: ReturnType<typeof useCustomerStore>

  beforeEach(() => {
    store = useCustomerStore()
  })

  it('should fetch customers', async () => {
    const mockCustomers = [
      { id: 1, name: 'John', email: 'john@example.com' },
    ]

    vi.mocked(customerRepository.getCustomers).mockResolvedValue({
      data: mockCustomers,
      total: 1,
      per_page: 10,
      current_page: 1,
    })

    await store.fetchCustomers()

    expect(store.customers).toEqual(mockCustomers)
  })

  it('should handle errors', async () => {
    const error = new Error('Failed to fetch')
    vi.mocked(customerRepository.getCustomers).mockRejectedValue(error)

    await expect(store.fetchCustomers()).rejects.toThrow()
    expect(store.error).toBe('Failed to fetch')
  })
})
```

---

## 🎯 Checklist Akhir

Sebelum push code, pastikan:

- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Component stories/documentation updated
- [ ] Tests written and passing
- [ ] Git commit messages are clear
- [ ] Code reviewed by team member

---

**Happy Coding! 🚀**
