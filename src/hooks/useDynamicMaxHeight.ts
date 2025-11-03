import { useEffect, useRef, useState } from 'react'

interface UseDynamicMaxHeightOptions {
  minHeight?: number
  bottomPadding?: number
  throttleMs?: number
  debounceMs?: number
  heightChangeThreshold?: number
  disabled?: boolean // Disable height calculations (e.g., on mobile)
}

/**
 * Custom hook to dynamically calculate max height for sticky positioned elements
 * Optimized with throttling, ResizeObserver, and RAF for smooth performance
 *
 * Uses enhanced CSS-based transitions for smooth height changes:
 * - On mount: No transition (prevents flash)
 * - During scroll: Reduced transition for responsiveness
 * - After scroll ends: Smooth transition with will-change optimization
 * - On resize: Smooth transition
 *
 * Key improvements:
 * - Uses will-change: max-height for GPU acceleration
 * - Applies transition class after DOM update completes (via setTimeout)
 * - Uses cubic-bezier for more natural easing
 * - Properly manages transition states
 *
 * @param options Configuration options
 * @returns containerRef to attach to element, calculated maxHeight, and isScrolling state
 */
export function useDynamicMaxHeight<T extends HTMLElement = HTMLDivElement>(options: UseDynamicMaxHeightOptions = {}) {
  const {
    minHeight = 300,
    bottomPadding = 32,
    throttleMs = 100,
    debounceMs = 200,
    heightChangeThreshold = 10,
    disabled = false,
  } = options

  const containerRef = useRef<T>(null)
  const [maxHeight, setMaxHeight] = useState<number>(0)
  const [isScrolling, setIsScrolling] = useState<boolean>(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef<boolean>(false)

  useEffect(() => {
    // Skip all calculations if disabled (e.g., on mobile)
    if (disabled) {
      return
    }
    const calculateHeight = (forceNoTransition = false) => {
      if (!containerRef.current) return

      requestAnimationFrame(() => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const availableHeight = viewportHeight - rect.top - bottomPadding
        const newHeight = availableHeight > minHeight ? availableHeight : minHeight

        setMaxHeight((prevHeight) => {
          const roundedNew = Math.round(newHeight)
          const roundedPrev = Math.round(prevHeight)
          const heightDiff = Math.abs(roundedNew - roundedPrev)

          // Only update if height change is significant (reduces jank from tiny changes)
          if (heightDiff >= heightChangeThreshold) {
            // Use CSS class toggling with proper timing
            const element = containerRef.current
            if (element) {
              if (forceNoTransition || !isMountedRef.current) {
                // Disable transition immediately
                element.classList.add('no-transition')
                // Re-enable after next paint
                if (transitionTimeoutRef.current) {
                  clearTimeout(transitionTimeoutRef.current)
                }
                // Capture element reference to avoid accessing potentially null ref after unmount
                transitionTimeoutRef.current = setTimeout(() => {
                  element.classList.remove('no-transition')
                }, 50)
              }
            }
            return roundedNew
          }

          return prevHeight
        })
      })
    }

    // Initial calculation - no transition on mount
    calculateHeight(true)
    // Mark as mounted after first calculation to enable future transitions
    setTimeout(() => {
      isMountedRef.current = true
    }, 100)

    // Observe element size changes
    const resizeObserver = new ResizeObserver(() => {
      // Resize should have smooth transitions
      calculateHeight(false)
    })
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Scroll handler with throttling and scroll-end detection
    const scrollHandler = () => {
      // Mark as scrolling
      setIsScrolling(true)

      // Clear existing timeouts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current)
      }

      // Throttled height calculation during scroll
      scrollTimeoutRef.current = setTimeout(() => {
        calculateHeight(false)
      }, throttleMs)

      // Detect scroll end after debounce delay
      scrollEndTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
        // Final smooth adjustment with transition after scroll ends
        calculateHeight(false)
      }, debounceMs)
    }

    window.addEventListener('scroll', scrollHandler, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scrollHandler)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [minHeight, bottomPadding, throttleMs, debounceMs, heightChangeThreshold, disabled])

  return { containerRef, maxHeight, isScrolling }
}
