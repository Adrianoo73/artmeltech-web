export type ProjectCategory =
  | 'software'
  | 'web'
  | 'apps'
  | 'automatizacion'
  | 'integracion'
  | 'consultoria';

export const projectCategories: { id: ProjectCategory | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'software', label: 'Software' },
  { id: 'web', label: 'Web' },
  { id: 'apps', label: 'Apps' },
  { id: 'automatizacion', label: 'Automatización' },
  { id: 'integracion', label: 'Integración' },
  { id: 'consultoria', label: 'Consultoría' },
];
