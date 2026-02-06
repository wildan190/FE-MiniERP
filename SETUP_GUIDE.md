# Frontend MiniERP - Complete Setup & Usage Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Architecture & Design Patterns](#architecture--design-patterns)
5. [Running the Application](#running-the-application)
6. [API Integration](#api-integration)
7. [Features & Pages](#features--pages)
8. [Component Usage](#component-usage)
9. [State Management](#state-management)
10. [Development Best Practices](#development-best-practices)

---

## 🎯 Project Overview

**Frontend MiniERP** adalah aplikasi web modern untuk manajemen enterprise yang dibangun dengan:
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - Lightweight state management
- **Axios** - HTTP client untuk API calls

### Key Features
- 🔐 **Authentication Module** dengan login/logout
- 📊 **Dashboard** dengan user information
- 🎯 **CRM Dashboard** dengan analytics dan metrics
- 📱 **Responsive Design** untuk semua devices
- 🏗️ **Clean Architecture** dengan design patterns
- ⚡ **Type Safety** dengan full TypeScript support

---

## 💻 Installation

### Prerequisites
```bash
- Node.js 18 atau lebih tinggi
- npm 9 atau lebih tinggi (atau yarn)
```

### Step 1: Install Dependencies
```bash
cd /Users/wildanbelfiore/FE-MiniERP
npm install
```

### Step 2: Verify Installation
```bash
# Check TypeScript compilation
npm run type-check

# Run linting
npm run lint
```

---

## 📁 Project Structure

```
FE-MiniERP/
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Reusable components
│   │   └── common/         # Common UI components
│   │       ├── Button.vue
│   │       ├── Card.vue
│   │       ├── Input.vue
│   │       ├── FormField.vue
│   │       ├── Alert.vue
│   │       └── Spinner.vue
│   ├── layouts/            # Layout components
│   │   └── AppLayout.vue   # Main app layout
│   ├── pages/              # Page components
│   │   ├── LoginPage.vue
│   │   ├── DashboardPage.vue
│   │   └── CRMDashboardPage.vue
│   ├── router/             # Vue Router configuration
│   │   └── index.ts
│   ├── services/           # Business logic & API
│   │   ├── api/
│   │   │   └── ApiClient.ts
│   │   └── index.ts
│   ├── repositories/       # Data access layer
│   │   └── index.ts
│   ├── stores/             # Pinia state management
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   └── counter.ts
│   ├── styles/             # Global styles
│   │   └── index.css       # Tailwind directives
│   ├── App.vue             # Root component
│   ├── main.ts             # Application entry point
│   └── env.d.ts            # TypeScript declarations
├── public/                 # Public assets
├── tailwind.config.ts      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── package.json
└── README.md
```

---

## 🏗️ Architecture & Design Patterns

### 1. **Service Pattern**
Services menghandle business logic dan API calls:

```typescript
// src/services/index.ts
export class AuthService {
  async login(email: string, password: string): Promise<LoginResponse>
  async logout(): Promise<void>
  getToken(): string | null
  setToken(token: string): void
}

export class DashboardService {
  async getDashboard(): Promise<DashboardResponse>
  async getCRMDashboard(): Promise<CRMDashboardResponse>
}
```

**Usage:**
```typescript
import { authService } from '@/services'

const response = await authService.login('email@example.com', 'password')
```

### 2. **Repository Pattern**
Repository mengabstrak data access layer:

```typescript
// src/repositories/index.ts
export class AuthRepository {
  async login(email: string, password: string): Promise<LoginResponse>
  async logout(): Promise<void>
  getToken(): string | null
  isAuthenticated(): boolean
}
```

**Usage:**
```typescript
import { authRepository } from '@/repositories'

const isAuth = authRepository.isAuthenticated()
```

### 3. **MVVM (ViewModel Pattern)**
Pinia stores bertindak sebagai ViewModel:

```typescript
// src/stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  async function login(email: string, password: string) { ... }
  async function logout() { ... }

  return { user, isLoading, error, isAuthenticated, login, logout }
})
```

**Usage di Components:**
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Akses state
console.log(authStore.user)
console.log(authStore.isAuthenticated)

// Panggil actions
await authStore.login(email, password)
```

### Data Flow Diagram
```
User Interaction (Component)
    ↓
    Component Event Handler
    ↓
    Store Action (useAuthStore.login())
    ↓
    Repository (authRepository.login())
    ↓
    Service (authService.login())
    ↓
    API Client (axios)
    ↓
    Backend API
    ↓
    (Response) Store State Update
    ↓
    Component Re-render
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173/`

### Production Build
```bash
npm run build
```
Output akan tersimpan di folder `dist/`

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
npm run test:unit          # Unit tests
npm run test:e2e           # End-to-end tests
```

### Linting & Formatting
```bash
npm run lint               # Run linting
npm run format             # Format code dengan oxfmt
```

---

## 📡 API Integration

### API Base URL
```typescript
const API_BASE_URL = 'http://localhost:8001/api/platform'
```

### Authentication Endpoints

#### 1. Login
```
POST /api/platform/login
Content-Type: application/json

{
  "email": "wildanbelfiore@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "Wildan Belfiore",
    "email": "wildanbelfiore@example.com",
    "email_verified_at": null,
    "created_at": "2026-02-05T18:25:07.000000Z",
    "updated_at": "2026-02-05T18:25:07.000000Z"
  }
}
```

#### 2. Logout
```
POST /api/platform/logout
Authorization: Bearer {token}

Response:
{
  "message": "Successfully logged out"
}
```

### Dashboard Endpoints

#### 1. Dashboard
```
GET /api/platform/dashboard
Authorization: Bearer {token}

Response:
{
  "message": "Welcome to platform dashboard",
  "user": {
    "id": 1,
    "name": "Wildan Belfiore",
    "email": "wildanbelfiore@example.com",
    "email_verified_at": null,
    "created_at": "2026-02-05T18:25:07.000000Z",
    "updated_at": "2026-02-05T18:25:07.000000Z"
  }
}
```

#### 2. CRM Dashboard
```
GET /api/platform/crm/dashboard
Authorization: Bearer {token}

Response:
{
  "metrics": {
    "total_customers": 1,
    "total_leads": 2,
    "total_prospects": 1,
    "active_pipelines": 1,
    "total_quotation": 2,
    "quotation_value": "40000000.00",
    "prospect_by_status": [
      {
        "status": "qualified",
        "total": 1
      }
    ]
  }
}
```

### API Client Configuration
```typescript
// src/services/api/ApiClient.ts
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - auto include auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle 401 errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 🎨 Features & Pages

### 1. **Login Page** (`/login`)
**Path:** `src/pages/LoginPage.vue`

Fitur:
- Email & password form
- Error handling & validation
- Loading state dengan spinner
- Demo credentials display
- Beautiful gradient background
- Responsive design

**Components Used:**
- FormField
- Button
- Card
- Alert
- Spinner

### 2. **Dashboard Page** (`/dashboard`)
**Path:** `src/pages/DashboardPage.vue`

Fitur:
- User welcome message
- User information card dengan avatar
- Account status card
- Last updated timestamp
- CTA button ke CRM
- Responsive layout

**Components Used:**
- AppLayout
- Card
- Button
- Alert
- Spinner

### 3. **CRM Dashboard Page** (`/crm`)
**Path:** `src/pages/CRMDashboardPage.vue`

Fitur:
- KPI metrics cards (Customers, Leads, Prospects, Pipelines)
- Quotation statistics
- Prospect status breakdown
- Revenue analytics
- Conversion rate calculation
- Action buttons (New Lead, Create Quotation, Export)
- Colorful metrics with icons
- Growth indicators

**Components Used:**
- AppLayout
- Card
- Button
- Alert
- Spinner

### 4. **App Layout** (`src/layouts/AppLayout.vue`)
Main layout untuk semua authenticated pages:
- Header dengan logo
- Navigation menu
- User profile dropdown
- Logout functionality
- Sticky header
- Responsive sidebar (mobile ready)

---

## 🎯 Component Usage

### Common Components

#### 1. Button Component
```vue
<template>
  <Button variant="primary" @click="handleClick">
    Click Me
  </Button>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button.vue'
</script>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' (default: 'primary')
- `disabled`: boolean

#### 2. Card Component
```vue
<template>
  <Card>
    <h3>Card Title</h3>
    <p>Card content</p>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
</script>
```

#### 3. FormField Component
```vue
<template>
  <FormField
    label="Email"
    type="email"
    placeholder="Enter email"
    v-model="email"
    :error="error"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormField from '@/components/common/FormField.vue'

const email = ref('')
const error = ref('')
</script>
```

**Props:**
- `label`: string (required)
- `type`: string (default: 'text')
- `placeholder`: string
- `modelValue`: string
- `error`: string

#### 4. Alert Component
```vue
<template>
  <Alert
    message="Success message"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import Alert from '@/components/common/Alert.vue'
</script>
```

**Props:**
- `message`: string (required)

**Events:**
- `@close`: void

#### 5. Spinner Component
```vue
<template>
  <Spinner />
</template>

<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue'
</script>
```

---

## 🔄 State Management

### Authentication Store

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Read state
authStore.user        // User | null
authStore.isLoading   // boolean
authStore.error       // string | null
authStore.isAuthenticated  // computed boolean

// Call actions
await authStore.login(email, password)
await authStore.logout()

// Utility methods
authStore.loadUser()        // Load user dari localStorage
authStore.clearError()      // Clear error message
```

### Dashboard Store

```typescript
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()

// Read state
dashboardStore.dashboardData      // DashboardResponse | null
dashboardStore.crmDashboardData   // CRMDashboardResponse | null
dashboardStore.isLoading          // boolean
dashboardStore.error              // string | null

// Call actions
await dashboardStore.fetchDashboard()
await dashboardStore.fetchCRMDashboard()

// Utility methods
dashboardStore.clearError()      // Clear error message
```

### Usage in Components

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

// Inside component
const userName = computed(() => authStore.user?.name)
</script>

<template>
  <div v-if="authStore.isLoading">Loading...</div>
  <div v-else>{{ userName }}</div>
</template>
```

---

## 🔐 Authentication & Routing

### Protected Routes

Router configuration dengan authentication guard:

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.loadUser()

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  // Redirect tidak authenticated users ke login
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Redirect authenticated users dari login ke dashboard
  else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  }
  else {
    next()
  }
})
```

### Routes

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | - | Yes | Redirect to /dashboard |
| `/login` | LoginPage | No | Login page |
| `/dashboard` | DashboardPage | Yes | Main dashboard |
| `/crm` | CRMDashboardPage | Yes | CRM dashboard |

---

## 🎨 Styling & Tailwind CSS

### Tailwind Configuration
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: { 50, 100, 200, ..., 900 },
      secondary: { 50, 100, 200, ..., 900 },
    },
  },
}
```

### Custom CSS Components
```css
/* Buttons */
.btn              /* Base button */
.btn-primary      /* Primary button */
.btn-secondary    /* Secondary button */
.btn-outline      /* Outline button */

/* Card */
.card             /* Card component */

/* Input */
.input            /* Input field */
```

### Usage Example
```vue
<template>
  <!-- Using Tailwind utilities -->
  <div class="flex items-center gap-4 p-4 rounded-lg bg-primary-50">
    <button class="btn btn-primary">Click me</button>
  </div>

  <!-- Using custom components -->
  <input class="input" placeholder="Enter text" />
  <div class="card">Card content</div>
</template>
```

---

## 📱 Responsive Design

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Responsive Classes
```html
<!-- Mobile first -->
<div class="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Items -->
</div>

<!-- Flexbox -->
<div class="flex flex-col md:flex-row items-center gap-4">
  <!-- Items -->
</div>
```

---

## 🛠️ Development Best Practices

### 1. Type Safety
Selalu gunakan TypeScript interfaces:
```typescript
interface User {
  id: number
  name: string
  email: string
}

function getUser(id: number): Promise<User> {
  // ...
}
```

### 2. Component Structure
```vue
<template>
  <!-- Template -->
</template>

<script setup lang="ts">
// Imports
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Type definitions
interface Props {
  title: string
}

// Props & Emits
defineProps<Props>()
defineEmits<{ update: [value: string] }>()

// Composables
const router = useRouter()
const store = useStore()

// Local state
const count = ref(0)
const computed = computed(() => count.value * 2)

// Methods
function handleClick() { }

// Lifecycle
onMounted(() => { })
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### 3. Error Handling
```typescript
try {
  await authStore.login(email, password)
  router.push('/dashboard')
} catch (error) {
  console.error('Login failed:', error)
  // Error sudah ditangani di store
}
```

### 4. Loading States
Selalu tampilkan loading indicator:
```vue
<template>
  <div v-if="store.isLoading">
    <Spinner />
  </div>
  <div v-else>
    <!-- Content -->
  </div>
</template>
```

### 5. Environment Variables
Gunakan `.env.local` untuk konfigurasi:
```env
VITE_API_BASE_URL=http://localhost:8001
VITE_APP_NAME=MiniERP
```

Akses di aplikasi:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

---

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Guide](https://router.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Port 5173 already in use
```bash
npm run dev -- --port 3000
```

**Issue:** Module not found error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue:** TypeScript errors
```bash
npm run type-check
```

**Issue:** Port 8001 (backend) tidak accessible
- Pastikan backend sudah running
- Check URL di `src/services/api/ApiClient.ts`
- Check CORS settings di backend

---

## 📞 Support

Untuk bantuan atau pertanyaan, silahkan hubungi tim development atau buka issue di repository.

---

**Happy Coding! 🚀**
