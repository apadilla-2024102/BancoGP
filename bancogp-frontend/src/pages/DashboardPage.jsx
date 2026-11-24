import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCreditCard, FiDollarSign, FiRepeat, FiUsers } from 'react-icons/fi';
import { NAV_ITEMS } from '../shared/config/navigation.js';
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

const QUICK_DESCRIPTIONS = {
  '/customers': 'Registra clientes y consulta sus cuentas.',
  '/accounts': 'Busca cuentas y revisa saldos al instante.',
  '/transactions': 'Depósitos, retiros y transferencias.',
  '/products': 'Tipos de cuenta, monedas y tasas.',
  '/reports': 'Estadísticas y estados de cuenta.',
};

const QUICK_LINKS = NAV_ITEMS.filter((item) => QUICK_DESCRIPTIONS[item.to]);

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

      <section className="quick-actions" aria-labelledby="quick-title">
        <h2 id="quick-title" className="section-title">
          Accesos rápidos
        </h2>
        <div className="quick-actions__grid stagger">
          {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="quick-action">
              <span className="quick-action__icon">
                <Icon />
              </span>
              <span className="quick-action__text">
                <span className="quick-action__title">{label}</span>
                <span className="quick-action__description">{QUICK_DESCRIPTIONS[to]}</span>
              </span>
              <FiArrowUpRight className="quick-action__arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
