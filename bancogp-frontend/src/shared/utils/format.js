const currencyFormatters = new Map();

/** Formatea montos con caché de Intl.NumberFormat por moneda. */
export const formatCurrency = (value, currency = 'USD') => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  if (!currencyFormatters.has(currency)) {
    try {
      currencyFormatters.set(
        currency,
        new Intl.NumberFormat('es-GT', { style: 'currency', currency, minimumFractionDigits: 2 })
      );
    } catch {
      currencyFormatters.set(
        currency,
        new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
      );
    }
  }
  return currencyFormatters.get(currency).format(amount);
};

const numberFormatter = new Intl.NumberFormat('es-GT');

export const formatNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? numberFormatter.format(n) : '—';
};

const dateFormatter = new Intl.DateTimeFormat('es-GT', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('es-GT', {
  hour: '2-digit',
  minute: '2-digit',
});

/** Fecha absoluta corta: "24 nov 2026". */
export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
};

/** Fecha con hora: "24 nov 2026 · 14:32". */
export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`;
};

/** Iniciales para avatares. */
export const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
};

const plural = new Intl.PluralRules('es-GT');

/** Pluraliza correctamente: pluralize(1, 'cuenta', 'cuentas'). */
export const pluralize = (count, one, other) =>
  `${formatNumber(count)} ${plural.select(count) === 'one' ? one : other}`;
