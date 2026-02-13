import { authService, type LoginResponse } from '@/services'

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

  getToken(): string | null {
    return authService.getToken()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authRepository = new AuthRepository()
