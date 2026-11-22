/**
 * Contenido institucional de ArtMel Tech.
 * ⚠️ BORRADOR — Textos de propuesta redactados para el lanzamiento.
 * Validar y reemplazar por los textos oficiales de ArtMel Tech cuando estén disponibles.
 */

export const hero = {
  eyebrow: 'Connecting Solutions',
  titleLead: ['Transformamos', 'ideas', 'en'],
  titleHighlight: ['soluciones', 'tecnológicas'],
  subtitle:
    'Desarrollamos soluciones de software y tecnología que conectan posibilidades, optimizan procesos e impulsan el crecimiento de las empresas.',
  primaryCta: { label: 'Descubre nuestros servicios', href: '#servicios' },
  secondaryCta: { label: 'Inicia tu proyecto', href: '#contacto' },
  capabilities: [
    'Software a medida',
    'Desarrollo web',
    'Apps digitales',
    'Automatización',
    'Integración',
    'Consultoría',
    'Reparación de PC y laptops',
    'Impresoras',
    'Mantenimiento y drivers',
  ],
} as const;

export const about = {
  eyebrow: 'Nosotros',
  title: 'Tecnología cercana desde',
  titleHighlight: 'Riberalta, Beni.',
  intro:
    'ArtMel Tech es un emprendimiento tecnológico en crecimiento con sede en Riberalta, Beni, Bolivia. Creamos sitios web, aplicaciones prácticas y automatizaciones a medida, además de brindar reparación y mantenimiento confiable para computadoras, laptops e impresoras.',
  body: 'Creemos que la mejor tecnología es la que resuelve problemas reales de forma simple y accesible. Por eso escuchamos primero, hablamos con claridad y acompañamos cada necesidad paso a paso.',
  pillars: [
    {
      id: 'mision',
      label: 'Misión',
      icon: 'target',
      text: 'Acercar soluciones digitales prácticas y soporte técnico confiable a personas, comercios y negocios en Riberalta, Beni y toda Bolivia, facilitando su día a día con tecnología útil y bien hecha.',
    },
    {
      id: 'vision',
      label: 'Visión',
      icon: 'telescope',
      text: 'Consolidarnos como un aliado tecnológico de confianza en la región y el país, reconocidos por nuestra honestidad, la calidad de nuestro trabajo y el trato cercano con cada cliente.',
    },
    {
      id: 'filosofia',
      label: 'Filosofía',
      icon: 'compass',
      text: 'Conectar personas, ideas y tecnología con soluciones honestas, funcionales y acordes a la realidad de cada proyecto, creciendo junto a quienes confían en nosotros.',
    },
  ],
  values: [
    { label: 'Calidad técnica', text: 'Trabajo prolijo, soluciones bien pensadas y atención al detalle.' },
    { label: 'Honestidad', text: 'Comunicación clara, alcances reales y presupuestos transparentes.' },
    { label: 'Tecnología útil', text: 'Recomendamos e implementamos solo lo que realmente aporta valor.' },
    { label: 'Cercanía', text: 'Trato directo y acompañamiento real antes, durante y después.' },
  ],
} as const;
