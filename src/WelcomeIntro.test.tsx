import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import WelcomeIntro, { INTRO_STORAGE_KEY } from './WelcomeIntro'

const dialogName = 'Bienvenue dans l’univers Koomar'

function mockMotionPreference(reduced: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: reduced && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: () => true,
  }))
}

describe('WelcomeIntro', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    mockMotionPreference(false)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('présente l’introduction à la première visite puis libère le site après 3,6 secondes', () => {
    const onComplete = vi.fn()
    render(<WelcomeIntro onComplete={onComplete} />)

    expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3599))
    expect(onComplete).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(INTRO_STORAGE_KEY)).not.toBeNull()
  })

  it('permet de passer immédiatement et ne rappelle pas la fin au terme du délai', () => {
    const onComplete = vi.fn()
    render(<WelcomeIntro onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Passer l’introduction' }))

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(INTRO_STORAGE_KEY)).not.toBeNull()
    act(() => vi.advanceTimersByTime(5000))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('ne rejoue pas l’introduction après une première visite terminée', () => {
    const firstVisit = render(<WelcomeIntro onComplete={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Passer l’introduction' }))
    firstVisit.unmount()
    const onComplete = vi.fn()
    render(<WelcomeIntro onComplete={onComplete} />)

    expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('reste utilisable lorsque le navigateur refuse le stockage local', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable', 'SecurityError')
    })
    const onComplete = vi.fn()
    render(<WelcomeIntro onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Passer l’introduction' }))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('permet de revoir volontairement l’introduction après une visite', () => {
    localStorage.setItem(INTRO_STORAGE_KEY, 'seen')
    render(<WelcomeIntro force onComplete={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument()
  })

  it('respecte la préférence de mouvement réduit et laisse accéder immédiatement au site', () => {
    vi.restoreAllMocks()
    mockMotionPreference(true)
    const onComplete = vi.fn()
    render(<WelcomeIntro onComplete={onComplete} />)

    expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('permet de fermer avec Échap et rétablit le défilement de la page', () => {
    const onComplete = vi.fn()
    const initialOverflow = document.body.style.overflow
    render(<WelcomeIntro onComplete={onComplete} />)
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent(screen.getByRole('dialog', { name: dialogName }), new Event('cancel'))

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(document.body.style.overflow).toBe(initialOverflow)
    expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
  })

  it('annule le délai et rétablit le défilement si le composant est démonté', () => {
    const onComplete = vi.fn()
    const initialOverflow = document.body.style.overflow
    const introduction = render(<WelcomeIntro onComplete={onComplete} />)
    introduction.unmount()
    act(() => vi.advanceTimersByTime(5000))

    expect(onComplete).not.toHaveBeenCalled()
    expect(document.body.style.overflow).toBe(initialOverflow)
    expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBeNull()
  })
})
