import { FiBarChart2, FiCreditCard, FiGrid, FiLayers, FiRepeat, FiUsers } from 'react-icons/fi';

/** Rutas de la navegación principal. */
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Panel principal', short: 'Panel', icon: FiGrid },
  { to: '/customers', label: 'Clientes', short: 'Clientes', icon: FiUsers },
  { to: '/accounts', label: 'Cuentas', short: 'Cuentas', icon: FiCreditCard },
  { to: '/transactions', label: 'Transacciones', short: 'Movimientos', icon: FiRepeat },
  { to: '/products', label: 'Productos financieros', short: 'Productos', icon: FiLayers },
  { to: '/reports', label: 'Reportes', short: 'Reportes', icon: FiBarChart2 },
];
