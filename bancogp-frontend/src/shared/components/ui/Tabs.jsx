import { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn.js';

/**
 * Pestañas segmentadas con indicador que se desliza entre opciones.
 * items: [{ value, label, count? }]
 */
export const Tabs = ({ items, value, onChange, className, ariaLabel }) => {
  const groupId = useId();
  return (
    <div className={cn('tabs', className)} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn('tabs__tab', active && 'is-active')}
            onClick={() => onChange(item.value)}
          >
            {active && (
              <motion.span
                layoutId={`tabs-indicator-${groupId}`}
                className="tabs__indicator"
                transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              />
            )}
            <span className="tabs__label">
              {item.label}
              {item.count !== undefined && <span className="tabs__count">{item.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
};
