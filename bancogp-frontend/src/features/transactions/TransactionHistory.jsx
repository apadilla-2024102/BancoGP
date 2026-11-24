import { useState } from 'react';
import { FiArrowDownLeft, FiArrowUpRight, FiRepeat } from 'react-icons/fi';
import { DataTable, Tabs } from '../../shared/components/ui/index.js';
import { formatCurrency, formatDateTime } from '../../shared/utils/format.js';

const getDate = (item) => item.timestamp ?? item.createdAt;

const amountCell = (sign, tone) => (item) => (
  <span className={`amount amount--${tone}`}>
    {sign}
    {formatCurrency(item.amount ?? 0)}
  </span>
);

const COLUMNS = {
  deposits: [
    { key: 'type', header: '', width: 40, render: () => <span className="tx-icon tx-icon--in"><FiArrowDownLeft /></span> },
    { key: 'description', header: 'Descripción', render: (i) => i.description || 'Depósito' },
    { key: 'date', header: 'Fecha', render: (i) => formatDateTime(getDate(i)) },
    { key: 'amount', header: 'Monto', align: 'right', render: amountCell('+', 'in') },
  ],
  withdrawals: [
    { key: 'type', header: '', width: 40, render: () => <span className="tx-icon tx-icon--out"><FiArrowUpRight /></span> },
    { key: 'description', header: 'Descripción', render: (i) => i.description || 'Retiro' },
    { key: 'date', header: 'Fecha', render: (i) => formatDateTime(getDate(i)) },
    { key: 'amount', header: 'Monto', align: 'right', render: amountCell('−', 'out') },
  ],
  transfers: [
    { key: 'type', header: '', width: 40, render: () => <span className="tx-icon"><FiRepeat /></span> },
    { key: 'from', header: 'Origen', mono: true, render: (i) => i.fromAccountId ?? i.sourceAccount ?? '—' },
    { key: 'to', header: 'Destino', mono: true, render: (i) => i.toAccountId ?? i.destinationAccount ?? '—' },
    { key: 'date', header: 'Fecha', render: (i) => formatDateTime(getDate(i)) },
    { key: 'amount', header: 'Monto', align: 'right', render: amountCell('', 'neutral') },
  ],
};

const EMPTY = {
  deposits: 'No hay depósitos registrados.',
  withdrawals: 'No hay retiros registrados.',
  transfers: 'No hay transferencias registradas.',
};

/** Historial de movimientos con pestañas por tipo. */
export const TransactionHistory = ({ deposits = [], withdrawals = [], transfers = [], loading = false }) => {
  const [tab, setTab] = useState('deposits');
  const data = { deposits, withdrawals, transfers };

  return (
    <div className="tx-history">
      <Tabs
        ariaLabel="Tipo de movimiento"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'deposits', label: 'Depósitos', count: deposits.length },
          { value: 'withdrawals', label: 'Retiros', count: withdrawals.length },
          { value: 'transfers', label: 'Transferencias', count: transfers.length },
        ]}
      />
      <DataTable
        key={tab}
        className="animate-in"
        caption={`Historial de ${tab}`}
        columns={COLUMNS[tab]}
        rows={data[tab]}
        loading={loading}
        getRowKey={(item, index) => item._id ?? item.id ?? index}
        emptyTitle="Sin movimientos"
        emptyDescription={EMPTY[tab]}
      />
    </div>
  );
};
