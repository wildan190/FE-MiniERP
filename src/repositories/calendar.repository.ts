import { apiClient } from '@/services/api/ApiClient'

export const calendarRepository = {
  // Get Calendar Overview
  getCalendarData(params: { start_date?: string; end_date?: string } = {}) {
    return apiClient.getClient().get('/system/calendar', { params })
  },

  // Events CRUD
  createEvent(data: any) {
    return apiClient.getClient().post('/system/calendar/events', data)
  },
  updateEvent(uuid: string, data: any) {
    return apiClient.getClient().put(`/system/calendar/events/${uuid}`, data)
  },
  deleteEvent(uuid: string) {
    return apiClient.getClient().delete(`/system/calendar/events/${uuid}`)
  },

  // Tasks CRUD
  createTask(data: any) {
    return apiClient.getClient().post('/system/calendar/tasks', data)
  },
  updateTask(uuid: string, data: any) {
    return apiClient.getClient().put(`/system/calendar/tasks/${uuid}`, data)
  },
  deleteTask(uuid: string) {
    return apiClient.getClient().delete(`/system/calendar/tasks/${uuid}`)
  },
}
