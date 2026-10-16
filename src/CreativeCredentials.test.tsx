import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import CreativeCredentials from './CreativeCredentials';

it('permet de consulter le CV et télécharger son original', () => {
  render(<CreativeCredentials />);
  fireEvent.click(screen.getByRole('button', { name: /Consulter mon CV/ }));
  let dialog = screen.getByRole('dialog');
  expect(within(dialog).getAllByRole('img')).toHaveLength(1);
  expect(within(dialog).getByRole('link', { name: /Télécharger/ })).toHaveAttribute('href', '/documents/laxshmee-koomar-cv.pdf');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Fermer le document' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /certification/i })).not.toBeInTheDocument();
});
