import { useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { NAV_ITEMS } from '../../config/navigation.js';
import { Badge, Button, ThemeToggle } from '../ui/index.js';
import { Brand } from './Sidebar.jsx';

export const Topbar = ({ onOpenMenu }) => {
  const { pathname } = useLocation();
  const current = NAV_ITEMS.find((item) => pathname.startsWith(item.to));

  return (
    <header className="topbar">
      <div className="topbar__left">
        <Button variant="ghost" size="icon" className="topbar__menu" onClick={onOpenMenu} aria-label="Abrir menú">
          <FiMenu />
        </Button>
        <div className="topbar__brand-mobile">
          <Brand />
        </div>
        <nav className="breadcrumb" aria-label="Ruta">
          <span className="breadcrumb__item">BancoGP</span>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          <span className="breadcrumb__item is-current">{current?.label ?? 'Inicio'}</span>
        </nav>
      </div>
      <div className="topbar__right">
        <Badge tone="success" dot className="topbar__status">
          Sistema operativo
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  );
};
