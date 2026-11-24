import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { cn } from '../../utils/cn.js';

const defaultFormat = (n) => new Intl.NumberFormat('es-GT').format(Math.round(n));

/**
 * Contador animado (adaptado de NumberTicker de Magic UI, licencia MIT).
 * Usa un resorte para que el número se asiente de forma natural y
 * escribe directo en el DOM para no re-renderizar en cada frame.
 */
export const NumberTicker = ({ value = 0, format = defaultFormat, className }) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 40, stiffness: 140 });
  const inView = useInView(ref, { once: true });
  const target = Number(value) || 0;

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      spring.jump(target);
    } else {
      motionValue.set(target);
    }
  }, [inView, target, reduceMotion, motionValue, spring]);

  useEffect(
    () =>
      spring.on('change', (latest) => {
        if (ref.current) ref.current.textContent = format(latest);
      }),
    [spring, format]
  );

  return (
    <span ref={ref} className={cn('tabular', className)}>
      {format(0)}
    </span>
  );
};
