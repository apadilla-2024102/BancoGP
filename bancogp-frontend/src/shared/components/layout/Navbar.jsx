import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/authStore.jsx';

export const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span>Banco</span>
        <span className="navbar__brand-accent">GP</span>
      </div>
      <nav className="navbar__links">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}>
          Panel Principal
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}>
          Gestión de Clientes
        </NavLink>
        <NavLink to="/accounts" className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}>
          Cuentas Bancarias
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}>
          Transacciones
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}>
          Productos Financieros
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}>
          Reportes y Analytics
        </NavLink>
      </nav>
      <div className="navbar__actions">
        {user && (
          <div className="navbar__profile">
            <div className="navbar__avatar">{(user.username ?? 'U').charAt(0).toUpperCase()}</div>
            <div className="navbar__profile-info">
              <span className="navbar__username">{user.username ?? 'Usuario'}</span>
            </div>
          </div>
        )}
        <button className="btn btn--secondary navbar__logout" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
};
