import { act, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import ContactReveal from './ContactReveal';
const state = vi.hoisted(() => ({ reduced: false, stop: vi.fn() }));
vi.mock('./logoDissolve', () => ({ startLogoDissolve: () => state.stop }));
vi.mock('framer-motion', async original => ({
  ...await original<typeof import('framer-motion')>(),
  useReducedMotion: () => state.reduced,
}));
afterEach(() => { vi.useRealTimers(); state.reduced = false; state.stop.mockClear(); });
it('libère la couche GPU après la révélation', () => {
  vi.useFakeTimers();
  const view = render(<ContactReveal />);
  expect(view.container.querySelector('canvas')).not.toBeNull();
  act(() => { vi.advanceTimersByTime(3100); });
  expect(view.container.querySelector('canvas')).toBeNull();
  expect(state.stop).toHaveBeenCalled();
});
it('libère l’animation si le formulaire est fermé immédiatement', () => {
  const view = render(<ContactReveal />);
  view.unmount();
  expect(state.stop).toHaveBeenCalled();
});
it('respecte la préférence de réduction des mouvements', () => {
  state.reduced = true;
  const view = render(<ContactReveal />);
  expect(view.container).toBeEmptyDOMElement();
});
