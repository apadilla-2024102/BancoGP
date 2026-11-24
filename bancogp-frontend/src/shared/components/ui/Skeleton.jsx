import { cn } from '../../utils/cn.js';

export const Skeleton = ({ width, height = 14, radius, className }) => (
  <span
    className={cn('skeleton', className)}
    style={{ width, height, borderRadius: radius }}
    aria-hidden="true"
  />
);

/** Filas de tabla en estado de carga. */
export const SkeletonRows = ({ rows = 4, columns = 3 }) =>
  Array.from({ length: rows }, (_, r) => (
    <tr key={r} className="skeleton-row">
      {Array.from({ length: columns }, (_, c) => (
        <td key={c}>
          <Skeleton width={`${55 + ((r * 7 + c * 13) % 35)}%`} />
        </td>
      ))}
    </tr>
  ));
