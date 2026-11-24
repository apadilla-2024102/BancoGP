import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../store/authStore.jsx';
import { NAV_ITEMS } from '../../config/navigation.js';
import { cn } from '../../utils/cn.js';
import { getInitials } from '../../utils/format.js';

export const Brand = () => (
  <div className="brand">
    <span className="brand__mark" aria-hidden="true">
      GP
    </span>
    <span className="brand__name">BancoGP</span>
  </div>
);

/** Navegación lateral. Sin animaciones de entrada: se usa decenas de veces al día. */
export const Sidebar = ({ className, onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const name = user?.username ?? 'Usuario';

  return (
    <aside className={cn('sidebar', className)}>
      <div className="sidebar__header">
        <Brand />
      </div>

      <nav className="sidebar__nav" aria-label="Navegación principal">
        <p className="sidebar__section">General</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, tone }) => (
          <NavLink
            key={to}
            to={to}
            data-tone={tone}
            onClick={onNavigate}
            className={({ isActive }) => cn('sidebar__link', isActive && 'is-active')}
          >
            <span className="sidebar__link-icon" aria-hidden="true">
              <Icon />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <span className="avatar" aria-hidden="true">
            {getInitials(name)}
          </span>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{name}</span>
            <span className="sidebar__user-role">{user?.role ?? 'USER'}</span>
          </div>
          <button type="button" className="sidebar__logout" onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <FiLogOut />
          </button>
        </div>
      </div>
    </aside>
  );
};
