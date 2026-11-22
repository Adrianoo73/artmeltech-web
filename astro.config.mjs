// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

/**
 * La URL pública se define con PUBLIC_SITE_URL (ver .env.example).
 * El proyecto no depende de ningún proveedor de hosting: el build es 100 % estático.
 */
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL;
if (!PUBLIC_SITE_URL && process.argv.includes('build')) {
  console.warn(
    '[artmeltech-web] AVISO: PUBLIC_SITE_URL no está definido en .env. ' +
      'Las URLs de canonical, Open Graph, robots.txt y sitemap usarán https://www.artmeltech.example hasta definir el dominio real.',
  );
}
const site = PUBLIC_SITE_URL || 'https://www.artmeltech.example';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: { defaultLocale: 'es', locales: { es: 'es-BO' } },
    }),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: {
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
