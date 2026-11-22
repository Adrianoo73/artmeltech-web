# Changelog

## 1.8.1 — 2026-11-22

### Correcciones detectadas en prueba final integral
- **TypeScript 6 (`TS5101`) en [tsconfig.json](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/tsconfig.json):** eliminada la opción obsoleta `baseUrl` migrando el alias a `"@/*": ["./src/*"]` para compatibilidad limpia con `tsc --noEmit` en TypeScript 6/7.
- **Animación de trazos SVG (`data-reveal="draw"`) en [global.css](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/styles/global.css) y [reveal.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/lib/motion/reveal.ts):** corregido el desplazamiento inicial (`transform: none`) y la observación vía contenedor `<svg>` en `IntersectionObserver` para que los 6 trazos conectores de *Soluciones* se dibujen y revelen al 100 % en todos los navegadores, sin inflar el retraso escalonado de las tarjetas.
- **Configuración de formateo ([.prettierignore](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/.prettierignore)):** excluidos activos binarios de imagen (`*.png`, `*.jpg`, `*.webp`, `*.avif`, `*.ico`).

## 1.8.0 — 2026-11-22

### Ubicación oficial (Riberalta, Beni, Bolivia) y enfoque realista de servicios
- **Identidad local configurada ([site.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/config/site.ts), [Seo.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/Seo.astro), [AboutSection.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/AboutSection.astro), [ContactSection.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/ContactSection.astro)):** definida la ubicación oficial **Riberalta, Beni, Bolivia**, `locale: 'es_BO'`, tarjeta de ubicación en Contacto/Footer, insignia en Nosotros y datos estructurados `PostalAddress` / `areaServed` en JSON-LD para SEO local.
- **Tono honesto y realista para empresa en crecimiento ([home.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/content/home.ts), [services.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/content/services.ts), [solutions.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/content/solutions.ts), [projects.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/content/projects.ts), [process.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/content/process.ts), [HeroVisual.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/react/HeroVisual.tsx)):** eliminadas todas las referencias a sistemas grandes como **ERP**, **CRM** o *sistemas heredados* de gran escala; textos ajustados a soluciones digitales prácticas (web, apps, herramientas de control, automatizaciones ligeras e integraciones con WhatsApp/formularios) junto al soporte técnico de equipos.

## 1.7.0 — 2026-11-21

### Servicios de reparación, impresoras, drivers y mantenimiento
- **Nuevos servicios técnicos ([services.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/content/services.ts), [ServicesSection.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/ServicesSection.astro), [icons.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/ui/icons.tsx)):** añadidos **Reparación de computadoras y laptops** (`07`), **Reparación y mantenimiento de impresoras** (`08`) y **Mantenimiento, drivers y optimización** (`09`), organizados en una subsección clara (*Soporte técnico, reparación y mantenimiento de equipos*) con iconos `Laptop`, `Printer` y `Wrench` (SVG estático, 0 KB de JS).
- **Hero y Contacto integrados ([home.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/content/home.ts), [ContactComposer.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/react/ContactComposer.tsx)):** nuevas capacidades en la cinta del Hero y selector interactivo de contacto actualizado con *Reparación de PC y laptops*, *Reparación de impresoras* y *Mantenimiento y drivers* para consultar directo por WhatsApp o correo.

## 1.6.0 — 2026-11-21

### Contacto prioritario por WhatsApp e iconos visibles de redes sociales
- **WhatsApp como 1.ª opción de contacto:** nuevo botón flotante rápido ([WhatsAppFloat.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/WhatsAppFloat.astro)) accesible en todo el sitio, tarjeta protagonista blanca de WhatsApp como primer canal en [ContactSection.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/ContactSection.astro), botón principal ancho completo **"Enviar consulta por WhatsApp"** en [ContactComposer.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/react/ContactComposer.tsx), primer acceso en [Footer.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/Footer.astro) y CTA directo en el menú móvil ([SiteHeader.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/react/SiteHeader.tsx)). El correo electrónico (`artmeltech@gmail.com`) queda como 2.ª opción.
- **Iconos de redes sociales más visibles y reconocibles ([SocialIcon.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/ui/SocialIcon.tsx)):** glifos vectoriales sólidos y nítidos de WhatsApp, Instagram, Facebook y TikTok con alto contraste en Contacto, Footer y menú móvil.

## 1.5.0 — 2026-11-21

### Datos oficiales de contacto y redes sociales
- Configurados en [site.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/config/site.ts) los canales oficiales proporcionados por ArtMel Tech: WhatsApp (`59175118634`), correo electrónico (`artmeltech@gmail.com`), Facebook, Instagram y TikTok.
- Activados automáticamente los enlaces directos y el envío desde `ContactComposer`, los accesos del `Footer` y los campos `contactPoint` / `sameAs` en JSON-LD (`Seo.astro`).

## 1.4.0 — 2026-11-21

### Correcciones tras auditoría integral prepublicación
- **Responsive `1024×768` ([SiteHeader.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/react/SiteHeader.tsx)):** ajuste de espaciado y escala en el breakpoint `lg` (`1024–1279 px`) con `whitespace-nowrap` para evitar el salto de línea y recorte del CTA `"Inicia tu proyecto"`.
- **Accesibilidad ([ProjectsGallery.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/react/ProjectsGallery.tsx), [Footer.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/Footer.astro)):** trampa de foco por teclado (`Tab`/`Shift+Tab`) en el modal de detalle de proyectos y ampliación del área táctil de los indicadores del carrusel móvil (`36×36 px`) y enlaces del pie de página en móvil.
- **Rendimiento y CLS ([ProcessTimeline.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/react/ProcessTimeline.tsx), [BaseLayout.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/layouts/BaseLayout.astro), [ProjectsSection.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/ProjectsSection.astro), [project-categories.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/content/project-categories.ts), [preloader.ts](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/lib/motion/preloader.ts)):** animación del punto viajero del proceso convertida de `top` a GPU `transform` (`0` layout shifts), separación de categorías sin arrastrar los JPG originales al bundle cliente, eliminación del `<link rel="preload">` duplicado del logo, precarga de `Inter Variable` latino para reducir CLS en móvil 4G y ajuste fino de `MIN_DISPLAY_MS` (`850 ms`) del preloader.
- **SEO, seguridad y limpieza ([astro.config.mjs](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/astro.config.mjs), [Seo.astro](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/astro/Seo.astro), [ContactComposer.tsx](file:///c:/Proyectos_adriano/ARTMELTECH_WEB/src/components/react/ContactComposer.tsx)):** aviso explícito de compilación cuando falta `PUBLIC_SITE_URL`, logotipo WebP optimizado y escape de `<` en JSON-LD, `<meta name="referrer">`, fallback de copiado al portapapeles, eliminación de archivos y campos sin uso (`variants.ts`, `artmeltech-logo-original.jpg`, `Solution.size`) y cobertura Playwright ampliada a `1024×768` (42 pruebas).

## 1.3.0 — 2026-11-21

### Sistema ampliado de animaciones profesionales (Motion + WAAPI GPU)
- **Motor declarativo ampliado (`src/lib/motion/reveal.ts`, `interactions.ts`):** soporte para entradas `card` (escala + desplazamiento), `left`/`right` (deslizamiento lateral adaptable), `line` (subrayados animados en cada `SectionHeading`), `draw` (trazos SVG que se dibujan al entrar en pantalla), líneas vinculadas al scroll (`data-scroll-line`), parallax de profundidad (`data-parallax`) y atracción magnética sutil en CTAs (`data-magnetic`, solo ratón en escritorio).
- **Hero más vivo (`HeroSection.astro`, `HeroVisual.tsx`):** haces luminosos recorriendo la cuadrícula de fondo, botón principal con destello *shimmer* periódico, cinta continua (*marquee*) de capacidades con pausa al hover, anillo orbital giratorio alrededor del isotipo oficial `AM`, doble pulso de datos en circuito, flotación orgánica contrafase en tarjetas flotantes y gráfica viva.
- **Animaciones en todas las secciones:** línea conectora vinculada al scroll en Nosotros, tarjetas con despliegue de borde superior `#EB2F33` e iconos reactivos en Servicios, trazos conectores SVG que se dibujan en vivo en Soluciones, entrada escalonada + elevación Motion en Proyectos, punto luminoso viajero sobre la columna vertebral del Proceso (`useTransform`) con nodos pulsantes, y selector animado (`layoutId`) en el compositor de Contacto.
- Protección total de `overflow-x-clip`, `prefers-reduced-motion: reduce`, visibilidad sin JavaScript y Core Web Vitals.

## 1.2.0 — 2026-11-21

### Pantalla de carga inicial con logotipo animado
- Nuevo componente `Preloader.astro` y controlador `src/lib/motion/preloader.ts`: al entrar o recargar la página se muestra el logotipo oficial de ArtMel Tech sobre fondo blanco con cuadrícula técnica sutil, marco de esquinas con acento `#EB2F33`, destello suave, barra de progreso con gradiente `#03203D → #639CC5 → #EB2F33` y salida tipo cortina hacia el header blanco (`motion/mini`).
- Optimización de recursos: `Preloader`, `Header` y `<link rel="preload">` comparten el mismo archivo WebP de 480 px para evitar descargas duplicadas y mantener LCP rápido.
- Mejora progresiva y accesibilidad: oculto automáticamente si JavaScript está desactivado o si `prefers-reduced-motion: reduce` está activo, con salvaguarda de retiro automático y nuevas pruebas E2E en 5 viewports (entrada + recarga).

## 1.1.0 — 2026-11-21

### Refinamiento de marca, header blanco, acento `#EB2F33` y optimización móvil
- **Header blanco con logotipo protagonista (`SiteHeader.tsx`, `Header.astro`):** cabecera blanca translúcida (`bg-white/97`) con filete de acento `#EB2F33`, logotipo oficial sin recuadro en mayor tamaño (`h-10` a `h-12`, servido a 480 px WebP), píldora activa navy con punto `#EB2F33` y CTA con círculo de acción en `#EB2F33`.
- **Mayor presencia de marca:** incorporación del isotipo oficial `AM` en el núcleo de `HeroVisual.tsx` y del logotipo oficial en la tarjeta de identidad de `AboutSection.astro`, en `ContactSection.astro` y en mayor tamaño en `Footer.astro`.
- **Presencia equilibrada de `#EB2F33`:** subrayados animados, trazos de eyebrow, nodos y pulsos de circuito, bordes de tarjetas, indicadores de etapa y círculos de CTA respetando WCAG 2.1 AA (0 violaciones en `axe-core`) y sin usarlo en grandes superficies.
- **Optimización Mobile First (360 px y 390 px):** botones CTA simétricos a ancho completo en móvil, tarjeta inferior de `HeroVisual` centrada sin recortes, filtros de proyectos visibles sin scroll oculto (`flex-wrap`), modal de proyecto tipo *bottom-sheet*, timeline compacta a la izquierda, campos de formulario en `16px` (`text-base sm:text-sm`) para evitar auto-zoom en iOS Safari y cobertura E2E añadida para `mobile-small` (`360×740`).

## 1.0.0 — 2026-11-21

### Etapa 0 — Scaffold y herramientas
- Inicialización del proyecto Astro 7 estático con `@astrojs/react`, React 19, Motion 14 (`motion/react`), Tailwind CSS 4 (`@tailwindcss/vite`), `@astrojs/sitemap` y TypeScript estricto (`astro/tsconfigs/strictest`).
- Configuración de ESLint 9 (`typescript-eslint`, `eslint-plugin-astro`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`), Prettier, Vitest + Testing Library y Playwright + `@axe-core/playwright`.

### Etapa 1 — Identidad, sistema de diseño y Motion
- Integración del logotipo oficial sin modificaciones (`scripts/brand-assets.mjs`: recorte de márgenes vacíos, favicons e imagen Open Graph `1200×630`).
- Sistema de tokens CSS y `@theme` con paleta oficial (`#03203D`, `#639CC5`, `#FFFFFF`, `#EB2F33`) deshabilitando la paleta por defecto de Tailwind para evitar colores fuera de marca.
- Tipografía WOFF2 autoalojada (`Montserrat Variable` + `Inter Variable`) con preload y fallbacks ajustados para prevenir CLS.
- Sistema de animación sincronizado (`src/lib/motion/tokens.ts`, `variants.ts`, `hooks.ts`, `reveal.ts`, `MotionProvider.tsx` con `LazyMotion` asíncrono y `MotionConfig reducedMotion="user"`).

### Etapa 2 — Navegación y pie de página
- `SiteHeader.tsx` (`client:load`): cabecera adaptable al scroll, indicador de sección activa (`layoutId`) y menú móvil a pantalla completa con trampa de foco y cierre con `Escape`.
- `ScrollProgress.tsx` (`client:idle`) y `Footer.astro` estático con enlaces y canales condicionales.

### Etapa 3 — Hero
- `HeroSection.astro` con titular, subtítulo y CTAs renderizados en SSR (visibles sin JS y optimizados para LCP).
- `HeroVisual.tsx` (`client:load`): composición tecnológica SVG con trazos de circuito animados (`pathLength`), pulso luminoso, capas con profundidad, partículas discretas y adaptación automática por capacidad de dispositivo (`useDeviceTier`).

### Etapa 4 — Nosotros, Servicios y Soluciones tecnológicas
- Secciones 100 % estáticas (`AboutSection.astro`, `ServicesSection.astro`, `SolutionsSection.astro`) con ritmo alternado navy/claro, cuadrícula Bento equilibrada en todos los breakpoints, efecto spotlight ligero y reveals WAAPI (`motion` / `motion/mini`).

### Etapa 5 — Proyectos y Proceso de trabajo
- `ProjectsSection.astro` + `ProjectsGallery.tsx` (`client:visible`): 6 casos demostrativos claramente etiquetados (`Proyecto demostrativo`), imágenes responsive optimizadas en AVIF y WebP, filtros animados, carrusel móvil táctil y modal accesible.
- `ProcessSection.astro` + `ProcessTimeline.tsx` (`client:visible`): 6 etapas con línea de progreso vinculada al desplazamiento (`useScroll` + `useSpring`).

### Etapa 6 — Contacto
- `ContactSection.astro` + `ContactComposer.tsx` (`client:visible`): canales editables centralizados en `src/config/site.ts` sin datos inventados ni backend; generador de consulta para WhatsApp, correo electrónico o copiado al portapapeles.

### Etapas 7 y 8 — SEO, Accesibilidad y QA
- Metadatos completos, Open Graph, Twitter Cards, datos estructurados JSON-LD (`Organization` + `WebSite`), `sitemap-index.xml`, `robots.txt` dinámico en build, `site.webmanifest` y página `404.astro`.
- Optimización de bundles de Motion con carga asíncrona de `domAnimation` y `domMax`.
- Verificación completa: `astro check`, ESLint, Vitest, compilación estática, pruebas E2E en 4 viewports (móvil, tablet, laptop y escritorio), auditoría WCAG 2.1 AA con axe-core, prueba sin JS y con `prefers-reduced-motion`.
