import type { IconName } from '@/components/ui/icons';

export interface Solution {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  outcome: string;
}

export const solutionsIntro = {
  eyebrow: 'Soluciones tecnológicas',
  title: 'Tecnología práctica que',
  titleHighlight: 'impulsa tu día a día.',
  lead: 'Cada negocio tiene un punto de partida distinto. Estas son las soluciones accesibles y reales que podemos construir para ti.',
} as const;

export const solutions: Solution[] = [
  {
    id: 'procesos',
    title: 'Digitalización de registros',
    description:
      'Pasamos anotaciones manuales y en papel a herramientas digitales claras, ordenadas y accesibles desde el celular o la PC.',
    icon: 'file-digital',
    outcome: 'Trabajo más ordenado',
  },
  {
    id: 'datos',
    title: 'Reportes y control claro',
    description:
      'Paneles y resúmenes sencillos para visualizar ventas, pedidos o gastos de tu negocio sin complicaciones.',
    icon: 'chart',
    outcome: 'Mejor control del negocio',
  },
  {
    id: 'clientes',
    title: 'Presencia y atención digital',
    description:
      'Sitios web, formularios y canales conectados con WhatsApp para que tus clientes te encuentren y contacten al instante.',
    icon: 'users',
    outcome: 'Clientes mejor atendidos',
  },
  {
    id: 'ecosistema',
    title: 'Herramientas conectadas',
    description:
      'Conectamos tu página web, formularios, WhatsApp, correo y hojas de cálculo para evitar tareas duplicadas.',
    icon: 'network',
    outcome: 'Menos trabajo manual',
  },
  {
    id: 'modernizacion',
    title: 'Equipos y web al día',
    description:
      'Renovamos páginas antiguas, actualizamos drivers y optimizamos tus computadoras e impresoras para trabajar sin interrupciones.',
    icon: 'refresh',
    outcome: 'Tecnología rápida y confiable',
  },
  {
    id: 'comercio',
    title: 'Catálogos y ventas en línea',
    description:
      'Catálogos digitales y tiendas web rápidas, claras y listas para recibir pedidos directo por WhatsApp o internet.',
    icon: 'cart',
    outcome: 'Nuevos canales de venta',
  },
];
