import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, m } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, X } from 'lucide-react';
import { projectCategories, type ProjectCategory } from '@/content/project-categories';
import { MotionProvider } from '@/components/react/MotionProvider';
import { useReducedMotionSafe } from '@/lib/motion/hooks';
import { duration, ease, softSpring } from '@/lib/motion/tokens';

export interface SerializedProject {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  stack: string[];
  imageAlt: string;
  image: {
    avifSrcSet: string;
    webpSrcSet: string;
    fallbackSrc: string;
    width: number;
    height: number;
  };
}

interface ProjectsGalleryProps {
  items: SerializedProject[];
}

function ProjectsGalleryInner({ items }: ProjectsGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'todos'>('todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const reduced = useReducedMotionSafe();
  const trackRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const filterGroupId = useId();

  const filtered =
    activeCategory === 'todos' ? items : items.filter((item) => item.category === activeCategory);

  const selectedIndex = selectedId ? filtered.findIndex((p) => p.id === selectedId) : -1;
  const selectedProject = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  const openModal = (id: string, trigger: HTMLButtonElement | null) => {
    lastTriggerRef.current = trigger;
    setSelectedId(id);
  };

  const closeModal = useCallback(() => {
    setSelectedId(null);
    requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
  }, []);

  const stepModal = useCallback(
    (delta: number) => {
      if (selectedIndex < 0 || filtered.length <= 1) return;
      const next = (selectedIndex + delta + filtered.length) % filtered.length;
      const nextProject = filtered[next];
      if (nextProject) setSelectedId(nextProject.id);
    },
    [selectedIndex, filtered],
  );

  // Sincroniza el carrusel al cambiar de categoría
  const handleSelectCategory = (cat: ProjectCategory | 'todos') => {
    setActiveCategory(cat);
    setCarouselIndex(0);
    if (typeof trackRef.current?.scrollTo === 'function') {
      trackRef.current.scrollTo({ left: 0, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  // Navegación del carrusel (móvil / tablet)
  const scrollCarouselTo = (index: number) => {
    const clamped = Math.max(0, Math.min(filtered.length - 1, index));
    setCarouselIndex(clamped);
    const track = trackRef.current;
    if (!track || typeof track.scrollTo !== 'function') return;
    const child = track.children.item(clamped) as HTMLElement | null;
    if (child) {
      track.scrollTo({ left: child.offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const firstCard = track.children.item(0) as HTMLElement | null;
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth + 20;
    if (cardWidth <= 0) return;
    const approx = Math.round(track.scrollLeft / cardWidth);
    setCarouselIndex(Math.max(0, Math.min(filtered.length - 1, approx)));
  };

  // Teclado y bloqueo de scroll para el modal de detalle
  useEffect(() => {
    if (!selectedProject) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = requestAnimationFrame(() => {
      modalCloseRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        stepModal(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stepModal(-1);
      } else if (event.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
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
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProject, closeModal, stepModal]);

  return (
    <div className="mt-10 lg:mt-12">
      {/* Barra de filtros por categoría (envuelve limpiamente en móvil para ver todas las opciones) */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <LayoutGroup id={`project-filters-${filterGroupId}`}>
          <div
            role="group"
            aria-label="Filtrar proyectos demostrativos por categoría"
            className="flex flex-wrap items-center gap-1.5"
          >
            {projectCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`relative inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-xs font-semibold transition-colors duration-200 sm:px-4 ${
                    isActive
                      ? 'text-navy'
                      : 'border border-white/12 bg-white/[0.03] text-white/80 hover:border-accent/55 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <m.span
                      layoutId="project-filter-pill"
                      transition={softSpring}
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-white shadow-soft ring-1 ring-accent/50"
                    />
                  )}
                  {isActive && (
                    <span aria-hidden="true" className="relative z-10 size-1.5 rounded-full bg-accent" />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Controles del carrusel (visibles en móvil y tablet) */}
        {filtered.length > 1 && (
          <div className="flex items-center justify-between gap-2 lg:hidden">
            <span className="text-xs text-white/65 sm:hidden">Desliza para explorar</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarouselTo(carouselIndex - 1)}
                disabled={carouselIndex <= 0}
                aria-label="Proyecto anterior"
                className="grid size-10 place-items-center rounded-full border border-sky/35 bg-white/[0.05] text-white transition-colors hover:border-accent hover:bg-accent disabled:opacity-35"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <span className="min-w-12 text-center font-display text-xs font-semibold text-white/80">
                {carouselIndex + 1} / {filtered.length}
              </span>
              <button
                type="button"
                onClick={() => scrollCarouselTo(carouselIndex + 1)}
                disabled={carouselIndex >= filtered.length - 1}
                aria-label="Proyecto siguiente"
                className="grid size-10 place-items-center rounded-full border border-sky/35 bg-white/[0.05] text-white transition-colors hover:border-accent hover:bg-accent disabled:opacity-35"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/*
        Móvil/tablet: carrusel horizontal táctil con peek de la siguiente tarjeta.
        Escritorio (lg+): cuadrícula editorial de 3 columnas.
      */}
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={activeCategory}
          ref={trackRef}
          onScroll={handleTrackScroll}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: ease.outQuart }}
          className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:mt-7 sm:gap-5 lg:mt-9 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0"
        >
          {filtered.map((project, idx) => (
            <m.article
              key={project.id}
              initial={reduced ? false : { opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.42,
                delay: reduced ? 0 : Math.min(idx, 5) * 0.055,
                ease: ease.outExpo,
              }}
              {...(!reduced ? { whileHover: { y: -6 } } : {})}
              className="spotlight group flex w-[84vw] max-w-[420px] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-card)] border border-sky/20 bg-navy-900/80 shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent/65 hover:shadow-glow sm:w-[68vw] lg:w-auto lg:max-w-none"
            >
              {/* Mockup optimizado AVIF + WebP */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={project.image.avifSrcSet}
                    sizes="(max-width: 640px) 84vw, (max-width: 1024px) 68vw, 31vw"
                  />
                  <source
                    type="image/webp"
                    srcSet={project.image.webpSrcSet}
                    sizes="(max-width: 640px) 84vw, (max-width: 1024px) 68vw, 31vw"
                  />
                  <img
                    src={project.image.fallbackSrc}
                    width={project.image.width}
                    height={project.image.height}
                    alt={project.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                </picture>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/15 to-transparent"
                />

                {/* Badge obligatorio de contenido demostrativo con borde de acento */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-accent/65 bg-navy/92 px-3 py-1 backdrop-blur-md sm:top-3.5 sm:left-3.5">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  <span className="font-display text-[0.6875rem] font-semibold tracking-[0.06em] text-white">
                    Proyecto demostrativo
                  </span>
                </div>
              </div>

              {/* Contenido de tarjeta */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <p className="font-display text-xs font-semibold tracking-[0.16em] text-sky uppercase">
                    {project.categoryLabel}
                  </p>
                  <h3 className="text-h3 mt-2 font-bold text-white">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/78 sm:mt-2.5">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 sm:mt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-sky/20 bg-sky/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-sky-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => openModal(project.id, e.currentTarget)}
                    className="group/det inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/22 bg-white/[0.05] px-3.5 py-1.5 font-display text-xs font-semibold text-white transition-colors hover:border-accent hover:bg-white hover:text-navy active:scale-[0.96]"
                  >
                    <span>Ver detalle</span>
                    <ArrowUpRight
                      className="size-3.5 text-accent transition-transform duration-300 ease-out-expo group-hover/det:translate-x-0.5 group-hover/det:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </m.article>
          ))}
        </m.div>
      </AnimatePresence>

      {/* Indicadores de página del carrusel en móvil/tablet (área táctil >= 36px, aspecto compacto) */}
      {filtered.length > 1 && (
        <div
          aria-label="Indicadores del carrusel"
          className="mt-2 flex items-center justify-center gap-0.5 lg:hidden"
        >
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollCarouselTo(idx)}
              aria-label={`Ver proyecto ${idx + 1}: ${item.title}`}
              aria-current={carouselIndex === idx ? 'true' : undefined}
              className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full"
            >
              <span
                aria-hidden="true"
                className={`block h-2 rounded-full transition-all duration-300 ${
                  carouselIndex === idx ? 'w-7 bg-accent' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal de detalle (bottom-sheet en móvil, modal centrado en escritorio) */}
      <AnimatePresence>
        {selectedProject && (
          <m.div
            key="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base, ease: ease.outQuart }}
            className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          >
            <div
              aria-hidden="true"
              onClick={closeModal}
              className="absolute inset-0 bg-navy-950/85 backdrop-blur-md"
            />

            <m.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.34, ease: ease.outExpo }}
              className="relative z-10 max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-sky/30 border-t-accent/70 bg-navy text-white shadow-2xl sm:rounded-[1.5rem]"
            >
              {/* Imagen superior */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy-950">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={selectedProject.image.avifSrcSet}
                    sizes="(max-width: 768px) 95vw, 768px"
                  />
                  <source
                    type="image/webp"
                    srcSet={selectedProject.image.webpSrcSet}
                    sizes="(max-width: 768px) 95vw, 768px"
                  />
                  <img
                    src={selectedProject.image.fallbackSrc}
                    width={selectedProject.image.width}
                    height={selectedProject.image.height}
                    alt={selectedProject.imageAlt}
                    className="h-full w-full object-cover"
                  />
                </picture>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent"
                />

                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-navy/90 px-3.5 py-1.5 backdrop-blur-md">
                  <Sparkles className="size-3.5 text-sky" aria-hidden="true" />
                  <span className="font-display text-xs font-semibold text-white">
                    Proyecto demostrativo
                  </span>
                </div>

                <button
                  ref={modalCloseRef}
                  type="button"
                  onClick={closeModal}
                  aria-label="Cerrar detalle del proyecto"
                  className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-white/25 bg-navy/85 text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-navy"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <p className="font-display text-xs font-semibold tracking-[0.18em] text-sky uppercase">
                  {selectedProject.categoryLabel}
                </p>
                <h3 id="project-modal-title" className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                  {selectedProject.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/80">
                  {selectedProject.summary}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <h4 className="font-display text-xs font-semibold tracking-[0.16em] text-sky uppercase">
                      Desafío habitual
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {selectedProject.challenge}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-sky/25 bg-sky/10 p-5">
                    <h4 className="font-display text-xs font-semibold tracking-[0.16em] text-sky-200 uppercase">
                      Enfoque de solución
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/88">
                      {selectedProject.solution}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedProject.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-sky/25 bg-white/[0.04] px-3 py-1 text-xs font-medium text-sky-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/12 pt-6 sm:flex-row sm:items-center">
                  <p className="text-xs text-white/60">
                    Ejemplo demostrativo de capacidades técnicas.
                  </p>
                  <div className="flex items-center gap-2.5">
                    {filtered.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => stepModal(-1)}
                          aria-label="Proyecto anterior"
                          className="grid size-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-sky hover:bg-sky/20"
                        >
                          <ArrowLeft className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => stepModal(1)}
                          aria-label="Proyecto siguiente"
                          className="grid size-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-sky hover:bg-sky/20"
                        >
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </button>
                      </>
                    )}
                    <a
                      href="#contacto"
                      onClick={closeModal}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-xs font-semibold text-navy transition-colors hover:bg-sky-100"
                    >
                      <span>Quiero algo similar</span>
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Portafolio interactivo con filtros, carrusel móvil y vista de detalle. */
export function ProjectsGallery(props: ProjectsGalleryProps) {
  return (
    <MotionProvider features="max">
      <ProjectsGalleryInner {...props} />
    </MotionProvider>
  );
}
