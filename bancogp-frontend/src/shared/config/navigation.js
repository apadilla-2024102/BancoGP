import { FiBarChart2, FiCreditCard, FiGrid, FiLayers, FiRepeat, FiUsers } from 'react-icons/fi';

/** Rutas de la navegación principal. */
export const NAV_ITEMS = [
  { to: '/dashboard', tone: 'indigo', label: 'Panel principal', short: 'Panel', icon: FiGrid },
  { to: '/customers', tone: 'blue', label: 'Clientes', short: 'Clientes', icon: FiUsers },
  { to: '/accounts', tone: 'emerald', label: 'Cuentas', short: 'Cuentas', icon: FiCreditCard },
  { to: '/transactions', tone: 'violet', label: 'Transacciones', short: 'Movimientos', icon: FiRepeat },
  { to: '/products', tone: 'amber', label: 'Productos financieros', short: 'Productos', icon: FiLayers },
  { to: '/reports', tone: 'rose', label: 'Reportes', short: 'Reportes', icon: FiBarChart2 },
];
