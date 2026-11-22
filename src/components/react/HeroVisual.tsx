import { useRef } from 'react';
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { MotionProvider } from '@/components/react/MotionProvider';
import { useDeviceTier, useReducedMotionSafe } from '@/lib/motion/hooks';
import { ease } from '@/lib/motion/tokens';

export interface HeroVisualProps {
  isotipoSrc: string;
  isotipoWidth: number;
  isotipoHeight: number;
}

interface Particle {
  id: number;
  cx: number;
  cy: number;
  r: number;
  dy: number;
  dur: number;
  delay: number;
  accent?: boolean;
}

const PARTICLES: Particle[] = [
  { id: 1, cx: 64, cy: 86, r: 2.2, dy: -12, dur: 5.5, delay: 0.2 },
  { id: 2, cx: 142, cy: 48, r: 1.8, dy: 10, dur: 6.4, delay: 0.8, accent: true },
  { id: 3, cx: 235, cy: 70, r: 2.5, dy: -14, dur: 7.0, delay: 0.4 },
  { id: 4, cx: 348, cy: 52, r: 2.0, dy: 12, dur: 5.8, delay: 1.1 },
  { id: 5, cx: 432, cy: 96, r: 2.6, dy: -11, dur: 6.8, delay: 0.3, accent: true },
  { id: 6, cx: 484, cy: 186, r: 1.8, dy: 9, dur: 5.2, delay: 0.9 },
  { id: 7, cx: 454, cy: 318, r: 2.2, dy: -13, dur: 6.2, delay: 0.5 },
  { id: 8, cx: 374, cy: 408, r: 2.1, dy: 10, dur: 7.2, delay: 1.3, accent: true },
  { id: 9, cx: 214, cy: 422, r: 2.4, dy: -10, dur: 6.0, delay: 0.7 },
  { id: 10, cx: 88, cy: 374, r: 1.8, dy: 11, dur: 5.6, delay: 1.0 },
  { id: 11, cx: 46, cy: 244, r: 2.3, dy: -9, dur: 6.6, delay: 0.1 },
  { id: 12, cx: 298, cy: 288, r: 2.0, dy: 8, dur: 5.9, delay: 1.4 },
];

const CIRCUIT_PATHS = [
  'M 54 348 L 128 274 L 220 274 L 286 208 L 392 208 L 456 144',
  'M 94 128 L 166 128 L 222 184 L 318 184 L 372 130 L 444 130',
  'M 124 398 L 194 328 L 296 328 L 358 266 L 442 266',
  'M 64 216 L 144 216 L 188 260',
  'M 286 208 L 286 118 L 336 68',
  'M 296 328 L 336 368 L 414 368',
];

const NODES: { x: number; y: number; r: number; kind: 'sky' | 'white' | 'accent' }[] = [
  { x: 54, y: 348, r: 5, kind: 'sky' },
  { x: 128, y: 274, r: 4.5, kind: 'white' },
  { x: 392, y: 208, r: 4.5, kind: 'white' },
  { x: 456, y: 144, r: 6.5, kind: 'accent' },
  { x: 94, y: 128, r: 4.5, kind: 'sky' },
  { x: 222, y: 184, r: 4, kind: 'white' },
  { x: 444, y: 130, r: 4.5, kind: 'white' },
  { x: 124, y: 398, r: 4.5, kind: 'sky' },
  { x: 296, y: 328, r: 5.5, kind: 'accent' },
  { x: 442, y: 266, r: 4.5, kind: 'white' },
  { x: 336, y: 68, r: 4.5, kind: 'sky' },
  { x: 414, y: 368, r: 4.5, kind: 'sky' },
];

function HeroVisualInner({ isotipoSrc, isotipoWidth, isotipoHeight }: HeroVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const tier = useDeviceTier();
  const interactive = !reduced && tier === 'high';

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.6 });

  const layerBackX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const layerBackY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const layerFrontX = useTransform(smoothX, [-1, 1], [14, -14]);
  const layerFrontY = useTransform(smoothY, [-1, 1], [10, -10]);
  const layerMidX = useTransform(smoothX, [-1, 1], [7, -7]);
  const layerMidY = useTransform(smoothY, [-1, 1], [6, -6]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const scrollLift = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -32]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const visibleParticles = reduced ? [] : tier === 'high' ? PARTICLES : PARTICLES.slice(0, 5);

  return (
    <m.div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ y: scrollLift }}
      aria-hidden="true"
      className="relative mx-auto aspect-[520/440] w-full max-w-[540px] pb-6 select-none sm:aspect-[520/460] sm:pb-0"
    >
      {/* Halo atmosférico (gradiente radial puro sin blur costoso) */}
      <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_62%_38%,rgb(99_156_197/0.26)_0%,transparent_62%),radial-gradient(circle_at_35%_72%,rgb(235_47_51/0.12)_0%,transparent_58%)]" />

      {/* Panel principal de arquitectura */}
      <m.div
        {...(interactive ? { style: { x: layerBackX, y: layerBackY } } : {})}
        className="glass-dark relative h-full w-full overflow-hidden rounded-[1.75rem] shadow-card sm:rounded-[2rem]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(99_156_197/0.22),transparent_55%)]" />

        <svg viewBox="0 0 520 460" fill="none" className="h-full w-full" role="presentation">
          <defs>
            <linearGradient id="hero-trace" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#639CC5" stopOpacity="0.28" />
              <stop offset="55%" stopColor="#639CC5" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="hero-trace-accent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#639CC5" stopOpacity="0.4" />
              <stop offset="55%" stopColor="#EB2F33" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="hero-node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#639CC5" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#639CC5" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Cuadrícula interna */}
          <g stroke="#639CC5" strokeOpacity="0.1" strokeWidth="1">
            {[65, 130, 195, 260, 325, 390, 455].map((x) => (
              <line key={`vx-${x}`} x1={x} y1={20} x2={x} y2={440} />
            ))}
            {[75, 150, 225, 300, 375].map((y) => (
              <line key={`hy-${y}`} x1={20} y1={y} x2={500} y2={y} />
            ))}
          </g>

          <circle cx="286" cy="208" r="76" fill="url(#hero-node-glow)" />

          {/* Trazos de circuito */}
          {CIRCUIT_PATHS.map((d, idx) => (
            <g key={d}>
              <path
                d={d}
                stroke="#639CC5"
                strokeOpacity="0.18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <m.path
                d={d}
                stroke={idx === 2 ? 'url(#hero-trace-accent)' : 'url(#hero-trace)'}
                strokeWidth={idx === 0 || idx === 2 ? 2.4 : 1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 1.2, delay: 0.12 + idx * 0.08, ease: ease.inOutSoft },
                  opacity: { duration: 0.3, delay: 0.12 + idx * 0.08 },
                }}
              />
            </g>
          ))}

          {/* Flecha ascendente de crecimiento en acento */}
          <m.path
            d="M 442 144 L 456 144 L 456 158"
            stroke="#EB2F33"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.9, ease: ease.outExpo }}
          />

          {/* Pulsos luminosos recorriendo rutas complementarias */}
          {!reduced && (
            <>
              <m.path
                d={CIRCUIT_PATHS[0]}
                stroke="#EB2F33"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24 520"
                initial={{ strokeDashoffset: 544, opacity: 0 }}
                animate={{ strokeDashoffset: [544, -24], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 3.4,
                  delay: 0.9,
                  repeat: Infinity,
                  repeatDelay: 1.1,
                  ease: 'easeInOut',
                }}
              />
              <m.path
                d={CIRCUIT_PATHS[2]}
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="18 460"
                initial={{ strokeDashoffset: 478, opacity: 0 }}
                animate={{ strokeDashoffset: [478, -20], opacity: [0, 0.95, 0.95, 0] }}
                transition={{
                  duration: 3.9,
                  delay: 2.0,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: 'easeInOut',
                }}
              />
            </>
          )}

          {/* Nodos de conexión */}
          {NODES.map((node, i) => (
            <m.g
              key={`${node.x}-${node.y}`}
              initial={reduced ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.35 + i * 0.04,
                ease: ease.outExpo,
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              {node.kind === 'accent' && !reduced && (
                <m.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + 7}
                  stroke="#EB2F33"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  animate={{ scale: [0.85, 1.38, 0.85], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={
                  node.kind === 'accent'
                    ? '#EB2F33'
                    : node.kind === 'white'
                      ? '#FFFFFF'
                      : '#03203D'
                }
                stroke={node.kind === 'sky' ? '#639CC5' : 'none'}
                strokeWidth={node.kind === 'sky' ? 2.2 : 0}
              />
            </m.g>
          ))}

          {/* Partículas discretas */}
          {visibleParticles.map((p) => (
            <m.circle
              key={p.id}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={p.accent ? '#EB2F33' : '#639CC5'}
              fillOpacity={p.accent ? 0.9 : 0.55}
              animate={{ y: [0, p.dy, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>

        {/* Núcleo central con el isotipo oficial AM rodeado de un anillo orbital lento */}
        <m.div
          initial={reduced ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: ease.outExpo }}
          className="pointer-events-none absolute top-[45.2%] left-[55%] -translate-x-1/2 -translate-y-1/2"
        >
          {/* Anillo orbital con nodos en movimiento */}
          {!reduced && (
            <div className="orbit-slow absolute -inset-4 rounded-full border border-dashed border-sky/45 sm:-inset-5">
              <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_rgb(235_47_51/0.9)]" />
              <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-sky shadow-[0_0_8px_rgb(99_156_197/0.9)]" />
            </div>
          )}

          <div className="relative grid size-16 place-items-center rounded-2xl bg-white p-2.5 shadow-[0_14px_34px_-8px_rgb(0_0_0/0.65)] ring-2 ring-accent/85 sm:size-20 sm:p-3">
            <img
              src={isotipoSrc}
              width={isotipoWidth}
              height={isotipoHeight}
              alt=""
              decoding="async"
              className="h-auto w-full object-contain"
            />
            <span className="animate-pulse-dot absolute -top-1.5 -right-1.5 size-3 rounded-full bg-accent/55" />
            <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-accent ring-2 ring-navy" />
          </div>
        </m.div>

        {/* Barra superior de arquitectura */}
        <div className="pointer-events-none absolute inset-x-4 top-3.5 flex items-center justify-between border-b border-sky/15 pb-2.5 sm:inset-x-5 sm:top-4 sm:pb-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="size-2 rounded-full bg-sky/75" />
            <span className="size-2 rounded-full bg-white/35" />
          </div>
          <span className="font-display text-[0.625rem] font-semibold tracking-[0.2em] text-sky uppercase">
            Arquitectura conectada
          </span>
        </div>
      </m.div>

      {/* Capa flotante superior izquierda con flotación orgánica suave */}
      <m.div
        {...(interactive ? { style: { x: layerMidX, y: layerMidY } } : {})}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: [0, -6, 0] }}
        transition={
          reduced
            ? { duration: 0.3 }
            : {
                opacity: { duration: 0.55, delay: 0.28, ease: ease.outExpo },
                y: { duration: 5.8, delay: 0.85, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        className="glass-dark absolute top-14 -left-4 hidden w-52 rounded-2xl border-l-2 border-l-accent p-3.5 shadow-card sm:block sm:-left-7"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-[0.6875rem] font-semibold tracking-[0.14em] text-sky uppercase">
            Soluciones
          </span>
          <span className="relative flex size-2">
            <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
        </div>
        <p className="mt-1.5 font-display text-xs font-semibold text-white">
          Web + Apps + Soporte
        </p>
        <div className="mt-3 flex items-end gap-1.5">
          {[42, 68, 54, 86, 72, 100].map((height, idx) => (
            <m.span
              key={height}
              initial={reduced ? false : { scaleY: 0.2, opacity: 0.4 }}
              animate={
                reduced
                  ? { scaleY: 1, opacity: 1 }
                  : { scaleY: [1, 0.72, 1], opacity: 1 }
              }
              transition={
                reduced
                  ? { duration: 0.3 }
                  : {
                      opacity: { duration: 0.4, delay: 0.45 + idx * 0.05 },
                      scaleY: {
                        duration: 2.8 + idx * 0.25,
                        delay: 0.9 + idx * 0.14,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }
              }
              style={{ height: `${Math.round(height * 0.24)}px` }}
              className={`w-full origin-bottom rounded-t-sm ${
                idx === 5 ? 'bg-accent' : idx === 3 ? 'bg-white' : 'bg-sky/65'
              }`}
            />
          ))}
        </div>
      </m.div>

      {/* Capa flotante inferior con flotación contrafase y progreso vivo */}
      <m.div
        {...(interactive ? { style: { x: layerFrontX, y: layerFrontY } } : {})}
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: [0, 6, 0] }}
        transition={
          reduced
            ? { duration: 0.3 }
            : {
                opacity: { duration: 0.6, delay: 0.38, ease: ease.outExpo },
                y: { duration: 6.4, delay: 1.0, repeat: Infinity, ease: 'easeInOut' },
              }
        }
        className="glass-dark absolute inset-x-3 bottom-0 w-auto rounded-2xl p-3.5 shadow-card sm:inset-x-auto sm:-right-6 sm:-bottom-5 sm:w-72 sm:p-4"
      >
        <div className="flex items-center gap-3">
          <span className="relative grid size-8 shrink-0 place-items-center rounded-xl bg-accent/18 ring-1 ring-accent/55">
            <span className="animate-pulse-dot absolute size-2.5 rounded-full bg-accent" />
            <span className="relative size-2.5 rounded-full bg-accent" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-xs font-semibold leading-snug text-white">
              Automatización continua
            </p>
            <p className="mt-0.5 text-[0.7rem] leading-snug text-white/75">
              Procesos conectados de punta a punta
            </p>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/12">
          <m.div
            initial={reduced ? false : { scaleX: 0.15 }}
            animate={reduced ? { scaleX: 0.86 } : { scaleX: [0.68, 0.94, 0.78, 0.9] }}
            transition={
              reduced
                ? { duration: 0.3 }
                : { duration: 4.8, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }
            }
            className="h-full origin-left rounded-full bg-gradient-to-r from-sky via-white to-accent"
          />
        </div>
      </m.div>
    </m.div>
  );
}

/** Composición visual tecnológica interactiva del Hero (Motion for React). */
export function HeroVisual(props: HeroVisualProps) {
  return (
    <MotionProvider>
      <HeroVisualInner {...props} />
    </MotionProvider>
  );
}
