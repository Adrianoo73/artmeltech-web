# ARTMEL TECH — Sitio Web Corporativo

**ARTMEL TECH — CONNECTING SOLUTIONS**

Sitio web corporativo 100 % estático desarrollado con **Astro + React + Motion + Tailwind CSS 4 + TypeScript estricto**. Independiente de cualquier proveedor de alojamiento o backend.

## Stack tecnológico

- **Framework:** Astro 7 (salida 100 % estática en `dist/`)
- **Islas interactivas:** React 19 mediante `@astrojs/react` (hidratación selectiva `client:load`, `client:idle`, `client:visible`)
- **Animaciones:** Motion for React (`motion/react` + `motion` / `motion/mini` para reveals sin React)
- **Estilos:** Tailwind CSS 4 (`@tailwindcss/vite`) y tokens CSS globales con la paleta oficial
- **Tipografía:** Montserrat Variable y Inter Variable autoalojadas en WOFF2 (`@fontsource-variable/*`)
- **Calidad y pruebas:** TypeScript (`astro/tsconfigs/strictest`), ESLint 9 (`eslint-plugin-astro`, `typescript-eslint`, `jsx-a11y`, `react-hooks`), Prettier, Vitest + Testing Library, Playwright + `@axe-core/playwright`

## Paleta oficial y tokens

Todos los colores derivados se calculan mediante `color-mix()` a partir de los 4 colores oficiales en [`src/styles/global.css`](src/styles/global.css):

| Rol | Variable | Valor |
| --- | --- | --- |
| Primario | `--color-navy` | `#03203D` |
| Secundario | `--color-sky` | `#639CC5` |
| Claro | `--color-white` | `#FFFFFF` |
| Acento (uso restringido) | `--color-accent` | `#EB2F33` |

## Logotipo

El logotipo oficial en [`src/assets/brand/artmeltech-logo-original.png`](src/assets/brand/artmeltech-logo-original.png) se conserva íntegro sin alterar colores, proporciones ni formas. Solo se recortan márgenes vacíos mediante `node scripts/brand-assets.mjs` para generar `logo.png`, `isotipo.png`, los favicons y la imagen Open Graph (`public/og-default.jpg`).

## Configuración editable (contacto, redes y URL pública)

1. **Datos de contacto y redes sociales:** editar [`src/config/site.ts`](src/config/site.ts).
   - No existen datos inventados: cualquier campo vacío (`''`) se oculta automáticamente en la página, el pie de página y el bloque JSON-LD.
   - Al completar `contact.whatsapp` (solo dígitos con código de país) o `contact.email`, se habilitan automáticamente los enlaces directos y el asistente de consulta.
2. **Textos institucionales y portafolio demostrativo:**
   - Identidad, misión, visión y filosofía (borradores listos para reemplazar): [`src/content/home.ts`](src/content/home.ts)
   - Servicios: [`src/content/services.ts`](src/content/services.ts)
   - Soluciones tecnológicas: [`src/content/solutions.ts`](src/content/solutions.ts)
   - Proyectos (identificados como demostrativos): [`src/content/projects.ts`](src/content/projects.ts)
   - Proceso de trabajo: [`src/content/process.ts`](src/content/process.ts)
3. **URL pública (canonical, Open Graph, sitemap y robots.txt):** copiar `.env.example` a `.env` y definir `PUBLIC_SITE_URL=https://tu-dominio.com` antes de compilar.

## Comandos disponibles

```bash
npm install              # Instala dependencias
npm run dev              # Servidor de desarrollo local
npm run build            # Compilación estática en dist/
npm run preview          # Previsualización local de dist/
npm run check            # Comprobación estricta de TypeScript y Astro
npm run lint             # ESLint (TypeScript, Astro, React Hooks, a11y)
npm run test             # Pruebas unitarias y de componentes (Vitest)
npm run test:e2e         # Pruebas E2E, responsive y WCAG 2.1 AA (Playwright + axe)
npm run verify           # check + lint + test + build
```

## Arquitectura Islands

| Componente | Tecnología | Hidratación | Propósito |
| --- | --- | --- | --- |
| `SiteHeader` | React + Motion | `client:load` | Cabecera inteligente, indicador activo (`layoutId`) y menú móvil accesible |
| `HeroVisual` | React + Motion | `client:load` | Red tecnológica animada SVG y parallax sutil por dispositivo |
| `ScrollProgress` | React + Motion | `client:idle` | Barra de progreso de lectura |
| `ProjectsGallery` | React + Motion | `client:visible` | Filtros, carrusel móvil y modal accesible para proyectos demostrativos |
| `ProcessTimeline` | React + Motion | `client:visible` | Línea de tiempo vinculada al desplazamiento (`useScroll`) |
| `ContactComposer` | React + Motion | `client:visible` | Generador de consulta sin backend (WhatsApp, correo o copiar resumen) |
| `Preloader`, `HeroSection`, `AboutSection`, `ServicesSection`, `SolutionsSection`, `WhatsAppFloat`, `Footer` | Astro estático | Ninguna (0 KB React) | Pantalla de carga, contenido principal, acceso flotante a WhatsApp y reveals WAAPI ligeros (`motion` / `motion/mini`) |
