import { cn } from '../../utils/cn.js';

/** tone: neutral | success | danger | warning | info | accent */
export const Badge = ({ tone = 'neutral', dot = false, className, children }) => (
  <span className={cn('badge', `badge--${tone}`, className)}>
    {dot && <span className="badge__dot" aria-hidden="true" />}
    {children}
  </span>
);
