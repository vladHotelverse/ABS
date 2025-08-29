import { useMemo } from 'react'
import type { PricingItem } from '../types'
import type { SectionConfig } from '../components/SectionRenderer'

export interface SectionConfigurationProps {
  chooseYourSuperiorRoomItems: PricingItem[]
  customizeYourRoomItems: PricingItem[]
  chooseYourRoomItems: PricingItem[]
  enhanceYourStayItems: PricingItem[]
}

export const useSectionConfiguration = ({
  chooseYourSuperiorRoomItems,
  customizeYourRoomItems,
  chooseYourRoomItems,
  enhanceYourStayItems,
}: SectionConfigurationProps): SectionConfig[] => {
  return useMemo(() => {
    const configurations: SectionConfig[] = [
      {
        id: 'room-selection',
        title: chooseYourSuperiorRoomItems.length > 0 ? 'Superior Room Selection' : 'Room Selection',
        items: [...chooseYourRoomItems, ...chooseYourSuperiorRoomItems],
        shouldRender: chooseYourRoomItems.length > 0 || chooseYourSuperiorRoomItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4",
        ariaLabelledBy: "room-section-title"
      },
      {
        id: 'room-customization',
        title: 'Room Customization',
        items: customizeYourRoomItems,
        shouldRender: customizeYourRoomItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4"
      },
      {
        id: 'stay-enhancement',
        title: 'Stay Enhancement',
        items: enhanceYourStayItems,
        shouldRender: enhanceYourStayItems.length > 0,
        className: "bg-gray-50 rounded-lg p-3 mb-4"
      }
    ]

    return configurations
  }, [
    chooseYourSuperiorRoomItems,
    customizeYourRoomItems,
    chooseYourRoomItems,
    enhanceYourStayItems,
  ])
}