import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authRepository } from '@/repositories'
import type { LoginResponse } from '@/services'

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!authRepository.getToken())

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authRepository.login(email, password)
      
      if (response.user) {
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    error.value = null

    try {
      await authRepository.logout()
      user.value = null
      localStorage.removeItem('user')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
    } finally {
      isLoading.value = false
    }
  }

  function loadUser() {
    const savedUser = localStorage.getItem('user')
    if (savedUser && authRepository.isAuthenticated()) {
      user.value = JSON.parse(savedUser)
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    loadUser,
    clearError,
  }
})
