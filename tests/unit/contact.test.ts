import { describe, expect, it } from 'vitest';
import {
  buildMailtoUrl,
  buildTelUrl,
  buildWhatsAppUrl,
  getActiveSocials,
  getContactChannels,
  normalizePhoneDigits,
} from '@/lib/contact';
import { site } from '@/config/site';

describe('contact helpers', () => {
  it('normaliza dígitos eliminando símbolos y espacios', () => {
    expect(normalizePhoneDigits('+54 (11) 4567-8901')).toBe('541145678901');
  });

  it('construye URLs de WhatsApp válidas y omite valores vacíos o cortos', () => {
    expect(buildWhatsAppUrl('')).toBeNull();
    expect(buildWhatsAppUrl('1234')).toBeNull();
    expect(buildWhatsAppUrl('+54 9 11 5555-1234', 'Hola ArtMel')).toBe(
      'https://wa.me/5491155551234?text=Hola%20ArtMel',
    );
  });

  it('construye enlaces mailto válidos y rechaza correos inválidos', () => {
    expect(buildMailtoUrl('')).toBeNull();
    expect(buildMailtoUrl('no-es-correo')).toBeNull();
    expect(buildMailtoUrl('hola@artmeltech.com', 'Consulta', 'Detalle')).toBe(
      'mailto:hola@artmeltech.com?subject=Consulta&body=Detalle',
    );
  });

  it('construye enlaces tel: respetando el prefijo internacional', () => {
    expect(buildTelUrl('')).toBeNull();
    expect(buildTelUrl('+54 11 5555-0000')).toBe('tel:+541155550000');
  });

  it('filtra únicamente redes sociales con URL https válida', () => {
    const active = getActiveSocials({
      linkedin: 'https://linkedin.com/company/artmeltech',
      instagram: 'http://inseguro.example',
      facebook: '',
      x: 'https://x.com/artmeltech',
      github: '   ',
      youtube: '',
      tiktok: '',
    });
    expect(active.map((s) => s.key)).toEqual(['linkedin', 'x']);
  });

  it('expone los canales oficiales configurados en site.ts y mantiene ocultos los no definidos', () => {
    const channels = getContactChannels(site);
    expect(channels.whatsappUrl).toMatch(/^https:\/\/wa\.me\/59175118634\?text=/);
    expect(channels.mailtoUrl).toBe('mailto:artmeltech@gmail.com');
    expect(channels.telUrl).toBeNull();
    expect(channels.hasAnyChannel).toBe(true);
    expect(getActiveSocials(site.social).map((s) => s.key)).toEqual([
      'instagram',
      'facebook',
      'tiktok',
    ]);
  });
});
