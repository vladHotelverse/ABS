import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PriceChangeIndicator from '../PriceChangeIndicator'

describe('PriceChangeIndicator', () => {
  const defaultProps = {
    euroSuffix: '€',
  }

  describe('Positive Prices', () => {
    it('should display positive price with + prefix', () => {
      render(<PriceChangeIndicator price={50} {...defaultProps} />)
      expect(screen.getByText('+€50.00')).toBeInTheDocument()
    })

    it('should handle decimal prices', () => {
      render(<PriceChangeIndicator price={25.99} {...defaultProps} />)
      expect(screen.getByText('+€25.99')).toBeInTheDocument()
    })

    it('should handle zero price', () => {
      render(<PriceChangeIndicator price={0} {...defaultProps} />)
      expect(screen.getByText('+€0.00')).toBeInTheDocument()
    })
  })

  describe('Negative Prices', () => {
    it('should display negative price correctly without double minus', () => {
      render(<PriceChangeIndicator price={-50} {...defaultProps} />)
      // Should show "-€50.00" not "+-€50.00"
      expect(screen.getByText('-€50.00')).toBeInTheDocument()
    })

    it('should handle negative decimal prices', () => {
      render(<PriceChangeIndicator price={-25.99} {...defaultProps} />)
      expect(screen.getByText('-€25.99')).toBeInTheDocument()
    })

    it('should handle large negative prices', () => {
      render(<PriceChangeIndicator price={-107.99} {...defaultProps} />)
      expect(screen.getByText('-€107.99')).toBeInTheDocument()
    })
  })

  describe('International Currency', () => {
    it('should handle USD currency with locale', () => {
      render(
        <PriceChangeIndicator 
          price={100} 
          currency="USD" 
          locale="en-US" 
          euroSuffix="€" 
        />
      )
      expect(screen.getByText('+$100.00')).toBeInTheDocument()
    })

    it('should handle negative USD currency', () => {
      render(
        <PriceChangeIndicator 
          price={-75} 
          currency="USD" 
          locale="en-US" 
          euroSuffix="€" 
        />
      )
      expect(screen.getByText('-$75.00')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very small positive prices', () => {
      render(<PriceChangeIndicator price={0.01} {...defaultProps} />)
      expect(screen.getByText('+€0.01')).toBeInTheDocument()
    })

    it('should handle very small negative prices', () => {
      render(<PriceChangeIndicator price={-0.01} {...defaultProps} />)
      expect(screen.getByText('-€0.01')).toBeInTheDocument()
    })
  })
})