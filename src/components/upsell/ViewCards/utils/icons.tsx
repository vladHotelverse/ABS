import {
  ArrowUpRight,
  Utensils,
  Sparkles,
  Car,
  Clock,
  Wifi,
  Coffee,
  Wine,
  UtensilsCrossed,
  Bed,
  MapPin,
  Gift,
  Star,
  DollarSign,
} from 'lucide-react'

export type BenefitType =
  | 'upgrade'
  | 'allInclusive'
  | 'spa'
  | 'transport'
  | 'lateCheckout'
  | 'breakfast'
  | 'dining'
  | 'checkin'
  | 'room'
  | 'location'
  | 'package'
  | 'default'

export const getBenefitIcon = (type: BenefitType, size: number = 16) => {
  const iconProps = { size, strokeWidth: 2 }

  switch (type) {
    case 'upgrade':
      return <ArrowUpRight {...iconProps} />
    case 'allInclusive':
      return <UtensilsCrossed {...iconProps} />
    case 'spa':
      return <Sparkles {...iconProps} />
    case 'transport':
      return <Car {...iconProps} />
    case 'lateCheckout':
      return <Clock {...iconProps} />
    case 'breakfast':
      return <Coffee {...iconProps} />
    case 'dining':
      return <Utensils {...iconProps} />
    case 'checkin':
      return <Wifi {...iconProps} />
    case 'room':
      return <Bed {...iconProps} />
    case 'location':
      return <MapPin {...iconProps} />
    case 'package':
      return <Gift {...iconProps} />
    default:
      return <Star {...iconProps} />
  }
}

export const detectBenefitType = (title: string): BenefitType => {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes('upgrade')) return 'upgrade'
  if (lowerTitle.includes('all inclusive') || lowerTitle.includes('all-inclusive')) return 'allInclusive'
  if (lowerTitle.includes('spa') || lowerTitle.includes('massage') || lowerTitle.includes('wellness'))
    return 'spa'
  if (lowerTitle.includes('transfer') || lowerTitle.includes('transport') || lowerTitle.includes('airport'))
    return 'transport'
  if (lowerTitle.includes('late checkout') || lowerTitle.includes('checkout')) return 'lateCheckout'
  if (lowerTitle.includes('breakfast')) return 'breakfast'
  if (lowerTitle.includes('dinner') || lowerTitle.includes('lunch') || lowerTitle.includes('dining'))
    return 'dining'
  if (lowerTitle.includes('check-in') || lowerTitle.includes('checkin') || lowerTitle.includes('online'))
    return 'checkin'
  if (lowerTitle.includes('room') || lowerTitle.includes('bed') || lowerTitle.includes('suite')) return 'room'
  if (lowerTitle.includes('location') || lowerTitle.includes('view') || lowerTitle.includes('floor'))
    return 'location'
  if (lowerTitle.includes('package')) return 'package'

  return 'default'
}
