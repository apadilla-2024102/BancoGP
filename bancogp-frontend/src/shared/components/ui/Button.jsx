import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';
import { Spinner } from './Spinner.jsx';

/**
 * Botón base.
 * variant: primary | secondary | ghost | danger | accent
 * size: sm | md | lg | icon
 */
export const Button = forwardRef(function Button(
  { variant = 'secondary', size = 'md', loading = false, disabled, leftIcon, rightIcon, className, children, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('button', `button--${variant}`, `button--${size}`, loading && 'is-loading', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className="button__content">
        {leftIcon && <span className="button__icon">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="button__icon">{rightIcon}</span>}
      </span>
      {loading && (
        <span className="button__spinner">
          <Spinner size={16} />
        </span>
      )}
    </button>
  );
});
