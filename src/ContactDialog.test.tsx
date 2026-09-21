import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ContactDialog from './ContactDialog';

beforeEach(() => vi.stubGlobal('location', { hostname: 'laxshmeekoomar.netlify.app' }));
afterEach(() => vi.unstubAllGlobals());
function fillForm() {
  fireEvent.change(screen.getByLabelText('Votre nom'), { target: { value: 'Camille' } });
  fireEvent.change(screen.getByLabelText('Votre adresse e-mail'), { target: { value: 'camille@example.com' } });
  fireEvent.change(screen.getByLabelText('Racontez-moi votre idée'), { target: { value: 'Une nouvelle identité pour notre atelier.' } });
}
describe('ContactDialog', () => {
  it('explique que l’aperçu local ne peut pas envoyer de messages', async () => {
    vi.stubGlobal('location', { hostname: '127.0.0.1' });
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    render(<ContactDialog onClose={vi.fn()} />); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer mon message' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('aperçu local');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('valide les champs obligatoires avant tout envoi', () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    render(<ContactDialog onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer mon message' }));
    expect(fetcher).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Votre adresse e-mail')).toBeRequired();
  });
  it('envoie au formulaire Netlify puis confirme un envoi accepté', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status: 200 }));
    vi.stubGlobal('fetch', fetcher);
    render(<ContactDialog onClose={vi.fn()} />); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer mon message' }));
    expect(await screen.findByRole('heading', { name: /Votre idée a trouvé/ })).toBeInTheDocument();
    expect(fetcher.mock.calls[0][1].body).toContain('form-name=contact');
    expect(fetcher.mock.calls[0][1].body).toContain('camille%40example.com');
  });
  it('conserve le message en cas d’échec et permet de réessayer', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(new Response('', { status: 200 }));
    vi.stubGlobal('fetch', fetcher);
    render(<ContactDialog onClose={vi.fn()} />); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer mon message' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('conservé');
    expect(screen.getByLabelText('Votre nom')).toHaveValue('Camille');
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer mon message' }));
    await screen.findByRole('heading', { name: /Votre idée a trouvé/ });
  });
  it('ne confond pas le fallback local avec une réception du message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html><script src="/@vite/client"></script></html>', { headers: { 'content-type': 'text/html' } })));
    render(<ContactDialog onClose={vi.fn()} />); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer mon message' }));
    await screen.findByRole('alert');
    expect(screen.queryByRole('heading', { name: /Votre idée a trouvé/ })).not.toBeInTheDocument();
  });
  it('empêche les doubles envois pendant la requête', async () => {
    const fetcher = vi.fn().mockReturnValue(new Promise(() => {})); vi.stubGlobal('fetch', fetcher);
    render(<ContactDialog onClose={vi.fn()} />); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer mon message' }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Envoi en cours/ })).toBeDisabled());
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('ferme avec Échap et restaure le focus et le défilement au démontage', () => {
    const opener = document.createElement('button'); document.body.append(opener); opener.focus();
    const close = vi.fn(); const prior = document.body.style.overflow;
    const view = render(<ContactDialog onClose={close} />);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(close).toHaveBeenCalledTimes(1);
    view.unmount(); expect(document.body.style.overflow).toBe(prior); expect(opener).toHaveFocus(); opener.remove();
  });
});
