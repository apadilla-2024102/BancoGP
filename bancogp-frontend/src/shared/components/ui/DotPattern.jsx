import { useId } from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Patrón de puntos SVG para fondos (inspirado en DotPattern de Magic UI).
 * Decorativo: se oculta a lectores de pantalla y no recibe eventos.
 */
export const DotPattern = ({ size = 16, radius = 1, className }) => {
  const id = useId();
  return (
    <svg className={cn('dot-pattern', className)} aria-hidden="true">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <circle cx={size / 2} cy={size / 2} r={radius} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};
