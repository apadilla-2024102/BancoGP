import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCreditCard, FiDollarSign, FiRepeat, FiUsers } from 'react-icons/fi';
import { useAuth } from '../store/authStore.jsx';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getCustomers } from '../shared/api/customersApi.js';
import { getStatistics } from '../shared/api/reportsApi.js';
import { StatCard } from '../shared/components/ui/index.js';
import { formatCurrency } from '../shared/utils/format.js';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

const formatMoney = (n) => formatCurrency(n);

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalBalance: 0,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getCustomers(), getStatistics()]).then(([customersResult, statsResult]) => {
      if (cancelled) return;
      const customers = customersResult.status === 'fulfilled' ? customersResult.value?.customers ?? [] : [];
      const statistics = statsResult.status === 'fulfilled' ? statsResult.value ?? {} : {};
      setStats({
        totalCustomers: statistics.totalCustomers ?? customers.length,
        totalAccounts: statistics.totalAccounts ?? 0,
        totalTransactions: statistics.totalTransactions ?? 0,
        totalBalance: statistics.totalBalance ?? 0,
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Intl.DateTimeFormat('es-GT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <DashboardLayout
      title={`${getGreeting()}, ${user?.username ?? 'equipo'}`}
      subtitle={`Resumen de la operación de hoy, ${today}.`}
    >
      <div className="stat-grid stagger">
        <StatCard label="Clientes registrados" value={stats.totalCustomers} icon={<FiUsers />} loading={loading} />
        <StatCard label="Cuentas activas" value={stats.totalAccounts} icon={<FiCreditCard />} loading={loading} />
        <StatCard label="Transacciones" value={stats.totalTransactions} icon={<FiRepeat />} loading={loading} />
        <StatCard
          label="Balance total"
          value={stats.totalBalance}
          format={formatMoney}
          icon={<FiDollarSign />}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
