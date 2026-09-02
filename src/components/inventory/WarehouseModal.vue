<script setup lang="ts">
import { ref, watch } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { X, Loader2, Warehouse } from 'lucide-vue-next'

const props = defineProps<{ isOpen: boolean; warehouse?: any }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const store = useInventoryStore()
const saving = ref(false)
const error = ref('')

const form = ref({
  name: '',
  code: '',
  location: '',
  address: '',
  phone: '',
  manager_name: '',
  is_active: true,
})

watch(() => props.isOpen, (open) => {
  if (open) {
    error.value = ''
    if (props.warehouse) {
      form.value = {
        name: props.warehouse.name || '',
        code: props.warehouse.code || '',
        location: props.warehouse.location || '',
        address: props.warehouse.address || '',
        phone: props.warehouse.phone || '',
        manager_name: props.warehouse.manager_name || '',
        is_active: props.warehouse.is_active ?? true,
      }
    } else {
      form.value = { name: '', code: '', location: '', address: '', phone: '', manager_name: '', is_active: true }
    }
  }
})

async function save() {
  if (!form.value.name.trim() || !form.value.code.trim()) {
    error.value = 'Warehouse name and code are required.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await store.createWarehouse({ ...form.value })
    emit('saved')
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to save warehouse.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg">
          <!-- Header -->
          <div class="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-50 rounded-xl">
                <Warehouse class="h-5 w-5 text-emerald-600" />
              </div>
              <h2 class="text-lg font-bold text-gray-900">{{ warehouse ? 'Edit Warehouse' : 'Add Warehouse' }}</h2>
            </div>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="save" class="px-8 py-6 space-y-5">
            <div v-if="error" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{{ error }}</div>

            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Warehouse Name <span class="text-rose-500">*</span></label>
                <input v-model="form.name" type="text" required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Code <span class="text-rose-500">*</span></label>
                <input v-model="form.code" type="text" required
                  placeholder="WH-01"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input v-model="form.location" type="text"
                  placeholder="City / Area"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <textarea v-model="form.address" rows="2"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Manager Name</label>
                <input v-model="form.manager_name" type="text"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input v-model="form.phone" type="tel"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p class="font-semibold text-gray-800 text-sm">Active Warehouse</p>
                <p class="text-xs text-gray-400">Inactive warehouses are excluded from stock operations.</p>
              </div>
              <button type="button" @click="form.is_active = !form.is_active"
                :class="['relative inline-flex h-7 w-12 rounded-full transition-colors', form.is_active ? 'bg-emerald-500' : 'bg-gray-200']">
                <span :class="['inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform mt-1', form.is_active ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="emit('close')"
                class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" :disabled="saving"
                class="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center gap-2">
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                {{ saving ? 'Saving…' : warehouse ? 'Save Changes' : 'Create Warehouse' }}
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
