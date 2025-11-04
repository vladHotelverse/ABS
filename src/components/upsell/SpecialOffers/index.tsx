import clsx from 'clsx'
import type React from 'react'

import OfferCard from './components/OfferCard'
import type { SpecialOffersProps } from './types'

/**
 * SpecialOffers - Pure presentation component for displaying offer cards
 *
 * ✅ UI Layer ONLY - receives pre-formatted data
 * - Displays offer cards in a grid
 * - Handles user interactions via callbacks
 * - Manages visual state (layout, styling)
 * - Passes interactions to callbacks WITHOUT transformation
 *
 * ❌ Does NOT:
 * - Calculate or format anything
 * - Transform data structures
 * - Determine visibility or state based on data
 * - Apply business rules or logic
 *
 * Parent is responsible for:
 * - Formatting prices, labels, unit labels
 * - Calculating totals and determining visibility
 * - Applying business rules (special offers, validation)
 * - Creating OfferCardData with all pre-calculated values
 *
 * For integration examples, see:
 * - src/stories/SpecialOffers/SpecialOffers.stories.tsx (basic usage)
 * - src/stories/SpecialOffers/SpecialOffersMultibooking.stories.tsx (multibooking)
 */

const SpecialOffers: React.FC<SpecialOffersProps> = ({
  className,
  id,
  cardData,
  onUpdateQuantity,
  onUpdateSelectedDate,
  onUpdateSelectedDates,
  onBookOffer,
  labels,
}) => {
  // Grid layout based on count is a UI decision, not business logic
  const gridClass = clsx(
    'grid gap-4 sm:gap-6',
    cardData.length === 1 ? 'grid-cols-1 max-w-md' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl'
  )

  return (
    <div id={id} className={clsx('transition-all duration-300 ease-in-out', className)}>
      <div className={gridClass}>
        {cardData.map((card) => {
          // perNight offers always require date selection to calculate number of nights
          const requiresDateSelection = card.offer.requiresDateSelection === true || card.offer.type === 'perNight'
          const allowsMultipleDates = requiresDateSelection && card.offer.allowsMultipleDates === true
          const enableSingleDate = requiresDateSelection && !allowsMultipleDates

          return (
            <OfferCard
              key={card.offer.id}
              cardData={card}
              onUpdateQuantity={onUpdateQuantity ? (change) => onUpdateQuantity(card.offer.id, change) : undefined}
              onUpdateSelectedDate={
                enableSingleDate && onUpdateSelectedDate ? (date) => onUpdateSelectedDate(card.offer.id, date) : undefined
              }
              onUpdateSelectedDates={
                allowsMultipleDates && onUpdateSelectedDates
                  ? (dates) => onUpdateSelectedDates(card.offer.id, dates)
                  : undefined
              }
              onBook={onBookOffer ? () => onBookOffer(card.offer.id) : undefined}
              labels={labels}
            />
          )
        })}
      </div>
    </div>
  )
}

export default SpecialOffers
// Legacy export for backward compatibility
export { SpecialOffers as ABS_SpecialOffers }
