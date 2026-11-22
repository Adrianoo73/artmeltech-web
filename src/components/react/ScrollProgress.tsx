import { m, useScroll, useSpring } from 'motion/react';
import { MotionProvider } from '@/components/react/MotionProvider';
import { useReducedMotionSafe } from '@/lib/motion/hooks';

function ScrollProgressBar() {
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      <m.div
        className="h-full origin-left bg-gradient-to-r from-navy via-sky to-accent shadow-[0_0_10px_rgb(235_47_51/0.45)]"
        style={{ scaleX }}
      />
    </div>
  );
}

/** Indicador discreto de progreso de lectura en la parte superior de la ventana. */
export function ScrollProgress() {
  return (
    <MotionProvider>
      <ScrollProgressBar />
    </MotionProvider>
  );
}
