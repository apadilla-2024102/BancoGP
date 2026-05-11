import { Navbar } from './Navbar.jsx';

export const DashboardLayout = ({ title, subtitle, children }) => {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-background-shape" />
      <div className="dashboard-background-shape dashboard-background-shape--two" />
      <Navbar />
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="dashboard-topbar__title-group">
            <span className="dashboard-topbar__eyebrow">Sistema de Gestión Bancaria</span>
            <h2 className="dashboard-topbar__title">{title}</h2>
          </div>
          <div className="dashboard-topbar__status">Estado del sistema: Operativo</div>
        </div>
        <main className="dashboard-content">
          <section className="page-shell__card">
            <div className="page-shell__header">
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {children}
          </section>
        </main>
      </div>
    </div>
  );
};
