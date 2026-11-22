/**
 * ============================================================================
 *  CONFIGURACIÓN EDITABLE DEL SITIO — ArtMel Tech
 * ============================================================================
 *  Todos los datos de contacto y redes sociales se gestionan desde aquí.
 *  Deja un campo como cadena vacía ('') para ocultarlo automáticamente en la
 *  web, en el footer y en los datos estructurados (JSON-LD).
 * ============================================================================
 */

export interface SocialLinks {
  linkedin: string;
  instagram: string;
  facebook: string;
  x: string;
  github: string;
  youtube: string;
  tiktok: string;
}

export interface ContactConfig {
  /** Número de WhatsApp en formato internacional, solo dígitos. Ej.: '5491100000000' */
  whatsapp: string;
  /** Mensaje inicial predefinido para WhatsApp */
  whatsappMessage: string;
  /** Correo electrónico de contacto. Ej.: 'hola@tudominio.com' */
  email: string;
  /** Teléfono visible (texto libre). Ej.: '+54 11 0000-0000' */
  phone: string;
  /** Ciudad / país o dirección visible (texto libre) */
  location: string;
  /** Horario de atención (texto libre) */
  hours: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  locale: string;
  lang: string;
  themeColor: string;
  contact: ContactConfig;
  social: SocialLinks;
}

export const site: SiteConfig = {
  name: 'ArtMel Tech',
  legalName: 'ArtMel Tech',
  tagline: 'Connecting Solutions',
  description:
    'Soluciones de software, desarrollo web, automatización y soporte técnico de computadoras, laptops e impresoras en Riberalta, Beni, Bolivia.',
  locale: 'es_BO',
  lang: 'es',
  themeColor: '#03203D',

  contact: {
    whatsapp: '59175118634',
    whatsappMessage: 'Hola, ArtMel Tech. Me gustaría hacer una consulta.',
    email: 'artmeltech@gmail.com',
    phone: '',
    location: 'Riberalta, Beni, Bolivia',
    hours: '',
  },

  social: {
    linkedin: '',
    instagram: 'https://www.instagram.com/artmel_tech?bqrl=MXN5M254MWdhc2pkaA==',
    facebook: 'https://www.facebook.com/ArtmelTech?mibextid=ZbWKwL',
    x: '',
    github: '',
    youtube: '',
    tiktok: 'https://www.tiktok.com/@artmel_tech?_r=1&_t=ZS-9BbeEvecATq',
  },
};

/** Navegación principal (one-page con anclas amigables) */
export const navItems = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'soluciones', label: 'Soluciones' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'contacto', label: 'Contacto' },
] as const;

export type SectionId = (typeof navItems)[number]['id'];
