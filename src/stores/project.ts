import { defineStore } from 'pinia'
import { ref } from 'vue'
import { projectRepository } from '@/repositories/project/project.repository'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<any[]>([])
  const currentProject = ref<any>(null)
  const tasks = ref<any[]>([])
  const dashboardData = ref<any>(null)
  const resourceData = ref<any>(null)
  const financialData = ref<any>(null)
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    isLoading.value = true
    try {
      const response = await projectRepository.getDashboard()
      dashboardData.value = response.data.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchResources() {
    isLoading.value = true
    try {
      const response = await projectRepository.getResources()
      resourceData.value = response.data.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFinancials() {
    isLoading.value = true
    try {
      const response = await projectRepository.getFinancials()
      financialData.value = response.data.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProjects() {
    isLoading.value = true
    try {
      const response = await projectRepository.getProjects()
      projects.value = response.data.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProjectDetail(uuid: string) {
    isLoading.value = true
    try {
      const response = await projectRepository.getProject(uuid)
      currentProject.value = response.data.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createProject(data: any) {
    isLoading.value = true
    try {
      await projectRepository.createProject(data)
      await fetchProjects()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTasks(projectUuid?: string) {
    isLoading.value = true
    try {
      const response = await projectRepository.getTasks(projectUuid)
      tasks.value = response.data.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(data: any) {
    isLoading.value = true
    try {
      await projectRepository.createTask(data)
      if (data.project_uuid) {
        await fetchTasks(data.project_uuid)
      } else {
        await fetchTasks()
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(uuid: string, data: any) {
    isLoading.value = true
    try {
      await projectRepository.updateTask(uuid, data)
      if (data.project_uuid) {
        await fetchTasks(data.project_uuid)
      } else {
        await fetchTasks()
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function assignMember(data: any) {
    isLoading.value = true
    try {
      await projectRepository.assignMember(data)
      await fetchResources()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function addExpense(data: any) {
    isLoading.value = true
    try {
      await projectRepository.addExpense(data)
      await fetchFinancials()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    currentProject,
    tasks,
    dashboardData,
    resourceData,
    financialData,
    isLoading,
    error,
    fetchDashboard,
    fetchResources,
    fetchFinancials,
    fetchProjects,
    fetchProjectDetail,
    createProject,
    fetchTasks,
    createTask,
    updateTask,
    assignMember,
    addExpense
  }
})
