import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './store/authStore.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';

function ProtectedRoute({ children }) {
  try {
    const { token, loading } = useAuth();
    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>;
    return token ? children : <Navigate to="/login" replace />;
  } catch (error) {
    // If auth context is not available, redirect to login
    return <Navigate to="/login" replace />;
  }
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            <AccountsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
