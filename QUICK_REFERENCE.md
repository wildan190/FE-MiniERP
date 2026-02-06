# Frontend MiniERP - Quick Reference Guide

## 🚀 Quick Start

### Start Development Server
```bash
cd /Users/wildanbelfiore/FE-MiniERP
npm install
npm run dev
```
→ Open `http://localhost:5173/`

### Production Build
```bash
npm run build
npm run preview
```

## 📍 Key Routes

| Route | Component | Auth | Purpose |
|-------|-----------|------|---------|
| `/` | - | Yes | Redirect to /dashboard |
| `/login` | LoginPage | No | User login |
| `/dashboard` | DashboardPage | Yes | Main dashboard |
| `/crm` | CRMDashboardPage | Yes | CRM analytics |

## 💾 Key Files & Their Purpose

### Services Layer
**`src/services/index.ts`** - API communication
- `AuthService` - Login/logout API calls
- `DashboardService` - Fetch dashboard data
- Interfaces: LoginRequest, LoginResponse, DashboardResponse, CRMDashboardResponse

### Repository Layer
**`src/repositories/index.ts`** - Data access abstraction
- `AuthRepository` - Auth business logic
- `DashboardRepository` - Dashboard business logic
- Abstract API layer from components

### State Management
**`src/stores/auth.ts`** - Authentication state
- User data
- Loading & error states
- `login()`, `logout()`, `loadUser()` actions

**`src/stores/dashboard.ts`** - Dashboard state
- Dashboard & CRM dashboard data
- `fetchDashboard()`, `fetchCRMDashboard()` actions

### Components
**`src/components/common/`** - Reusable UI components
- Button, Card, Input, FormField, Alert, Spinner

### Pages
**`src/pages/`** - Page-level components
- LoginPage, DashboardPage, CRMDashboardPage

### Layout
**`src/layouts/AppLayout.vue`** - Main application layout
- Header, navigation, user menu

## 🔐 Authentication Flow

```
1. User visits /login
2. Fills email & password
3. Calls authStore.login()
4. authStore calls authRepository.login()
5. authRepository calls authService.login()
6. authService makes POST /api/platform/login
7. Response: { token, user }
8. Store token in localStorage
9. Update authStore.user
10. Redirect to /dashboard
```

## 🔄 Data Flow Example

```typescript
// In LoginPage.vue
const handleLogin = async () => {
  try {
    // 1. Call store action
    await authStore.login(email, password)
    // 2. Store action calls repository
    // 3. Repository calls service
    // 4. Service makes API call
    // 5. Response updates store state
    // 6. Component detects state change
    // 7. Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    // Error handled in store
  }
}
```

## 📦 Component Usage Examples

### Button
```vue
<Button variant="primary" @click="handleClick">
  Click Me
</Button>
```

### Card
```vue
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

### FormField
```vue
<FormField
  label="Email"
  type="email"
  placeholder="Enter email"
  v-model="email"
  :error="error"
/>
```

### Alert
```vue
<Alert
  message="Error message"
  @close="clearError()"
/>
```

## 🎨 Tailwind CSS Classes

### Buttons
```html
<!-- Primary button -->
<button class="btn btn-primary">Click</button>

<!-- Secondary button -->
<button class="btn btn-secondary">Click</button>

<!-- Outline button -->
<button class="btn btn-outline">Click</button>
```

### Layout
```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Items -->
</div>

<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  <!-- Items -->
</div>
```

### Colors
```html
<!-- Primary color -->
<div class="bg-primary-600 text-white">Primary</div>

<!-- Secondary color -->
<div class="bg-secondary-600 text-white">Secondary</div>

<!-- Success color -->
<span class="bg-green-100 text-green-700">Active</span>
```

## 🔗 API Endpoints

### Login
```
POST /api/platform/login
Body: { "email": string, "password": string }
Response: { "token": string, "user": User }
```

### Logout
```
POST /api/platform/logout
Headers: { "Authorization": "Bearer {token}" }
```

### Dashboard
```
GET /api/platform/dashboard
Headers: { "Authorization": "Bearer {token}" }
Response: { "message": string, "user": User }
```

### CRM Dashboard
```
GET /api/platform/crm/dashboard
Headers: { "Authorization": "Bearer {token}" }
Response: { "metrics": CRMMetrics }
```

## 📝 Common Code Patterns

### Using Store
```typescript
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    
    return {
      user: computed(() => authStore.user),
      isLoading: computed(() => authStore.isLoading),
      handleLogin: () => authStore.login(email, password)
    }
  }
}
```

### Fetching Data
```typescript
import { useDashboardStore } from '@/stores/dashboard'
import { onMounted } from 'vue'

const dashboardStore = useDashboardStore()

onMounted(async () => {
  await dashboardStore.fetchDashboard()
})
```

### Error Handling
```typescript
try {
  await authStore.login(email, password)
  router.push('/dashboard')
} catch (error) {
  console.error('Login failed:', error)
  // Error already in authStore.error
}
```

### Loading State
```vue
<template>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <!-- Content -->
  </div>
</template>
```

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check     # TypeScript check
npm run lint           # Run linting

# Production
npm run build          # Build for production
npm run preview        # Preview production

# Testing
npm run test:unit      # Unit tests
npm run test:e2e       # E2E tests
```

## 🐛 Debugging Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Check API calls
4. Verify response status & data

### Check State
1. Open Vue DevTools
2. Go to Pinia tab
3. Check store state
4. Inspect mutations & actions

### Check Errors
1. Open Console
2. Look for error messages
3. Check error stack traces
4. Verify API response

### Common Issues

**Port 5173 already in use**
```bash
npm run dev -- --port 3000
```

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
npm run type-check
```

**CORS error**
- Check backend is running on localhost:8001
- Check CORS settings in backend
- Verify API endpoint in ApiClient.ts

## 📚 Documentation Links

- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture details
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup guide
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Add new features
- [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md) - Feature list
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project completion

## 🎯 File Locations

```
Login Form       → src/pages/LoginPage.vue
Dashboard        → src/pages/DashboardPage.vue
CRM Dashboard    → src/pages/CRMDashboardPage.vue
App Layout       → src/layouts/AppLayout.vue
Auth Store       → src/stores/auth.ts
Dashboard Store  → src/stores/dashboard.ts
Auth Service     → src/services/index.ts
Button Component → src/components/common/Button.vue
Router Config    → src/router/index.ts
Tailwind Config  → tailwind.config.ts
```

## 💡 Tips & Tricks

### Create New Component Quickly
```bash
# Create in components/common/
# Use composition API with <script setup>
# Import in pages needed
```

### Add New Route
```typescript
// 1. Create page component
// 2. Add route in src/router/index.ts
// 3. Update AppLayout.vue navigation
// 4. Add meta: { requiresAuth: true/false }
```

### Add New Store
```typescript
// 1. Create store in src/stores/
// 2. Use defineStore('name', () => { ... })
// 3. Import in component with useStore()
// 4. Use in template with store.property
```

### Fetch Data from API
```typescript
// 1. Create service method
// 2. Create repository method
// 3. Create store action
// 4. Call in onMounted()
// 5. Use computed in template
```

## ✨ Best Practices

✅ Always use TypeScript interfaces
✅ Handle loading states
✅ Show error messages
✅ Use Pinia for state
✅ Keep components small & reusable
✅ Use composition API
✅ Document complex logic
✅ Test responsive design
✅ Validate user inputs
✅ Handle edge cases

## 🚀 Ready for Production

This project is production-ready with:
- Full TypeScript support
- Comprehensive error handling
- Loading states management
- Responsive design
- Security features
- Clean architecture
- Complete documentation
- Best practices implemented

---

**Last Updated**: February 6, 2026
**Status**: ✅ Complete & Production Ready
