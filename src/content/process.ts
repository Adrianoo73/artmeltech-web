import type { IconName } from '@/components/ui/icons';

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  icon: IconName;
}

export const processIntro = {
  eyebrow: 'Proceso de trabajo',
  title: 'Un método claro, de la idea',
  titleHighlight: 'al resultado.',
  lead: 'Trabajamos por etapas definidas, con entregables visibles y comunicación constante en cada paso.',
} as const;

export const processSteps: ProcessStep[] = [
  {
    id: 'analisis',
    number: '01',
    title: 'Análisis',
    description: 'Escuchamos, investigamos y entendemos tu negocio, tus usuarios y los objetivos del proyecto.',
    deliverables: ['Levantamiento de requisitos', 'Diagnóstico inicial'],
    icon: 'search',
  },
  {
    id: 'planificacion',
    number: '02',
    title: 'Planificación',
    description: 'Definimos alcance, prioridades y un plan realista paso a paso según tus necesidades y presupuesto.',
    deliverables: ['Plan por etapas', 'Presupuesto claro'],
    icon: 'map',
  },
  {
    id: 'diseno',
    number: '03',
    title: 'Diseño',
    description: 'Creamos la experiencia y la interfaz, validando flujos y prototipos antes de construir.',
    deliverables: ['Prototipos interactivos', 'Sistema visual'],
    icon: 'pen',
  },
  {
    id: 'desarrollo',
    number: '04',
    title: 'Desarrollo',
    description: 'Construimos tu solución con buenas prácticas, avances visibles y pruebas constantes.',
    deliverables: ['Avances periódicos', 'Pruebas de calidad'],
    icon: 'code',
  },
  {
    id: 'implementacion',
    number: '05',
    title: 'Implementación',
    description: 'Ponemos la solución en marcha de forma segura, con capacitación y acompañamiento.',
    deliverables: ['Puesta en marcha', 'Capacitación del equipo'],
    icon: 'rocket',
  },
  {
    id: 'soporte',
    number: '06',
    title: 'Soporte',
    description: 'Monitoreamos, mantenemos y evolucionamos la solución junto a tu negocio.',
    deliverables: ['Mantenimiento', 'Mejora continua'],
    icon: 'lifebuoy',
  },
];
