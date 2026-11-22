/**
 * Microinteracciones táctiles y de cursor para escritorio:
 * - Atracción magnética sutil en botones CTA (`[data-magnetic]`), máx. ±5 px.
 * - Solo se activa en dispositivos con puntero fino (ratón) y sin movimiento reducido.
 */
export function initMagnetic(root: ParentNode = document): void {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduced) return;

  const elements = root.querySelectorAll<HTMLElement>('[data-magnetic]');
  elements.forEach((el) => {
    const strength = Number(el.dataset.magnetic || 5);

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `translate3d(${(relX * strength * 2).toFixed(2)}px, ${(relY * strength * 2).toFixed(2)}px, 0)`;
    };

    const onLeave = () => {
      el.style.removeProperty('transform');
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
  });
}
