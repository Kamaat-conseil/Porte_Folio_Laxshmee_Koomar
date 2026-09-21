import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Expertise from './Expertise'

vi.mock('framer-motion', async (original) => ({
  ...await original<typeof import('framer-motion')>(),
  useReducedMotion: () => true,
}))

describe('Expertises', () => {
  it('ouvre et referme une expertise avec une région nommée et une étoile décorative', async () => {
    render(<Expertise />)
    const trigger = screen.getByRole('button', { name: /Direction artistique/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: /Direction artistique/ })).toHaveAttribute('id', trigger.getAttribute('aria-controls'))
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(screen.queryByRole('region')).not.toBeInTheDocument())
  })

  it('conserve une seule expertise ouverte', async () => {
    render(<Expertise />)
    fireEvent.click(screen.getByRole('button', { name: /Direction artistique/ }))
    fireEvent.click(screen.getByRole('button', { name: /Identité visuelle/ }))
    expect(screen.getByRole('button', { name: /Direction artistique/ })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: /Identité visuelle/ })).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(screen.getAllByRole('region')).toHaveLength(1))
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })
})
