import { authService, type LoginResponse } from '@/services'
import { apiClient } from '@/services/api/ApiClient'

export class AuthRepository {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await authService.login(email, password)
    if (response.token) {
      authService.setToken(response.token)
    }
    return response
  }

  async logout(): Promise<void> {
    await authService.logout()
    authService.removeToken()
  }

  /**
   * Fetch the currently authenticated user's profile with their roles + permissions.
   * Used to hydrate RBAC data for existing sessions (without requiring re-login).
   */
  async fetchMe(): Promise<LoginResponse> {
    const response = await apiClient.getClient().get<LoginResponse>('/me')
    return response.data
  }

  getToken(): string | null {
    return authService.getToken()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authRepository = new AuthRepository()
