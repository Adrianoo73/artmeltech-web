import type { IconName } from '@/components/ui/icons';

export type ServiceCategory = 'digital' | 'hardware';

export interface Service {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  icon: IconName;
  features: string[];
}

export interface ServiceGroup {
  id: ServiceCategory;
  label: string;
  badge: string;
}

export const servicesIntro = {
  eyebrow: 'Servicios',
  title: 'Soluciones prácticas para',
  titleHighlight: 'tu negocio y tus equipos.',
  lead: 'Diseñamos herramientas digitales a la medida de comercios y emprendimientos, y brindamos soporte técnico especializado en Riberalta, Beni.',
} as const;

export const serviceGroups: readonly ServiceGroup[] = [
  {
    id: 'digital',
    label: 'Desarrollo y soluciones digitales',
    badge: 'Software · Web · Automatización',
  },
  {
    id: 'hardware',
    label: 'Soporte técnico, reparación y mantenimiento de equipos',
    badge: 'PC · Laptops · Impresoras · Drivers',
  },
] as const;

export const services: Service[] = [
  {
    id: 'software',
    category: 'digital',
    title: 'Desarrollo de software',
    description:
      'Aplicaciones y herramientas a medida, prácticas y fáciles de usar, diseñadas para ordenar el trabajo diario de tu negocio.',
    icon: 'code',
    features: ['Herramientas a medida', 'Control de ventas y stock', 'Código mantenible'],
  },
  {
    id: 'web',
    category: 'digital',
    title: 'Desarrollo web',
    description:
      'Sitios web profesionales, landing pages y catálogos rápidos, modernos y optimizados para celular y buscadores.',
    icon: 'globe',
    features: ['Sitios corporativos', 'Catálogos en línea', 'SEO y velocidad'],
  },
  {
    id: 'apps',
    category: 'digital',
    title: 'Aplicaciones digitales',
    description:
      'Aplicaciones web y móviles prácticas con interfaces intuitivas para acercar tus servicios a más clientes.',
    icon: 'smartphone',
    features: ['Apps web y móviles', 'Reservas y catálogos', 'Diseño UX/UI'],
  },
  {
    id: 'automatizacion',
    category: 'digital',
    title: 'Automatización',
    description:
      'Automatizamos tareas repetitivas como registros, reportes y avisos para que ahorres tiempo y evites errores.',
    icon: 'workflow',
    features: ['Flujos automatizados', 'Reportes automáticos', 'Ahorro de tiempo'],
  },
  {
    id: 'integracion',
    category: 'digital',
    title: 'Integración tecnológica',
    description:
      'Conectamos tus herramientas digitales —web, formularios, WhatsApp, correo y planillas— para que trabajen juntas.',
    icon: 'plug',
    features: ['APIs y webhooks', 'Formularios y WhatsApp', 'Sincronización de datos'],
  },
  {
    id: 'consultoria',
    category: 'digital',
    title: 'Consultoría tecnológica',
    description:
      'Asesoría cercana para elegir los equipos, herramientas y pasos digitales adecuados según tus necesidades y presupuesto.',
    icon: 'lightbulb',
    features: ['Diagnóstico práctico', 'Plan por etapas', 'Selección tecnológica'],
  },
  {
    id: 'reparacion-pc-laptops',
    category: 'hardware',
    title: 'Reparación de computadoras y laptops',
    description:
      'Diagnóstico preciso y reparación especializada de PCs de escritorio y laptops para recuperar su estabilidad y velocidad.',
    icon: 'laptop',
    features: ['Diagnóstico técnico', 'Cambio de componentes', 'Ampliación SSD y RAM'],
  },
  {
    id: 'reparacion-impresoras',
    category: 'hardware',
    title: 'Reparación y mantenimiento de impresoras',
    description:
      'Servicio técnico para impresoras de tinta, láser y multifuncionales, eliminando atascos, errores y fallas de impresión.',
    icon: 'printer',
    features: ['Limpieza de cabezales', 'Configuración en red', 'Mantenimiento correctivo'],
  },
  {
    id: 'mantenimiento-drivers',
    category: 'hardware',
    title: 'Mantenimiento, drivers y optimización',
    description:
      'Mantenimiento preventivo, actualización de drivers, formateo e instalación de programas para prolongar la vida útil de tus equipos.',
    icon: 'wrench',
    features: ['Actualización de drivers', 'Mantenimiento preventivo', 'Formateo y optimización'],
  },
];
