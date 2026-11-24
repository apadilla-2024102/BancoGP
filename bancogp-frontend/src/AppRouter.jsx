import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './store/authStore.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { Spinner } from './shared/components/ui/index.js';

// Cada módulo se descarga solo cuando se visita
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const CustomersPage = lazy(() => import('./pages/CustomersPage.jsx'));
const AccountsPage = lazy(() => import('./pages/AccountsPage.jsx'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const ReportsPage = lazy(() => import('./pages/ReportsPage.jsx'));

const FullScreenLoader = ({ label = 'Cargando tu sesión…' }) => (
  <div className="fullscreen-loader">
    <Spinner size={20} />
    <span>{label}</span>
  </div>
);

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!token) return <Navigate to="/login" replace />;
  return <Suspense fallback={<FullScreenLoader label="Cargando…" />}>{children}</Suspense>;
}

const PROTECTED_ROUTES = [
  { path: '/dashboard', Component: DashboardPage },
  { path: '/customers', Component: CustomersPage },
  { path: '/accounts', Component: AccountsPage },
  { path: '/transactions', Component: TransactionsPage },
  { path: '/products', Component: ProductsPage },
  { path: '/reports', Component: ReportsPage },
];

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {PROTECTED_ROUTES.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <Component />
            </ProtectedRoute>
          }
        />
      ))}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
