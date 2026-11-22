import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, m, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navItems, type SectionId } from '@/config/site';
import type { ActiveSocial } from '@/lib/contact';
import { MotionProvider } from '@/components/react/MotionProvider';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { duration, ease, softSpring } from '@/lib/motion/tokens';

export interface SiteHeaderProps {
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  brandAlt: string;
  /** Cuando true, enlaces apuntan a `/#id` (útil en la página 404). */
  rootPrefix?: boolean;
  whatsappUrl?: string | null;
  socials?: ActiveSocial[];
}

function HeaderInner({
  logoSrc,
  logoWidth,
  logoHeight,
  brandAlt,
  rootPrefix = false,
  whatsappUrl = null,
  socials = [],
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeId, setActiveId] = useState<SectionId>('inicio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  const lastScrollY = useRef(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = lastScrollY.current;
    lastScrollY.current = latest;

    setScrolled(latest > 24);

    if (menuOpen || focusWithin || latest < 380) {
      setHidden(false);
      return;
    }

    const delta = latest - prev;
    if (delta > 10) {
      setHidden(true);
    } else if (delta < -6) {
      setHidden(false);
    }
  });

  // Observa qué sección ocupa el centro del viewport para mover el indicador activo.
  useEffect(() => {
    if (rootPrefix) return;

    const elements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId: SectionId | null = null;
        let bestScore = 0;

        for (const item of navItems) {
          const score = ratios.get(item.id) ?? 0;
          if (score > bestScore) {
            bestScore = score;
            bestId = item.id;
          }
        }

        if (bestId) setActiveId(bestId);
      },
      {
        rootMargin: '-28% 0px -45% 0px',
        threshold: [0, 0.15, 0.35, 0.6, 0.85],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootPrefix]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  }, []);

  // Bloqueo de scroll, Escape y trampa de foco cuando el menú móvil está abierto.
  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen, closeMenu]);

  const hrefFor = (id: SectionId) => (rootPrefix ? `/#${id}` : `#${id}`);

  return (
    <>
      <m.header
        initial={false}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: duration.base, ease: ease.outQuart }}
        onFocus={() => {
          setFocusWithin(true);
          setHidden(false);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setFocusWithin(false);
          }
        }}
        className={`fixed inset-x-0 top-0 z-50 bg-white/97 backdrop-blur-xl transition-[border-color,box-shadow,padding] duration-300 ease-out-quart ${
          scrolled
            ? 'border-b border-navy/12 py-2.5 shadow-[0_10px_32px_-18px_rgb(3_32_61/0.35)]'
            : 'border-b border-navy/8 py-3 sm:py-3.5'
        }`}
      >
        <div className="container-site flex items-center justify-between gap-3 sm:gap-4">
          {/* Logotipo oficial grande y sin alteraciones, directo sobre el fondo blanco del header */}
          <a
            href={hrefFor('inicio')}
            aria-label={`${brandAlt} — Ir al inicio`}
            className="group inline-flex shrink-0 items-center py-0.5 transition-transform duration-300 ease-out-expo hover:scale-[1.02]"
          >
            <img
              src={logoSrc}
              width={logoWidth}
              height={logoHeight}
              alt={brandAlt}
              decoding="sync"
              fetchPriority="high"
              className={`w-auto transition-[height] duration-300 ease-out-quart ${
                scrolled ? 'h-9 sm:h-10 lg:h-8.5 xl:h-11' : 'h-10 sm:h-11 lg:h-9 xl:h-12'
              }`}
            />
          </a>

          {/* Navegación escritorio sobre blanco con indicador animado y detalle #EB2F33 */}
          <nav aria-label="Navegación principal" className="hidden min-w-0 lg:block">
            <LayoutGroup id="desktop-nav">
              <ul className="flex items-center gap-0.5 rounded-full border border-navy/10 bg-surface/90 p-1">
                {navItems.map((item) => {
                  const isActive = !rootPrefix && activeId === item.id;
                  return (
                    <li key={item.id} className="relative">
                      <a
                        href={hrefFor(item.id)}
                        aria-current={isActive ? 'location' : undefined}
                        onClick={() => setActiveId(item.id)}
                        className={`relative z-10 inline-flex items-center gap-1.5 rounded-full whitespace-nowrap px-2.5 py-2 font-display text-xs font-semibold transition-colors duration-200 xl:px-3.5 xl:text-[0.8125rem] ${
                          isActive ? 'text-white' : 'text-navy/80 hover:text-navy'
                        }`}
                      >
                        {isActive && (
                          <m.span
                            layoutId="nav-active-pill"
                            transition={softSpring}
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 rounded-full bg-navy shadow-[0_6px_18px_-8px_rgb(3_32_61/0.6)]"
                          />
                        )}
                        {item.label}
                        {isActive && (
                          <m.span
                            layoutId="nav-active-dot"
                            transition={softSpring}
                            aria-hidden="true"
                            className="size-1.5 rounded-full bg-accent"
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>

          {/* CTA de cabecera + botón menú móvil */}
          <div className="flex shrink-0 items-center gap-2.5">
            <a
              href={hrefFor('contacto')}
              className="group hidden shrink-0 items-center gap-2 rounded-full bg-navy py-2 pr-2 pl-3.5 font-display text-xs font-semibold whitespace-nowrap text-white shadow-[0_10px_24px_-12px_rgb(3_32_61/0.65)] transition-[background-color,transform] duration-300 ease-out-quart hover:bg-navy-800 active:scale-[0.97] sm:inline-flex xl:gap-2.5 xl:pl-4 xl:text-[0.8125rem]"
            >
              <span>Inicia tu proyecto</span>
              <span
                aria-hidden="true"
                className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
              </span>
            </a>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Abrir menú de navegación"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-navy/15 bg-surface text-navy transition-colors duration-200 hover:border-accent/60 hover:bg-navy hover:text-white lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Filete inferior sutil con toque de acento #EB2F33 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-navy/0 via-accent/65 to-sky/0 opacity-80"
        />
      </m.header>

      {/* Menú móvil desplegable optimizado para pulgar y pantallas pequeñas */}
      <AnimatePresence>
        {menuOpen && (
          <m.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base, ease: ease.outQuart }}
            className="fixed inset-0 z-[70] lg:hidden"
          >
            {/* Fondo oscuro con desenfoque */}
            <div
              aria-hidden="true"
              onClick={closeMenu}
              className="absolute inset-0 bg-navy-950/80 backdrop-blur-md"
            />

            {/* Panel lateral: cabecera blanca con logo protagonista + cuerpo navy */}
            <m.div
              ref={drawerRef}
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación móvil"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.38, ease: ease.outExpo }}
              className="bg-tech-grid absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-navy text-white shadow-2xl"
            >
              {/* Cabecera blanca del drawer */}
              <div className="flex items-center justify-between gap-4 border-b-2 border-accent/70 bg-white px-5 py-3.5">
                <img
                  src={logoSrc}
                  width={logoWidth}
                  height={logoHeight}
                  alt={brandAlt}
                  className="h-9 w-auto"
                />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMenu}
                  aria-label="Cerrar menú de navegación"
                  className="inline-flex size-11 items-center justify-center rounded-xl border border-navy/15 bg-surface text-navy transition-colors hover:border-accent hover:bg-navy hover:text-white"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Secciones" className="my-auto overflow-y-auto px-5 py-6">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item, idx) => {
                    const isActive = !rootPrefix && activeId === item.id;
                    return (
                      <m.li
                        key={item.id}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{
                          duration: 0.32,
                          delay: 0.04 + idx * 0.035,
                          ease: ease.outExpo,
                        }}
                      >
                        <a
                          href={hrefFor(item.id)}
                          aria-current={isActive ? 'location' : undefined}
                          onClick={() => {
                            setActiveId(item.id);
                            setMenuOpen(false);
                          }}
                          className={`group flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 font-display text-lg font-semibold transition-colors ${
                            isActive
                              ? 'border-l-[3px] border-accent bg-sky/16 text-white'
                              : 'text-white/82 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`font-sans text-xs font-semibold ${
                                isActive ? 'text-sky-200' : 'text-sky'
                              }`}
                            >
                              0{idx + 1}
                            </span>
                            {item.label}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`size-2 rounded-full transition-transform ${
                              isActive
                                ? 'scale-100 bg-accent'
                                : 'scale-75 bg-sky/40 group-hover:scale-100 group-hover:bg-accent'
                            }`}
                          />
                        </a>
                      </m.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-white/12 px-5 pt-4 pb-6">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 w-full items-center justify-between rounded-full bg-white py-2 pr-2 pl-5 font-display text-sm font-bold text-navy transition-colors hover:bg-sky-100"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <SocialIcon network="whatsapp" className="size-5 text-navy" />
                      <span>Escribir por WhatsApp</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid size-9 place-items-center rounded-full bg-accent text-white"
                    >
                      <ArrowUpRight className="size-4" strokeWidth={2.4} />
                    </span>
                  </a>
                ) : (
                  <a
                    href={hrefFor('contacto')}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 w-full items-center justify-between rounded-full bg-white py-2.5 pr-2.5 pl-6 font-display text-sm font-semibold text-navy transition-colors hover:bg-sky-100"
                  >
                    <span>Inicia tu proyecto</span>
                    <span
                      aria-hidden="true"
                      className="grid size-9 place-items-center rounded-full bg-accent text-white"
                    >
                      <ArrowUpRight className="size-4" strokeWidth={2.4} />
                    </span>
                  </a>
                )}

                {socials.length > 0 && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    {socials.map((item) => (
                      <a
                        key={item.key}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`ArtMel Tech en ${item.label}`}
                        className="grid size-10 place-items-center rounded-full bg-white text-navy transition-colors hover:bg-accent hover:text-white"
                      >
                        <SocialIcon network={item.key} className="size-4.5" />
                      </a>
                    ))}
                  </div>
                )}

                <p className="mt-4 flex items-center justify-center gap-2 font-display text-[0.6875rem] tracking-[0.22em] text-sky uppercase">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  Connecting Solutions
                </p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Cabecera corporativa interactiva blanca con detección de sección y menú móvil accesible. */
export function SiteHeader(props: SiteHeaderProps) {
  return (
    <MotionProvider features="max">
      <HeaderInner {...props} />
    </MotionProvider>
  );
}
