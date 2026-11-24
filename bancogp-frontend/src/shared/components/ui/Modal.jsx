import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FiX } from 'react-icons/fi';
import { Button } from './Button.jsx';

const EASE_OUT = [0.23, 1, 0.32, 1];

/**
 * Modal centrado. Entra con escala 0.96 + opacidad (nunca desde scale(0))
 * y sale más rápido de lo que entra.
 */
export const Modal = ({ open, onClose, title, description, children, footer, size = 'md' }) => {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector('input, select, textarea, button:not([data-close])');
      first?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="modal" role="presentation">
          <motion.div
            className="modal__overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          />
          <motion.div
            ref={panelRef}
            className={`modal__panel modal__panel--${size}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.96) translateY(8px)' }}
            animate={{
              opacity: 1,
              transform: 'scale(1) translateY(0px)',
              transition: { duration: 0.25, ease: EASE_OUT },
            }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { opacity: 0, transform: 'scale(0.98) translateY(0px)', transition: { duration: 0.15, ease: EASE_OUT } }
            }
          >
            <header className="modal__header">
              <div>
                <h2 id="modal-title" className="modal__title">
                  {title}
                </h2>
                {description && <p className="modal__description">{description}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar" data-close>
                <FiX />
              </Button>
            </header>
            <div className="modal__body">{children}</div>
            {footer && <footer className="modal__footer">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
