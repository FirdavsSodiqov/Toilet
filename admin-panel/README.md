# Toilet Admin Panel

Standalone React admin panel for the Toilet Finder project.

## Run

```bash
cd admin-panel
npm install
npm run dev
```

The dev server uses port `5174` by default.

## Structure

```text
admin-panel/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   └── ui/
    │       ├── Button.jsx
    │       ├── Card.jsx
    │       └── Input.jsx
    ├── features/
    │   ├── auth/
    │   │   ├── pages/
    │   │   │   └── LoginPage.jsx
    │   │   └── services/
    │   │       └── authService.js
    │   ├── dashboard/
    │   │   ├── components/
    │   │   │   └── StatCard.jsx
    │   │   └── pages/
    │   │       └── DashboardPage.jsx
    │   └── users/
    │       └── pages/
    │           └── UsersPage.jsx
    ├── layouts/
    │   └── AdminLayout.jsx
    ├── lib/
    │   └── cn.js
    ├── routes/
    │   ├── AppRoutes.jsx
    │   └── ProtectedRoute.jsx
    ├── services/
    │   └── apiClient.js
    └── store/
        ├── authStore.js
        └── uiStore.js
```
