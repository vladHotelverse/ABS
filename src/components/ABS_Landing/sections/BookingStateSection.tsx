import type React from 'react'
import { UiButton } from '../../ui/button'

export type BookingState = 'loading' | 'error' | 'normal' | 'confirmation'

export interface BookingStateTexts {
  loadingLabel: string
  errorTitle: string
  errorMessage: string
  tryAgainLabel: string
  bookingConfirmedTitle: string
  confirmationMessage: string
  backToHomeLabel: string
}

export interface BookingStateSectionProps {
  state: BookingState
  texts: BookingStateTexts
  onRetry?: () => void
  onBackToNormal?: () => void
  className?: string
}

export const BookingStateSection: React.FC<BookingStateSectionProps> = ({
  state,
  texts,
  onRetry,
  onBackToNormal,
  className = '',
}) => {
  if (state === 'normal') {
    return null
  }

  if (state === 'loading') {
    return (
      <div className={`flex items-center justify-center h-screen w-full bg-neutral-100 ${className}`}>
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-neutral-200 h-32 w-32 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold">{texts.loadingLabel}</h2>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className={`text-center py-20 ${className}`}>
        <h2 className="text-4xl font-bold text-red-600 mb-4">{texts.errorTitle}</h2>
        <p className="text-lg mb-6">{texts.errorMessage}</p>
        <UiButton onClick={onRetry || onBackToNormal} className="bg-red-600 hover:bg-red-700 text-white" size="lg">
          {texts.tryAgainLabel}
        </UiButton>
      </div>
    )
  }

  if (state === 'confirmation') {
    return (
      <div className={`text-center py-20 ${className}`}>
        <h2 className="text-4xl font-bold text-green-600 mb-4">{texts.bookingConfirmedTitle}</h2>
        <p className="text-lg mb-6">{texts.confirmationMessage}</p>
        <UiButton onClick={onBackToNormal} className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
          {texts.backToHomeLabel}
        </UiButton>
      </div>
    )
  }

  return null
}

export default BookingStateSection
