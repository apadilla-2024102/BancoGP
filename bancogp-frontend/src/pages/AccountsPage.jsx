import { useState } from 'react';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getCustomerAccounts, getCustomer } from '../shared/api/customersApi.js';
import { getAccountDetails, getAccountBalance } from '../shared/api/accountsApi.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

export default function AccountsPage() {
  const [customerId, setCustomerId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');

  const handleSearchAccounts = async () => {
    setMessage('');
    setAccountDetails(null);
    setBalance(null);
    try {
      const customerResponse = await getCustomer(customerId);
      setCustomer(customerResponse);
      const accountsResponse = await getCustomerAccounts(customerId);
      setAccounts(accountsResponse.accounts ?? []);
    } catch {
      setMessage('No se encontraron cuentas para ese cliente.');
      setAccounts([]);
      setCustomer(null);
    }
  };

  const handleLoadAccount = async () => {
    setMessage('');
    try {
      const details = await getAccountDetails(accountId);
      const balanceResponse = await getAccountBalance(accountId);
      setAccountDetails(details);
      setBalance(balanceResponse);
    } catch {
      setMessage('No se encontraron datos para esa cuenta.');
      setAccountDetails(null);
      setBalance(null);
    }
  };

  return (
    <DashboardLayout title="Cuentas" subtitle="Visualiza y administra las cuentas bancarias.">
      <div className="section-grid">
        <section className="panel-card">
          <h2>Buscar cuentas por cliente</h2>
          <div className="form-row">
            <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="ID del cliente" />
            <button className="btn btn--primary btn--small" onClick={handleSearchAccounts}>
              Buscar
            </button>
          </div>
          {message && <p className="error-text">{message}</p>}
          {customer && <p>Cliente: {`${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim()}</p>}
          {accounts.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.accountId ?? account.accountNumber}>
                      <td>{account.accountId ?? account.accountNumber}</td>
                      <td>{account.accountType ?? '-'}</td>
                      <td>{formatCurrency(account.balance ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel-card">
          <h2>Detalle de cuenta</h2>
          <div className="form-row">
            <input type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="ID de la cuenta" />
            <button className="btn btn--primary btn--small" onClick={handleLoadAccount}>
              Cargar datos
            </button>
          </div>

          {accountDetails && (
            <div className="info-card">
              <p><strong>Cuenta:</strong> {accountDetails.accountNumber ?? accountDetails.accountId}</p>
              <p><strong>Tipo:</strong> {accountDetails.accountType ?? '-'}</p>
              <p><strong>Saldo:</strong> {formatCurrency(accountDetails.balance ?? balance?.balance ?? 0)}</p>
              <p><strong>Moneda:</strong> {accountDetails.currency ?? balance?.currency ?? 'USD'}</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
