import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactComposer, formatInquirySummary } from '@/components/react/ContactComposer';

describe('ContactComposer', () => {
  it('formatea un resumen estructurado con los datos ingresados', () => {
    const text = formatInquirySummary({
      name: 'Andrea',
      company: 'Norte Logística',
      topic: 'Automatización',
      message: 'Queremos integrar facturación.',
      fallbackGreeting: 'Hola.',
    });
    expect(text).toContain('Soy Andrea (Norte Logística).');
    expect(text).toContain('Área de interés: Automatización.');
    expect(text).toContain('Detalle de la consulta: Queremos integrar facturación.');
  });

  it('permite seleccionar servicios de reparación y mantenimiento para enviar por WhatsApp', async () => {
    const user = userEvent.setup();
    render(
      <ContactComposer
        whatsapp="59175118634"
        email="artmeltech@gmail.com"
        defaultMessage="Hola."
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Reparación de PC y laptops' }));
    const waLink = screen.getByRole('link', { name: /Enviar.*WhatsApp/i });

    expect(waLink.getAttribute('href')).toContain('https://wa.me/59175118634?text=');
    expect(waLink.getAttribute('href')).toContain('Reparaci%C3%B3n%20de%20PC%20y%20laptops');
  });

  it('mantiene deshabilitados WhatsApp y Correo cuando no hay datos configurados', () => {
    render(<ContactComposer whatsapp="" email="" defaultMessage="Hola." />);
    expect(screen.getByRole('button', { name: /WhatsApp \(configurable\)/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Correo \(configurable\)/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Copiar resumen/i })).toBeEnabled();
  });

  it('genera enlaces dinámicos de WhatsApp y correo cuando los canales están configurados', async () => {
    const user = userEvent.setup();
    render(
      <ContactComposer
        whatsapp="+54 9 11 5555-1234"
        email="contacto@artmeltech.example"
        defaultMessage="Hola."
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Desarrollo web' }));
    await user.type(screen.getByLabelText(/Tu nombre/i), 'Carlos');

    const waLink = screen.getByRole('link', { name: /Enviar.*WhatsApp/i });
    const mailLink = screen.getByRole('link', { name: /Enviar por correo/i });

    expect(waLink.getAttribute('href')).toContain('https://wa.me/5491155551234?text=');
    expect(waLink.getAttribute('href')).toContain('Carlos');
    expect(waLink.getAttribute('href')).toContain('Desarrollo%20web');
    expect(mailLink.getAttribute('href')).toContain('mailto:contacto@artmeltech.example?');
  });
});
