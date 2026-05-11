import { useEffect, useState } from 'react';
import { useAuth } from '../store/authStore.jsx';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getCustomers } from '../shared/api/customersApi.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const customersResponse = await getCustomers();
        setStats((prev) => ({
          ...prev,
          totalCustomers: customersResponse.customers?.length ?? 0,
        }));
      } catch {
        console.error('Error loading stats');
      }
    };

    loadStats();
  }, []);

  return (
    <DashboardLayout title="Panel de Control Ejecutivo" subtitle="Monitorea y gestiona todas las operaciones de tu institución financiera desde un solo lugar.">
      <div className="dashboard-welcome-card">
        <h2>¡Bienvenido al Panel Ejecutivo!</h2>
        <p>Administra tu institución financiera con herramientas profesionales y toma decisiones informadas con datos en tiempo real.</p>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-value">{stats.totalCustomers}</div>
          <div className="stat-label">Clientes registrados</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.totalAccounts}</div>
          <div className="stat-label">Cuentas activas</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.totalTransactions}</div>
          <div className="stat-label">Transacciones</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
