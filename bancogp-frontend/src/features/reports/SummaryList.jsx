import { cn } from '../../shared/utils/cn.js';

/**
 * Lista de pares etiqueta/valor para resúmenes financieros.
 * items: [{ label, value, icon?, tone?: 'in'|'out'|'accent', strong? }]
 */
export const SummaryList = ({ items, className }) => (
  <dl className={cn('summary-list', className)}>
    {items.map(({ label, value, icon, tone, strong }) => (
      <div key={label} className={cn('summary-list__row', strong && 'is-strong')}>
        <dt>
          {icon && <span className="summary-list__icon">{icon}</span>}
          {label}
        </dt>
        <dd className={cn('tabular', tone && `amount amount--${tone}`)}>{value}</dd>
      </div>
    ))}
  </dl>
);

/** Bloque colapsable con la respuesta completa del servidor. */
export const RawData = ({ data }) => (
  <details className="raw-data">
    <summary>Ver datos completos (JSON)</summary>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </details>
);
