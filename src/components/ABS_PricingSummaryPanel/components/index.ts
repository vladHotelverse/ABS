// Main component exports
export { default as PricingSummaryHeader } from './PricingSummaryHeader'
export { default as RoomSection } from './RoomSection'
export { default as BidUpgradesSection } from './BidUpgradesSection'
export { default as SectionRenderer } from './SectionRenderer'

// Existing component exports
export { default as EmptyState } from './EmptyState'
export { default as PriceBreakdown } from './PriceBreakdown'
export { default as PricingItemComponent } from './PricingItemComponent'
export { default as ItemsSection } from './ItemsSection'

// Type exports
export type { PricingSummaryHeaderProps } from './PricingSummaryHeader'
export type { RoomSectionProps } from './RoomSection'
export type { BidUpgradesSectionProps } from './BidUpgradesSection'
export type { SectionConfig, SectionRendererProps } from './SectionRenderer'
export type { ItemsSectionProps } from './ItemsSection'

// Hook-related exports
export type { SectionConfigurationProps } from '../hooks/useSectionConfiguration'