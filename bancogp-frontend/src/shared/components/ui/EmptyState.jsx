import { FiInbox } from 'react-icons/fi';
import { cn } from '../../utils/cn.js';

export const EmptyState = ({ icon = <FiInbox />, title, description, action, compact = false, className }) => (
  <div className={cn('empty-state', compact && 'empty-state--compact', className)}>
    <span className="empty-state__icon">{icon}</span>
    <p className="empty-state__title">{title}</p>
    {description && <p className="empty-state__description">{description}</p>}
    {action && <div className="empty-state__action">{action}</div>}
  </div>
);
