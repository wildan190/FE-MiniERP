# Frontend MiniERP

Frontend application untuk MiniERP dengan fitur Authentication, Dashboard, dan CRM Management.

## 🎯 Features

- ✅ **Authentication Module** - Login dan Logout
- ✅ **Dashboard** - Welcome screen dengan user information
- ✅ **CRM Dashboard** - Metrics dan analytics untuk sales
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Design Patterns** - MVVM, Repository Pattern, Service Pattern
- ✅ **State Management** - Pinia untuk global state
- ✅ **Type Safety** - Full TypeScript support

## 🏗️ Architecture

Project ini menggunakan architecture pattern yang clean dan scalable:

```
src/
├── components/          # Reusable UI components
│   └── common/         # Common components (Button, Card, Input, etc)
├── layouts/            # Layout components (AppLayout)
├── pages/              # Page components
├── router/             # Vue Router configuration
├── services/           # Business logic & API calls
│   └── api/           # API client configuration
├── repositories/       # Data access layer (Repository pattern)
├── stores/            # Pinia state management
├── styles/            # Global styles dan Tailwind CSS
└── types/             # TypeScript type definitions
```

## 📋 Design Patterns

### 1. **Service Pattern**
Services meng-handle business logic dan API calls:
- `AuthService` - Mengelola authentication
- `DashboardService` - Mengelola dashboard data

### 2. **Repository Pattern**
Repository meng-abstract data access layer:
- `AuthRepository` - Mengelola auth operations
- `DashboardRepository` - Mengelola dashboard operations

### 3. **MVVM (ViewModel)**
Menggunakan Pinia stores sebagai ViewModel:
- `useAuthStore()` - Auth state & actions
- `useDashboardStore()` - Dashboard state & actions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test:unit
```

## 📡 API Endpoints

### Authentication
- **Login**: `POST /api/platform/login`
  ```json
  {
    "email": "wildanbelfiore@example.com",
    "password": "password123"
  }
  ```

- **Logout**: `POST /api/platform/logout`

### Dashboard
- **Dashboard**: `GET /api/platform/dashboard`

### CRM
- **CRM Dashboard**: `GET /api/platform/crm/dashboard`

## 🎨 UI Components

### Common Components
- **Button** - Primary, Secondary, Outline variants
- **Card** - Container component dengan shadow
- **Input** - Input field dengan styling
- **FormField** - Input with label dan error handling
- **Alert** - Alert notification
- **Spinner** - Loading indicator

## 🎯 Pages

### Login Page
- Email & password form
- Error handling
- Demo credentials display
- Responsive design

### Dashboard Page
- User welcome message
- User information card
- Account status
- Navigation ke CRM

### CRM Dashboard Page
- KPI metrics (Customers, Leads, Prospects, Pipelines)
- Quotation statistics
- Prospect status tracking
- Revenue analytics
- Action buttons

## 🔐 Authentication Guard

Router menggunakan navigation guard untuk protect routes:
- Routes yang memerlukan auth redirect ke login jika belum authenticated
- Authenticated users redirect ke dashboard saat akses login page
- Token disimpan di localStorage

## 🎨 Styling

Project menggunakan **Tailwind CSS** untuk styling:
- Custom colors (primary, secondary)
- Custom components (btn, card, input)
- Responsive grid system
- Animation support

## 📦 Dependencies

- **Vue 3** - Frontend framework
- **Vue Router** - Routing
- **Pinia** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **TypeScript** - Type safety

## 🔄 Data Flow

```
Component → Store (Pinia) → Repository → Service → API
   ↓          (useAuthStore)   (AuthRepo)   (AuthSvc)
  Emit                  ↓
  Actions            Actions → Mutations → State
                         ↓
                      Computed
                         ↓
                      Component
```

## 📝 Best Practices

1. **Type Safety** - Semua data typed dengan TypeScript interfaces
2. **Separation of Concerns** - Service, Repository, dan Store terpisah
3. **Reusable Components** - Common components untuk DRY principle
4. **Error Handling** - Try-catch dan error messages
5. **Loading States** - Spinner and loading indicators
6. **Responsive Design** - Mobile-first approach

## 🚀 Deployment

```bash
# Build untuk production
npm run build

# Output akan di folder dist/
```

## 📄 License

MIT
