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
  }
}
