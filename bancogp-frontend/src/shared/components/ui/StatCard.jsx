import { cn } from '../../utils/cn.js';
import { NumberTicker } from './NumberTicker.jsx';
import { Skeleton } from './Skeleton.jsx';

/** Tarjeta de métrica: etiqueta, valor animado e icono. */
export const StatCard = ({ label, value, icon, format, hint, loading = false, className }) => (
  <div className={cn('stat-card-v2', className)}>
    <div className="stat-card-v2__top">
      <span className="stat-card-v2__label">{label}</span>
      {icon && <span className="stat-card-v2__icon">{icon}</span>}
    </div>
    <div className="stat-card-v2__value">
      {loading ? <Skeleton width={96} height={28} /> : <NumberTicker value={value} format={format} />}
    </div>
    {hint && <p className="stat-card-v2__hint">{hint}</p>}
  </div>
);
