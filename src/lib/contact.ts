import type { SiteConfig, SocialLinks } from '@/config/site';

/** Elimina todo lo que no sea dígito (formato requerido por wa.me). */
export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D+/g, '');
}

/** Construye un enlace de WhatsApp o devuelve null si no hay número configurado. */
export function buildWhatsAppUrl(number: string, message?: string): string | null {
  const digits = normalizePhoneDigits(number);
  if (digits.length < 8) return null;
  const text = message?.trim();
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

/** Construye un enlace mailto o devuelve null si el correo no es válido. */
export function buildMailtoUrl(email: string, subject?: string, body?: string): string | null {
  const value = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString().replace(/\+/g, '%20');
  return query ? `mailto:${value}?${query}` : `mailto:${value}`;
}

/** Construye un enlace tel: o null. */
export function buildTelUrl(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  const digits = normalizePhoneDigits(trimmed);
  if (digits.length < 6) return null;
  return `tel:${trimmed.startsWith('+') ? '+' : ''}${digits}`;
}

export const socialLabels: Record<keyof SocialLinks, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X',
  github: 'GitHub',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

export interface ActiveSocial {
  key: keyof SocialLinks;
  label: string;
  url: string;
}

/** Devuelve solo las redes sociales configuradas con una URL https válida. */
export function getActiveSocials(social: SocialLinks): ActiveSocial[] {
  return (Object.keys(social) as (keyof SocialLinks)[])
    .filter((key) => /^https:\/\/\S+$/.test(social[key].trim()))
    .map((key) => ({ key, label: socialLabels[key], url: social[key].trim() }));
}

export interface ContactChannels {
  whatsappUrl: string | null;
  mailtoUrl: string | null;
  telUrl: string | null;
  hasAnyChannel: boolean;
}

export function getContactChannels(config: SiteConfig): ContactChannels {
  const whatsappUrl = buildWhatsAppUrl(config.contact.whatsapp, config.contact.whatsappMessage);
  const mailtoUrl = buildMailtoUrl(config.contact.email);
  const telUrl = buildTelUrl(config.contact.phone);
  return { whatsappUrl, mailtoUrl, telUrl, hasAnyChannel: Boolean(whatsappUrl ?? mailtoUrl ?? telUrl) };
}
