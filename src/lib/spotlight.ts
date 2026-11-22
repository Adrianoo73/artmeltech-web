/**
 * Efecto "spotlight": actualiza las variables --mx/--my de las tarjetas `.spotlight`
 * con la posición del puntero. Solo en dispositivos con hover real y sin
 * preferencia de movimiento reducido. Un único listener delegado, con rAF.
 */
export function initSpotlight(): void {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduced) return;

  let frame = 0;
  let lastEvent: PointerEvent | null = null;

  const update = () => {
    frame = 0;
    if (!lastEvent) return;
    const target = (lastEvent.target as Element | null)?.closest<HTMLElement>('.spotlight');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${lastEvent.clientX - rect.left}px`);
    target.style.setProperty('--my', `${lastEvent.clientY - rect.top}px`);
  };

  document.addEventListener(
    'pointermove',
    (event) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}
