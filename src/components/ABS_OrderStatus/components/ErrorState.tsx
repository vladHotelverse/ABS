import type React from 'react'
import { UiButton } from '../../ui/button'

export interface ErrorStateProps {
  type: 'invalid_id' | 'not_found'
  onTryAgain: () => void
  onBackToHome?: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({
  type,
  onTryAgain,
  onBackToHome,
}) => {
  const isInvalidId = type === 'invalid_id'
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {isInvalidId ? 'Invalid Booking ID' : 'Order Not Found'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {isInvalidId 
            ? 'Please check your booking ID format. It should look like: ABS-20250723-A1B2C3'
            : 'We couldn\'t find an order with this booking ID. Please check your ID and try again.'
          }
        </p>
        
        <div className="space-y-3">
          <UiButton 
            onClick={onTryAgain}
            className="w-full"
          >
            Try Another ID
          </UiButton>
          
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="w-full text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorState