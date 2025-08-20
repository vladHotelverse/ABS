/**
 * Haptic feedback utilities for mobile devices
 * Provides tactile feedback for user interactions
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notification'

/**
 * Trigger haptic feedback if available on the device
 */
export const triggerHaptic = (type: HapticType = 'light') => {
  // Check if we're on a mobile device and haptics are supported
  if (!window.navigator || typeof window.navigator.vibrate !== 'function') {
    return
  }

  // Map haptic types to vibration patterns
  const vibrationPatterns: Record<HapticType, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 50,
    selection: 10,
    impactLight: 15,
    impactMedium: 30,
    impactHeavy: 60,
    notification: [50, 50, 50]
  }

  const pattern = vibrationPatterns[type]
  
  try {
    window.navigator.vibrate(pattern)
  } catch (error) {
    // Silently fail if vibration is not supported
    console.debug('Haptic feedback not supported:', error)
  }
}

/**
 * Enhanced haptic feedback for modern devices with Vibration API support
 */
export const triggerEnhancedHaptic = (type: HapticType = 'light') => {
  // Try modern haptic feedback first (iOS Safari, some Android browsers)
  if ('ontouchstart' in window && 'haptic' in window.navigator) {
    try {
      // @ts-ignore - haptic API is not widely standardized yet
      window.navigator.haptic?.notification?.(type)
      return
    } catch (error) {
      // Fall back to basic vibration
    }
  }

  // Fall back to basic vibration
  triggerHaptic(type)
}

/**
 * Utility to add haptic feedback to button clicks
 */
export const withHapticFeedback = <T extends (...args: any[]) => any>(
  callback: T,
  hapticType: HapticType = 'light'
): T => {
  return ((...args: Parameters<T>) => {
    triggerEnhancedHaptic(hapticType)
    return callback(...args)
  }) as T
}

/**
 * React hook for easy haptic feedback integration
 */
export const useHapticFeedback = () => {
  return {
    light: () => triggerEnhancedHaptic('light'),
    medium: () => triggerEnhancedHaptic('medium'),
    heavy: () => triggerEnhancedHaptic('heavy'),
    selection: () => triggerEnhancedHaptic('selection'),
    impact: (intensity: 'light' | 'medium' | 'heavy' = 'medium') => 
      triggerEnhancedHaptic(`impact${intensity.charAt(0).toUpperCase() + intensity.slice(1)}` as HapticType),
    notification: () => triggerEnhancedHaptic('notification'),
    trigger: triggerEnhancedHaptic,
    withFeedback: withHapticFeedback
  }
}