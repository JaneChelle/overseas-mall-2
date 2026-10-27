// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
  window.matchMedia = vi.fn().mockReturnValue({ matches: false })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('variant selection and purchase', () => {
  it('preserves the card color when opening product details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Forest Arc table lamp' }))
    await user.click(screen.getByRole('button', { name: 'View Arc table lamp' }))
    const dialog = screen.getByRole('dialog', { name: 'Arc table lamp' })
    expect(within(dialog).getByRole('button', { name: 'Select Forest' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('dismisses details on add so the confirmation and bag action remain accessible', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'View Arc table lamp' }))
    await user.click(screen.getByRole('button', { name: 'Add to bag' }))
    expect(screen.queryByRole('dialog', { name: 'Arc table lamp' })).toBeNull()
    expect(document.body.style.pointerEvents).not.toBe('none')
    await user.click(screen.getByRole('button', { name: 'View bag' }))
    const bag = screen.getByRole('dialog', { name: 'Your shopping bag' })
    expect(within(bag).getByText('Arc table lamp')).toBeTruthy()
    expect(within(bag).getByText('$74.95')).toBeTruthy()
  })
})

describe('reduced motion', () => {
  it('uses instant scrolling for category navigation when motion is reduced', async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    const user = userEvent.setup()
    render(<App />)
    await user.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', { name: 'Home & living' }))
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' })
  })

  it('uses instant scrolling for brand navigation when motion is reduced', async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Form and Field home' }))
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'instant' })
  })
})
