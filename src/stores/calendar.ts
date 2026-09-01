import { defineStore } from 'pinia'
import { ref } from 'vue'
import { calendarRepository } from '@/repositories/calendar.repository'

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref<any[]>([])
  const tasks = ref<any[]>([])
  const interviews = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCalendarData(params: { start_date?: string; end_date?: string } = {}) {
    isLoading.value = true
    try {
      const res = await calendarRepository.getCalendarData(params)
      const data = res.data.data || {}
      events.value = data.events || []
      tasks.value = data.tasks || []
      interviews.value = data.interviews || []
    } catch (err: any) {
      error.value = err.message
      console.error('Failed to fetch calendar data:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createEvent(data: any) {
    const res = await calendarRepository.createEvent(data)
    await fetchCalendarData()
    return res.data
  }

  async function updateEvent(uuid: string, data: any) {
    const res = await calendarRepository.updateEvent(uuid, data)
    await fetchCalendarData()
    return res.data
  }

  async function deleteEvent(uuid: string) {
    await calendarRepository.deleteEvent(uuid)
    await fetchCalendarData()
  }

  async function createTask(data: any) {
    const res = await calendarRepository.createTask(data)
    await fetchCalendarData()
    return res.data
  }

  async function updateTask(uuid: string, data: any) {
    const res = await calendarRepository.updateTask(uuid, data)
    await fetchCalendarData()
    return res.data
  }

  async function deleteTask(uuid: string) {
    await calendarRepository.deleteTask(uuid)
    await fetchCalendarData()
  }

  return {
    events,
    tasks,
    interviews,
    isLoading,
    error,
    fetchCalendarData,
    createEvent,
    updateEvent,
    deleteEvent,
    createTask,
    updateTask,
    deleteTask,
  }
})
