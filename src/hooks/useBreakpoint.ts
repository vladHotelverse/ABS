'use client'

import { useEffect, useState } from 'react'

export type Breakpoint = 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Tailwind-compatible breakpoint values (min-width)
 */
export const BREAKPOINTS = {
  mobile: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/**
 * Custom hook to detect the current responsive breakpoint
 * @returns The current active breakpoint
 *
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint()
 * const itemsToShow = breakpoint === '2xl' ? 3 : breakpoint === 'sm' ? 2 : 1
 * ```
 */
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') return 'lg'
    return getCurrentBreakpoint()
  })

  useEffect(() => {
    const checkBreakpoint = () => {
      setBreakpoint(getCurrentBreakpoint())
    }

    // Check on mount in case initial state was incorrect
    checkBreakpoint()

    // Listen for resize events
    window.addEventListener('resize', checkBreakpoint)

    return () => {
      window.removeEventListener('resize', checkBreakpoint)
    }
  }, [])

  return breakpoint
}

/**
 * Helper function to determine current breakpoint based on window width
 */
function getCurrentBreakpoint(): Breakpoint {
  const width = window.innerWidth

  if (width >= BREAKPOINTS['2xl']) return '2xl'
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'mobile'
}
