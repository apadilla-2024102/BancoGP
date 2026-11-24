import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiRepeat,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
  FiCreditCard,
} from 'react-icons/fi';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getStatistics, getFinancialReport, generateAccountStatement } from '../shared/api/reportsApi.js';
import { Badge, Button, Card, CardHeader, EmptyState, Input, StatCard } from '../shared/components/ui/index.js';
import { SummaryList, RawData } from '../features/reports/SummaryList.jsx';
import { formatCurrency, formatDate, formatNumber } from '../shared/utils/format.js';
import { getErrorMessage } from '../shared/utils/cn.js';

const money = (value) => formatCurrency(parseFloat(value ?? 0));
const formatMoney = (n) => formatCurrency(n);

export default function ReportsPage() {
  const [statistics, setStatistics] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [financial, setFinancial] = useState(null);
  const [statementResult, setStatementResult] = useState(null);
  const [statementForm, setStatementForm] = useState({ accountId: '', startDate: '', endDate: '' });
  const [reportForm, setReportForm] = useState({
    startDate: `${new Date().getFullYear()}-01-01`,
    endDate: new Date().toISOString().split('T')[0],
  });
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    getStatistics()
      .then(setStatistics)
      .catch(() => toast.error('No se pudieron cargar las estadísticas.', { id: 'stats-error' }))
      .finally(() => setLoadingStats(false));
  }, []);

  const handleFinancialReport = async (event) => {
    event.preventDefault();
    setGenerating('financial');
    try {
      setFinancial(await getFinancialReport(reportForm));
      toast.success('Reporte financiero generado');
    } catch (error) {
      toast.error('No se pudo generar el reporte', { description: getErrorMessage(error) });
    } finally {
      setGenerating(null);
    }
  };

  const handleStatement = async (event) => {
    event.preventDefault();
    setGenerating('statement');
    try {
      setStatementResult(await generateAccountStatement(statementForm));
      toast.success('Estado de cuenta generado');
    } catch (error) {
      toast.error('No se pudo generar el estado de cuenta', { description: getErrorMessage(error) });
    } finally {
      setGenerating(null);
    }
  };

  const updateStatement = (field) => (e) => setStatementForm((prev) => ({ ...prev, [field]: e.target.value }));
  const updateReport = (field) => (e) => setReportForm((prev) => ({ ...prev, [field]: e.target.value }));

  const fs = financial?.summary;
  const ss = statementResult?.summary;

  return (
    <DashboardLayout title="Reportes" subtitle="Estadísticas generales, reportes financieros y estados de cuenta.">
      <div className="stat-grid stagger">
        <StatCard label="Clientes" value={statistics?.totalCustomers ?? 0} icon={<FiUsers />} loading={loadingStats} />
        <StatCard label="Cuentas" value={statistics?.totalAccounts ?? 0} icon={<FiCreditCard />} loading={loadingStats} />
        <StatCard label="Transacciones" value={statistics?.totalTransactions ?? 0} icon={<FiRepeat />} loading={loadingStats} />
        <StatCard
          label="Balance total"
          value={statistics?.totalBalance ?? 0}
          format={formatMoney}
          icon={<FiDollarSign />}
          loading={loadingStats}
        />
      </div>

      <div className="card-grid">
        <Card>
          <CardHeader icon={<FiBarChart2 />} title="Reporte financiero" description="Ingresos, gastos y márgenes del período." />
          <form className="form-stack" onSubmit={handleFinancialReport}>
            <div className="form-grid">
              <Input label="Desde" type="date" value={reportForm.startDate} onChange={updateReport('startDate')} />
              <Input label="Hasta" type="date" value={reportForm.endDate} onChange={updateReport('endDate')} />
            </div>
            <Button type="submit" variant="primary" loading={generating === 'financial'}>
              Generar reporte
            </Button>
          </form>

          {financial ? (
            <div className="report-result animate-in">
              <div className="report-result__meta">
                <span>Reporte</span>
                <Badge>{financial.reportId ?? 'Sin ID'}</Badge>
              </div>
              {fs && (
                <SummaryList
                  items={[
                    { label: 'Ingresos totales', value: money(fs.totalRevenue), icon: <FiTrendingUp />, tone: 'in' },
                    { label: 'Gastos totales', value: money(fs.totalExpenses), icon: <FiTrendingDown />, tone: 'out' },
                    { label: 'Margen operativo', value: fs.operatingMargin ?? '—', icon: <FiBarChart2 /> },
                    { label: 'Cuentas por cobrar', value: money(fs.accountsReceivable), icon: <FiFileText /> },
                    { label: 'Cuentas por pagar', value: money(fs.accountsPayable), icon: <FiFileText /> },
                    { label: 'Ingresos netos', value: money(fs.netIncome), icon: <FiDollarSign />, strong: true },
                  ]}
                />
              )}
              <RawData data={financial} />
            </div>
          ) : (
            <EmptyState compact icon={<FiBarChart2 />} title="Sin reporte" description="Elige un período y genera el reporte." />
          )}
        </Card>

        <Card>
          <CardHeader icon={<FiFileText />} title="Estado de cuenta" description="Movimientos y saldos de una cuenta específica." />
          <form className="form-stack" onSubmit={handleStatement}>
            <Input label="ID de cuenta" value={statementForm.accountId} onChange={updateStatement('accountId')} placeholder="Ej: 6a15401bd43966a75a44ba8" />
            <div className="form-grid">
              <Input label="Desde" type="date" value={statementForm.startDate} onChange={updateStatement('startDate')} />
              <Input label="Hasta" type="date" value={statementForm.endDate} onChange={updateStatement('endDate')} />
            </div>
            <Button type="submit" loading={generating === 'statement'} disabled={!statementForm.accountId}>
              Generar estado
            </Button>
          </form>

          {statementResult ? (
            <div className="report-result animate-in">
              <div className="report-result__meta">
                <span>
                  <FiCalendar aria-hidden="true" /> {formatDate(statementResult.startDate)} — {formatDate(statementResult.endDate)}
                </span>
                <Badge>{statementResult.reportId ?? '—'}</Badge>
              </div>
              {ss && (
                <SummaryList
                  items={[
                    { label: 'Transacciones', value: formatNumber(ss.totalTransactions), icon: <FiRepeat /> },
                    { label: 'Saldo inicial', value: money(ss.openingBalance), icon: <FiDollarSign /> },
                    { label: 'Ingresos', value: money(ss.totalCredits), icon: <FiTrendingUp />, tone: 'in' },
                    { label: 'Egresos', value: money(ss.totalDebits), icon: <FiTrendingDown />, tone: 'out' },
                    { label: 'Saldo final', value: money(ss.closingBalance), icon: <FiDollarSign />, strong: true },
                  ]}
                />
              )}
            </div>
          ) : (
            <EmptyState compact icon={<FiFileText />} title="Sin estado de cuenta" description="Ingresa una cuenta y un rango de fechas." />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
