import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  Code2,
  Compass,
  FileDigit,
  Globe,
  Laptop,
  LifeBuoy,
  Lightbulb,
  Mail,
  Map,
  MapPin,
  Network,
  PenTool,
  Phone,
  Plug,
  Printer,
  RefreshCcw,
  Rocket,
  Search,
  ShoppingCart,
  Smartphone,
  Target,
  Telescope,
  Users,
  Workflow,
  Wrench,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

export const icons = {
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  chart: BarChart3,
  clock: Clock,
  code: Code2,
  compass: Compass,
  'file-digital': FileDigit,
  globe: Globe,
  laptop: Laptop,
  lifebuoy: LifeBuoy,
  lightbulb: Lightbulb,
  mail: Mail,
  map: Map,
  'map-pin': MapPin,
  network: Network,
  pen: PenTool,
  phone: Phone,
  plug: Plug,
  printer: Printer,
  refresh: RefreshCcw,
  rocket: Rocket,
  search: Search,
  cart: ShoppingCart,
  smartphone: Smartphone,
  target: Target,
  telescope: Telescope,
  users: Users,
  workflow: Workflow,
  wrench: Wrench,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

/**
 * Icono de la librería Lucide. En componentes Astro se renderiza como SVG
 * estático (sin hidratación, 0 KB de JS en el cliente).
 */
export function Icon({ name, strokeWidth = 1.6, ...props }: IconProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" focusable="false" strokeWidth={strokeWidth} {...props} />;
}
