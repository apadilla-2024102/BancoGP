import { useCallback, useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { MobileNav } from './MobileNav.jsx';

/** Estructura principal: barra lateral fija, barra superior y contenido. */
export const DashboardLayout = ({ title, subtitle, actions, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="layout">
      <Sidebar className="layout__sidebar" />
      <MobileNav open={menuOpen} onClose={closeMenu} />
      <div className="layout__main">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="layout__content">
          <header className="page-header animate-in">
            <div className="page-header__text">
              <h1 className="page-header__title">{title}</h1>
              {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header__actions">{actions}</div>}
          </header>
          <div className="page-body">{children}</div>
        </main>
      </div>
    </div>
  );
};
