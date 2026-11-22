import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export type DeviceTier = 'high' | 'low';

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

/**
 * Envuelve `useReducedMotion` de motion/react de forma segura para SSR/hidratación.
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  return Boolean(reduced);
}

/**
 * Detecta dispositivos con menor capacidad o táctiles/ahorro de datos para aligerar
 * animaciones decorativas (partículas, parallax por puntero, etc.).
 * En SSR devuelve 'low' por defecto para evitar trabajo innecesario hasta hidratar.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('low');

  useEffect(() => {
    const compute = (): DeviceTier => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const smallViewport = window.innerWidth < 1024;
      const lowCores =
        typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
      const conn = (navigator as NavigatorWithConnection).connection;
      const saveData = Boolean(conn?.saveData) || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g';

      if (reduced || coarsePointer || smallViewport || lowCores || saveData) {
        return 'low';
      }
      return 'high';
    };

    setTier(compute());

    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setTier(compute());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return tier;
}
