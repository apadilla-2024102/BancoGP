import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiBarChart2, FiCreditCard, FiDollarSign, FiRepeat, FiSend, FiUsers } from 'react-icons/fi';
import { NAV_ITEMS } from '../shared/config/navigation.js';
import { useAuth } from '../store/authStore.jsx';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getCustomers } from '../shared/api/customersApi.js';
import { getStatistics } from '../shared/api/reportsApi.js';
import { DotPattern, NumberTicker, StatCard } from '../shared/components/ui/index.js';
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
      <section className="hero-banner animate-in" aria-label="Resumen general">
        <DotPattern size={18} className="hero-banner__dots" />
        <div className="hero-banner__orb hero-banner__orb--one" aria-hidden="true" />
        <div className="hero-banner__orb hero-banner__orb--two" aria-hidden="true" />
        <div className="hero-banner__content">
          <span className="hero-banner__eyebrow">Balance consolidado</span>
          <p className="hero-banner__amount">
            <NumberTicker value={stats.totalBalance} format={formatMoney} />
          </p>
          <p className="hero-banner__text">
            Gestiona clientes, cuentas y movimientos desde un solo lugar.
          </p>
          <div className="hero-banner__actions">
            <Link to="/transactions" className="hero-button hero-button--light">
              <FiSend aria-hidden="true" /> Nueva transferencia
            </Link>
            <Link to="/reports" className="hero-button hero-button--ghost">
              <FiBarChart2 aria-hidden="true" /> Ver reportes <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="hero-banner__card" aria-hidden="true">
          <div className="mini-card">
            <div className="mini-card__row">
              <span className="mini-card__chip" />
              <span>BancoGP</span>
            </div>
            <span className="mini-card__number">•••• 2024</span>
            <div className="mini-card__row mini-card__row--muted">
              <span>{user?.username ?? 'Titular'}</span>
              <span>12/30</span>
            </div>
          </div>
        </div>
      </section>

      <div className="stat-grid stagger">
        <StatCard tone="blue" label="Clientes registrados" value={stats.totalCustomers} icon={<FiUsers />} loading={loading} />
        <StatCard tone="emerald" label="Cuentas activas" value={stats.totalAccounts} icon={<FiCreditCard />} loading={loading} />
        <StatCard tone="violet" label="Transacciones" value={stats.totalTransactions} icon={<FiRepeat />} loading={loading} />
        <StatCard
          tone="amber"
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
          {QUICK_LINKS.map(({ to, label, icon: Icon, tone }) => (
            <Link key={to} to={to} className="quick-action" data-tone={tone}>
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
