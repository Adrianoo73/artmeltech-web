/**
 * Motor de animaciones vinculadas al viewport y al scroll para secciones estáticas (Astro).
 * Usa `inView` y `scroll` de `motion` + `animate` de `motion/mini` (WAAPI acelerado por GPU).
 *
 * Atributos soportados:
 *   data-reveal            → fade + slide up
 *   data-reveal="fade"     → solo opacidad
 *   data-reveal="scale"    → fade + escala suave
 *   data-reveal="card"     → fade + desplazamiento + escala para tarjetas
 *   data-reveal="left"     → entrada lateral desde izquierda (en móvil vertical)
 *   data-reveal="right"    → entrada lateral desde derecha (en móvil vertical)
 *   data-reveal="line"     → despliegue horizontal (scaleX 0 → 1) para trazos y subrayados
 *   data-reveal="draw"     → dibujo progresivo de trazos SVG (pathLength="1")
 *   data-reveal-group      → escalona automáticamente a los hijos [data-reveal]
 *   data-scroll-line       → línea vertical que crece (scaleY 0 → 1) siguiendo el scroll
 *   data-parallax="24"     → parallax vertical sutil vinculado al scroll (en px)
 *
 * Mejora progresiva: el estado inicial oculto solo existe con `html.js` activo.
 */
import { inView, scroll } from 'motion';
import { animate } from 'motion/mini';
import { duration, ease, revealOffset, stagger } from './tokens';

type RevealKind = 'up' | 'fade' | 'scale' | 'card' | 'left' | 'right' | 'line' | 'draw';
type Keyframes = Parameters<typeof animate>[1];

export function keyframesFor(kind: RevealKind, reduced: boolean, compact = false): Keyframes {
  if (reduced || kind === 'fade') return { opacity: [0, 1] };

  if (kind === 'scale') {
    return { opacity: [0, 1], transform: ['scale(0.95)', 'scale(1)'] };
  }
  if (kind === 'card') {
    return {
      opacity: [0, 1],
      transform: ['translate3d(0, 34px, 0) scale(0.96)', 'translate3d(0, 0, 0) scale(1)'],
    };
  }
  if (kind === 'left') {
    const x = compact ? 0 : -28;
    const y = compact ? 22 : 0;
    return {
      opacity: [0, 1],
      transform: [`translate3d(${x}px, ${y}px, 0)`, 'translate3d(0, 0, 0)'],
    };
  }
  if (kind === 'right') {
    const x = compact ? 0 : 28;
    const y = compact ? 22 : 0;
    return {
      opacity: [0, 1],
      transform: [`translate3d(${x}px, ${y}px, 0)`, 'translate3d(0, 0, 0)'],
    };
  }
  if (kind === 'line') {
    return {
      opacity: [0.2, 1],
      transform: ['scaleX(0)', 'scaleX(1)'],
    };
  }
  if (kind === 'draw') {
    return {
      strokeDashoffset: [1, 0],
      opacity: [0.2, 1],
    };
  }
  return {
    opacity: [0, 1],
    transform: [`translate3d(0, ${revealOffset}px, 0)`, 'translate3d(0, 0, 0)'],
  };
}

function groupIndex(el: Element): number {
  if ((el as HTMLElement | SVGElement).dataset?.reveal === 'draw') return 0;
  const group = el.closest('[data-reveal-group]');
  if (!group) return 0;
  const peers = Array.from(group.querySelectorAll('[data-reveal]:not([data-reveal="draw"])'));
  return Math.max(0, peers.indexOf(el));
}

function markRevealed(el: HTMLElement | SVGElement): void {
  el.dataset.revealed = '';
  el.style.removeProperty('opacity');
  el.style.removeProperty('transform');
  el.style.removeProperty('stroke-dasharray');
  el.style.removeProperty('stroke-dashoffset');
}

export function initReveal(root: ParentNode = document): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact = window.innerWidth < 768;
  const elements = root.querySelectorAll<HTMLElement | SVGElement>('[data-reveal]:not([data-revealed])');

  elements.forEach((el) => {
    const kind = ((el.dataset.reveal || 'up') as RevealKind);
    // IntersectionObserver en elementos SVG <path> internos puede no dispararse en Chromium;
    // observar su <svg> contenedor garantiza la animación al entrar en viewport.
    const observeTarget = kind === 'draw' ? (el.closest('svg') ?? el) : el;

    inView(
      observeTarget,
      () => {
        const index = groupIndex(el);
        const baseDelay = Number(el.dataset.revealDelay ?? (kind === 'draw' ? 0.16 : 0));
        const step = kind === 'card' ? 0.09 : stagger.base;
        const delay = reduced ? 0 : baseDelay + Math.min(index, 8) * step;
        const animDuration = reduced
          ? duration.base
          : kind === 'draw'
            ? 0.95
            : kind === 'line'
              ? 0.72
              : duration.reveal;

        animate(el, keyframesFor(kind, reduced, compact), {
          duration: animDuration,
          delay,
          ease: [...ease.outExpo],
        })
          .then(() => markRevealed(el))
          .catch(() => markRevealed(el));
      },
      { amount: 0.14, margin: '0px 0px -6% 0px' },
    );
  });

  // Efectos continuos vinculados al scroll (WAAPI nativo, solo sin movimiento reducido)
  if (!reduced) {
    root.querySelectorAll<HTMLElement>('[data-scroll-line]').forEach((line) => {
      const target = line.closest('section') ?? line.parentElement ?? line;
      scroll(
        animate(line, { transform: ['scaleY(0)', 'scaleY(1)'] }, { ease: 'linear' }),
        { target, offset: ['start 75%', 'end 75%'] },
      );
    });

    if (window.innerWidth >= 768) {
      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const range = Number(el.dataset.parallax ?? 28);
        const target = el.closest('section') ?? el;
        scroll(
          animate(
            el,
            { transform: [`translate3d(0, ${range}px, 0)`, `translate3d(0, ${-range}px, 0)`] },
            { ease: 'linear' },
          ),
          { target, offset: ['start end', 'end start'] },
        );
      });
    }
  }

  document.documentElement.dataset.revealReady = '';
}
