import { useEffect, useState } from 'react';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getStatistics, getFinancialReport, generateAccountStatement } from '../shared/api/reportsApi.js';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiBarChart2, FiUsers, FiFileText } from 'react-icons/fi';

export default function ReportsPage() {
  const [statistics, setStatistics] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [statementResult, setStatementResult] = useState(null);
  const [statementForm, setStatementForm] = useState({ accountId: '', startDate: '', endDate: '' });
  const [reportForm, setReportForm] = useState({ 
    startDate: '2026-01-01', 
    endDate: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getStatistics().then(setStatistics).catch(() => setMessage('No se pudieron cargar las estadísticas.'));
  }, []);

  const handleFinancialReport = async () => {
    setMessage('');
    try {
      const result = await getFinancialReport(reportForm);
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.totalCustomers ?? '-'}</span>
                  <FiUsers size={24} color="#3498db" />
                </div>
                <p>Clientes</p>
              </div>
              <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.totalAccounts ?? '-'}</span>
                  <FiBarChart2 size={24} color="#2ecc71" />
                </div>
                <p>Cuentas</p>
              </div>
              <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.totalTransactions ?? '-'}</span>
                  <FiTrendingUp size={24} color="#f39c12" />
                </div>
                <p>Transacciones</p>
              </div>
              <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.totalBalance != null ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(statistics.totalBalance) : '-'}</span>
                  <FiDollarSign size={24} color="#e74c3c" />
                </div>
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
              <p><strong>ID Reporte:</strong> {financial.reportId ?? 'Sin ID'}</p>
              <div style={{ marginTop: '15px' }}>
                <p><strong>Resumen Financiero:</strong></p>
                {financial.summary && (
                  <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '4px', fontSize: '14px', lineHeight: '1.6' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiDollarSign size={18} /> <strong>Ingresos Totales:</strong> ${parseFloat(financial.summary.totalRevenue).toLocaleString()}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiTrendingDown size={18} /> <strong>Gastos Totales:</strong> ${parseFloat(financial.summary.totalExpenses).toLocaleString()}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiBarChart2 size={18} /> <strong>Ingresos Netos:</strong> ${parseFloat(financial.summary.netIncome).toLocaleString()}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiTrendingUp size={18} /> <strong>Margen Operativo:</strong> {financial.summary.operatingMargin}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiFileText size={18} /> <strong>Cuentas por Cobrar:</strong> ${parseFloat(financial.summary.accountsReceivable).toLocaleString()}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiFileText size={18} /> <strong>Cuentas por Pagar:</strong> ${parseFloat(financial.summary.accountsPayable).toLocaleString()}</p>
                  </div>
                )}
              </div>
              <details style={{ marginTop: '15px', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 'bold', padding: '8px', backgroundColor: '#e8e8e8', borderRadius: '4px' }}>Ver datos completos (JSON)</summary>
                <pre style={{ fontSize: '11px', maxHeight: '300px', overflow: 'auto', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
                  {JSON.stringify(financial, null, 2)}
                </pre>
              </details>
            </div>
          )}
          <div className="statement-card">
            <h3>Estado de cuenta</h3>
            <div className="form-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>ID de cuenta</label>
                <input 
                  type="text" 
                  value={statementForm.accountId} 
                  onChange={(e) => setStatementForm((prev) => ({ ...prev, accountId: e.target.value }))} 
                  placeholder="Ej: 6a15401bd43966a75a44ba8"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Fecha inicio</label>
                <input 
                  type="date" 
                  value={statementForm.startDate} 
                  onChange={(e) => setStatementForm((prev) => ({ ...prev, startDate: e.target.value }))} 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Fecha fin</label>
                <input 
                  type="date" 
                  value={statementForm.endDate} 
                  onChange={(e) => setStatementForm((prev) => ({ ...prev, endDate: e.target.value }))} 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <button className="btn btn--secondary btn--small" onClick={handleStatement}>Generar estado</button>
            {statementResult && (
              <div className="info-card" style={{ marginTop: '15px' }}>
                <p><strong>ID Reporte:</strong> {statementResult.reportId ?? '-'}</p>
                {statementResult.summary && (
                  <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '4px', fontSize: '14px', lineHeight: '1.8', marginTop: '10px' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiFileText size={18} /> <strong>Período:</strong> {statementResult.startDate} a {statementResult.endDate}</p>
                    <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiBarChart2 size={18} /> <strong>Total Transacciones:</strong> {statementResult.summary.totalTransactions}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiDollarSign size={18} color="#2ecc71" /> <strong>Balance Inicial:</strong> ${parseFloat(statementResult.summary.openingBalance).toLocaleString()}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiTrendingUp size={18} color="#3498db" /> <strong>Ingresos:</strong> ${parseFloat(statementResult.summary.totalCredits).toLocaleString()}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiTrendingDown size={18} color="#e74c3c" /> <strong>Gastos:</strong> ${parseFloat(statementResult.summary.totalDebits).toLocaleString()}</p>
                    <p style={{ fontWeight: 'bold', color: '#0066cc', fontSize: '16px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiDollarSign size={20} /> <strong>Balance Final:</strong> ${parseFloat(statementResult.summary.closingBalance).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
