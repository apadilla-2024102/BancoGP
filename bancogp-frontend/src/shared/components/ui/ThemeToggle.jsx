import { AnimatePresence, motion } from 'motion/react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useThemeContext } from '../../../store/themeStore.jsx';
import { Button } from './Button.jsx';

/**
 * Alterna el tema. El icono cambia con un crossfade + blur:
 * el desenfoque une ambos estados y evita ver dos iconos superpuestos.
 */
export const ThemeToggle = () => {
  const { resolvedTheme, toggleTheme } = useThemeContext();
  const isDark = resolvedTheme === 'dark';
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          style={{ display: 'inline-flex' }}
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {isDark ? <FiMoon /> : <FiSun />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
};
