import { useState } from 'react';
import { toast } from 'sonner';
import { FiCreditCard, FiSearch, FiUser } from 'react-icons/fi';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getCustomerAccounts, getCustomer } from '../shared/api/customersApi.js';
import { getAccountDetails, getAccountBalance } from '../shared/api/accountsApi.js';
import { Badge, Button, Card, CardHeader, DataTable, EmptyState, Input } from '../shared/components/ui/index.js';
import { accountTypeTone, formatCurrency, pluralize, toneFromString } from '../shared/utils/format.js';
import { getCustomerName } from '../shared/utils/cn.js';

const getAccountKey = (account) => account.accountId ?? account.id ?? account.accountNumber;

const DetailRow = ({ label, children }) => (
  <div className="detail-list__row">
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

export default function AccountsPage() {
  const [customerId, setCustomerId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [balance, setBalance] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearchAccounts = async (event) => {
    event?.preventDefault();
    if (!customerId.trim()) return;
    setSearching(true);
    setAccountDetails(null);
    setBalance(null);
    try {
      const customerResponse = await getCustomer(customerId.trim());
      setCustomer(customerResponse);
      const accountsResponse = await getCustomerAccounts(customerId.trim());
      setAccounts(accountsResponse.accounts ?? []);
    } catch {
      toast.error('Cliente no encontrado', { description: 'Verifica el ID e intenta de nuevo.' });
      setAccounts([]);
      setCustomer(null);
    } finally {
      setSearching(false);
      setSearched(true);
    }
  };

  const handleLoadAccount = async (requestedAccountId = accountId) => {
    if (!requestedAccountId) {
      toast.error('Ingresa el ID de la cuenta para cargarla.');
      return;
    }
    setAccountId(requestedAccountId);
    setLoadingAccount(true);
    try {
      const [details, balanceResponse] = await Promise.all([
        getAccountDetails(requestedAccountId),
        getAccountBalance(requestedAccountId),
      ]);
      setAccountDetails(details);
      setBalance(balanceResponse);
    } catch {
      toast.error('Cuenta no encontrada', { description: 'No se encontraron datos para esa cuenta.' });
      setAccountDetails(null);
      setBalance(null);
    } finally {
      setLoadingAccount(false);
    }
  };

  const columns = [
    { key: 'id', header: 'Cuenta', mono: true, render: (a) => getAccountKey(a) },
    {
      key: 'type',
      header: 'Tipo',
      render: (a) => <Badge tone={accountTypeTone(a.accountType ?? a.type)}>{a.accountType ?? a.type ?? '—'}</Badge>,
    },
    { key: 'balance', header: 'Saldo', align: 'right', render: (a) => formatCurrency(a.balance ?? 0, a.currency) },
  ];

  const detailBalance = accountDetails?.balance ?? balance?.balance ?? 0;
  const detailCurrency = accountDetails?.currency ?? balance?.currency ?? 'USD';

  return (
    <DashboardLayout title="Cuentas" subtitle="Busca las cuentas de un cliente y consulta el detalle y saldo de cada una.">
      <div className="split-grid">
        <Card>
          <CardHeader icon={<FiUser />} title="Cuentas por cliente" description="Ingresa el ID del cliente para listar sus cuentas." />
          <form className="inline-form" onSubmit={handleSearchAccounts}>
            <Input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="ID del cliente"
              icon={<FiSearch />}
              aria-label="ID del cliente"
            />
            <Button type="submit" variant="primary" loading={searching} disabled={!customerId.trim()}>
              Buscar
            </Button>
          </form>

          {customer && (
            <div className="customer-summary animate-in">
              <span className="avatar avatar--tone" data-tone={toneFromString(getCustomerName(customer))}>
                {getCustomerName(customer).charAt(0).toUpperCase()}
              </span>
              <div className="customer-summary__info">
                <p className="customer-summary__name">{getCustomerName(customer)}</p>
                <p className="customer-summary__meta">{customer.email ?? 'Sin correo'}</p>
              </div>
              <Badge tone="accent">{pluralize(accounts.length, 'cuenta', 'cuentas')}</Badge>
            </div>
          )}

          {searched || searching ? (
            <DataTable
              caption="Cuentas del cliente"
              columns={columns}
              rows={accounts}
              loading={searching}
              getRowKey={(a, i) => getAccountKey(a) ?? i}
              onRowClick={(a) => handleLoadAccount(getAccountKey(a))}
              selectedKey={accountDetails ? accountId : undefined}
              emptyTitle="Sin cuentas"
              emptyDescription="No se encontraron cuentas para ese cliente."
            />
          ) : (
            <EmptyState icon={<FiSearch />} title="Busca un cliente" description="Sus cuentas aparecerán aquí." />
          )}
        </Card>

        <Card className="sticky-card">
          <CardHeader icon={<FiCreditCard />} title="Detalle de cuenta" description="Selecciona una cuenta o ingresa su ID." />
          <form
            className="inline-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleLoadAccount(accountId);
            }}
          >
            <Input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="ID de la cuenta" aria-label="ID de la cuenta" />
            <Button type="submit" loading={loadingAccount} disabled={!accountId}>
              Cargar
            </Button>
          </form>

          {accountDetails ? (
            <div className="account-detail animate-in" key={accountId}>
              <div className="balance-hero">
                <span className="balance-hero__label">Saldo disponible</span>
                <span className="balance-hero__value tabular">{formatCurrency(detailBalance, detailCurrency)}</span>
              </div>
              <dl className="detail-list">
                <DetailRow label="Número">
                  <span className="mono">{accountDetails.accountNumber ?? accountDetails.accountId ?? accountDetails.id}</span>
                </DetailRow>
                <DetailRow label="Tipo">{accountDetails.accountType ?? accountDetails.type ?? '—'}</DetailRow>
                <DetailRow label="Moneda">{detailCurrency}</DetailRow>
                {accountDetails.customerId && typeof accountDetails.customerId === 'object' && (
                  <DetailRow label="Titular">{getCustomerName(accountDetails.customerId)}</DetailRow>
                )}
              </dl>
            </div>
          ) : (
            <EmptyState icon={<FiCreditCard />} title="Sin cuenta cargada" description="El saldo y los datos de la cuenta se mostrarán aquí." />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
