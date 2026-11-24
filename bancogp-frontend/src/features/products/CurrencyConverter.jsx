import { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { convertCurrency } from '../../shared/api/productsApi.js';
import { Button, Input, Select } from '../../shared/components/ui/index.js';
import { formatCurrency } from '../../shared/utils/format.js';
import { getErrorMessage } from '../../shared/utils/cn.js';

const FALLBACK_CODES = ['USD', 'EUR', 'GTQ', 'MXN'];

/** Conversor de divisas con intercambio rápido de origen/destino. */
export const CurrencyConverter = ({ currencies = [] }) => {
  const [form, setForm] = useState({ from: 'USD', to: 'EUR', amount: '1' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [swapTurns, setSwapTurns] = useState(0);

  const codes = currencies.length
    ? currencies.map((c) => c.code ?? c.currencyCode).filter(Boolean)
    : FALLBACK_CODES;
  const options = [...new Set([...codes, form.from, form.to])].map((code) => ({ value: code, label: code }));

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setResult(null);
  };

  const swap = () => {
    setForm((prev) => ({ ...prev, from: prev.to, to: prev.from }));
    setSwapTurns((t) => t + 1);
    setResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      setResult(await convertCurrency(form));
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo convertir la moneda.'));
    } finally {
      setLoading(false);
    }
  };

  const converted = result?.convertedAmount ?? result?.amount;

  return (
    <form className="converter" onSubmit={handleSubmit}>
      <Input label="Cantidad" type="number" inputMode="decimal" min="0" step="0.01" value={form.amount} onChange={update('amount')} />
      <div className="converter__pair">
        <Select label="De" value={form.from} onChange={update('from')} options={options} />
        <button
          type="button"
          className="converter__swap"
          onClick={swap}
          aria-label="Intercambiar monedas"
          style={{ '--turns': swapTurns }}
        >
          <FiRefreshCw />
        </button>
        <Select label="A" value={form.to} onChange={update('to')} options={options} />
      </div>
      <Button type="submit" variant="primary" className="button--block" loading={loading} disabled={!form.amount}>
        Convertir
      </Button>
      {error && <p className="alert alert--danger">{error}</p>}
      {converted !== undefined && (
        <div className="converter__result animate-in">
          <span className="converter__result-label">
            {formatCurrency(Number(form.amount), form.from)} equivale a
          </span>
          <span className="converter__result-value tabular">{formatCurrency(Number(converted), result?.to ?? form.to)}</span>
        </div>
      )}
    </form>
  );
};
