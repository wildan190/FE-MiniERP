<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ShieldCheck, Lock, Check, X, Loader2, Key } from 'lucide-vue-next'
import { useRbacStore } from '../../stores/rbac'
import type { User, RoleSummary } from '../../services/hrm/types/employee.types'

const props = defineProps<{
  isOpen: boolean
  user: User | null
  userName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated', updatedUser: any): void
}>()

const rbacStore = useRbacStore()
const selectedRoleSlugs = ref<string[]>([])
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)
const search = ref('')

onMounted(async () => {
  if (!rbacStore.roles.length) {
    await rbacStore.fetchRoles()
  }
})

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      errorMessage.value = null
      search.value = ''
      if (!rbacStore.roles.length) {
        await rbacStore.fetchRoles()
      }
      if (props.user?.roles) {
        selectedRoleSlugs.value = props.user.roles.map((r: RoleSummary) => r.slug)
      } else {
        selectedRoleSlugs.value = []
      }
    }
  }
)

const filteredRoles = computed(() => {
  if (!search.value) return rbacStore.roles
  const q = search.value.toLowerCase()
  return rbacStore.roles.filter(
    (r: any) => r.name.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q)
  )
})

function toggleRole(slug: string) {
  const idx = selectedRoleSlugs.value.indexOf(slug)
  if (idx > -1) {
    selectedRoleSlugs.value.splice(idx, 1)
  } else {
    selectedRoleSlugs.value.push(slug)
  }
}

async function handleSave() {
  if (!props.user?.uuid) {
    errorMessage.value = 'User UUID is missing.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    const res = await rbacStore.assignUserRole(props.user.uuid, selectedRoleSlugs.value)
    emit('updated', res.data)
    emit('close')
  } catch (err: any) {
    errorMessage.value =
      err.response?.data?.message || err.message || 'Failed to update roles.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

        <!-- Dialog Box -->
        <div
          class="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-primary-100 text-primary-700 rounded-2xl">
                <ShieldCheck class="h-6 w-6" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Manage User Roles</h2>
                <p class="text-xs text-gray-500">
                  Assigning access policies to
                  <span class="font-semibold text-gray-800">{{ userName || user?.name || 'User' }}</span>
                </p>
              </div>
            </div>
            <button
              @click="emit('close')"
              class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4 overflow-y-auto flex-1">
            <div
              v-if="errorMessage"
              class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm"
            >
              {{ errorMessage }}
            </div>

            <!-- Search Roles -->
            <div>
              <input
                v-model="search"
                type="text"
                placeholder="Search available roles..."
                class="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            <!-- Role Checklist Cards -->
            <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              <div
                v-for="role in filteredRoles"
                :key="role.uuid || role.slug"
                @click="toggleRole(role.slug)"
                :class="[
                  'p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3',
                  selectedRoleSlugs.includes(role.slug)
                    ? 'border-primary-500 bg-primary-50/40 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50',
                ]"
              >
                <div class="flex items-start gap-3">
                  <div
                    :class="[
                      'p-2 rounded-xl transition-colors mt-0.5',
                      selectedRoleSlugs.includes(role.slug)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-500',
                    ]"
                  >
                    <Lock class="h-4 w-4" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-gray-900">{{ role.name }}</span>
                      <span
                        v-if="role.is_system"
                        class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800"
                      >
                        System
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {{ role.description || 'Full privileges associated with this role.' }}
                    </p>
                    <div class="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2">
                      <Key class="h-3 w-3" />
                      <span>{{ role.permissions?.length || 0 }} module permissions</span>
                    </div>
                  </div>
                </div>

                <!-- Checkbox Indicator -->
                <div
                  :class="[
                    'h-5 w-5 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 mt-1',
                    selectedRoleSlugs.includes(role.slug)
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300 bg-white',
                  ]"
                >
                  <Check v-if="selectedRoleSlugs.includes(role.slug)" class="h-3.5 w-3.5 stroke-[3]" />
                </div>
              </div>

              <div
                v-if="!filteredRoles.length"
                class="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl"
              >
                No roles found.
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span class="text-xs text-gray-500 font-medium">
              Selected: <strong class="text-primary-700">{{ selectedRoleSlugs.length }}</strong> roles
            </span>
            <div class="flex gap-2">
              <button
                type="button"
                @click="emit('close')"
                class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="handleSave"
                :disabled="isSubmitting"
                class="px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-all shadow-md shadow-primary-200 flex items-center gap-2"
              >
                <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
                {{ isSubmitting ? 'Saving...' : 'Save Roles' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
