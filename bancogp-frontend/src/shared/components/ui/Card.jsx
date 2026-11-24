import { cn } from '../../utils/cn.js';

export const Card = ({ as: Tag = 'section', className, padded = true, children, ...props }) => (
  <Tag className={cn('card', padded && 'card--padded', className)} {...props}>
    {children}
  </Tag>
);

export const CardHeader = ({ title, description, icon, actions, tone, className }) => (
  <header className={cn('card__header', className)} data-tone={tone}>
    <div className="card__heading">
      {icon && <span className="card__icon">{icon}</span>}
      <div>
        <h2 className="card__title">{title}</h2>
        {description && <p className="card__description">{description}</p>}
      </div>
    </div>
    {actions && <div className="card__actions">{actions}</div>}
  </header>
);

export const CardFooter = ({ className, children }) => <footer className={cn('card__footer', className)}>{children}</footer>;
