# Special Offers System - Design

## Component Architecture

```typescript
// Core offer selection component
const ABS_SpecialOffers: React.FC = ({
  offers,
  selectedOffers,
  onOfferChange,
  checkInDate,
  checkOutDate,
  translations,
  language
}) => {
  // Dynamic offer filtering and pricing
  const availableOffers = useOfferAvailability(offers, checkInDate, checkOutDate)
  const pricingCalculations = useOfferPricing(selectedOffers)
  
  return (
    <div className="special-offers-container">
      {availableOffers.map(offer => (
        <OfferCard
          key={offer.id}
          offer={offer}
          isSelected={selectedOffers.includes(offer.id)}
          onSelect={handleOfferSelection}
          pricing={pricingCalculations[offer.id]}
        />
      ))}
    </div>
  )
}
```

## State Management

```typescript
interface SpecialOffer {
  id: string
  title: string
  category: 'dining' | 'spa' | 'activity' | 'room' | 'transport'
  description: string
  basePrice: number
  discountedPrice?: number
  pricingModel: 'perPerson' | 'perNight' | 'perStay'
  availability: {
    startDate: string
    endDate: string
    daysOfWeek?: number[]
    maxQuantity?: number
  }
  imageUrl: string
  terms: string[]
}
```

## Pricing Engine

- Real-time price calculations based on guest count and stay duration
- Dynamic discounts based on booking value and guest segments
- Integration with room-specific pricing for targeted offers