import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageSelector } from '../LanguageSelector'

describe('LanguageSelector Component', () => {
  const mockOnLanguageChange = vi.fn()

  beforeEach(() => {
    mockOnLanguageChange.mockClear()
  })

  it('should render with current language selected', () => {
    render(
      <LanguageSelector 
        currentLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    expect(screen.getByRole('button')).toHaveTextContent('🇺🇸')
    expect(screen.getByRole('button')).toHaveTextContent('English')
  })

  it('should display Spanish when es is selected', () => {
    render(
      <LanguageSelector 
        currentLanguage="es" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    expect(screen.getByRole('button')).toHaveTextContent('🇪🇸')
    expect(screen.getByRole('button')).toHaveTextContent('Español')
  })

  it('should default to English for invalid language codes', () => {
    render(
      <LanguageSelector 
        currentLanguage="invalid" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    expect(screen.getByRole('button')).toHaveTextContent('🇺🇸')
    expect(screen.getByRole('button')).toHaveTextContent('English')
  })

  it('should open dropdown menu when clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <LanguageSelector 
        currentLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    await user.click(screen.getByRole('button'))
    
    // Should show both language options in dropdown (there will be duplicates - one in button, one in dropdown)
    expect(screen.getAllByText('English')).toHaveLength(2)
    expect(screen.getByText('Español')).toBeInTheDocument()
  })

  it('should call onLanguageChange when language is selected', async () => {
    const user = userEvent.setup()
    
    render(
      <LanguageSelector 
        currentLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    // Open dropdown
    await user.click(screen.getByRole('button'))
    
    // Click on Spanish option
    const spanishOption = screen.getByRole('menuitem', { name: /español/i })
    await user.click(spanishOption)
    
    expect(mockOnLanguageChange).toHaveBeenCalledWith('es')
  })

  it('should show checkmark for currently selected language', async () => {
    const user = userEvent.setup()
    
    render(
      <LanguageSelector 
        currentLanguage="es" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    await user.click(screen.getByRole('button'))
    
    // Spanish should have a checkmark
    const spanishOption = screen.getByRole('menuitem', { name: /español/i })
    expect(spanishOption).toHaveTextContent('✓')
  })

  it('should have proper accessibility attributes', () => {
    render(
      <LanguageSelector 
        currentLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('should contain globe icon', () => {
    render(
      <LanguageSelector 
        currentLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    // Globe icon should be present (from lucide-react)
    const button = screen.getByRole('button')
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('should maintain cursor pointer on dropdown items', async () => {
    const user = userEvent.setup()
    
    render(
      <LanguageSelector 
        currentLanguage="en" 
        onLanguageChange={mockOnLanguageChange} 
      />
    )

    await user.click(screen.getByRole('button'))
    
    const englishOption = screen.getByRole('menuitem', { name: /english/i })
    expect(englishOption).toHaveClass('cursor-pointer')
  })
})