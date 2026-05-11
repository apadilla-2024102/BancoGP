import { useEffect, useState } from 'react';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getStatistics, getFinancialReport, generateAccountStatement } from '../shared/api/reportsApi.js';

export default function ReportsPage() {
  const [statistics, setStatistics] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [statementResult, setStatementResult] = useState(null);
  const [statementForm, setStatementForm] = useState({ accountId: '', startDate: '', endDate: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getStatistics().then(setStatistics).catch(() => setMessage('No se pudieron cargar las estadísticas.'));
  }, []);

  const handleFinancialReport = async () => {
    setMessage('');
    try {
      const result = await getFinancialReport({ startDate: '', endDate: '', format: 'pdf' });
      setFinancial(result);
    } catch {
      setMessage('No se pudo generar el reporte financiero.');
    }
  };

  const handleStatement = async () => {
    setMessage('');
    try {
      const result = await generateAccountStatement(statementForm);
      setStatementResult(result);
    } catch {
      setMessage('No se pudo generar el estado de cuenta.');
    }
  };

  return (
    <DashboardLayout title="Reportes y Notificaciones" subtitle="Revisa informes y estadísticas del banco.">
      <div className="section-grid">
        <section className="panel-card">
          <h2>Estadísticas</h2>
          {statistics ? (
            <div className="stats-grid">
              <div className="stat-card">
                <span>{statistics.totalCustomers ?? '-'}</span>
                <p>Clientes</p>
              </div>
              <div className="stat-card">
                <span>{statistics.totalAccounts ?? '-'}</span>
                <p>Cuentas</p>
              </div>
              <div className="stat-card">
                <span>{statistics.totalTransactions ?? '-'}</span>
                <p>Transacciones</p>
              </div>
              <div className="stat-card">
                <span>{statistics.totalBalance != null ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(statistics.totalBalance) : '-'}</span>
                <p>Balance total</p>
              </div>
            </div>
          ) : (
            <p>Cargando estadísticas...</p>
          )}
          {message && <p className="error-text">{message}</p>}
        </section>

        <section className="panel-card">
          <h2>Reportes</h2>
          <button className="btn btn--primary btn--small" onClick={handleFinancialReport}>Generar reporte financiero</button>
          {financial && (
            <div className="info-card">
              <p><strong>Reporte:</strong> {financial.reportId ?? 'Sin ID'}</p>
              <p><strong>URL:</strong> {financial.url ?? '-'}</p>
            </div>
          )}
          <div className="statement-card">
            <h3>Estado de cuenta</h3>
            <div className="form-row">
              <input type="text" value={statementForm.accountId} onChange={(e) => setStatementForm((prev) => ({ ...prev, accountId: e.target.value }))} placeholder="ID de cuenta" />
              <input type="date" value={statementForm.startDate} onChange={(e) => setStatementForm((prev) => ({ ...prev, startDate: e.target.value }))} />
              <input type="date" value={statementForm.endDate} onChange={(e) => setStatementForm((prev) => ({ ...prev, endDate: e.target.value }))} />
            </div>
            <button className="btn btn--secondary btn--small" onClick={handleStatement}>Generar estado</button>
            {statementResult && (
              <div className="info-card">
                <p><strong>ID:</strong> {statementResult.reportId ?? '-'}</p>
                <p><strong>URL:</strong> {statementResult.url ?? '-'}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
