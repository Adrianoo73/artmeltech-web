/**
 * Clases de botón compartidas por componentes Astro y React.
 * Tono `onDark` para fondos navy, `onLight` para superficies claras.
 * El acento oficial `#EB2F33` da el toque distintivo en los detalles de acción.
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonTone = 'onDark' | 'onLight';
export type ButtonSize = 'md' | 'lg';

const base =
  'group/btn relative inline-flex items-center justify-center gap-3 rounded-full font-display font-semibold tracking-[-0.01em] whitespace-nowrap select-none ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-quart ' +
  'active:scale-[0.97] focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50';

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-13 pl-6 pr-2 text-[0.9375rem] sm:min-h-14 sm:pl-7',
};

const variants: Record<ButtonTone, Record<ButtonVariant, string>> = {
  onDark: {
    solid: 'bg-white text-navy shadow-[0_12px_32px_-12px_rgb(235_47_51/0.35)] hover:bg-sky-100',
    outline: 'border border-white/28 text-white hover:border-accent/80 hover:bg-white/[0.06]',
    ghost: 'text-white hover:bg-white/[0.08]',
  },
  onLight: {
    solid: 'bg-navy text-white shadow-soft hover:bg-navy-800',
    outline: 'border border-navy/20 text-navy hover:border-accent/70 hover:bg-navy/[0.04]',
    ghost: 'text-navy hover:bg-navy/[0.05]',
  },
};

export function buttonClasses(
  variant: ButtonVariant = 'solid',
  tone: ButtonTone = 'onDark',
  size: ButtonSize = 'lg',
  extra = '',
): string {
  const padRight = size === 'lg' && variant !== 'solid' ? ' pr-6 sm:pr-7' : '';
  return `${base} ${sizes[size]} ${variants[tone][variant]}${padRight} ${extra}`.trim();
}

/** Círculo con flecha en color de acento `#EB2F33` que acompaña al botón sólido grande */
export function buttonIconClasses(_tone: ButtonTone = 'onDark'): string {
  return 'grid size-9 shrink-0 place-items-center rounded-full bg-accent text-white shadow-[0_6px_16px_-4px_rgb(235_47_51/0.65)] transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0.5 group-hover/btn:-rotate-45 sm:size-10';
}
