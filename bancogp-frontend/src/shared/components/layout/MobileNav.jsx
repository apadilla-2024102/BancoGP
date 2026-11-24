import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Sidebar } from './Sidebar.jsx';

const EASE_DRAWER = [0.32, 0.72, 0, 1];

/** Cajón lateral para móvil. Usa la curva tipo iOS para cajones. */
export const MobileNav = ({ open, onClose }) => {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Menú">
          <motion.div
            className="mobile-nav__overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="mobile-nav__panel"
            initial={reduceMotion ? { opacity: 0 } : { transform: 'translateX(-100%)' }}
            animate={reduceMotion ? { opacity: 1 } : { transform: 'translateX(0%)' }}
            exit={reduceMotion ? { opacity: 0 } : { transform: 'translateX(-100%)' }}
            transition={{ duration: 0.35, ease: EASE_DRAWER }}
          >
            <Sidebar onNavigate={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
