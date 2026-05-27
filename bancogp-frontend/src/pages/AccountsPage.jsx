import { useEffect, useState } from 'react';
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
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 6000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleSearchAccounts = async () => {
    setMessage('');
    setMessageType('');
    setAccountDetails(null);
    setBalance(null);
    try {
      const customerResponse = await getCustomer(customerId);
      setCustomer(customerResponse);
      const accountsResponse = await getCustomerAccounts(customerId);
      setAccounts(accountsResponse.accounts ?? []);
      if ((accountsResponse.accounts ?? []).length === 0) {
        setMessage('No se encontraron cuentas para ese cliente.');
        setMessageType('info');
      }
    } catch {
      setMessage('No se encontraron cuentas para ese cliente.');
      setMessageType('error');
      setAccounts([]);
      setCustomer(null);
    }
  };

  const handleLoadAccount = async (requestedAccountId = accountId) => {
    setMessage('');
    setMessageType('');
    if (!requestedAccountId) {
      setMessage('Ingresa el ID de la cuenta para cargarla.');
      setMessageType('error');
      return;
    }

    setAccountId(requestedAccountId);
    try {
      const details = await getAccountDetails(requestedAccountId);
      const balanceResponse = await getAccountBalance(requestedAccountId);
      setAccountDetails(details);
      setBalance(balanceResponse);
      setMessage('Datos de cuenta cargados correctamente.');
      setMessageType('success');
    } catch {
      setMessage('No se encontraron datos para esa cuenta.');
      setMessageType('error');
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
          {message && <p className={messageType === 'error' ? 'error-text' : messageType === 'success' ? 'success-text' : 'info-text'}>{message}</p>}
          {customer && (
            <div className="info-card">
              <p><strong>Cliente:</strong> {`${customer.firstName ?? customer.name ?? ''} ${customer.lastName ?? ''}`.trim()}</p>
              <p><strong>Correo:</strong> {customer.email ?? '-'}</p>
              <p><strong>Cantidad de cuentas:</strong> {accounts.length}</p>
            </div>
          )}
          {accounts.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Saldo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => {
                    const accountKey = account.accountId ?? account.id ?? account.accountNumber;
                    return (
                      <tr key={accountKey}>
                        <td>{accountKey}</td>
                        <td>{account.accountType ?? account.type ?? '-'}</td>
                        <td>{formatCurrency(account.balance ?? 0)}</td>
                        <td>
                          <button className="btn btn--secondary btn--small" onClick={() => handleLoadAccount(accountKey)}>
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel-card">
          <h2>Detalle de cuenta</h2>
          <div className="form-row">
            <input type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="ID de la cuenta" />
            <button className="btn btn--primary btn--small" onClick={() => handleLoadAccount(accountId)}>
              Cargar datos
            </button>
          </div>

          {accountDetails && (
            <div className="info-card">
              <p><strong>Cuenta:</strong> {accountDetails.accountNumber ?? accountDetails.accountId ?? accountDetails.id}</p>
              <p><strong>Tipo:</strong> {accountDetails.accountType ?? accountDetails.type ?? '-'}</p>
              <p><strong>Saldo:</strong> {formatCurrency(accountDetails.balance ?? balance?.balance ?? 0)}</p>
              <p><strong>Moneda:</strong> {accountDetails.currency ?? balance?.currency ?? 'USD'}</p>
              {accountDetails.customerId && (
                <p><strong>Cliente:</strong> {`${accountDetails.customerId.firstName ?? ''} ${accountDetails.customerId.lastName ?? ''}`.trim()}</p>
              )}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
