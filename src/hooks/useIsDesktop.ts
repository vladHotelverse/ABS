'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook to detect if the current viewport is desktop-sized
 * @param breakpoint - The minimum width in pixels to consider as desktop (default: 768px)
 * @returns boolean indicating if the viewport is desktop-sized
 *
 * @example
 * ```tsx
 * const isDesktop = useIsDesktop()
 * const isLargeDesktop = useIsDesktop(1024)
 * ```
 */
export const useIsDesktop = (breakpoint = 768): boolean => {
  const [isDesktop, setIsDesktop] = useState(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') return true
    return window.innerWidth >= breakpoint
  })

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= breakpoint)
    }

    // Check on mount in case initial state was incorrect
    checkIsDesktop()

    // Listen for resize events
    window.addEventListener('resize', checkIsDesktop)

    return () => {
      window.removeEventListener('resize', checkIsDesktop)
    }
  }, [breakpoint])

  return isDesktop
}
