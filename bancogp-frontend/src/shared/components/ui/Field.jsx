import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn.js';

/** Contenedor de campo: etiqueta, control, ayuda y error. */
export const Field = ({ label, hint, error, htmlFor, className, children }) => (
  <div className={cn('field', error && 'field--invalid', className)}>
    {label && (
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
    )}
    {children}
    {error ? (
      <p className="field__error" role="alert">
        {error}
      </p>
    ) : (
      hint && <p className="field__hint">{hint}</p>
    )}
  </div>
);

/** Input con etiqueta opcional e icono a la izquierda. */
export const Input = forwardRef(function Input(
  { label, hint, error, icon, suffix, className, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={className}>
      <div className={cn('input', icon && 'input--with-icon', suffix && 'input--with-suffix')}>
        {icon && <span className="input__icon">{icon}</span>}
        <input ref={ref} id={inputId} className="input__control" aria-invalid={Boolean(error) || undefined} {...props} />
        {suffix && <span className="input__suffix">{suffix}</span>}
      </div>
    </Field>
  );
});
