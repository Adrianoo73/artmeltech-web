/**
 * Tokens de animación — sincronizados con las variables CSS de src/styles/global.css
 * (--ease-out-expo, --duration-*). Una sola fuente de verdad para el "feeling" de marca:
 * movimientos rápidos al inicio y aterrizajes suaves, sin rebotes.
 */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutSoft: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const duration = {
  fast: 0.16,
  base: 0.32,
  slow: 0.64,
  reveal: 0.8,
} as const;

export const stagger = {
  tight: 0.05,
  base: 0.08,
  loose: 0.12,
} as const;

/** Spring suave sin rebote perceptible (para indicadores y elementos táctiles) */
export const softSpring = { type: 'spring', stiffness: 380, damping: 38, mass: 0.8 } as const;

/** Distancia de desplazamiento estándar para entradas */
export const revealOffset = 28;
