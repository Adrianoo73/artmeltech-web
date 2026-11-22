import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('ArtMel Tech — Sitio corporativo', () => {
  test('renderiza las 7 secciones, logo íntegro, sin desbordamiento ni errores de consola', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('#site-preloader')).toHaveCount(0, { timeout: 5000 });

    // Titular y subtítulo exactos del Hero
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Transformamos ideas en soluciones tecnológicas\./i,
      }),
    ).toBeVisible();
    await expect(
      page
        .locator('#inicio')
        .getByText(/Desarrollamos soluciones de software y tecnología que conectan posibilidades/i),
    ).toBeVisible();

    // Presencia de las 7 secciones obligatorias
    for (const id of [
      'inicio',
      'nosotros',
      'servicios',
      'soluciones',
      'proyectos',
      'proceso',
      'contacto',
    ]) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }

    // Logotipo cargado correctamente y sin deformación (ratio natural ~4.47)
    const headerLogo = page.locator('header img').first();
    await expect(headerLogo).toBeVisible();
    const logoMetrics = await headerLogo.evaluate((img: HTMLImageElement) => {
      const rect = img.getBoundingClientRect();
      return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedRatio: rect.width / rect.height,
        naturalRatio: img.naturalWidth / img.naturalHeight,
      };
    });
    expect(logoMetrics.naturalWidth).toBeGreaterThan(100);
    expect(Math.abs(logoMetrics.renderedRatio - logoMetrics.naturalRatio)).toBeLessThan(0.15);

    // Sin desbordamiento horizontal ni recortes en el header (crítico en 1024px)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const headerClipped = await page.evaluate(() =>
      Array.from(document.querySelectorAll('header a, header button')).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1);
      }).length,
    );
    expect(headerClipped).toBe(0);

    // Recorrido completo para activar reveals e islas client:visible y comprobar imágenes
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= totalHeight; y += 650) {
      await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(450);

    const brokenImages = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img')).filter((img) => !img.complete || img.naturalWidth === 0).length,
    );
    expect(brokenImages).toBe(0);
    expect(errors).toEqual([]);
  });

  test('muestra la animación de carga con el logotipo al entrar y al recargar, y luego se retira', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const preloader = page.locator('#site-preloader');
    await expect(preloader.locator('img')).toBeVisible();
    await expect(preloader).toHaveCount(0, { timeout: 6000 });

    // Al recargar vuelve a aparecer y se retira limpiamente
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(preloader.locator('img')).toBeVisible();
    await expect(preloader).toHaveCount(0, { timeout: 6000 });
  });

  test('cumple accesibilidad WCAG 2.1 AA (axe-core)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('#site-preloader')).toHaveCount(0, { timeout: 6000 });

    // Desplaza toda la página para que todas las secciones estén reveladas antes de auditar contraste
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= totalHeight; y += 700) {
      await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), y);
      await page.waitForTimeout(60);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(600);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('interacciones: menú móvil, filtros/modal de proyectos y compositor de contacto', async ({
    page,
    viewport,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('#site-preloader')).toHaveCount(0, { timeout: 5000 });

    // Menú móvil en viewports menores a 1024px
    if ((viewport?.width ?? 1280) < 1024) {
      const openBtn = page.getByRole('button', { name: /Abrir menú de navegación/i });
      await openBtn.click();
      const drawer = page.getByRole('dialog', { name: /Menú de navegación móvil/i });
      await expect(drawer).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(drawer).toBeHidden();
    }

    // Proyectos demostrativos: filtro y modal
    const projectsSection = page.locator('#proyectos');
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await expect(projectsSection.getByText('Proyecto demostrativo').first()).toBeVisible();
    await projectsSection.getByRole('button', { name: 'Web', exact: true }).click();
    await expect(projectsSection.getByText('Portal corporativo y tienda en línea')).toBeVisible();

    await projectsSection.getByRole('button', { name: /Ver detalle/i }).first().click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Verifica que la trampa de foco mantiene Tab dentro del modal
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const focusInsideModal = await page.evaluate(() =>
        Boolean(document.activeElement?.closest('[role="dialog"]')),
      );
      expect(focusInsideModal).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();

    // Contacto: seleccionar área y rellenar campos
    const contactSection = page.locator('#contacto');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await expect(page.locator('#servicios').getByText('Reparación de computadoras y laptops')).toBeAttached();
    await expect(page.locator('#servicios').getByText('Reparación y mantenimiento de impresoras')).toBeAttached();
    await expect(page.locator('#servicios').getByText('Mantenimiento, drivers y optimización')).toBeAttached();

    await contactSection.getByRole('button', { name: 'Reparación de PC y laptops' }).click();
    await contactSection.getByLabel(/Tu nombre/i).fill('Laura Méndez');
    await expect(contactSection.getByRole('button', { name: /Copiar resumen/i })).toBeEnabled();
  });

  test('metadatos SEO, JSON-LD, robots.txt, sitemap y página 404', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(/ArtMel Tech — Connecting Solutions/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /soluciones de software/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /https?:\/\//);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-default\.jpg/);

    const ldText = await page.locator('script[type="application/ld+json"]').textContent();
    const ld = JSON.parse(ldText ?? '{}');
    expect(ld['@graph']?.[0]?.['@type']).toBe('Organization');
    expect(ld['@graph']?.[0]?.address?.addressLocality).toBe('Riberalta');
    expect(ld['@graph']?.[0]?.address?.addressRegion).toBe('Beni');
    expect(ld['@graph']?.[0]?.address?.addressCountry).toBe('BO');
    expect(ld['@graph']?.[1]?.['@type']).toBe('WebSite');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('Riberalta');
    expect(bodyText).not.toMatch(/\b(ERP|CRM)\b/i);

    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap:');

    const sitemap = await request.get('/sitemap-index.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('sitemap-0.xml');

    await page.goto('/404.html');
    await expect(page.getByRole('heading', { level: 1, name: /Ruta no encontrada/i })).toBeVisible();
  });

  test('respeta prefers-reduced-motion sin ocultar contenido', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#site-preloader')).toBeHidden();
    const h1Opacity = await page.locator('h1').evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(h1Opacity)).toBeGreaterThan(0.95);
    await context.close();
  });

  test('el contenido principal es visible incluso sin JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#site-preloader')).toBeHidden();
    for (const selector of ['h1', '#nosotros h2', '#servicios h2', '#soluciones h2', '#proyectos h2', '#proceso h2', '#contacto h2']) {
      const opacity = await page.locator(selector).evaluate((el) => Number(getComputedStyle(el).opacity));
      expect(opacity, `Selector ${selector} debe ser visible sin JS`).toBeGreaterThan(0.9);
    }
    await context.close();
  });
});
