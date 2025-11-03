/**
 * ConfigurationErrorBoundary
 *
 * Error boundary component for catching and displaying configuration/runtime errors.
 * Used to gracefully handle unexpected errors in components while maintaining app stability.
 *
 * This is a class component because React Error Boundaries must be class components.
 *
 * @example
 * ```tsx
 * <ConfigurationErrorBoundary onError={(error) => logError(error)}>
 *   <YourComponent />
 * </ConfigurationErrorBoundary>
 * ```
 */

import React, { ReactNode, ErrorInfo } from 'react'

interface ConfigurationErrorBoundaryProps {
  /** React components to wrap */
  children: ReactNode
  /** Custom fallback UI to display on error */
  fallback?: ReactNode
  /** Callback when error is caught (for logging services) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ConfigurationErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component for Configuration and Runtime Errors
 *
 * Catches errors that occur during rendering in child components
 * and displays a user-friendly error message instead of crashing.
 *
 * ## What It Catches:
 * - Errors during render
 * - Errors in lifecycle methods
 * - Errors in constructors
 *
 * ## What It DOESN'T Catch:
 * - Event handler errors (use try-catch in handlers)
 * - Async errors (use Promise.catch or try-catch with async/await)
 * - Server-side rendering errors
 * - Errors in the error boundary itself
 *
 * ## Usage:
 *
 * ### Basic Usage:
 * ```tsx
 * <ConfigurationErrorBoundary>
 *   <PricingSummaryPanel labels={labels} rooms={rooms} />
 * </ConfigurationErrorBoundary>
 * ```
 *
 * ### With Error Callback:
 * ```tsx
 * <ConfigurationErrorBoundary
 *   onError={(error, errorInfo) => {
 *     // Log to error tracking service
 *     Sentry.captureException(error, { contexts: { errorInfo } })
 *   }}
 * >
 *   <YourComponent />
 * </ConfigurationErrorBoundary>
 * ```
 *
 * ### With Custom Fallback:
 * ```tsx
 * <ConfigurationErrorBoundary
 *   fallback={
 *     <div className="error-container">
 *       <h2>Custom Error Occurred</h2>
 *       <p>Please try refreshing the page</p>
 *     </div>
 *   }
 * >
 *   <YourComponent />
 * </ConfigurationErrorBoundary>
 * ```
 */
export class ConfigurationErrorBoundary extends React.Component<
  ConfigurationErrorBoundaryProps,
  ConfigurationErrorBoundaryState
> {
  constructor(props: ConfigurationErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error: Error): Partial<ConfigurationErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  /**
   * Log error details to console and trigger callback
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info in state
    this.setState({ errorInfo })

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ConfigurationErrorBoundary:')
      console.error(error)
      console.error('Component Stack:', errorInfo.componentStack)
    }

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  /**
   * Reset error state
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-6 text-red-900">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Something Went Wrong</h2>
            <p className="text-sm text-red-700 mt-1">
              An unexpected error occurred. Please try refreshing the page.
            </p>
          </div>

          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="w-full text-left">
              <summary className="cursor-pointer font-semibold text-red-800 hover:text-red-900">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                {this.state.error.toString()}
                {this.state.errorInfo && `\n\n${this.state.errorInfo.componentStack}`}
              </pre>
            </details>
          )}

          {/* Reset button */}
          <button
            onClick={this.handleReset}
            className="rounded-md bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ConfigurationErrorBoundary
