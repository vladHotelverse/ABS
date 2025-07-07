import type React from 'react'
import { UiButton } from '../../ui/button'

export type BookingState = 'loading' | 'error' | 'normal' | 'confirmation'

export interface SelectionStateTexts {
  loadingLabel: string
  errorTitle: string
  errorMessage: string
  tryAgainLabel: string
  selectionConfirmedTitle: string
  confirmationMessage: string
  backToHomeLabel: string
}

export interface SelectionSummary {
  selectedRoom?: string
  customizations?: string[]
  specialOffers?: string[]
  totalPrice?: string
  nights?: number
  activeBid?: {
    roomName: string
    bidAmount: number
  }
}

export interface BookingStateSectionProps {
  state: BookingState
  texts: SelectionStateTexts
  onRetry?: () => void
  onBackToNormal?: () => void
  className?: string
  selectionSummary?: SelectionSummary
}

export const BookingStateSection: React.FC<BookingStateSectionProps> = ({
  state,
  texts,
  onRetry,
  onBackToNormal,
  className = '',
  selectionSummary,
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
      <div className={`flex items-center justify-center min-h-screen bg-neutral-50 ${className}`}>
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{texts.selectionConfirmedTitle}</h2>
            <p className="text-lg text-gray-600">{texts.confirmationMessage}</p>
          </div>

          {selectionSummary && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Selection Summary</h3>
              
              {selectionSummary.selectedRoom && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Selected Room</p>
                  <p className="font-medium text-gray-800">{selectionSummary.selectedRoom}</p>
                </div>
              )}

              {selectionSummary.activeBid && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Room Bid</p>
                  <p className="font-medium text-gray-800">
                    {selectionSummary.activeBid.roomName} - €{selectionSummary.activeBid.bidAmount}
                  </p>
                </div>
              )}

              {selectionSummary.customizations && selectionSummary.customizations.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Customizations</p>
                  <ul className="list-disc list-inside">
                    {selectionSummary.customizations.map((custom, index) => (
                      <li key={index} className="text-gray-800">{custom}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectionSummary.specialOffers && selectionSummary.specialOffers.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Special Offers</p>
                  <ul className="list-disc list-inside">
                    {selectionSummary.specialOffers.map((offer, index) => (
                      <li key={index} className="text-gray-800">{offer}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectionSummary.totalPrice && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">Total</p>
                    <p className="text-lg font-bold text-gray-800">{selectionSummary.totalPrice}</p>
                  </div>
                  {selectionSummary.nights && (
                    <p className="text-sm text-gray-600 mt-1">For {selectionSummary.nights} nights</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <UiButton onClick={onBackToNormal} className="bg-black text-white" size="lg">
              {texts.backToHomeLabel}
            </UiButton>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default BookingStateSection
