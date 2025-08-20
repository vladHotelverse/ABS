import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'

// Test providers wrapper (simplified for initial setup)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="test-environment">{children}</div>
  )
}

// Custom render function with all providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
export { customRender as render }