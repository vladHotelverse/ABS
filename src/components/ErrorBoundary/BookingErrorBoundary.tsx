/**
 * Booking Error Boundary
 * Comprehensive error handling for the booking system with recovery mechanisms
 */

import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw, Home, Phone } from 'lucide-react'
import { UiButton } from '../ui/button'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
// Dynamic import to avoid circular dependencies

interface Props {
  children: ReactNode
  fallback?: ReactNode
  level: 'page' | 'section' | 'component'
  context: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
  retryCount: number
}

// Error classification
const ErrorType = {
  VALIDATION_ERROR: 'validation',
  NETWORK_ERROR: 'network',
  STATE_ERROR: 'state',
  RENDERING_ERROR: 'rendering',
  BUSINESS_LOGIC_ERROR: 'business_logic',
  UNKNOWN_ERROR: 'unknown'
} as const

type ErrorType = typeof ErrorType[keyof typeof ErrorType]

interface ErrorContext {
  type: ErrorType
  severity: 'low' | 'medium' | 'high' | 'critical'
  recoverable: boolean
  retryable: boolean
  userMessage: string
  technicalMessage: string
  suggestedActions: string[]
}

class BookingErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = []
  
  constructor(props: Props) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    }
  }
  
  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId,
    }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })
    
    // Log error with context
    this.logError(error, errorInfo)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
    
    // Report to monitoring service
    this.reportError(error, errorInfo)
  }
  
  componentWillUnmount() {
    // Clean up retry timeouts
    this.retryTimeouts.forEach(clearTimeout)
  }
  
  private classifyError(error: Error): ErrorContext {
    const message = error.message.toLowerCase()
    const stack = error.stack?.toLowerCase() || ''
    
    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        severity: 'medium',
        recoverable: true,
        retryable: true,
        userMessage: 'Connection issue detected. Please check your internet connection.',
        technicalMessage: error.message,
        suggestedActions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the problem persists'
        ]
      }
    }
    
    // State management errors
    if (message.includes('zustand') || message.includes('store') || message.includes('state')) {
      return {
        type: ErrorType.STATE_ERROR,
        severity: 'high',
        recoverable: true,
        retryable: true,
        userMessage: 'There was an issue with your booking data. We\'re trying to restore it.',
        technicalMessage: error.message,
        suggestedActions: [
          'Your selections are being restored',
          'Please wait a moment and try again',
          'Contact support if you continue to experience issues'
        ]
      }
    }
    
    // Validation errors
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return {
        type: ErrorType.VALIDATION_ERROR,
        severity: 'low',
        recoverable: true,
        retryable: false,
        userMessage: 'Some information needs to be corrected.',
        technicalMessage: error.message,
        suggestedActions: [
          'Please check your selections',
          'Make sure all required fields are filled',
          'Try a different configuration if the issue persists'
        ]
      }
    }
    
    // Rendering errors
    if (stack.includes('react') || message.includes('render') || message.includes('component')) {
      return {
        type: ErrorType.RENDERING_ERROR,
        severity: 'high',
        recoverable: true,
        retryable: true,
        userMessage: 'There was a display issue. We\'re fixing it now.',
        technicalMessage: error.message,
        suggestedActions: [
          'The page is being refreshed',
          'Please wait a moment',
          'Try clearing your browser cache if the problem continues'
        ]
      }
    }
    
    // Business logic errors
    if (message.includes('booking') || message.includes('room') || message.includes('offer')) {
      return {
        type: ErrorType.BUSINESS_LOGIC_ERROR,
        severity: 'medium',
        recoverable: true,
        retryable: true,
        userMessage: 'There was an issue processing your booking selections.',
        technicalMessage: error.message,
        suggestedActions: [
          'Try making your selections again',
          'Check if all options are still available',
          'Contact our support team for assistance'
        ]
      }
    }
    
    // Default to unknown error
    return {
      type: ErrorType.UNKNOWN_ERROR,
      severity: 'high',
      recoverable: false,
      retryable: true,
      userMessage: 'An unexpected error occurred. Our team has been notified.',
      technicalMessage: error.message,
      suggestedActions: [
        'Try refreshing the page',
        'Clear your browser cache',
        'Contact support with error ID: ' + this.state.errorId
      ]
    }
  }
  
  private logError(error: Error, errorInfo: ErrorInfo) {
    const errorContext = this.classifyError(error)
    
    console.group(`🚨 Booking Error Boundary: ${this.props.context}`)
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Context:', {
      level: this.props.level,
      context: this.props.context,
      errorId: this.state.errorId,
      retryCount: this.state.retryCount,
      classification: errorContext,
    })
    console.groupEnd()
  }
  
  private reportError(error: Error, errorInfo: ErrorInfo) {
    const errorContext = this.classifyError(error)
    
    // In production, this would send to error monitoring service
    const errorReport = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      level: this.props.level,
      context: this.props.context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      classification: errorContext,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: 'anonymous', // Would be actual user ID in production
      bookingState: this.getBookingStateSnapshot(),
    }
    
    // Mock error reporting - replace with actual service
    console.log('Error reported:', errorReport)
  }
  
  private getBookingStateSnapshot() {
    try {
      // Only import when needed to avoid circular dependencies
      const { useBookingStore } = require('../../stores/bookingStore')
      const state = useBookingStore.getState()
      
      // Calculate unified statistics from room-based system
      const hasSelectedRoom = state.rooms.length > 0 && state.rooms.some((room: any) => 
        room.items.some((item: any) => item.type === 'room')
      )
      
      const customizationCount = state.rooms.reduce((total: number, room: any) => 
        total + room.items.filter((item: any) => item.type === 'customization').length, 0
      )
      
      const specialOffersCount = state.rooms.reduce((total: number, room: any) => 
        total + room.items.filter((item: any) => item.type === 'offer').length, 0
      )
      
      const hasActiveBid = state.rooms.some((room: any) => 
        room.items.some((item: any) => item.type === 'bid')
      )
      
      return {
        mode: state.mode,
        roomCount: state.rooms.length,
        activeRoomId: state.activeRoomId,
        hasSelectedRoom,
        customizationCount,
        specialOffersCount,
        hasActiveBid,
        lastUpdate: state.lastUpdate,
        optimisticUpdatesCount: state.optimisticUpdates.size,
      }
    } catch {
      return { error: 'Could not capture booking state' }
    }
  }
  
  private handleRetry = () => {
    const { retryCount } = this.state
    const maxRetries = 3
    
    if (retryCount >= maxRetries) {
      return
    }
    
    this.setState({
      retryCount: retryCount + 1,
    })
    
    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000
    
    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      })
    }, delay)
    
    this.retryTimeouts.push(timeout)
  }
  
  private handleReset = () => {
    // Reset error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    })
    
    // Reset booking state if this is a page-level error
    if (this.props.level === 'page') {
      try {
        const { useBookingStore } = require('../../stores/bookingStore')
        useBookingStore.getState().resetState()
      } catch (resetError) {
        console.error('Failed to reset booking state:', resetError)
        // Fallback: clear localStorage if store reset fails
        try {
          localStorage.removeItem('booking-storage')
          window.location.reload()
        } catch {
          console.error('Failed to clear storage and reload')
        }
      }
    }
  }
  
  private handleContactSupport = () => {
    // In production, this would open support chat or redirect to support page
    const subject = encodeURIComponent(`Booking Error - ${this.state.errorId}`)
    const body = encodeURIComponent(`I encountered an error while using the booking system.\n\nError ID: ${this.state.errorId}\nContext: ${this.props.context}\nTime: ${new Date().toISOString()}`)
    
    window.open(`mailto:support@hotel.com?subject=${subject}&body=${body}`)
  }
  
  render() {
    if (this.state.hasError && this.state.error) {
      const errorContext = this.classifyError(this.state.error)
      
      // Custom fallback for different levels
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      // Component-level errors - minimal UI
      if (this.props.level === 'component') {
        return (
          <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Component unavailable</span>
              {errorContext.retryable && (
                <UiButton
                  variant="ghost"
                  size="sm"
                  onClick={this.handleRetry}
                  className="ml-auto text-destructive hover:text-destructive/80"
                >
                  <RefreshCw className="w-3 h-3" />
                </UiButton>
              )}
            </div>
          </div>
        )
      }
      
      // Section-level errors - larger UI with more options
      if (this.props.level === 'section') {
        return (
          <div className="p-6 border border-destructive rounded-lg bg-destructive/10">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-destructive">Section Temporarily Unavailable</AlertTitle>
              <AlertDescription className="text-destructive/80 mt-2">
                {errorContext.userMessage}
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 flex gap-3">
              {errorContext.retryable && this.state.retryCount < 3 && (
                <UiButton
                  variant="outline"
                  onClick={this.handleRetry}
                  disabled={this.state.retryCount >= 3}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({3 - this.state.retryCount} attempts left)
                </UiButton>
              )}
              
              <UiButton
                variant="ghost"
                onClick={this.handleReset}
                className="text-destructive hover:bg-destructive/10"
              >
                Reset Section
              </UiButton>
            </div>
            
            {errorContext.suggestedActions.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-destructive mb-2">Suggested actions:</p>
                <ul className="text-sm text-destructive/80 list-disc list-inside space-y-1">
                  {errorContext.suggestedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      }
      
      // Page-level errors - full error page
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Booking System Error
              </h1>
              <p className="text-muted-foreground mb-6">
                {errorContext.userMessage}
              </p>
            </div>
            
            <div className="space-y-3">
              {errorContext.retryable && this.state.retryCount < 3 && (
                <UiButton
                  className="w-full"
                  onClick={this.handleRetry}
                  disabled={this.state.retryCount >= 3}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({3 - this.state.retryCount} attempts left)
                </UiButton>
              )}
              
              <UiButton
                variant="outline"
                className="w-full"
                onClick={this.handleReset}
              >
                <Home className="w-4 h-4 mr-2" />
                Start Over
              </UiButton>
              
              <UiButton
                variant="ghost"
                className="w-full"
                onClick={this.handleContactSupport}
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact Support
              </UiButton>
            </div>
            
            {errorContext.suggestedActions.length > 0 && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">What you can try:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {errorContext.suggestedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {process.env.NODE_ENV === 'development' && this.state.errorId && (
              <div className="mt-4 p-3 bg-muted rounded text-xs font-mono text-muted-foreground">
                Error ID: {this.state.errorId}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}

// HOC for easy wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  level: Props['level'] = 'component',
  context?: string
) => {
  const WrappedComponent = (props: P) => (
    <BookingErrorBoundary
      level={level}
      context={context || Component.displayName || Component.name}
    >
      <Component {...props} />
    </BookingErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Specialized error boundaries for different contexts
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <BookingErrorBoundary level="page" context="Page">
    {children}
  </BookingErrorBoundary>
)

export const SectionErrorBoundary: React.FC<{ children: ReactNode; context: string }> = ({ 
  children, 
  context 
}) => (
  <BookingErrorBoundary level="section" context={context}>
    {children}
  </BookingErrorBoundary>
)

export const ComponentErrorBoundary: React.FC<{ children: ReactNode; context: string }> = ({ 
  children, 
  context 
}) => (
  <BookingErrorBoundary level="component" context={context}>
    {children}
  </BookingErrorBoundary>
)

export default BookingErrorBoundary