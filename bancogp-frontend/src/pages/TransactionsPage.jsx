import { useState } from 'react';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import {
  createDeposit,
  createWithdrawal,
  createTransfer,
  getDepositHistory,
  getWithdrawalHistory,
  getTransferHistory
} from '../shared/api/transactionsApi.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

export default function TransactionsPage() {
  const [accountId, setAccountId] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionForm, setTransactionForm] = useState({ amount: '', description: '' });
  const [transferForm, setTransferForm] = useState({ fromAccountId: '', toAccountId: '', amount: '' });

  const handleFetchHistory = async () => {
    setMessage('');
    try {
      const depositResponse = await getDepositHistory(accountId);
      const withdrawalResponse = await getWithdrawalHistory(accountId);
      const transferResponse = await getTransferHistory(accountId);
      setDeposits(depositResponse.deposits ?? []);
      setWithdrawals(withdrawalResponse.withdrawals ?? []);
      setTransfers(transferResponse.transfers ?? []);
    } catch {
      setMessage('No se pudo cargar el historial de esa cuenta.');
    }
  };

  const handleDeposit = async () => {
    setMessage('');
    setPosting(true);
    try {
      await createDeposit({ accountId, amount: Number(transactionForm.amount), description: transactionForm.description });
      setMessage('Depósito realizado con éxito.');
      await handleFetchHistory();
      setTransactionForm({ amount: '', description: '' });
    } catch {
      setMessage('Error al realizar el depósito.');
    } finally {
      setPosting(false);
    }
  };

  const handleWithdrawal = async () => {
    setMessage('');
    setPosting(true);
    try {
      await createWithdrawal({ accountId, amount: Number(transactionForm.amount), description: transactionForm.description });
      setMessage('Retiro realizado con éxito.');
      await handleFetchHistory();
      setTransactionForm({ amount: '', description: '' });
    } catch {
      setMessage('Error al realizar el retiro.');
    } finally {
      setPosting(false);
    }
  };

  const handleTransfer = async () => {
    setMessage('');
    setPosting(true);
    try {
      await createTransfer({
        fromAccountId: transferForm.fromAccountId,
        toAccountId: transferForm.toAccountId,
        amount: Number(transferForm.amount)
      });
      setMessage('Transferencia realizada con éxito.');
      setTransferForm({ fromAccountId: '', toAccountId: '', amount: '' });
      if (transferForm.fromAccountId === accountId) {
        await handleFetchHistory();
      }
    } catch {
      setMessage('Error al realizar la transferencia.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <DashboardLayout title="Transacciones" subtitle="Consulta depósitos, retiros y transferencias.">
      <div className="section-grid">
        <section className="panel-card">
          <h2>Historial de cuenta</h2>
          <div className="form-row">
            <input type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="ID de la cuenta" />
            <button className="btn btn--primary btn--small" onClick={handleFetchHistory}>
              Cargar historial
            </button>
          </div>
          {message && <p className="info-text">{message}</p>}
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
                {(deposits ?? []).map((item, index) => (
                  <tr key={index}>
                    <td>{formatCurrency(item.amount ?? 0)}</td>
                    <td>{new Date(item.timestamp ?? item.createdAt ?? Date.now()).toLocaleString()}</td>
                  </tr>
                ))}
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
                {(withdrawals ?? []).map((item, index) => (
                  <tr key={index}>
                    <td>{formatCurrency(item.amount ?? 0)}</td>
                    <td>{new Date(item.timestamp ?? item.createdAt ?? Date.now()).toLocaleString()}</td>
                  </tr>
                ))}
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
                {(transfers ?? []).map((item, index) => (
                  <tr key={index}>
                    <td>{formatCurrency(item.amount ?? 0)}</td>
                    <td>{item.fromAccountId ?? item.sourceAccount ?? '-'}</td>
                    <td>{item.toAccountId ?? item.destinationAccount ?? '-'}</td>
                    <td>{new Date(item.timestamp ?? item.createdAt ?? Date.now()).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel-card">
          <h2>Operaciones rápidas</h2>
          <div className="form-stack">
            <div className="form-row">
              <input type="text" value={transactionForm.amount} onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Monto" />
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
              <input type="text" value={transferForm.fromAccountId} onChange={(e) => setTransferForm((prev) => ({ ...prev, fromAccountId: e.target.value }))} placeholder="Cuenta origen" />
              <input type="text" value={transferForm.toAccountId} onChange={(e) => setTransferForm((prev) => ({ ...prev, toAccountId: e.target.value }))} placeholder="Cuenta destino" />
            </div>
            <div className="form-row">
              <input type="text" value={transferForm.amount} onChange={(e) => setTransferForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Monto" />
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
