import { apiClient } from './api/ApiClient'
import type { LoginRequest, LoginResponse } from './types'

export class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.getClient().post<LoginResponse>('/login', {
      email,
      password,
    })
    return response.data
  }

  async logout(): Promise<void> {
    await apiClient.getClient().post('/logout')
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  removeToken(): void {
    localStorage.removeItem('auth_token')
  }
}

export const authService = new AuthService()
