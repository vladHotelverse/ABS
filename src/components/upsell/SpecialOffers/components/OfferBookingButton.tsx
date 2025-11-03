import { Check } from 'lucide-react'
import type React from 'react'
import { UiButton } from '@/components/ui/button'

export interface OfferBookingButtonProps {
  onClick: () => void
  disabled: boolean
  isBooked: boolean
  bookText: string
  removeText: string
  offerTitle?: string
}

const OfferBookingButton: React.FC<OfferBookingButtonProps> = ({
  onClick,
  disabled,
  isBooked,
  bookText,
  removeText,
  offerTitle,
}) => {
  const handleClick = () => {
    onClick()
  }

  return (
    <UiButton
      onClick={handleClick}
      disabled={disabled}
      variant={isBooked ? 'destructive' : 'default'}
      className={`  w-full cursor-pointer transition-all border ${isBooked ? '' : 'hover:bg-black hover:text-white'}`}
      aria-label={`${isBooked ? removeText : bookText}${offerTitle ? ` ${offerTitle}` : ''}`}
      aria-pressed={isBooked}
      role="button"
    >
      {isBooked && <Check className="h-4 w-4" aria-hidden="true" />}
      {isBooked ? removeText : bookText}
    </UiButton>
  )
}

export default OfferBookingButton
