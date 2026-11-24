import { cn } from '../../utils/cn.js';
import { EmptyState } from './EmptyState.jsx';
import { SkeletonRows } from './Skeleton.jsx';

/**
 * Tabla de datos.
 * columns: [{ key, header, render?(row), align?: 'left'|'right', mono?: boolean, width? }]
 */
export const DataTable = ({
  columns,
  rows = [],
  getRowKey = (row, index) => row?._id ?? row?.id ?? index,
  loading = false,
  emptyTitle = 'Sin registros',
  emptyDescription,
  emptyIcon,
  onRowClick,
  selectedKey,
  caption,
  className,
}) => (
  <div className={cn('table', className)}>
    <div className="table__scroll">
      <table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }} className={cn(col.align === 'right' && 'is-right')}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows rows={4} columns={columns.length} />
          ) : (
            rows.map((row, index) => {
              const key = getRowKey(row, index);
              return (
                <tr
                  key={key}
                  className={cn(onRowClick && 'is-clickable', selectedKey === key && 'is-selected')}
                  onClick={onRowClick ? () => onRowClick(row, key) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn(col.align === 'right' && 'is-right', col.mono && 'mono')}>
                      {col.render ? col.render(row, index) : row?.[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
    {!loading && rows.length === 0 && (
      <EmptyState compact title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
    )}
  </div>
);
