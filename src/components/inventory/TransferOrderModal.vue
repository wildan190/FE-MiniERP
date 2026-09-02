<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { X, Loader2, ArrowRightLeft, Plus, Trash2 } from 'lucide-vue-next'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const store = useInventoryStore()
const saving = ref(false)
const error = ref('')

const form = ref({
  source_warehouse_uuid: '',
  destination_warehouse_uuid: '',
  transfer_date: new Date().toISOString().slice(0, 10),
  notes: '',
  items: [] as Array<{ product_uuid: string; quantity_requested: number; notes: string }>,
})

watch(() => props.isOpen, async (open) => {
  if (open) {
    error.value = ''
    form.value = {
      source_warehouse_uuid: '',
      destination_warehouse_uuid: '',
      transfer_date: new Date().toISOString().slice(0, 10),
      notes: '',
      items: [{ product_uuid: '', quantity_requested: 1, notes: '' }],
    }
    await Promise.all([
      store.fetchWarehouses(),
      store.fetchProducts(),
    ])
  }
})

function addItem() {
  form.value.items.push({ product_uuid: '', quantity_requested: 1, notes: '' })
}

function removeItem(i: number) {
  form.value.items.splice(i, 1)
}

const valid = computed(() =>
  form.value.source_warehouse_uuid &&
  form.value.destination_warehouse_uuid &&
  form.value.source_warehouse_uuid !== form.value.destination_warehouse_uuid &&
  form.value.items.length > 0 &&
  form.value.items.every(it => it.product_uuid && it.quantity_requested > 0)
)

async function save() {
  if (!valid.value) {
    error.value = 'Please fill all required fields. Source and destination must differ.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await store.createTransfer(form.value)
    emit('saved')
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to create transfer order.'
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

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-50 rounded-xl">
                <ArrowRightLeft class="h-5 w-5 text-blue-600" />
              </div>
              <h2 class="text-lg font-bold text-gray-900">New Transfer Order</h2>
            </div>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="save" class="px-8 py-6 space-y-6">
            <div v-if="error" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{{ error }}</div>

            <!-- Route -->
            <div>
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Transfer Route</h3>
              <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">From Warehouse</label>
                  <select v-model="form.source_warehouse_uuid"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">— Select Source —</option>
                    <option v-for="wh in store.warehouses" :key="wh.uuid" :value="wh.uuid"
                      :disabled="wh.uuid === form.destination_warehouse_uuid">
                      {{ wh.name }}
                    </option>
                  </select>
                </div>
                <div class="text-center">
                  <ArrowRightLeft class="h-5 w-5 text-gray-300 mx-auto" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">To Warehouse</label>
                  <select v-model="form.destination_warehouse_uuid"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">— Select Destination —</option>
                    <option v-for="wh in store.warehouses" :key="wh.uuid" :value="wh.uuid"
                      :disabled="wh.uuid === form.source_warehouse_uuid">
                      {{ wh.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="mt-4">
                <label class="block text-xs font-semibold text-gray-500 mb-1">Transfer Date</label>
                <input v-model="form.transfer_date" type="date"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
            </div>

            <!-- Items -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Items</h3>
                <button type="button" @click="addItem"
                  class="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                  <Plus class="h-3.5 w-3.5" /> Add Item
                </button>
              </div>

              <div class="space-y-3">
                <div v-for="(item, i) in form.items" :key="i"
                  class="grid grid-cols-[1fr_auto_auto] gap-3 items-start bg-gray-50 rounded-2xl p-3">
                  <div class="space-y-2">
                    <select v-model="item.product_uuid"
                      class="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">— Select Product —</option>
                      <option v-for="p in store.products" :key="p.uuid" :value="p.uuid">{{ p.name }} ({{ p.sku }})</option>
                    </select>
                    <input v-model="item.notes" type="text" placeholder="Notes (optional)"
                      class="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <div class="flex-shrink-0">
                    <input v-model.number="item.quantity_requested" type="number" min="1"
                      class="w-20 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-center font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>
                  <button type="button" @click="removeItem(i)"
                    :disabled="form.items.length === 1"
                    class="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Transfer Notes</label>
              <textarea v-model="form.notes" rows="2"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="emit('close')"
                class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" :disabled="saving || !valid"
                class="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
                <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                {{ saving ? 'Creating…' : 'Create Transfer' }}
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
