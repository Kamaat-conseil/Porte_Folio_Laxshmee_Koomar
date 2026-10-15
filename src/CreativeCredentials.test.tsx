import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import CreativeCredentials from './CreativeCredentials';

it('permet de consulter les deux documents et télécharger les originaux', () => {
  render(<CreativeCredentials />);
  fireEvent.click(screen.getByRole('button', { name: /Consulter mon CV/ }));
  let dialog = screen.getByRole('dialog');
  expect(within(dialog).getAllByRole('img')).toHaveLength(1);
  expect(within(dialog).getByRole('link', { name: /Télécharger/ })).toHaveAttribute('href', '/documents/laxshmee-koomar-cv.pdf');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Fermer le document' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Voir ma certification/ }));
  dialog = screen.getByRole('dialog');
  expect(within(dialog).getAllByRole('img')).toHaveLength(2);
  expect(within(dialog).getByRole('link', { name: /Télécharger/ })).toHaveAttribute('download');
  fireEvent(dialog, new Event('cancel'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
