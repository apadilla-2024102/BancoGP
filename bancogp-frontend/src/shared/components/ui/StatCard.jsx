import { cn } from '../../utils/cn.js';
import { NumberTicker } from './NumberTicker.jsx';
import { Skeleton } from './Skeleton.jsx';

/** Tarjeta de métrica con color: ícono en degradado y brillo del tono. */
export const StatCard = ({ label, value, icon, format, hint, tone = 'indigo', loading = false, className }) => (
  <div className={cn('stat-card', className)} data-tone={tone}>
    <div className="stat-card__top">
      <span className="stat-card__label">{label}</span>
      {icon && <span className="stat-card__icon">{icon}</span>}
    </div>
    <div className="stat-card__value">
      {loading ? <Skeleton width={96} height={28} /> : <NumberTicker value={value} format={format} />}
    </div>
    {hint && <p className="stat-card__hint">{hint}</p>}
  </div>
);
