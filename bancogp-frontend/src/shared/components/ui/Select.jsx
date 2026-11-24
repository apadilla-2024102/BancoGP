import { forwardRef, useId } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Field } from './Field.jsx';

/**
 * Select nativo estilizado. Se mantiene nativo a propósito:
 * en móvil abre el selector del sistema, que es la mejor experiencia.
 */
export const Select = forwardRef(function Select(
  { label, hint, error, options = [], placeholder, className, id, children, ...props },
  ref
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={selectId} className={className}>
      <div className="select">
        <select ref={ref} id={selectId} className="select__control" {...props}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <FiChevronDown className="select__chevron" aria-hidden="true" />
      </div>
    </Field>
  );
});
