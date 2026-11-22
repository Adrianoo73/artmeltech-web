import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import { duration, ease } from '@/lib/motion/tokens';

const loadAnimation = () => import('@/lib/motion/features-animation').then((mod) => mod.default);
const loadMax = () => import('@/lib/motion/features-max').then((mod) => mod.default);

interface MotionProviderProps {
  children: ReactNode;
  /** Usa `max` únicamente en islas que necesiten `layoutId` o gestos de arrastre. */
  features?: 'animation' | 'max';
}

/**
 * Proveedor ligero de Motion for React (`motion/react`) con carga asíncrona de features.
 * - Respeta automáticamente `prefers-reduced-motion` del sistema operativo.
 * - Evita cargar el motor de layout en el hilo inicial hasta que se necesite.
 */
export function MotionProvider({ children, features = 'animation' }: MotionProviderProps) {
  return (
    <LazyMotion features={features === 'max' ? loadMax : loadAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: duration.base, ease: ease.outExpo }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
