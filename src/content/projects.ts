import type { ImageMetadata } from 'astro';
import type { ProjectCategory } from '@/content/project-categories';
import logistics from '@/assets/projects/logistics.jpg';
import corporateWeb from '@/assets/projects/corporate-web.jpg';
import bookingApp from '@/assets/projects/booking-app.jpg';
import automation from '@/assets/projects/automation.jpg';
import integration from '@/assets/projects/integration.jpg';
import consulting from '@/assets/projects/consulting.jpg';

export { projectCategories, type ProjectCategory } from '@/content/project-categories';

/**
 * ⚠️ PORTAFOLIO DEMOSTRATIVO
 * Estos proyectos son ejemplos ilustrativos (contenido de demostración) y NO
 * corresponden a clientes reales. En la web se muestran con la etiqueta
 * "Proyecto demostrativo". Reemplazar por casos reales cuando estén disponibles.
 */

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  stack: string[];
  image: ImageMetadata;
  imageAlt: string;
}

export const projectsIntro = {
  eyebrow: 'Proyectos',
  title: 'Ideas convertidas en',
  titleHighlight: 'soluciones reales.',
  lead: 'Una muestra del tipo de soluciones que diseñamos y construimos. Los casos presentados son demostrativos.',
  disclaimer:
    'Contenido demostrativo: los proyectos mostrados son ejemplos ilustrativos de nuestras capacidades y no representan clientes reales.',
} as const;

export const projects: Project[] = [
  {
    id: 'logistica',
    title: 'Control de pedidos y entregas',
    category: 'software',
    categoryLabel: 'Desarrollo de software',
    summary: 'Panel web sencillo para registrar pedidos, organizar entregas locales y seguir su estado.',
    challenge: 'Pedidos anotados en cuadernos o mensajes sueltos, con confusiones en direcciones y estados.',
    solution: 'Aplicación web práctica con registro de pedidos, zonas organizadas y vista clara de seguimiento.',
    stack: ['Panel web', 'Control de entregas', 'Diseño claro'],
    image: logistics,
    imageAlt: 'Mockup demostrativo de un panel de seguimiento de pedidos y rutas locales',
  },
  {
    id: 'portal-corporativo',
    title: 'Portal corporativo y tienda en línea',
    category: 'web',
    categoryLabel: 'Desarrollo web',
    summary: 'Sitio web moderno y rápido con catálogo de productos y pedidos directos por WhatsApp o en línea.',
    challenge: 'Presencia digital limitada, difícil de actualizar desde el celular y sin catálogo claro.',
    solution: 'Sitio web veloz, accesible y optimizado para buscadores, con catálogo práctico y contacto directo.',
    stack: ['Velocidad y SEO', 'Catálogo web', 'Diseño responsive'],
    image: corporateWeb,
    imageAlt: 'Mockup demostrativo de un sitio web corporativo en laptop y smartphone',
  },
  {
    id: 'reservas',
    title: 'App de reservas y turnos',
    category: 'apps',
    categoryLabel: 'Aplicaciones digitales',
    summary: 'Aplicación práctica para agendar citas, elegir horarios y recibir recordatorios automáticos.',
    challenge: 'Agenda manual en papel con citas superpuestas y demasiados mensajes repetitivos.',
    solution: 'App intuitiva con calendario disponible en vivo, confirmación rápida y recordatorios por mensaje.',
    stack: ['Web app móvil', 'Recordatorios', 'Diseño UX/UI'],
    image: bookingApp,
    imageAlt: 'Mockup demostrativo de tres pantallas de una app móvil de reservas con calendario',
  },
  {
    id: 'facturacion',
    title: 'Automatización de reportes y avisos',
    category: 'automatizacion',
    categoryLabel: 'Automatización',
    summary: 'Flujo automático que ordena registros, genera resúmenes y envía avisos sin carga manual repetitiva.',
    challenge: 'Horas perdidas cada semana copiando datos entre planillas, mensajes y documentos.',
    solution: 'Automatización ligera con validaciones básicas, envío de avisos y reportes listos al instante.',
    stack: ['Flujos automatizados', 'Planillas conectadas', 'Reportes claros'],
    image: automation,
    imageAlt: 'Mockup demostrativo de un editor de flujos de automatización con nodos conectados',
  },
  {
    id: 'integracion',
    title: 'Conexión de web, formularios y WhatsApp',
    category: 'integracion',
    categoryLabel: 'Integración tecnológica',
    summary: 'Integración práctica entre página web, formularios de consulta, WhatsApp y hojas de control.',
    challenge: 'Consultas y pedidos dispersos en varios canales que obligaban a transcribir todo a mano.',
    solution: 'Conexión mediante APIs y webhooks ligeros para centralizar cada consulta automáticamente.',
    stack: ['APIs y webhooks', 'Sincronización', 'Canales conectados'],
    image: integration,
    imageAlt: 'Mockup demostrativo de herramientas digitales conectadas en un flujo ordenado',
  },
  {
    id: 'hoja-de-ruta',
    title: 'Plan de digitalización para negocios',
    category: 'consultoria',
    categoryLabel: 'Consultoría tecnológica',
    summary: 'Diagnóstico práctico y plan paso a paso para ordenar la presencia web y las herramientas digitales.',
    challenge: 'Dudas sobre qué sitio web, herramientas o mejoras técnicas conviene implementar sin gastar de más.',
    solution: 'Evaluación clara de necesidades actuales y un plan gradual adaptado al ritmo del negocio.',
    stack: ['Diagnóstico práctico', 'Plan por etapas', 'Asesoría cercana'],
    image: consulting,
    imageAlt: 'Mockup demostrativo de una hoja de ruta con hitos y plan de crecimiento digital',
  },
];
