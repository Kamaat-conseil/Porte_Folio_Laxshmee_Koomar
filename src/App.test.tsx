import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
vi.mock('./logoDissolve', () => ({ startLogoDissolve: () => () => {} }))

const motionPreference = vi.hoisted(() => ({ reduced: true }))
vi.mock('framer-motion', async (importOriginal) => ({
  ...await importOriginal<typeof import('framer-motion')>(),
  useReducedMotion: () => motionPreference.reduced,
}))

describe('Portfolio de Laxshmee Koomar', () => {
  it.each([true, false])('présente les sections essentielles avec mouvement réduit : %s', (reduced) => {
    motionPreference.reduced = reduced
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: /Laxshmee\s*Koomar/i })).toBeInTheDocument()
    const destinations = [
      [/^Projets(?:\s*\(03\))?$/, '#projets'],
      [/^À propos$/, '#apropos'],
    ] as const

    destinations.forEach(([name, href]) => {
      const links = screen.getAllByRole('link', { name, exact: true })
      expect(links.length).toBeGreaterThan(0)
      links.forEach((link) => expect(link).toHaveAttribute('href', href))
      expect(document.querySelector(href)).toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: /Et si on créait la suite\s*\?/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Contact', exact: true })).toBeInTheDocument()
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
  })

  it('ouvre le formulaire depuis le bouton de contact', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Contact', exact: true }))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('textbox', { name: /mail/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Fermer le formulaire' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('revient au projet après une prise de contact sans perdre le verrouillage du défilement', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Découvrir Unik Locks' }))
    fireEvent.click(screen.getByRole('button', { name: 'Imaginons votre univers' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fermer le formulaire' }))
    await waitFor(() => expect(within(screen.getByRole('dialog')).getByRole('heading', { name: 'Unik Locks', exact: true })).toBeVisible())
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(screen.getByRole('button', { name: 'Revenir aux projets' }))
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it.each(['Unik Locks', 'Maëva Hubert'])('permet de consulter puis fermer le projet %s', async (project) => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: `Découvrir ${project}` }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeVisible()
    await waitFor(() => expect(within(dialog).getByRole('heading', { name: project, exact: true })).toBeVisible())

    fireEvent.click(within(dialog).getByRole('button', { name: 'Fermer le projet' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('présente Bertine avec ses sept visuels et actualise le nombre de projets', async () => {
    render(<App />)

    expect(screen.getByRole('link', { name: /^Projets\s*\(03\)$/ })).toHaveAttribute('href', '#projets')
    fireEvent.click(screen.getByRole('button', { name: 'Découvrir Pâtisserie Bertine' }))

    const dialog = screen.getByRole('dialog')
    await waitFor(() => expect(within(dialog).getByRole('heading', { name: 'Pâtisserie Bertine', exact: true })).toBeVisible())
    const images = within(dialog).getAllByRole('img')
    expect(images).toHaveLength(7)
    images.forEach((image) => {
      expect(image.getAttribute('alt')).toMatch(/^Pâtisserie Bertine — .+/)
      expect(image.getAttribute('alt')).not.toContain('undefined')
    })

    fireEvent.click(within(dialog).getByRole('button', { name: 'Fermer le projet' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
