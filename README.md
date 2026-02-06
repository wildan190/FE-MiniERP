# 🚀 Frontend MiniERP

A modern, beautiful, and responsive Frontend for MiniERP - Enterprise Resource Planning application built with Vue 3, TypeScript, and Tailwind CSS.

## ✨ Key Features

- 🔐 **Authentication Module** - Secure login/logout with token-based auth
- 📊 **Dashboard** - Beautiful welcome screen with user information
- 🎯 **CRM Dashboard** - Comprehensive sales metrics and analytics
- 📱 **Fully Responsive** - Mobile-first design, works on all devices
- 🏗️ **Clean Architecture** - Service, Repository, and MVVM patterns
- 🔒 **Protected Routes** - Automatic authentication guards
- 💾 **State Management** - Centralized Pinia store
- ⚡ **Type Safety** - Full TypeScript support
- 🎨 **Beautiful UI** - Tailwind CSS with custom components
- 🚀 **Production Ready** - Optimized build and deployment ready

## 📸 Screenshots

### Login Page
- Modern gradient background
- Intuitive form with validation
- Demo credentials display
- Responsive design

### Dashboard Page
- User welcome message with time-based greeting
- User profile card with avatar
- Account status information
- CRM navigation CTA

### CRM Dashboard
- 4 KPI metric cards (Customers, Leads, Prospects, Pipelines)
- Quotation statistics with revenue breakdown
- Prospect status tracking
- Conversion rate calculations
- Beautiful action buttons

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router 5
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Testing**: Vitest, Nightwatch

## 📋 Prerequisites

- Node.js 18 or higher
- npm 9 or higher (or yarn)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## 📚 Documentation

### Architecture & Design
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Project structure, design patterns, and data flow
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup guide with API documentation
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - How to add new features

### Quick Links
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [State Management](#state-management)
- [Components](#components)

## 📁 Project Structure

```
src/
├── components/
│   └── common/              # Reusable UI components
│       ├── Button.vue
│       ├── Card.vue
│       ├── Input.vue
│       ├── FormField.vue
│       ├── Alert.vue
│       └── Spinner.vue
├── layouts/
│   └── AppLayout.vue        # Main application layout
├── pages/
│   ├── LoginPage.vue        # Login page
│   ├── DashboardPage.vue    # Dashboard
│   └── CRMDashboardPage.vue # CRM Dashboard
├── router/
│   └── index.ts             # Vue Router config
├── services/
│   ├── api/
│   │   └── ApiClient.ts     # Axios configuration
│   └── index.ts             # Service classes
├── repositories/
│   └── index.ts             # Data access layer
├── stores/
│   ├── auth.ts              # Auth store (Pinia)
│   ├── dashboard.ts         # Dashboard store
│   └── counter.ts           # Example store
├── styles/
│   └── index.css            # Global styles
├── App.vue                  # Root component
└── main.ts                  # Application entry
```

## 📡 API Integration

### Base URL
```
http://localhost:8001/api/platform
```

### Authentication Endpoints

**Login**
```
POST /login
Content-Type: application/json

{
  "email": "wildanbelfiore@example.com",
  "password": "password123"
}
```

**Logout**
```
POST /logout
Authorization: Bearer {token}
```

### Dashboard Endpoints

**Get Dashboard**
```
GET /dashboard
Authorization: Bearer {token}
```

**Get CRM Dashboard**
```
GET /crm/dashboard
Authorization: Bearer {token}
```

## 🔐 Authentication

### Login Flow
1. User enters email and password
2. Submit to backend `/login` endpoint
3. Backend returns JWT token and user data
4. Frontend stores token in localStorage
5. Token automatically included in subsequent requests
6. Redirect to dashboard

### Logout Flow
1. User clicks logout
2. Call backend `/logout` endpoint
3. Clear token from localStorage
4. Redirect to login page
5. 401 errors automatically trigger logout

### Protected Routes
- `/` → redirects to `/dashboard`
- `/login` → no auth required
- `/dashboard` → requires auth
- `/crm` → requires auth

## 🎨 State Management with Pinia

### Auth Store
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Properties
authStore.user              // Current user
authStore.isLoading        // Loading state
authStore.error            // Error message
authStore.isAuthenticated  // Computed boolean

// Methods
await authStore.login(email, password)
await authStore.logout()
authStore.clearError()
authStore.loadUser()
```

### Dashboard Store
```typescript
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()

// Properties
dashboardStore.dashboardData    // Dashboard data
dashboardStore.crmDashboardData // CRM metrics
dashboardStore.isLoading        // Loading state
dashboardStore.error            // Error message

// Methods
await dashboardStore.fetchDashboard()
await dashboardStore.fetchCRMDashboard()
dashboardStore.clearError()
```

## 🎯 Components

### Button
```vue
<Button variant="primary" @click="handleClick">
  Click Me
</Button>
```
Variants: `primary`, `secondary`, `outline`

### Card
```vue
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
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
  message="Success message"
  @close="handleClose"
/>
```

### Spinner
```vue
<Spinner />
```

## 🎨 Styling with Tailwind CSS

### Custom Colors
```css
Primary: bg-primary-600
Secondary: bg-secondary-600
```

### Custom Components
```css
.btn           /* Base button */
.btn-primary   /* Primary button */
.btn-secondary /* Secondary button */
.btn-outline   /* Outline button */
.card          /* Card container */
.input         /* Input field */
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 768px - 1024px
- Desktop: > 1024px

All components are tested and optimized for all screen sizes.

## 🔄 Data Flow

```
Component → Store (Pinia) → Repository → Service → API
   ↓
 Emit
 Actions
   ↓
Store Actions → Mutations → State
   ↓
Computed Properties
   ↓
Component Re-render
```

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run type-check      # Check TypeScript
npm run lint            # Run linting
npm run format          # Format code

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test:unit       # Run unit tests
npm run test:e2e        # Run e2e tests
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Server
The `dist/` folder contains the production-ready files. Upload to your hosting:

```bash
# Example with nginx
scp -r dist/* user@server:/var/www/minierp
```

### Environment Configuration
Create `.env.local` file:
```env
VITE_API_BASE_URL=http://your-api.com
VITE_APP_NAME=MiniERP
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Dependencies Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run type-check
```

### CORS Error (Backend not accessible)
- Ensure backend is running on `http://localhost:8001`
- Check CORS settings in backend
- Verify API endpoint in `src/services/api/ApiClient.ts`

## 📖 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Guide](https://router.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)

## 📄 License

MIT License - feel free to use this project for your purposes.

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Made with ❤️ for enterprise applications**

For detailed documentation, see:
- [📚 SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup and usage guide
- [🏗️ ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture and design patterns
- [🛠️ DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Guide for adding new features
