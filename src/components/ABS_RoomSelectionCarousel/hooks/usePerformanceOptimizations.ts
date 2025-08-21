import { useCallback, useMemo, useRef } from 'react'
import type { RoomOption } from '../types'

/**
 * Performance optimization constants
 */
const DEBOUNCE_DELAY = 16 // One frame at 60fps for smooth animations

/**
 * Advanced JavaScript performance optimizations for RoomSelectionCarousel
 */
export interface UsePerformanceOptimizationsOptions {
  debounceDelay?: number
}

export interface UsePerformanceOptimizationsReturn {
  // Memoization utilities
  memoizeByRoomId: <T>(fn: (room: RoomOption) => T) => (room: RoomOption) => T
  
  // Debouncing utilities
  debounce: <T extends (...args: any[]) => void>(fn: T, delay?: number) => T
  
  // Async utilities
  createAsyncQueue: <T>() => {
    enqueue: (task: () => Promise<T>) => Promise<T>
    clear: () => void
  }
  
  // Memory management
  createWeakCache: <K extends object, V>() => {
    get: (key: K) => V | undefined
    set: (key: K, value: V) => void
    has: (key: K) => boolean
  }
  
  // Function composition utilities
  pipe: <T>(...fns: Array<(arg: T) => T>) => (value: T) => T
  compose: <T>(...fns: Array<(arg: T) => T>) => (value: T) => T
  
  // Array optimization utilities
  fastFilter: <T>(array: T[], predicate: (item: T, index: number) => boolean) => T[]
  createPartialSort: <T>(compareFn: (a: T, b: T) => number) => (array: T[], k: number) => T[]
}

export const usePerformanceOptimizations = ({
  debounceDelay = DEBOUNCE_DELAY
}: UsePerformanceOptimizationsOptions = {}): UsePerformanceOptimizationsReturn => {
  
  // Memoization by room ID using WeakMap for automatic garbage collection
  const memoizeByRoomId = useCallback(<T>(fn: (room: RoomOption) => T) => {
    const cache = new WeakMap<RoomOption, T>()
    return (room: RoomOption): T => {
      if (cache.has(room)) {
        return cache.get(room)!
      }
      const result = fn(room)
      cache.set(room, result)
      return result
    }
  }, [])
  
  // Advanced debouncing with requestAnimationFrame for smooth performance
  const debounce = useCallback(<T extends (...args: any[]) => void>(
    fn: T, 
    delay: number = debounceDelay
  ): T => {
    let timeoutId: NodeJS.Timeout | null = null
    let rafId: number | null = null
    
    return ((...args: Parameters<T>) => {
      // Clear existing timeout and RAF
      if (timeoutId) clearTimeout(timeoutId)
      if (rafId) cancelAnimationFrame(rafId)
      
      if (delay <= 16) {
        // Use RAF for frame-based debouncing (better for animations)
        rafId = requestAnimationFrame(() => fn(...args))
      } else {
        // Use timeout for longer delays
        timeoutId = setTimeout(() => fn(...args), delay)
      }
    }) as T
  }, [debounceDelay])
  
  // Async task queue for managing sequential operations
  const createAsyncQueue = useCallback(<T>() => {
    let queue: Array<() => Promise<T>> = []
    let processing = false
    
    const processQueue = async (): Promise<void> => {
      if (processing || queue.length === 0) return
      
      processing = true
      try {
        while (queue.length > 0) {
          const task = queue.shift()!
          await task()
        }
      } finally {
        processing = false
      }
    }
    
    return {
      enqueue: (task: () => Promise<T>): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
          const wrappedTask = async (): Promise<T> => {
            try {
              const result = await task()
              resolve(result)
              return result
            } catch (error) {
              reject(error)
              throw error
            }
          }
          queue.push(wrappedTask)
          void processQueue() // Use void to indicate intentional fire-and-forget
        })
      },
      clear: () => {
        queue = []
      }
    }
  }, [])
  
  // WeakMap-based cache for automatic garbage collection
  const createWeakCache = useCallback(<K extends object, V>() => {
    const cache = new WeakMap<K, V>()
    
    return {
      get: (key: K): V | undefined => cache.get(key),
      set: (key: K, value: V): void => { cache.set(key, value) },
      has: (key: K): boolean => cache.has(key)
    }
  }, [])
  
  // Function composition utilities for better code organization
  const pipe = useCallback(<T>(...fns: Array<(arg: T) => T>) => {
    return (value: T): T => fns.reduce((acc, fn) => fn(acc), value)
  }, [])
  
  const compose = useCallback(<T>(...fns: Array<(arg: T) => T>) => {
    return (value: T): T => fns.reduceRight((acc, fn) => fn(acc), value)
  }, [])
  
  // Optimized array filtering using for-loop instead of Array.prototype.filter
  const fastFilter = useCallback(<T>(
    array: T[], 
    predicate: (item: T, index: number) => boolean
  ): T[] => {
    const result: T[] = []
    const length = array.length
    
    for (let i = 0; i < length; i++) {
      if (predicate(array[i], i)) {
        result.push(array[i])
      }
    }
    
    return result
  }, [])
  
  // Partial sorting implementation for finding top-k elements efficiently
  const createPartialSort = useCallback(<T>(compareFn: (a: T, b: T) => number) => {
    return (array: T[], k: number): T[] => {
      if (k >= array.length) {
        return [...array].sort(compareFn)
      }
      
      // Use quickselect-inspired approach for better performance
      const result = array.slice(0, k)
      result.sort(compareFn)
      
      for (let i = k; i < array.length; i++) {
        const current = array[i]
        const worstInTop = result[k - 1]
        
        if (compareFn(current, worstInTop) < 0) {
          result[k - 1] = current
          // Insert current in correct position
          let j = k - 2
          while (j >= 0 && compareFn(result[j], current) > 0) {
            result[j + 1] = result[j]
            j--
          }
          result[j + 1] = current
        }
      }
      
      return result
    }
  }, [])
  
  return {
    memoizeByRoomId,
    debounce,
    createAsyncQueue,
    createWeakCache,
    pipe,
    compose,
    fastFilter,
    createPartialSort,
  }
}

/**
 * Utility for creating memoized selectors with dependency tracking
 */
export const createMemoizedSelector = <TInput, TOutput>(
  selector: (input: TInput) => TOutput,
  isEqual: (a: TInput, b: TInput) => boolean = Object.is
) => {
  let lastInput: TInput
  let lastOutput: TOutput
  let hasCache = false
  
  return (input: TInput): TOutput => {
    if (!hasCache || !isEqual(input, lastInput)) {
      lastInput = input
      lastOutput = selector(input)
      hasCache = true
    }
    return lastOutput
  }
}

/**
 * Advanced shallow equality check optimized for React props
 */
export const shallowEqual = <T extends Record<string, any>>(a: T, b: T): boolean => {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  
  if (aKeys.length !== bKeys.length) {
    return false
  }
  
  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i]
    if (!Object.prototype.hasOwnProperty.call(b, key) || !Object.is(a[key], b[key])) {
      return false
    }
  }
  
  return true
}

/**
 * Create a stable reference for callback arrays
 */
export const useStableCallbacks = <T extends (...args: any[]) => any>(
  callbacks: T[]
): T[] => {
  const stableRef = useRef<T[]>([])
  
  return useMemo(() => {
    // Check if callbacks have changed
    if (stableRef.current.length !== callbacks.length ||
        !callbacks.every((cb, index) => Object.is(cb, stableRef.current[index]))) {
      stableRef.current = callbacks
    }
    return stableRef.current
  }, [callbacks])
}