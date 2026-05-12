import { apiClient } from '@/services/api/ApiClient'

export const projectRepository = {
  getDashboard() {
    return apiClient.getClient().get('/project/dashboard')
  },

  getResources() {
    return apiClient.getClient().get('/project/resources')
  },

  getFinancials() {
    return apiClient.getClient().get('/project/financials')
  },

  getProjects() {
    return apiClient.getClient().get('/project')
  },

  getProject(uuid: string) {
    return apiClient.getClient().get(`/project/${uuid}`)
  },

  createProject(data: any) {
    return apiClient.getClient().post('/project', data)
  },

  updateProject(uuid: string, data: any) {
    return apiClient.getClient().put(`/project/${uuid}`, data)
  },

  getTasks(projectUuid?: string) {
    const params = projectUuid ? { project_uuid: projectUuid } : {}
    return apiClient.getClient().get('/project/tasks', { params })
  },

  createTask(data: any) {
    return apiClient.getClient().post('/project/tasks', data)
  },

  updateTask(uuid: string, data: any) {
    return apiClient.getClient().put(`/project/tasks/${uuid}`, data)
  },

  reorderTasks(tasks: { uuid: string, order: number }[]) {
    return apiClient.getClient().put('/project/tasks/reorder', { tasks })
  },

  assignMember(data: any) {
    return apiClient.getClient().post('/project/members', data)
  },

  addExpense(data: any) {
    return apiClient.getClient().post('/project/costs', data)
  }
}
