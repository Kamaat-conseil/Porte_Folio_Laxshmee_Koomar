import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SignatureLink from './SignatureLink'

const preference = vi.hoisted(() => ({ reduced: false }))
vi.mock('framer-motion', async (importOriginal) => ({
  ...await importOriginal<typeof import('framer-motion')>(),
  useReducedMotion: () => preference.reduced,
}))

describe('SignatureLink', () => {
  it('garde un seul nom accessible malgré les calques visuels animés', () => {
    render(<SignatureLink href="#apropos">Faisons connaissance</SignatureLink>)

    const link = screen.getByRole('link', { name: 'Faisons connaissance', exact: true })
    expect(link).toHaveAccessibleName('Faisons connaissance')
    expect(link).toHaveAttribute('href', '#apropos')
  })

  it.each([false, true])('reste accessible au clavier et conserve le lien mail avec mouvement réduit : %s', async (reduced) => {
    preference.reduced = reduced
    const user = userEvent.setup()
    const href = 'mailto:kmrdesign2637@outlook.com?subject=Parlons%20de%20mon%20projet'
    render(<SignatureLink href={href}>Parlons de votre projet</SignatureLink>)
    const link = screen.getByRole('link', { name: 'Parlons de votre projet', exact: true })

    await user.tab()
    expect(link).toHaveFocus()
    fireEvent.pointerMove(link, { clientX: 24, clientY: 12, pointerType: 'mouse' })
    fireEvent.pointerLeave(link)
    expect(link).toHaveAttribute('href', href)
    expect(link).toHaveAccessibleName('Parlons de votre projet')

    await user.tab()
    expect(link).not.toHaveFocus()
    expect(link).toHaveAttribute('href', href)
  })
})
