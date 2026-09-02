import { defineStore } from 'pinia'
import { ref } from 'vue'
import { rbacRepository } from '@/repositories/rbac.repository'

export const useRbacStore = defineStore('rbac', () => {
  const roles = ref<any[]>([])
  const permissions = ref<Record<string, any[]>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRoles() {
    isLoading.value = true
    try {
      const res = await rbacRepository.getRoles()
      roles.value = res.data.data || []
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPermissions() {
    try {
      const res = await rbacRepository.getPermissions()
      permissions.value = res.data.data || {}
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function createRole(data: any) {
    const res = await rbacRepository.createRole(data)
    await fetchRoles()
    return res.data
  }

  async function assignUserRole(userUuid: string, rolesList: string[]) {
    const res = await rbacRepository.assignUserRole(userUuid, rolesList)
    return res.data
  }

  async function updateRole(uuid: string, data: any) {
    const res = await rbacRepository.updateRole(uuid, data)
    await fetchRoles()
    return res.data
  }

  async function deleteRole(uuid: string) {
    await rbacRepository.deleteRole(uuid)
    await fetchRoles()
  }

  return {
    roles,
    permissions,
    isLoading,
    error,
    fetchRoles,
    fetchPermissions,
    createRole,
    updateRole,
    deleteRole,
    assignUserRole,
  }
})
