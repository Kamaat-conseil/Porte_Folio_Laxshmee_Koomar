import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import WelcomeIntro, { INTRO_STORAGE_KEY } from './WelcomeIntro'

const dissolve = vi.hoisted(() => ({ start: vi.fn(), stop: vi.fn() }))
vi.mock('./logoDissolve', () => ({ startLogoDissolve: dissolve.start }))

const dialogName = 'Bienvenue dans l’univers Koomar'

function mockMotionPreference(reduced: boolean) {
  const changes = new EventTarget()
  let matches = reduced
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    get matches() { return matches && query.includes('prefers-reduced-motion') },
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: changes.addEventListener.bind(changes),
    removeEventListener: changes.removeEventListener.bind(changes),
    dispatchEvent: () => true,
  }))
  return (next: boolean) => {
    matches = next
    changes.dispatchEvent(Object.assign(new Event('change'), { matches: next }))
  }
}

describe('WelcomeIntro', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    dissolve.start.mockReset().mockReturnValue(dissolve.stop)
    dissolve.stop.mockReset()
    mockMotionPreference(false)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('présente l’introduction à la première visite puis libère le site après 8,2 secondes', () => {
    const onComplete = vi.fn()
    render(<WelcomeIntro onComplete={onComplete} />)

    expect(screen.getByRole('dialog', { name: dialogName })).toBeInTheDocument()
    expect(dissolve.start).toHaveBeenCalledTimes(1)
    expect(dissolve.start.mock.calls[0][0]).toBeInstanceOf(HTMLCanvasElement)
    act(() => vi.advanceTimersByTime(8199))
    expect(onComplete).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(INTRO_STORAGE_KEY)).not.toBeNull()
    expect(dissolve.stop).toHaveBeenCalledTimes(1)
  })

  it('permet de passer immédiatement et ne rappelle pas la fin au terme du délai', () => {
    const onComplete = vi.fn()
    render(<WelcomeIntro onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Passer l’introduction' }))

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(INTRO_STORAGE_KEY)).not.toBeNull()
    expect(dissolve.stop).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(9000))
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
    expect(dissolve.start).not.toHaveBeenCalled()
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
    act(() => vi.advanceTimersByTime(9000))

    expect(onComplete).not.toHaveBeenCalled()
    expect(document.body.style.overflow).toBe(initialOverflow)
    expect(localStorage.getItem(INTRO_STORAGE_KEY)).toBeNull()
    expect(dissolve.stop).toHaveBeenCalledTimes(1)
  })

  it('arrête l’animation et libère la page si le mouvement réduit est activé pendant la lecture', () => {
    vi.restoreAllMocks()
    const changePreference = mockMotionPreference(false)
    const onComplete = vi.fn()
    const initialOverflow = document.body.style.overflow
    render(<WelcomeIntro onComplete={onComplete} />)
    expect(dissolve.start).toHaveBeenCalledTimes(1)

    act(() => changePreference(true))

    expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe(initialOverflow)
    expect(dissolve.stop).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(9000))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
