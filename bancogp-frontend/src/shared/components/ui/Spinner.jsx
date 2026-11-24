import { cn } from '../../utils/cn.js';

/**
 * Spinner de 12 barras al estilo iOS. Gira rápido:
 * un spinner veloz hace que la carga se perciba más corta.
 */
export const Spinner = ({ size = 16, className }) => (
  <span className={cn('spinner', className)} style={{ '--spinner-size': `${size}px` }} role="status" aria-label="Cargando">
    {Array.from({ length: 12 }, (_, i) => (
      <span key={i} className="spinner__bar" style={{ '--i': i }} />
    ))}
  </span>
);
