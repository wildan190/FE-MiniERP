import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authRepository } from '@/repositories'
import type { LoginResponse, UserRole, UserPermission } from '@/services'

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
  const roles = ref<UserRole[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!authRepository.getToken())

  // ── Role helpers ──────────────────────────────────────────────────────────

  /** Semua slug role yang dimiliki user, e.g. ['hr-manager', 'employee'] */
  const userRoles = computed(() => (roles.value || []).map((r) => r.slug))

  /** Apakah user adalah super-admin */
  const isSuperAdmin = computed(() =>
    userRoles.value.includes('super-admin') ||
    userRoles.value.includes('admin') ||
    userRoles.value.some((r) => r.toLowerCase().includes('super'))
  )

  // ── Permission helpers ────────────────────────────────────────────────────

  /**
   * Semua permission yang dimiliki user sebagai flat array of {slug, module}.
   * Digabungkan dari semua role yang dimiliki.
   */
  const userPermissions = computed<UserPermission[]>(() => {
    const seen = new Set<string>()
    const result: UserPermission[] = []
    for (const role of roles.value || []) {
      if (!role.permissions || !Array.isArray(role.permissions)) continue
      for (const rawPerm of role.permissions) {
        const perm = rawPerm as any
        if (typeof perm === 'string') {
          // Fallback if permission is just a string slug like 'hrm.employees.view'
          const modulePart = (perm as string).split('.')[0] || ''
          if (!seen.has(perm)) {
            seen.add(perm)
            result.push({ slug: perm, module: modulePart })
          }
        } else if (perm && perm.slug) {
          if (!seen.has(perm.slug)) {
            seen.add(perm.slug)
            result.push({ slug: perm.slug, module: perm.module || '' })
          }
        }
      }
    }
    return result
  })

  /** Semua slug permission, berguna untuk cek izin granular */
  const userPermissionSlugs = computed(() => new Set(userPermissions.value.map((p) => p.slug)))

  /**
   * Set module key yang boleh diakses user.
   *
   * Logic (100% data-driven — tidak ada hardcode role slug):
   * - super-admin → semua modul
   * - selain itu → setiap modul yang user punya minimal 1 permission-nya
   *
   * Contoh: user punya permission `{slug:'hrm.employees.view', module:'hrm'}`
   * maka 'hrm' masuk ke accessibleModules secara otomatis.
   */
  const accessibleModules = computed<Set<string>>(() => {
    // ESS (Self-Service) & Dashboard selalu accessible untuk semua user yang sudah login
    const modules = new Set<string>([
      'dashboard',
      'attendance',
      'leaves',
      'reimbursement',
      'payslips',
    ])

    if (isSuperAdmin.value) {
      // Super-admin dapat akses ke semua modul yang dikenal
      ;['crm', 'hrm', 'finance', 'purchasing', 'project', 'inventory', 'system'].forEach((m) =>
        modules.add(m),
      )
      return modules
    }

    // Derive modules dari permission.module — inilah yang dikontrol super admin
    for (const perm of userPermissions.value) {
      if (perm.module) modules.add(perm.module)
    }

    return modules
  })

  /** Cek apakah user boleh mengakses modul tertentu */
  function canAccessModule(moduleKey: string): boolean {
    return accessibleModules.value.has(moduleKey)
  }

  /** Cek apakah user punya permission slug tertentu */
  function hasPermission(permSlug: string): boolean {
    if (isSuperAdmin.value) return true
    return userPermissionSlugs.value.has(permSlug)
  }

  /** Cek apakah user memiliki role tertentu */
  function hasRole(roleSlug: string): boolean {
    return userRoles.value.includes(roleSlug)
  }

  /**
   * Cek apakah user memiliki hak HR/Admin penuh (bukan hanya ESS / self-service).
   * True jika: super-admin, punya role hr-manager/hr-admin/hrm-manager/admin, atau punya permission hrm.employees.manage/hrm.leave.approve
   */
  const hasHrAccess = computed(() => {
    if (isSuperAdmin.value) return true
    const hrRoleSlugs = ['super-admin', 'admin', 'hr-manager', 'hr-admin', 'hrm-manager', 'hr_manager', 'hr_admin']
    if (userRoles.value.some((r) => hrRoleSlugs.includes(r.toLowerCase()))) return true
    if (
      hasPermission('hrm.employees.manage') ||
      hasPermission('hrm.employees.view') ||
      hasPermission('hrm.leave.approve') ||
      hasPermission('hrm.reimbursement.approve') ||
      hasPermission('hrm.payroll.manage')
    ) {
      return true
    }
    return false
  })

  // ── Label untuk display ───────────────────────────────────────────────────

  /** Label role utama yang ditampilkan di sidebar */
  const primaryRoleLabel = computed(() => {
    if (roles.value.length === 0) return 'No Role'
    if (isSuperAdmin.value) return 'Super Admin'
    const first = roles.value[0]
    return first ? first.name : ''
  })

  // ── Actions ───────────────────────────────────────────────────────────────

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authRepository.login(email, password)

      if (response.user) {
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      if (response.roles) {
        roles.value = response.roles
        localStorage.setItem('userRoles', JSON.stringify(response.roles))
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
    } catch {
      // ignore logout errors — always clear local state
    } finally {
      user.value = null
      roles.value = []
      localStorage.removeItem('user')
      localStorage.removeItem('userRoles')
      isLoading.value = false
      error.value = null
    }
  }

  /**
   * Fetch fresh roles + permissions from the API.
   * Called automatically when roles are missing from localStorage (stale session).
   */
  async function fetchMyRoles() {
    if (!authRepository.isAuthenticated()) return
    try {
      const response = await authRepository.fetchMe()
      if (response.user) {
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      if (response.roles) {
        roles.value = response.roles
        localStorage.setItem('userRoles', JSON.stringify(response.roles))
      }
    } catch {
      // Silently fail — router guard will handle 401 via interceptor
    }
  }

  function loadUser() {
    const savedUser = localStorage.getItem('user')
    const savedRoles = localStorage.getItem('userRoles')

    if (savedUser && authRepository.isAuthenticated()) {
      user.value = JSON.parse(savedUser)
    }

    if (savedRoles) {
      roles.value = JSON.parse(savedRoles)
    } else if (authRepository.isAuthenticated()) {
      // Roles missing (stale session before RBAC was deployed) — fetch from API
      fetchMyRoles()
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    roles,
    isLoading,
    error,
    // Computed
    isAuthenticated,
    userRoles,
    isSuperAdmin,
    userPermissions,
    userPermissionSlugs,
    accessibleModules,
    primaryRoleLabel,
    hasHrAccess,
    // Methods
    canAccessModule,
    hasPermission,
    hasRole,
    login,
    logout,
    loadUser,
    fetchMyRoles,
    clearError,
  }
})
