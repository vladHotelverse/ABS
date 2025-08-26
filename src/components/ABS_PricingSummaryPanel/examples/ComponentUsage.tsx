/**
 * Usage examples for the decomposed PricingSummaryPanel components
 */

import type React from 'react'
import {
  PricingSummaryHeader,
  RoomSection,
  BidUpgradesSection,
  SectionRenderer,
  useSectionConfiguration
} from '../index'
import type { PricingItem } from '../types'

// Example: Using individual components
export const IndividualComponentsExample: React.FC = () => {
  const sampleRoomItems: PricingItem[] = [
    { id: 1, name: 'Deluxe Room', price: 120, type: 'room', concept: 'choose-your-room' }
  ]

  const sampleBidItems: PricingItem[] = [
    { id: 2, name: 'Suite Upgrade Bid', price: 50, type: 'bid', concept: 'bid-for-upgrade' }
  ]

  const handleRemoveItem = (item: PricingItem) => {
    console.log('Removing item:', item)
  }

  return (
    <div className="space-y-4">
      {/* Header component */}
      <PricingSummaryHeader 
        roomImage="/default-room.jpg"
        roomImageAltText="Room preview"
      />

      {/* Room section component */}
      <RoomSection
        chooseYourRoomItems={sampleRoomItems}
        chooseYourSuperiorRoomItems={[]}
        euroSuffix="€"
        removeRoomUpgradeLabel="Remove room"
        onRemoveItem={handleRemoveItem}
      />

      {/* Bid upgrades component */}
      <BidUpgradesSection
        bidForUpgradeItems={sampleBidItems}
        euroSuffix="€"
        onRemoveItem={handleRemoveItem}
      />
    </div>
  )
}

// Example: Using the configuration-driven approach
export const ConfigurationDrivenExample: React.FC = () => {
  const sampleItems = {
    chooseYourRoomItems: [
      { id: 1, name: 'Standard Room', price: 100, type: 'room' as const, concept: 'choose-your-room' as const }
    ],
    chooseYourSuperiorRoomItems: [],
    customizeYourRoomItems: [
      { id: 2, name: 'Extra Pillow', price: 10, type: 'customization' as const, concept: 'customize-your-room' as const }
    ],
    enhanceYourStayItems: [
      { id: 3, name: 'Breakfast', price: 25, type: 'offer' as const, concept: 'enhance-your-stay' as const }
    ],
    bidForUpgradeItems: []
  }

  const sections = useSectionConfiguration(sampleItems)

  const handleRemoveItem = (item: PricingItem) => {
    console.log('Removing item:', item)
  }

  return (
    <div className="space-y-4">
      <SectionRenderer
        sections={sections}
        euroSuffix="€"
        onRemoveItem={handleRemoveItem}
      />
    </div>
  )
}

// Example: Custom section rendering
export const CustomSectionRenderingExample: React.FC = () => {
  const sections = [
    {
      id: 'custom-section',
      title: 'Custom Section',
      items: [
        { id: 1, name: 'Custom Item', price: 50, type: 'customization' as const }
      ]
    }
  ]

  const handleRemoveItem = (item: PricingItem) => {
    console.log('Removing item:', item)
  }

  const customRenderSection = (section: any, euroSuffix: string, onRemoveItem: (item: PricingItem) => void) => {
    return (
      <div key={section.id} className="custom-section-style">
        <h2>{section.title}</h2>
        {section.items.map((item: PricingItem) => (
          <div key={item.id} onClick={() => onRemoveItem(item)}>
            {item.name} - {item.price}{euroSuffix}
          </div>
        ))}
      </div>
    )
  }

  return (
    <SectionRenderer
      sections={sections}
      euroSuffix="€"
      onRemoveItem={handleRemoveItem}
      renderSection={customRenderSection}
    />
  )
}