import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsGallery, type SerializedProject } from '@/components/react/ProjectsGallery';

const sampleItems: SerializedProject[] = [
  {
    id: 'p1',
    title: 'Plataforma logística',
    category: 'software',
    categoryLabel: 'Desarrollo de software',
    summary: 'Resumen de software.',
    challenge: 'Desafío 1',
    solution: 'Solución 1',
    stack: ['Arquitectura modular'],
    imageAlt: 'Alt 1',
    image: {
      avifSrcSet: '/a.avif 800w',
      webpSrcSet: '/a.webp 800w',
      fallbackSrc: '/a.webp',
      width: 800,
      height: 500,
    },
  },
  {
    id: 'p2',
    title: 'Portal web',
    category: 'web',
    categoryLabel: 'Desarrollo web',
    summary: 'Resumen web.',
    challenge: 'Desafío 2',
    solution: 'Solución 2',
    stack: ['SEO técnico'],
    imageAlt: 'Alt 2',
    image: {
      avifSrcSet: '/b.avif 800w',
      webpSrcSet: '/b.webp 800w',
      fallbackSrc: '/b.webp',
      width: 800,
      height: 500,
    },
  },
];

describe('ProjectsGallery', () => {
  it('identifica cada proyecto como demostrativo y permite filtrar por categoría', async () => {
    const user = userEvent.setup();
    render(<ProjectsGallery items={sampleItems} />);

    expect(screen.getAllByText('Proyecto demostrativo')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Web' }));
    expect(screen.getByText('Portal web')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Plataforma logística')).not.toBeInTheDocument();
    });
  });

  it('abre y cierra el modal de detalle con teclado (Escape)', async () => {
    const user = userEvent.setup();
    render(<ProjectsGallery items={sampleItems} />);

    const triggers = screen.getAllByRole('button', { name: /Ver detalle/i });
    const firstTrigger = triggers[0];
    if (!firstTrigger) throw new Error('Expected detail trigger');

    await user.click(firstTrigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Desafío 1')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
