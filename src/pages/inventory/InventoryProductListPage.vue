<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import AppLayout from '@/layouts/AppLayout.vue'
import ProductModal from '@/components/inventory/ProductModal.vue'
import { Plus, Search, Package, Tag, Edit3, SlidersHorizontal } from 'lucide-vue-next'

const store = useInventoryStore()
const showModal = ref(false)
const editingProduct = ref<any>(null)
const search = ref('')
const selectedCategory = ref('')

onMounted(async () => {
  await Promise.all([
    store.fetchProducts(),
    store.fetchCategories(),
  ])
})

const filteredProducts = computed(() => {
  return store.products.filter(p => {
    const matchSearch = !search.value
      || p.name.toLowerCase().includes(search.value.toLowerCase())
      || p.sku?.toLowerCase().includes(search.value.toLowerCase())
      || p.barcode?.toLowerCase().includes(search.value.toLowerCase())
    const matchCategory = !selectedCategory.value || p.category_uuid === selectedCategory.value
    return matchSearch && matchCategory
  })
})

function totalStock(product: any) {
  return (product.stocks || []).reduce((s: number, st: any) => s + st.quantity_on_hand, 0)
}

function stockStatus(product: any) {
  const qty = totalStock(product)
  if (qty <= product.min_stock) return { label: 'Critical', class: 'bg-rose-100 text-rose-700' }
  if (qty <= product.reorder_level) return { label: 'Low', class: 'bg-amber-100 text-amber-700' }
  return { label: 'OK', class: 'bg-emerald-100 text-emerald-700' }
}

function openEdit(product: any) {
  editingProduct.value = product
  showModal.value = true
}

function openCreate() {
  editingProduct.value = null
  showModal.value = true
}

async function onSaved() {
  showModal.value = false
  await store.fetchProducts()
}
</script>

<template>
  <AppLayout>
    <ProductModal
      :is-open="showModal"
      :product="editingProduct"
      @close="showModal = false"
      @saved="onSaved"
    />

    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p class="text-gray-500">Manage all SKUs, stock levels, and pricing.</p>
        </div>
        <button @click="openCreate"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-100 transition-all">
          <Plus class="h-4 w-4" /> Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input v-model="search" type="text" placeholder="Search by name, SKU, or barcode..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all" />
        </div>
        <select v-model="selectedCategory"
          class="px-3 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
          <option value="">All Categories</option>
          <option v-for="cat in store.categories" :key="cat.uuid" :value="cat.uuid">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th class="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th class="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">UOM</th>
                <th class="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th class="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Unit Cost</th>
                <th class="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="product in filteredProducts" :key="product.uuid"
                class="hover:bg-gray-50/80 transition-colors group">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Package class="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ product.name }}</p>
                      <p class="text-xs text-gray-400 font-mono">{{ product.sku }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  <div class="flex items-center gap-1.5">
                    <Tag class="h-3.5 w-3.5 text-gray-400" />
                    <span class="text-gray-600 text-xs">{{ product.category?.name || '—' }}</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ product.uom }}</span>
                </td>
                <td class="px-4 py-4 text-right">
                  <span class="font-bold text-gray-900">{{ totalStock(product) }}</span>
                </td>
                <td class="px-4 py-4 text-right hidden lg:table-cell">
                  <span class="text-gray-600 font-medium">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.unit_cost || 0) }}</span>
                </td>
                <td class="px-4 py-4">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', stockStatus(product).class]">
                    {{ stockStatus(product).label }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <button @click="openEdit(product)"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all opacity-0 group-hover:opacity-100">
                    <Edit3 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredProducts.length">
                <td colspan="7" class="py-16 text-center text-gray-400 text-sm">No products found. Add your first product.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
