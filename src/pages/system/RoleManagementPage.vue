<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRbacStore } from '@/stores/rbac'
import AppLayout from '@/layouts/AppLayout.vue'
import { ShieldCheck, Plus, Lock, Key, Check, X, Search, Loader2 } from 'lucide-vue-next'

const rbacStore = useRbacStore()
const showModal = ref(false)
const search = ref('')
const saving = ref(false)
const modalError = ref('')

const newRole = ref({
  name: '',
  slug: '',
  description: '',
  selectedPermissions: [] as string[],
})

onMounted(async () => {
  await Promise.all([
    rbacStore.fetchRoles(),
    rbacStore.fetchPermissions(),
  ])
})

const filteredRoles = computed(() => {
  if (!search.value) return rbacStore.roles
  return rbacStore.roles.filter(r =>
    r.name.toLowerCase().includes(search.value.toLowerCase()) ||
    r.slug.toLowerCase().includes(search.value.toLowerCase())
  )
})

function generateSlug() {
  newRole.value.slug = newRole.value.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function togglePermission(permUuid: string) {
  const idx = newRole.value.selectedPermissions.indexOf(permUuid)
  if (idx > -1) {
    newRole.value.selectedPermissions.splice(idx, 1)
  } else {
    newRole.value.selectedPermissions.push(permUuid)
  }
}

async function handleSaveRole() {
  if (!newRole.value.name || !newRole.value.slug) {
    modalError.value = 'Role name and slug are required.'
    return
  }

  saving.value = true
  modalError.value = ''
  try {
    await rbacStore.createRole({
      name: newRole.value.name,
      slug: newRole.value.slug,
      description: newRole.value.description,
      permissions: newRole.value.selectedPermissions,
    })
    showModal.value = false
    newRole.value = { name: '', slug: '', description: '', selectedPermissions: [] }
  } catch (e: any) {
    modalError.value = e.response?.data?.message || e.message || 'Failed to create role.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck class="h-6 w-6 text-primary-600" /> Dynamic Role & Permission Management
          </h1>
          <p class="text-gray-500">Configure roles, scope permissions per module, and manage access policies.</p>
        </div>
        <button @click="showModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-100 transition-all">
          <Plus class="h-4 w-4" /> Add New Role
        </button>
      </div>

      <!-- Filter bar -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input v-model="search" type="text" placeholder="Search roles by name or slug..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all" />
        </div>
      </div>

      <!-- Roles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="role in filteredRoles" :key="role.uuid"
          class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between mb-3">
              <div class="p-3 bg-primary-50 rounded-2xl">
                <Lock class="h-6 w-6 text-primary-600" />
              </div>
              <span :class="['text-xs font-bold px-2.5 py-1 rounded-full', role.is_system ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700']">
                {{ role.is_system ? 'System Role' : 'Custom Role' }}
              </span>
            </div>

            <h3 class="font-bold text-gray-900 text-lg">{{ role.name }}</h3>
            <p class="text-xs font-mono text-gray-400 mt-0.5">{{ role.slug }}</p>
            <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ role.description || 'No description provided.' }}</p>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <Key class="h-3.5 w-3.5 text-gray-400" />
              <span>{{ role.permissions?.length || 0 }} permissions</span>
            </div>
            <span class="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">Active</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Role Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showModal = false" />

          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-primary-50 rounded-xl">
                  <ShieldCheck class="h-5 w-5 text-primary-600" />
                </div>
                <h2 class="text-lg font-bold text-gray-900">Create Dynamic Role</h2>
              </div>
              <button @click="showModal = false" class="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                <X class="h-5 w-5" />
              </button>
            </div>

            <form @submit.prevent="handleSaveRole" class="px-8 py-6 space-y-6">
              <div v-if="modalError" class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
                {{ modalError }}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Role Name <span class="text-rose-500">*</span></label>
                  <input v-model="newRole.name" @input="generateSlug" type="text" required placeholder="e.g. Regional Accountant"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Slug <span class="text-rose-500">*</span></label>
                  <input v-model="newRole.slug" type="text" required placeholder="regional-accountant"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-primary-500" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea v-model="newRole.description" rows="2" placeholder="Brief responsibility details..."
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
              </div>

              <!-- Permission Grid per Module -->
              <div>
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Module Permissions</h3>
                <div class="space-y-4 max-h-64 overflow-y-auto pr-2">
                  <div v-for="(perms, moduleName) in rbacStore.permissions" :key="moduleName"
                    class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h4 class="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2 text-primary-700">{{ moduleName }}</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div v-for="p in perms" :key="p.uuid"
                        @click="togglePermission(p.uuid)"
                        :class="[
                          'flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all',
                          newRole.selectedPermissions.includes(p.uuid)
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
                        ]">
                        <Check v-if="newRole.selectedPermissions.includes(p.uuid)" class="h-3.5 w-3.5" />
                        <span class="truncate">{{ p.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button type="button" @click="showModal = false"
                  class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" :disabled="saving"
                  class="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all disabled:opacity-60 flex items-center gap-2">
                  <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                  {{ saving ? 'Saving…' : 'Create Role' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
