import { apiClient } from '@/services/api/ApiClient'

export const rbacRepository = {
  getRoles() {
    return apiClient.getClient().get('/system/roles')
  },

  createRole(data: { name: string; slug: string; description?: string; permissions?: string[] }) {
    return apiClient.getClient().post('/system/roles', data)
  },

  getPermissions() {
    return apiClient.getClient().get('/system/permissions')
  },

  assignUserRole(userUuid: string, roles: string[]) {
    return apiClient.getClient().post(`/system/users/${userUuid}/roles`, { roles })
  },

  updateRole(uuid: string, data: { name: string; slug: string; description?: string; permissions?: string[] }) {
    return apiClient.getClient().put(`/system/roles/${uuid}`, data)
  },

  deleteRole(uuid: string) {
    return apiClient.getClient().delete(`/system/roles/${uuid}`)
  },
}
