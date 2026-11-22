/**
 * Controla la salida animada de la pantalla de carga inicial (`#site-preloader`).
 * - Respeta `prefers-reduced-motion`: se retira de inmediato sin bloquear.
 * - Garantiza un tiempo mínimo breve (~1.05 s) para lucir la animación del logotipo
 *   y nunca excede 1.8 s aunque algún recurso externo tarde.
 * - Usa `animate` de `motion/mini` (WAAPI acelerado por GPU) y elimina el nodo al concluir.
 */
import { animate } from 'motion/mini';

const MIN_DISPLAY_MS = 850;
const MAX_WAIT_MS = 1600;

export function initPreloader(): void {
  const overlay = document.getElementById('site-preloader');
  if (!overlay) return;

  const cleanup = () => {
    document.documentElement.classList.remove('preloader-lock');
    if (overlay.isConnected) overlay.remove();
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    cleanup();
    return;
  }

  const startedAt = performance.now();
  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;

    const elapsed = performance.now() - startedAt;
    const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);

    window.setTimeout(() => {
      const content = overlay.querySelector<HTMLElement>('[data-preloader-content]');
      if (content) {
        animate(
          content,
          {
            opacity: [1, 0],
            transform: ['translate3d(0,0,0) scale(1)', 'translate3d(0,-16px,0) scale(0.98)'],
          },
          { duration: 0.28, ease: [0.4, 0, 1, 1] },
        );
      }

      // Salvaguarda adicional si la pestaña está en segundo plano y WAAPI se pausa
      const forceTimer = window.setTimeout(cleanup, 900);

      animate(
        overlay,
        { transform: ['translate3d(0,0,0)', 'translate3d(0,-100%,0)'] },
        { duration: 0.54, delay: 0.08, ease: [0.76, 0, 0.24, 1] },
      )
        .then(() => {
          window.clearTimeout(forceTimer);
          cleanup();
        })
        .catch(() => {
          window.clearTimeout(forceTimer);
          cleanup();
        });
    }, wait);
  };

  if (document.readyState === 'complete') {
    dismiss();
  } else {
    window.addEventListener('load', dismiss, { once: true });
    window.setTimeout(dismiss, MAX_WAIT_MS);
  }
}
