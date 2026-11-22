import { useId, useState } from 'react';
import { AnimatePresence, LayoutGroup, m } from 'motion/react';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { buildMailtoUrl, buildWhatsAppUrl } from '@/lib/contact';
import { MotionProvider } from '@/components/react/MotionProvider';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { ease, softSpring } from '@/lib/motion/tokens';

const TOPICS = [
  'Desarrollo de software',
  'Desarrollo web',
  'Aplicaciones digitales',
  'Automatización',
  'Integración tecnológica',
  'Consultoría tecnológica',
  'Reparación de PC y laptops',
  'Reparación de impresoras',
  'Mantenimiento y drivers',
] as const;

export interface ContactComposerProps {
  whatsapp: string;
  email: string;
  defaultMessage: string;
}

export function formatInquirySummary(params: {
  name: string;
  company: string;
  topic: string;
  message: string;
  fallbackGreeting: string;
}): string {
  const lines: string[] = [];
  const cleanName = params.name.trim();
  const cleanCompany = params.company.trim();
  const cleanMessage = params.message.trim();

  if (!cleanName && !cleanCompany && !cleanMessage) {
    return `${params.fallbackGreeting} Interés principal: ${params.topic}.`;
  }

  lines.push('Hola, ArtMel Tech.');
  if (cleanName) {
    lines.push(cleanCompany ? `Soy ${cleanName} (${cleanCompany}).` : `Soy ${cleanName}.`);
  } else if (cleanCompany) {
    lines.push(`Empresa: ${cleanCompany}.`);
  }
  lines.push(`Área de interés: ${params.topic}.`);
  if (cleanMessage) {
    lines.push(`Detalle de la consulta: ${cleanMessage}`);
  }
  return lines.join('\n');
}

function ContactComposerInner({ whatsapp, email, defaultMessage }: ContactComposerProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0]);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const idPrefix = useId();
  const nameId = `${idPrefix}-name`;
  const companyId = `${idPrefix}-company`;
  const messageId = `${idPrefix}-message`;

  const composedText = formatInquirySummary({
    name,
    company,
    topic: selectedTopic,
    message,
    fallbackGreeting: defaultMessage,
  });

  const whatsappHref = buildWhatsAppUrl(whatsapp, composedText);
  const mailtoHref = buildMailtoUrl(email, `Consulta web — ${selectedTopic}`, composedText);

  const handleCopy = async () => {
    setCopyError(false);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(composedText);
      } else {
        const helper = document.createElement('textarea');
        helper.value = composedText;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        const legacyCopy = (document as unknown as { execCommand?: (cmd: string) => boolean })
          .execCommand;
        const ok = typeof legacyCopy === 'function' ? legacyCopy.call(document, 'copy') : false;
        helper.remove();
        if (!ok) throw new Error('Copy command failed');
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 3500);
    }
  };

  return (
    <div className="glass-dark relative overflow-hidden rounded-[var(--radius-card)] p-5 shadow-card sm:p-8">
      {/* Filete superior de acento #EB2F33 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-accent via-accent/80 to-sky/60"
      />

      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 sm:pb-5">
        <div>
          <h3 className="font-display text-lg font-bold text-white sm:text-xl">
            Prepara tu consulta
          </h3>
          <p className="mt-1 text-sm text-white/75">
            Completa los datos para generar tu mensaje y enviarlo por tu canal preferido.
          </p>
        </div>
        <span
          aria-hidden="true"
          className="hidden size-2.5 shrink-0 rounded-full bg-accent sm:inline-block"
        />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-5 flex flex-col gap-5 sm:mt-6"
        aria-label="Generador de consulta de proyecto"
      >
        {/* Selección de área con píldora animada (layoutId) */}
        <fieldset>
          <legend className="font-display text-xs font-semibold tracking-[0.16em] text-sky uppercase">
            ¿Qué servicio necesitas?
          </legend>
          <LayoutGroup id={`contact-topics-${idPrefix}`}>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOPICS.map((topic) => {
                const active = selectedTopic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedTopic(topic)}
                    className={`relative inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-xs font-semibold transition-colors duration-200 active:scale-[0.97] ${
                      active
                        ? 'text-navy'
                        : 'border border-sky/25 bg-white/[0.04] text-white/82 hover:border-accent/65 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {active && (
                      <m.span
                        layoutId="contact-topic-pill"
                        transition={softSpring}
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-white shadow-soft ring-2 ring-accent/75"
                      />
                    )}
                    {active && (
                      <span aria-hidden="true" className="relative z-10 size-1.5 rounded-full bg-accent" />
                    )}
                    <span className="relative z-10">{topic}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </fieldset>

        {/* Campos: text-base en móvil (16px) evita zoom automático no deseado en iOS Safari */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={nameId} className="block font-display text-xs font-semibold text-white/90">
              Tu nombre
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej.: Andrea Morales"
              className="mt-2 h-12 w-full rounded-xl border border-sky/25 bg-navy-950/65 px-4 text-base text-white placeholder:text-white/45 transition-colors focus:border-accent focus:bg-navy-950 focus:outline-none sm:h-11 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor={companyId}
              className="block font-display text-xs font-semibold text-white/90"
            >
              Empresa <span className="font-normal text-white/55">(opcional)</span>
            </label>
            <input
              id={companyId}
              name="company"
              type="text"
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nombre de tu organización"
              className="mt-2 h-12 w-full rounded-xl border border-sky/25 bg-navy-950/65 px-4 text-base text-white placeholder:text-white/45 transition-colors focus:border-accent focus:bg-navy-950 focus:outline-none sm:h-11 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={messageId}
            className="block font-display text-xs font-semibold text-white/90"
          >
            Cuéntanos brevemente tu idea o necesidad
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Cuéntanos sobre tu proyecto, el equipo a reparar o el servicio que necesitas…"
            className="mt-2 w-full resize-y rounded-xl border border-sky/25 bg-navy-950/65 px-4 py-3 text-base leading-relaxed text-white placeholder:text-white/45 transition-colors focus:border-accent focus:bg-navy-950 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Acciones sin backend: 1.ª opción WhatsApp protagonista, 2.ª Correo, 3.ª Copiar */}
        <div className="flex flex-col gap-3 pt-1">
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group/wa btn-shimmer relative inline-flex min-h-13 w-full items-center justify-between gap-3 rounded-full bg-white py-2 pr-2 pl-6 font-display text-sm font-bold text-navy shadow-[0_14px_32px_-12px_rgb(235_47_51/0.4)] transition-[background-color,transform] duration-200 hover:bg-sky-100 active:scale-[0.98] sm:min-h-14"
            >
              <span className="inline-flex items-center gap-2.5">
                <SocialIcon network="whatsapp" className="size-5 text-navy" />
                <span>Enviar consulta por WhatsApp</span>
              </span>
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-white shadow-[0_6px_16px_-4px_rgb(235_47_51/0.65)] transition-transform duration-300 ease-out-expo group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5 sm:size-10"
              >
                <ArrowUpRight className="size-4" strokeWidth={2.4} />
              </span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Configura site.contact.whatsapp en src/config/site.ts para habilitar este botón"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-5 font-display text-sm font-semibold text-white/55"
            >
              <SocialIcon network="whatsapp" className="size-4" />
              <span>WhatsApp (configurable)</span>
            </button>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {mailtoHref ? (
              <a
                href={mailtoHref}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-sky/45 bg-sky/14 px-5 font-display text-sm font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:border-accent hover:bg-white/[0.1] active:scale-[0.98]"
              >
                <Mail className="size-4 text-sky" aria-hidden="true" />
                <span>Enviar por correo</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Configura site.contact.email en src/config/site.ts para habilitar este botón"
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-5 font-display text-sm font-semibold text-white/55"
              >
                <Mail className="size-4" aria-hidden="true" />
                <span>Correo (configurable)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-5 font-display text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-navy active:scale-[0.98]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <m.span
                    key="copied"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: ease.outQuart }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="size-4 text-accent" strokeWidth={2.6} aria-hidden="true" />
                    <span>Resumen copiado</span>
                  </m.span>
                ) : (
                  <m.span
                    key="copy"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: ease.outQuart }}
                    className="inline-flex items-center gap-2"
                  >
                    <Copy className="size-4 text-sky" aria-hidden="true" />
                    <span>Copiar resumen</span>
                  </m.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <p
          aria-live="polite"
          className={copyError ? 'text-xs text-sky-200' : 'sr-only'}
        >
          {copied
            ? 'Resumen de consulta copiado al portapapeles.'
            : copyError
              ? 'No se pudo copiar automáticamente. Puedes seleccionar el texto o usar los canales directos.'
              : ''}
        </p>
      </form>
    </div>
  );
}

/** Asistente de consulta sin backend: genera enlaces de WhatsApp/correo o copia el resumen. */
export function ContactComposer(props: ContactComposerProps) {
  return (
    <MotionProvider features="max">
      <ContactComposerInner {...props} />
    </MotionProvider>
  );
}
