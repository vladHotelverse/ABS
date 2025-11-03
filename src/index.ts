/**
 * ABS UI Toolkit - Main export file
 *
 * This file exports all reusable components from the toolkit.
 */

// UI Primitives
export { Badge } from './components/ui/badge'
export { Button } from './components/ui/button'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
export { Input } from './components/ui/input'
export { Label } from './components/ui/label'
export { SegmentBadge } from './components/ui/segment-badge'
export { Separator } from './components/ui/separator'

// Upsell/Domain Components
export { default as SpecialOffers, ABS_SpecialOffers } from './components/upsell/SpecialOffers'

// SpecialOffers Types
export type {
  OfferType,
  OfferSelection,
  OfferData,
  OfferLabels,
  ReservationInfo,
  SpecialOffersProps,
} from './components/upsell/SpecialOffers/types'

// SpecialOffers Utilities (for external integration)
export { transformAPIOfferToComponent, transformAPIOffersToComponent, validateOfferData, transformOfferDataToAPI } from './components/upsell/SpecialOffers/utils/apiHelpers'
export { isDateDisabled, dateToKey, keyToDate } from './components/upsell/SpecialOffers/utils/dateHelpers'
