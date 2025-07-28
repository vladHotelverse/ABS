/**
 * Simple Auth Hook for Order Access
 * Provides basic email-based authentication for accessing orders
 */

import { useState, useEffect } from 'react'

export interface AuthState {
  isAuthenticated: boolean
  userEmail: string | null
  reservationCode: string | null
}

const AUTH_STORAGE_KEY = 'abs_auth_state'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userEmail: null,
    reservationCode: null
  })

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsedState = JSON.parse(stored)
        setAuthState(parsedState)
      } catch (error) {
        console.error('Error parsing auth state:', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
  }, [])

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [authState])

  const login = (email: string, reservationCode: string): boolean => {
    // Simple validation - in a real app, this would verify with backend
    if (email && reservationCode && email.includes('@')) {
      setAuthState({
        isAuthenticated: true,
        userEmail: email,
        reservationCode: reservationCode
      })
      return true
    }
    return false
  }

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      userEmail: null,
      reservationCode: null
    })
  }

  return {
    ...authState,
    login,
    logout
  }
}