import { useEffect, useState } from 'react';
import { FiDollarSign, FiLayers, FiPercent } from 'react-icons/fi';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getAccountTypes, getCurrencies, getInterestRates } from '../shared/api/productsApi.js';
import { Badge, Card, CardHeader, DataTable, Tabs } from '../shared/components/ui/index.js';
import { CurrencyConverter } from '../features/products/CurrencyConverter.jsx';

const ACCOUNT_TYPE_COLUMNS = [
  { key: 'name', header: 'Nombre', render: (i) => <span className="cell-strong">{i.name ?? i.typeName ?? '—'}</span> },
  { key: 'id', header: 'ID', mono: true, render: (i) => i.accountTypeId ?? i.id ?? '—' },
];

const CURRENCY_COLUMNS = [
  { key: 'code', header: 'Código', render: (c) => <Badge>{c.code ?? c.currencyCode ?? '—'}</Badge> },
  { key: 'name', header: 'Nombre', render: (c) => c.name ?? c.description ?? '—' },
];

const RATE_COLUMNS = [
  { key: 'account', header: 'Tipo de cuenta', render: (r) => r.accountType ?? r.accountTypeId ?? '—' },
  {
    key: 'rate',
    header: 'Tasa anual',
    align: 'right',
    render: (r) => (r.rate != null ? <Badge tone="success">{`${r.rate}%`}</Badge> : '—'),
  },
];

export default function ProductsPage() {
  const [accountTypes, setAccountTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [interestRates, setInterestRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('currencies');

  useEffect(() => {
    Promise.allSettled([getAccountTypes(), getCurrencies(), getInterestRates()]).then(([types, curr, rates]) => {
      if (types.status === 'fulfilled') setAccountTypes(types.value.accountTypes ?? []);
      if (curr.status === 'fulfilled') setCurrencies(curr.value.currencies ?? []);
      if (rates.status === 'fulfilled') setInterestRates(rates.value.interestRates ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout title="Productos financieros" subtitle="Tipos de cuenta, monedas disponibles y tasas de interés vigentes.">
      <div className="split-grid">
        <div className="stack">
          <Card>
            <CardHeader tone="amber" icon={<FiLayers />} title="Tipos de cuenta" description="Productos que se pueden abrir para un cliente." />
            <DataTable
              caption="Tipos de cuenta"
              columns={ACCOUNT_TYPE_COLUMNS}
              rows={accountTypes}
              loading={loading}
              getRowKey={(i, index) => i.accountTypeId ?? i.id ?? i.typeId ?? index}
              emptyTitle="Sin tipos de cuenta"
              emptyDescription="No hay tipos de cuenta disponibles."
            />
          </Card>

          <Card>
            <CardHeader
              tone="emerald"
              icon={<FiPercent />}
              title="Monedas y tasas"
              actions={
                <Tabs
                  ariaLabel="Catálogo"
                  value={tab}
                  onChange={setTab}
                  items={[
                    { value: 'currencies', label: 'Monedas', count: currencies.length },
                    { value: 'rates', label: 'Tasas', count: interestRates.length },
                  ]}
                />
              }
            />
            {tab === 'currencies' ? (
              <DataTable
                key="currencies"
                className="animate-in"
                caption="Monedas"
                columns={CURRENCY_COLUMNS}
                rows={currencies}
                loading={loading}
                getRowKey={(c, i) => c.code ?? c.currencyCode ?? c.id ?? i}
                emptyTitle="Sin monedas"
              />
            ) : (
              <DataTable
                key="rates"
                className="animate-in"
                caption="Tasas de interés"
                columns={RATE_COLUMNS}
                rows={interestRates}
                loading={loading}
                getRowKey={(r, i) => r.id ?? r.accountTypeId ?? i}
                emptyTitle="Sin tasas"
              />
            )}
          </Card>
        </div>

        <Card className="sticky-card">
          <CardHeader tone="violet" icon={<FiDollarSign />} title="Convertir moneda" description="Calcula el equivalente entre divisas." />
          <CurrencyConverter currencies={currencies} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
