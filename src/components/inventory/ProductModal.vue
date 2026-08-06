<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { X, Loader2, Package } from 'lucide-vue-next'

const props = defineProps<{ isOpen: boolean; product?: any }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const store = useInventoryStore()
const saving = ref(false)
const error = ref('')

const form = ref({
  name: '',
  sku: '',
  barcode: '',
  category_uuid: '',
  uom: 'pcs',
  unit_cost: 0,
  unit_price: 0,
  reorder_level: 0,
  min_stock: 0,
  max_stock: 0,
  description: '',
  is_active: true,
})

const isEdit = computed(() => !!props.product?.uuid)

watch(() => props.isOpen, async (open) => {
  if (open) {
    error.value = ''
    if (props.product) {
      form.value = {
        name: props.product.name || '',
        sku: props.product.sku || '',
        barcode: props.product.barcode || '',
        category_uuid: props.product.category_uuid || '',
        uom: props.product.uom || 'pcs',
        unit_cost: props.product.unit_cost || 0,
        unit_price: props.product.unit_price || 0,
        reorder_level: props.product.reorder_level || 0,
        min_stock: props.product.min_stock || 0,
        max_stock: props.product.max_stock || 0,
        description: props.product.description || '',
        is_active: props.product.is_active ?? true,
      }
    } else {
      form.value = {
        name: '', sku: '', barcode: '', category_uuid: '',
        uom: 'pcs', unit_cost: 0, unit_price: 0,
        reorder_level: 0, min_stock: 0, max_stock: 0,
        description: '', is_active: true,
      }
    }
    await store.fetchCategories()
  }
})

async function save() {
  if (!form.value.name.trim()) { error.value = 'Product name is required.'; return }
  saving.value = true
  error.value = ''
  try {
    if (isEdit.value) {
      await store.updateProduct(props.product.uuid, form.value)
    } else {
      await store.createProduct(form.value)
    }
    emit('saved')
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to save product.'
  } finally {
    saving.value = false
  }
}

const uomOptions = ['pcs', 'box', 'kg', 'g', 'liter', 'ml', 'meter', 'roll', 'set', 'unit']
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-primary-50 rounded-xl">
                <Package class="h-5 w-5 text-primary-600" />
              </div>
              <h2 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Edit Product' : 'Add New Product' }}</h2>
            </div>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="save" class="px-8 py-6 space-y-6">
            <div v-if="error" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{{ error }}</div>

            <!-- Basic Info -->
            <div>
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Product Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Product Name <span class="text-rose-500">*</span></label>
                  <input v-model="form.name" type="text" required
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                  <input v-model="form.sku" type="text"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Barcode</label>
                  <input v-model="form.barcode" type="text"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select v-model="form.category_uuid"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">— Select Category —</option>
                    <option v-for="cat in store.categories" :key="cat.uuid" :value="cat.uuid">{{ cat.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Unit of Measure</label>
                  <select v-model="form.uom"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option v-for="u in uomOptions" :key="u" :value="u">{{ u }}</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea v-model="form.description" rows="2"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
                </div>
              </div>
            </div>

            <!-- Pricing -->
            <div>
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Pricing</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Unit Cost (COGS)</label>
                  <input v-model.number="form.unit_cost" type="number" min="0" step="0.01"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Selling Price</label>
                  <input v-model.number="form.unit_price" type="number" min="0" step="0.01"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            <!-- Stock Thresholds -->
            <div>
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Stock Thresholds</h3>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Min Stock</label>
                  <input v-model.number="form.min_stock" type="number" min="0"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Reorder Level</label>
                  <input v-model.number="form.reorder_level" type="number" min="0"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Max Stock</label>
                  <input v-model.number="form.max_stock" type="number" min="0"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p class="font-semibold text-gray-800 text-sm">Active Product</p>
                <p class="text-xs text-gray-400">Inactive products are hidden from transactions.</p>
              </div>
              <button type="button" @click="form.is_active = !form.is_active"
                :class="['relative inline-flex h-7 w-12 rounded-full transition-colors', form.is_active ? 'bg-primary-600' : 'bg-gray-200']">
                <span :class="['inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform mt-1', form.is_active ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="emit('close')"
                class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" :disabled="saving"
                class="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all disabled:opacity-60 flex items-center gap-2">
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                {{ saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
