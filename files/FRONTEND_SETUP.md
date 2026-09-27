# React + Vite Frontend Setup Guide

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── MFAVerification.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── Document/
│   │   │   ├── DocumentList.jsx
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── DocumentViewer.jsx
│   │   │   ├── DocumentMetadata.jsx
│   │   │   ├── DocumentVersionHistory.jsx
│   │   │   ├── DocumentSearch.jsx
│   │   │   └── DigitalSignature.jsx
│   │   │
│   │   ├── Case/
│   │   │   ├── CaseList.jsx
│   │   │   ├── CaseDetails.jsx
│   │   │   ├── CaseCreate.jsx
│   │   │   ├── CaseTimeline.jsx
│   │   │   └── CaseDocuments.jsx
│   │   │
│   │   ├── AccessControl/
│   │   │   ├── PermissionManager.jsx
│   │   │   ├── AccessGrantForm.jsx
│   │   │   ├── AccessAuditLog.jsx
│   │   │   └── UserRoleManager.jsx
│   │   │
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── MainLayout.jsx
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── StatisticsWidget.jsx
│   │   │   ├── RecentDocuments.jsx
│   │   │   ├── ActiveCases.jsx
│   │   │   └── UserActivityFeed.jsx
│   │   │
│   │   ├── Admin/
│   │   │   ├── UserManagement.jsx
│   │   │   ├── RoleManagement.jsx
│   │   │   ├── SystemConfig.jsx
│   │   │   └── AuditReports.jsx
│   │   │
│   │   └── Common/
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── Notification.jsx
│   │       ├── Modal.jsx
│   │       ├── Breadcrumb.jsx
│   │       └── EmptyState.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── Cases.jsx
│   │   ├── Admin.jsx
│   │   ├── Audit.jsx
│   │   ├── Analytics.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/
│   │   ├── api.js                       # Axios instance
│   │   ├── auth.js
│   │   ├── documents.js
│   │   ├── cases.js
│   │   ├── audit.js
│   │   ├── blockchain.js
│   │   └── analytics.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDocuments.js
│   │   ├── useCases.js
│   │   ├── useFetch.js
│   │   ├── useLocalStorage.js
│   │   └── useNotification.js
│   │
│   ├── stores/
│   │   ├── authStore.js                 # Zustand auth store
│   │   ├── documentStore.js
│   │   ├── caseStore.js
│   │   ├── notificationStore.js
│   │   └── uiStore.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── errorHandler.js
│   │   └── permissions.js
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   ├── tailwind.css
│   │   └── animations.css
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── App.css
│
├── public/
│   └── vite.svg
│
├── tests/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   └── utils/
│
├── .env.example
├── .env.development
├── .env.production
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Installation & Setup

### 1. Create Vite Project

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### 2. Install Dependencies

```bash
npm install
```

### 3. package.json

```json
{
  "name": "secure-dms-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.jsx",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.5",
    "zustand": "^4.4.1",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.4.1",
    "tailwindcss": "^3.3.6",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "react-pdf": "^7.5.0",
    "react-dropzone": "^14.2.3",
    "recharts": "^2.10.3",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "vitest": "^1.1.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6"
  }
}
```

### 4. Environment Configuration

**.env.example**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Secure DMS
VITE_ENV=development
VITE_LOG_LEVEL=debug
```

**.env.development**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Secure DMS (Dev)
VITE_ENV=development
VITE_LOG_LEVEL=debug
```

**.env.production**
```env
VITE_API_BASE_URL=https://api.dms.example.com/api/v1
VITE_APP_NAME=Secure DMS
VITE_ENV=production
VITE_LOG_LEVEL=error
```

### 5. Vite Configuration

**vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
})
```

### 6. Tailwind CSS Setup

**tailwind.config.js**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        danger: '#dc2626',
        success: '#16a34a',
        warning: '#ea580c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**postcss.config.js**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Core Implementation Files

### 1. API Service (src/services/api.js)

```javascript
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        useAuthStore.setState({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.setState({ accessToken: null, refreshToken: null });
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 2. Auth Store (src/stores/authStore.js)

```javascript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,

        login: (user, accessToken, refreshToken) => {
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        },

        logout: () => {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        },

        updateUser: (user) => {
          set({ user });
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);
```

### 3. Auth Hook (src/hooks/useAuth.js)

```javascript
import { useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const signIn = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', {
        username: email,
        password,
      });

      login(data.user, data.access_token, data.refresh_token);
      return data;
    } catch (error) {
      throw error.response?.data?.detail || 'Login failed';
    }
  }, [login]);

  const signOut = useCallback(async () => {
    try {
      await api.post('/auth/logout');
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      logout();
    }
  }, [logout]);

  const signUp = useCallback(async (formData) => {
    try {
      const { data } = await api.post('/auth/register', formData);
      return data;
    } catch (error) {
      throw error.response?.data?.detail || 'Registration failed';
    }
  }, []);

  return {
    user,
    isAuthenticated,
    signIn,
    signOut,
    signUp,
  };
}
```

### 4. Protected Route (src/components/Auth/ProtectedRoute.jsx)

```javascript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function ProtectedRoute({ children, requiredRoles = null }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

### 5. Login Component (src/components/Auth/LoginForm.jsx)

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Secure DMS
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 6. Document Upload Component (src/components/Document/DocumentUpload.jsx)

```javascript
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import api from '../../services/api';

export function DocumentUpload({ caseId, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: 'other',
    classification: 'confidential',
    description: '',
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const file = acceptedFiles[0];

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('case_id', caseId);
      data.append('document_type', formData.documentType);
      data.append('classification_level', formData.classification);
      data.append('description', formData.description);

      await api.post('/documents', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Document uploaded successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  }, [caseId, formData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff'],
    },
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Upload Document</h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary-600">Drop files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Drag files here or click to select</p>
            <p className="text-sm text-gray-400">PDF, DOC, DOCX, Images up to 50MB</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Document Type
          </label>
          <select
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="fir">FIR</option>
            <option value="report">Report</option>
            <option value="witness_statement">Witness Statement</option>
            <option value="charge_sheet">Charge Sheet</option>
            <option value="evidence">Evidence</option>
            <option value="judgment">Judgment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Classification Level
          </label>
          <select
            value={formData.classification}
            onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="public">Public</option>
            <option value="confidential">Confidential</option>
            <option value="secret">Secret</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            rows="3"
            placeholder="Enter document description"
          />
        </div>
      </div>
    </div>
  );
}
```

## Running the Application

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Docker Deployment

**Dockerfile**
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist ./dist
EXPOSE 5173
CMD ["http-server", "dist", "-p", "5173"]
```

## Project Configuration Files

**ESLint Configuration (.eslintrc.json)**
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

This setup provides everything needed to build a modern, secure React frontend for the Secure DMS application!

