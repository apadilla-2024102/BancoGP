import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FiArrowDownLeft, FiArrowUpRight, FiClock, FiRepeat, FiSend } from 'react-icons/fi';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import {
  createDeposit,
  createWithdrawal,
  createTransfer,
  getDepositHistory,
  getWithdrawalHistory,
  getTransferHistory,
} from '../shared/api/transactionsApi.js';
import { getAccountBalance } from '../shared/api/accountsApi.js';
import { getCustomers, getCustomerAccounts } from '../shared/api/customersApi.js';
import { Button, Card, CardHeader, Input, Select } from '../shared/components/ui/index.js';
import { TransactionHistory } from '../features/transactions/TransactionHistory.jsx';
import { formatCurrency } from '../shared/utils/format.js';
import { getCustomerName, getErrorMessage, getId } from '../shared/utils/cn.js';

const accountKeyOf = (account) => account.accountNumber || account._id || account.id;

const toCustomerOptions = (customers) =>
  customers.map((c) => ({ value: getId(c), label: getCustomerName(c) }));

const toAccountOptions = (accounts) =>
  accounts.map((a) => ({
    value: accountKeyOf(a),
    label: `${accountKeyOf(a)} · ${a.accountType ?? 'Cuenta'} · ${formatCurrency(a.balance ?? 0, a.currency)}`,
  }));

const loadAccounts = async (customerId) => {
  const resp = await getCustomerAccounts(customerId);
  const list = resp.accounts ?? resp ?? [];
  return Array.isArray(list) ? list : [];
};

export default function TransactionsPage() {
  const [accountId, setAccountId] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [posting, setPosting] = useState(null);
  const [transactionForm, setTransactionForm] = useState({ amount: '', description: '' });
  const [transferForm, setTransferForm] = useState({ fromAccountId: '', toAccountId: '', amount: '' });
  const [customers, setCustomers] = useState([]);
  const [fromCustomerId, setFromCustomerId] = useState('');
  const [toCustomerId, setToCustomerId] = useState('');
  const [fromAccounts, setFromAccounts] = useState([]);
  const [toAccounts, setToAccounts] = useState([]);
  const [historyCustomerId, setHistoryCustomerId] = useState('');
  const [historyAccounts, setHistoryAccounts] = useState([]);

  const handleFetchHistory = async (targetAccountId, { silent = false } = {}) => {
    const id = targetAccountId || accountId;
    if (!id) {
      toast.error('Selecciona una cuenta para ver el historial.');
      return;
    }

    setLoadingHistory(true);
    try {
      const [depositResponse, withdrawalResponse, transferResponse, balanceResponse] = await Promise.all([
        getDepositHistory(id),
        getWithdrawalHistory(id),
        getTransferHistory(id),
        getAccountBalance(id),
      ]);
      setDeposits(depositResponse.deposits ?? []);
      setWithdrawals(withdrawalResponse.withdrawals ?? []);
      setTransfers(transferResponse.transfers ?? []);
      setCurrentBalance(balanceResponse);
    } catch (error) {
      if (!silent) toast.error('No se pudo cargar el historial', { description: getErrorMessage(error) });
      setDeposits([]);
      setWithdrawals([]);
      setTransfers([]);
      setCurrentBalance(null);
    } finally {
      setLoadingHistory(false);
    }
  };

  const runOperation = async (kind) => {
    if (!accountId || !transactionForm.amount) {
      toast.error('Completa la cuenta y el monto.');
      return;
    }
    const isDeposit = kind === 'deposit';
    setPosting(kind);
    try {
      const payload = { accountId, amount: Number(transactionForm.amount), description: transactionForm.description };
      await (isDeposit ? createDeposit(payload) : createWithdrawal(payload));
      toast.success(isDeposit ? 'Depósito realizado' : 'Retiro realizado', {
        description: `${formatCurrency(payload.amount)} en la cuenta ${accountId}.`,
      });
      setTransactionForm({ amount: '', description: '' });
      await handleFetchHistory(accountId, { silent: true });
    } catch (error) {
      toast.error(isDeposit ? 'Error al depositar' : 'Error al retirar', { description: getErrorMessage(error) });
    } finally {
      setPosting(null);
    }
  };

  const handleTransfer = async (event) => {
    event.preventDefault();
    const { fromAccountId, toAccountId, amount } = transferForm;

    if (!fromAccountId || !toAccountId || !amount) {
      toast.error('Completa origen, destino y monto.');
      return;
    }
    if (fromAccountId === toAccountId) {
      toast.error('La cuenta de origen y destino no pueden ser iguales.');
      return;
    }

    setPosting('transfer');
    try {
      await createTransfer({ fromAccountId, toAccountId, amount: Number(amount) });
      toast.success('Transferencia realizada', {
        description: `${formatCurrency(Number(amount))} de ${fromAccountId} a ${toAccountId}.`,
      });
      setTransferForm((prev) => ({ ...prev, amount: '' }));
      if (accountId && (accountId === fromAccountId || accountId === toAccountId)) {
        await handleFetchHistory(accountId, { silent: true });
      }
    } catch (error) {
      toast.error('Error en la transferencia', { description: getErrorMessage(error) });
    } finally {
      setPosting(null);
    }
  };

  const handleSideCustomerChange = async (side, custId) => {
    const setCustomer = side === 'from' ? setFromCustomerId : setToCustomerId;
    const setAccounts = side === 'from' ? setFromAccounts : setToAccounts;
    const field = side === 'from' ? 'fromAccountId' : 'toAccountId';

    setCustomer(custId);
    setAccounts([]);
    setTransferForm((prev) => ({ ...prev, [field]: '' }));
    if (!custId) return;
    try {
      const list = await loadAccounts(custId);
      setAccounts(list);
      if (list.length > 0) setTransferForm((prev) => ({ ...prev, [field]: accountKeyOf(list[0]) }));
    } catch {
      /* sin cuentas disponibles */
    }
  };

  const handleHistoryCustomerChange = async (custId, autoFetch = false) => {
    setHistoryCustomerId(custId);
    setHistoryAccounts([]);
    setAccountId('');
    if (!custId) return;
    try {
      const list = await loadAccounts(custId);
      setHistoryAccounts(list);
      if (list.length > 0) {
        const key = accountKeyOf(list[0]);
        setAccountId(key);
        if (autoFetch) await handleFetchHistory(key, { silent: true });
      }
    } catch {
      /* sin cuentas disponibles */
    }
  };

  useEffect(() => {
    getCustomers()
      .then(async (data) => {
        const list = data.customers ?? data ?? [];
        setCustomers(list);
        if (list.length > 0) await handleHistoryCustomerChange(getId(list[0]), true);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customerOptions = toCustomerOptions(customers);
  const canOperate = Boolean(accountId && transactionForm.amount) && !posting;

  return (
    <DashboardLayout title="Transacciones" subtitle="Consulta el historial y realiza depósitos, retiros y transferencias.">
      <div className="split-grid">
        <Card>
          <CardHeader icon={<FiClock />} title="Historial de cuenta" description="Movimientos de la cuenta seleccionada." />
          <div className="form-grid tx-filters">
            <Select
              label="Cliente"
              placeholder="Seleccionar cliente"
              value={historyCustomerId}
              onChange={(e) => handleHistoryCustomerChange(e.target.value, true)}
              options={customerOptions}
            />
            <Select
              label="Cuenta"
              placeholder="Seleccionar cuenta"
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                if (e.target.value) handleFetchHistory(e.target.value);
              }}
              disabled={historyAccounts.length === 0}
              options={toAccountOptions(historyAccounts)}
            />
          </div>

          {accountId && currentBalance && (
            <div className="balance-strip animate-in" key={accountId}>
              <div>
                <span className="balance-strip__label">Cuenta</span>
                <span className="mono">{accountId}</span>
              </div>
              <div className="balance-strip__right">
                <span className="balance-strip__label">Saldo actual</span>
                <span className="balance-strip__value tabular">
                  {formatCurrency(currentBalance.balance ?? 0, currentBalance.currency ?? 'USD')}
                </span>
              </div>
            </div>
          )}

          <TransactionHistory deposits={deposits} withdrawals={withdrawals} transfers={transfers} loading={loadingHistory} />
        </Card>

        <div className="stack">
          <Card>
            <CardHeader icon={<FiArrowDownLeft />} title="Depósito o retiro" description="Se aplica a la cuenta seleccionada en el historial." />
            <div className="form-stack">
              <Input
                label="Monto"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={transactionForm.amount}
                onChange={(e) => setTransactionForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
              <Input
                label="Descripción"
                value={transactionForm.description}
                onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Opcional"
              />
              <div className="form-actions form-actions--fill">
                <Button
                  variant="primary"
                  leftIcon={<FiArrowDownLeft />}
                  disabled={!canOperate}
                  loading={posting === 'deposit'}
                  onClick={() => runOperation('deposit')}
                >
                  Depositar
                </Button>
                <Button
                  leftIcon={<FiArrowUpRight />}
                  disabled={!canOperate}
                  loading={posting === 'withdrawal'}
                  onClick={() => runOperation('withdrawal')}
                >
                  Retirar
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader icon={<FiRepeat />} title="Transferencia" description="Mueve fondos entre dos cuentas." />
            <form className="form-stack" onSubmit={handleTransfer}>
              <fieldset className="fieldset">
                <legend>Origen</legend>
                <Select
                  label="Cliente"
                  placeholder="Seleccionar cliente"
                  value={fromCustomerId}
                  onChange={(e) => handleSideCustomerChange('from', e.target.value)}
                  options={customerOptions}
                />
                <Select
                  label="Cuenta"
                  placeholder="Seleccionar cuenta"
                  value={transferForm.fromAccountId}
                  onChange={(e) => setTransferForm((prev) => ({ ...prev, fromAccountId: e.target.value }))}
                  disabled={fromAccounts.length === 0}
                  options={toAccountOptions(fromAccounts)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend>Destino</legend>
                <Select
                  label="Cliente"
                  placeholder="Seleccionar cliente"
                  value={toCustomerId}
                  onChange={(e) => handleSideCustomerChange('to', e.target.value)}
                  options={customerOptions}
                />
                <Select
                  label="Cuenta"
                  placeholder="Seleccionar cuenta"
                  value={transferForm.toAccountId}
                  onChange={(e) => setTransferForm((prev) => ({ ...prev, toAccountId: e.target.value }))}
                  disabled={toAccounts.length === 0}
                  options={toAccountOptions(toAccounts)}
                />
              </fieldset>
              <Input
                label="Monto"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={transferForm.amount}
                onChange={(e) => setTransferForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
              <Button
                type="submit"
                variant="primary"
                className="button--block"
                leftIcon={<FiSend />}
                loading={posting === 'transfer'}
                disabled={!transferForm.fromAccountId || !transferForm.toAccountId || !transferForm.amount || Boolean(posting)}
              >
                Transferir
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
