import { useRef } from 'react';
import { m, useScroll, useSpring, useTransform } from 'motion/react';
import { Check } from 'lucide-react';
import { processSteps } from '@/content/process';
import { Icon } from '@/components/ui/icons';
import { MotionProvider } from '@/components/react/MotionProvider';
import { useReducedMotionSafe } from '@/lib/motion/hooks';
import { ease } from '@/lib/motion/tokens';

function ProcessTimelineInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 72%', 'end 68%'],
  });

  const lineScale = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const beadY = useTransform(lineScale, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative mt-11 sm:mt-14 lg:mt-20">
      {/* Trazo vertical de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 bottom-4 left-5 w-[2px] rounded-full bg-navy/10 sm:left-6 lg:left-1/2 lg:-translate-x-1/2"
      />

      {/* Trazo de progreso animado con gradiente sky → accent + cabeza luminosa viajera (GPU transform, 0 CLS) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 bottom-4 left-5 w-[2px] sm:left-6 lg:left-1/2 lg:-translate-x-1/2"
      >
        <m.div
          style={{ scaleY: reduced ? 1 : lineScale }}
          className="h-full w-full origin-top rounded-full bg-gradient-to-b from-sky via-accent to-accent"
        />
        {!reduced && (
          <m.div style={{ y: beadY }} className="absolute inset-0">
            <span className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_3px_rgb(235_47_51/0.75)] ring-2 ring-white" />
          </m.div>
        )}
      </div>

      <ol className="relative flex flex-col gap-5 sm:gap-8 lg:gap-10">
        {processSteps.map((step, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <m.li
              key={step.id}
              initial={reduced ? false : { opacity: 0.25, y: 24, x: 0 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.56, ease: ease.outExpo }}
              className="relative grid grid-cols-1 items-center pl-12 sm:pl-16 lg:grid-cols-2 lg:gap-14 lg:pl-0"
            >
              {/* Nodo sobre la línea del proceso que hace pop y pulso al activarse */}
              <m.div
                aria-hidden="true"
                initial={reduced ? false : { scale: 0.72, opacity: 0.4 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.48, delay: 0.08, ease: ease.outExpo }}
                className="absolute top-5 left-5 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-xl border-2 border-accent/70 bg-navy text-white shadow-soft ring-4 ring-white sm:top-6 sm:left-6 sm:size-12 sm:rounded-2xl lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2"
              >
                <Icon name={step.icon} className="size-4 text-sky sm:size-5" />
                <span className="animate-pulse-dot absolute -top-1 -right-1 size-2.5 rounded-full bg-accent/60" />
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-accent ring-2 ring-white" />
              </m.div>

              {/* Tarjeta del paso con entrada lateral sutil y hover elevado */}
              <m.div
                initial={reduced ? false : { opacity: 0.35, x: isLeft ? -18 : 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.58, delay: 0.06, ease: ease.outExpo }}
                className={isLeft ? 'lg:col-start-1 lg:pr-6' : 'lg:col-start-2 lg:pl-6'}
              >
                <div className="spotlight group relative overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-surface p-5 transition-[border-color,background-color,box-shadow,transform] duration-300 ease-out-quart hover:-translate-y-1.5 hover:border-accent/60 hover:bg-white hover:shadow-soft sm:p-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-5 top-0 h-[2.5px] origin-left scale-x-45 bg-gradient-to-r from-accent via-sky to-transparent transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-navy px-3 py-1 font-display text-xs font-bold tracking-[0.14em] text-white">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                      Etapa {step.number}
                    </span>
                    <span className="font-display text-xs font-semibold tracking-[0.16em] text-navy/50 uppercase">
                      0{idx + 1} / 0{processSteps.length}
                    </span>
                  </div>

                  <h3 className="text-h3 mt-3.5 font-bold text-navy sm:mt-4">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:mt-2.5 sm:text-[0.9375rem]">
                    {step.description}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2 border-t border-navy/8 pt-3.5 sm:mt-5 sm:pt-4">
                    {step.deliverables.map((del) => (
                      <li
                        key={del}
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-medium text-navy transition-colors duration-200 group-hover:border-sky/45"
                      >
                        <Check
                          className="size-3.5 text-accent"
                          strokeWidth={2.6}
                          aria-hidden="true"
                        />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </m.div>
            </m.li>
          );
        })}
      </ol>
    </div>
  );
}

/** Línea de tiempo del proceso de trabajo vinculada al desplazamiento. */
export function ProcessTimeline() {
  return (
    <MotionProvider>
      <ProcessTimelineInner />
    </MotionProvider>
  );
}
