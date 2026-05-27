import { useEffect, useState } from 'react';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import {
  createDeposit,
  createWithdrawal,
  createTransfer,
  getDepositHistory,
  getWithdrawalHistory,
  getTransferHistory
} from '../shared/api/transactionsApi.js';
import { getAccountBalance } from '../shared/api/accountsApi.js';
import { getCustomers, getCustomerAccounts } from '../shared/api/customersApi.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

export default function TransactionsPage() {
  const [accountId, setAccountId] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [transactionForm, setTransactionForm] = useState({ amount: '', description: '' });
  const [transferForm, setTransferForm] = useState({ fromAccountId: '', toAccountId: '', amount: '' });
  const [customers, setCustomers] = useState([]);
  const [fromCustomerId, setFromCustomerId] = useState('');
  const [toCustomerId, setToCustomerId] = useState('');
  const [fromAccounts, setFromAccounts] = useState([]);
  const [toAccounts, setToAccounts] = useState([]);
  const [historyCustomerId, setHistoryCustomerId] = useState('');
  const [historyAccounts, setHistoryAccounts] = useState([]);

  const resetMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const handleFetchHistory = async (targetAccountId) => {
    resetMessage();
    const id = targetAccountId || accountId;
    if (!id) {
      setMessage('Selecciona una cuenta para ver el historial.');
      setMessageType('error');
      return;
    }

    try {
      const [depositResponse, withdrawalResponse, transferResponse, balanceResponse] = await Promise.all([
        getDepositHistory(id),
        getWithdrawalHistory(id),
        getTransferHistory(id),
        getAccountBalance(id)
      ]);

      setDeposits(depositResponse.deposits ?? []);
      setWithdrawals(withdrawalResponse.withdrawals ?? []);
      setTransfers(transferResponse.transfers ?? []);
      setCurrentBalance(balanceResponse);
      setMessage('Historial cargado correctamente.');
      setMessageType('success');
    } catch (error) {
      const response = error?.response?.data;
      const detail = response?.error || response?.message || error?.message || 'No se pudo cargar el historial de esa cuenta.';
      setMessage(detail);
      setMessageType('error');
      setDeposits([]);
      setWithdrawals([]);
      setTransfers([]);
      setCurrentBalance(null);
    }
  };

  const handleDeposit = async () => {
    resetMessage();
    if (!accountId || !transactionForm.amount) {
      setMessage('Completa el ID de cuenta y el monto para el depósito.');
      setMessageType('error');
      return;
    }

    setPosting(true);
    try {
      await createDeposit({ accountId, amount: Number(transactionForm.amount), description: transactionForm.description });
      setMessage('Depósito realizado con éxito.');
      setMessageType('success');
      setTransactionForm({ amount: '', description: '' });
      await handleFetchHistory();
    } catch {
      setMessage('Error al realizar el depósito.');
      setMessageType('error');
    } finally {
      setPosting(false);
    }
  };

  const handleWithdrawal = async () => {
    resetMessage();
    if (!accountId || !transactionForm.amount) {
      setMessage('Completa el ID de cuenta y el monto para el retiro.');
      setMessageType('error');
      return;
    }

    setPosting(true);
    try {
      await createWithdrawal({ accountId, amount: Number(transactionForm.amount), description: transactionForm.description });
      setMessage('Retiro realizado con éxito.');
      setMessageType('success');
      setTransactionForm({ amount: '', description: '' });
      await handleFetchHistory();
    } catch {
      setMessage('Error al realizar el retiro.');
      setMessageType('error');
    } finally {
      setPosting(false);
    }
  };

  const getErrorMessage = (error) => {
    const response = error?.response?.data;
    if (response?.error) return response.error;
    if (response?.message) return response.message;
    if (error?.message) return error.message;
    return 'Error al realizar la transferencia.';
  };

  const handleTransfer = async () => {
    resetMessage();
    // Get account IDs from the form (they should have accountNumber)
    const fromId = transferForm.fromAccountId;
    const toId = transferForm.toAccountId;

    if (!fromId || !toId || !transferForm.amount) {
      setMessage('Completa los campos de origen, destino y monto.');
      setMessageType('error');
      return;
    }

    if (fromId === toId) {
      setMessage('La cuenta de origen y destino no pueden ser iguales.');
      setMessageType('error');
      return;
    }

    setPosting(true);
    try {
      await createTransfer({
        fromAccountId: fromId,
        toAccountId: toId,
        amount: Number(transferForm.amount)
      });
      setMessage('Transferencia realizada con éxito.');
      setMessageType('success');
      setTransferForm({ fromAccountId: '', toAccountId: '', amount: '' });
      if (accountId && (accountId === transferForm.fromAccountId || accountId === transferForm.toAccountId)) {
        await handleFetchHistory();
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
      setMessageType('error');
    } finally {
      setPosting(false);
    }
  };

  // Load customers for transfer dropdowns and history selector
  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      const list = data.customers ?? data ?? [];
      setCustomers(list);
      if (list.length > 0) {
        const defaultCustomerId = list[0].customerId || list[0]._id || list[0].id;
        setHistoryCustomerId(defaultCustomerId);
        await handleHistoryCustomerChange(defaultCustomerId, true);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleFromCustomerChange = async (custId) => {
    setFromCustomerId(custId);
    setFromAccounts([]);
    setTransferForm((p) => ({ ...p, fromAccountId: '' }));
    if (!custId) return;
    try {
      const resp = await getCustomerAccounts(custId);
      const list = resp.accounts ?? resp ?? [];
      setFromAccounts(list);
      if (list.length > 0) {
        // Use accountNumber as the ID for the transfer
        const key = list[0].accountNumber || list[0]._id || list[0].id;
        setTransferForm((p) => ({ ...p, fromAccountId: key }));
      }
    } catch (e) {
      // ignore
    }
  };

  const handleToCustomerChange = async (custId) => {
    setToCustomerId(custId);
    setToAccounts([]);
    setTransferForm((p) => ({ ...p, toAccountId: '' }));
    if (!custId) return;
    try {
      const resp = await getCustomerAccounts(custId);
      const list = resp.accounts ?? resp ?? [];
      setToAccounts(list);
      if (list.length > 0) {
        // Use accountNumber as the ID for the transfer
        const key = list[0].accountNumber || list[0]._id || list[0].id;
        setTransferForm((p) => ({ ...p, toAccountId: key }));
      }
    } catch (e) {
      // ignore
    }
  };

  const handleHistoryCustomerChange = async (custId, autoFetch = false) => {
    setHistoryCustomerId(custId);
    setHistoryAccounts([]);
    setAccountId('');

    if (!custId) return;

    try {
      const resp = await getCustomerAccounts(custId);
      const list = resp.accounts ?? resp ?? [];
      setHistoryAccounts(list);
      if (list.length > 0) {
        const key = list[0].accountNumber || list[0]._id || list[0].id;
        setAccountId(key);
        if (autoFetch) {
          await handleFetchHistory(key);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  // load customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <DashboardLayout title="Transacciones" subtitle="Consulta depósitos, retiros y transferencias.">
      <div className="section-grid">
        <section className="panel-card">
          <h2>Historial de cuenta</h2>
              <div className="form-row">
            <div style={{ flex: 1 }}>
              <select value={historyCustomerId} onChange={(e) => handleHistoryCustomerChange(e.target.value, true)}>
                <option value="">-- Seleccionar cliente --</option>
                {customers.map((c) => (
                  <option key={c.customerId ?? c.id ?? c._id} value={c.customerId ?? c.id ?? c._id}>
                    {c.name ?? c.fullName ?? c.email ?? (c.customerId ?? c.id ?? c._id)}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} disabled={historyAccounts.length === 0}>
                <option value="">-- Seleccionar cuenta --</option>
                {historyAccounts.map((a) => {
                  const accountKey = a.accountNumber || a._id || a.id;
                  return (
                    <option key={accountKey} value={accountKey}>
                      {accountKey} — {a.accountType ?? ''} ({formatCurrency(a.balance ?? 0)})
                    </option>
                  );
                })}
              </select>
            </div>
            <button className="btn btn--primary btn--small" onClick={() => handleFetchHistory()}>
              Cargar historial
            </button>
          </div>

          {message && <p className={messageType === 'error' ? 'error-text' : messageType === 'success' ? 'success-text' : 'info-text'}>{message}</p>}

          {accountId && currentBalance && (
            <div className="summary-card">
              <div>
                <strong>Cuenta actual:</strong> {accountId}
              </div>
              <div>
                <strong>Saldo:</strong> {formatCurrency(currentBalance.balance ?? 0)} {currentBalance.currency ?? 'USD'}
              </div>
            </div>
          )}

          <div className="table-wrapper">
            <h3>Depósitos</h3>
            <table>
              <thead>
                <tr>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {deposits.length > 0 ? (
                  deposits.map((item, index) => (
                    <tr key={index}>
                      <td>{formatCurrency(item.amount ?? 0)}</td>
                      <td>{new Date(item.timestamp ?? item.createdAt ?? Date.now()).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No hay depósitos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-wrapper">
            <h3>Retiros</h3>
            <table>
              <thead>
                <tr>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length > 0 ? (
                  withdrawals.map((item, index) => (
                    <tr key={index}>
                      <td>{formatCurrency(item.amount ?? 0)}</td>
                      <td>{new Date(item.timestamp ?? item.createdAt ?? Date.now()).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No hay retiros registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-wrapper">
            <h3>Transferencias</h3>
            <table>
              <thead>
                <tr>
                  <th>Monto</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transfers.length > 0 ? (
                  transfers.map((item, index) => (
                    <tr key={index}>
                      <td>{formatCurrency(item.amount ?? 0)}</td>
                      <td>{item.fromAccountId ?? item.sourceAccount ?? '-'}</td>
                      <td>{item.toAccountId ?? item.destinationAccount ?? '-'}</td>
                      <td>{new Date(item.timestamp ?? item.createdAt ?? Date.now()).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay transferencias registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel-card">
          <h2>Operaciones rápidas</h2>
          <div className="form-stack">
            <div className="form-row">
              <input type="number" min="0" step="0.01" value={transactionForm.amount} onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Monto del depósito/retiro" />
              <input type="text" value={transactionForm.description} onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descripción" />
            </div>
            <div className="form-actions">
              <button className="btn btn--primary btn--small" disabled={!accountId || !transactionForm.amount || posting} onClick={handleDeposit}>
                Depositar
              </button>
              <button className="btn btn--secondary btn--small" disabled={!accountId || !transactionForm.amount || posting} onClick={handleWithdrawal}>
                Retirar
              </button>
            </div>
          </div>
          <div className="form-stack">
            <h3>Transferencia</h3>
            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Cliente origen</label>
                <select value={fromCustomerId} onChange={(e) => handleFromCustomerChange(e.target.value)}>
                  <option value="">-- Seleccionar cliente --</option>
                  {customers.map((c) => (
                    <option key={c.customerId ?? c.id ?? c._id} value={c.customerId ?? c.id ?? c._id}>
                      {c.name ?? c.fullName ?? c.email ?? (c.customerId ?? c.id ?? c._id)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Cuenta origen</label>
                <select value={transferForm.fromAccountId} onChange={(e) => setTransferForm((prev) => ({ ...prev, fromAccountId: e.target.value }))} disabled={fromAccounts.length === 0}>
                  <option value="">-- Seleccionar cuenta --</option>
                  {fromAccounts.map((a) => {
                    const accountNum = a.accountNumber;
                    return (
                      <option key={accountNum} value={accountNum}>
                        {accountNum} — {a.accountType ?? ''} ({a.balance ?? 0} {a.currency ?? 'USD'})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Cliente destino</label>
                <select value={toCustomerId} onChange={(e) => handleToCustomerChange(e.target.value)}>
                  <option value="">-- Seleccionar cliente --</option>
                  {customers.map((c) => (
                    <option key={c.customerId ?? c.id ?? c._id} value={c.customerId ?? c.id ?? c._id}>
                      {c.name ?? c.fullName ?? c.email ?? (c.customerId ?? c.id ?? c._id)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Cuenta destino</label>
                <select value={transferForm.toAccountId} onChange={(e) => setTransferForm((prev) => ({ ...prev, toAccountId: e.target.value }))} disabled={toAccounts.length === 0}>
                  <option value="">-- Seleccionar cuenta --</option>
                  {toAccounts.map((a) => {
                    const accountNum = a.accountNumber;
                    return (
                      <option key={accountNum} value={accountNum}>
                        {accountNum} — {a.accountType ?? ''} ({a.balance ?? 0} {a.currency ?? 'USD'})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="form-row">
              <input type="number" min="0" step="0.01" value={transferForm.amount} onChange={(e) => setTransferForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Monto" />
              <button className="btn btn--primary btn--small" disabled={!transferForm.fromAccountId || !transferForm.toAccountId || !transferForm.amount || posting} onClick={handleTransfer}>
                Transferir
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
