export type RoomCustomizationAttribute = {
  id: number
  name: string
  description?: string
  icon: string
  amount: number
  exclusivityRatio?: number
  disabled?: boolean
}

export type RoomCustomizationCategory = {
  id: number
  name: string
  description?: string
  attributes: RoomCustomizationAttribute[]
}

export const defaultRoomCustomizationCategories: RoomCustomizationCategory[] = [
  {
    id: 1,
    name: 'Comfort Upgrades',
    description: 'Enhance the in-room experience with curated amenities tailored for longer stays.',
    attributes: [
      {
        id: 101,
        name: 'Premium Bedding Package',
        description: 'Egyptian cotton sheets, memory-foam pillows, and nightly turndown service.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/pillow.svg',
        amount: 72,
        exclusivityRatio: 0.15,
      },
      {
        id: 102,
        name: 'Wellness Welcome Kit',
        description: 'Aromatherapy diffuser, sleep mask, and herbal tea selection on arrival.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/spa.svg',
        amount: 48,
        exclusivityRatio: 0.05,
      },
      {
        id: 103,
        name: 'Late Checkout Guarantee',
        description: 'Sleep in with a guaranteed checkout at 3 PM.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/clock.svg',
        amount: 30,
        exclusivityRatio: 0.35,
      },
      {
        id: 104,
        name: 'Daily Laundry Bundle',
        description: 'Have up to five items washed and pressed each day.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/laundry.svg',
        amount: 56,
        exclusivityRatio: 0.2,
      },
      {
        id: 105,
        name: 'Family Comfort Pack',
        description: 'Includes rollaway bed, kids amenities, and crib on request.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/family.svg',
        amount: 65,
        exclusivityRatio: 0.4,
        disabled: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Views & Locations',
    description: 'Choose the outlook that best fits the purpose of your trip.',
    attributes: [
      {
        id: 201,
        name: 'Sunset Ocean View',
        description: 'Guaranteed west-facing room with panoramic sea views.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/sunset.svg',
        amount: 84,
        exclusivityRatio: 0.1,
      },
      {
        id: 202,
        name: 'Corner Suite Placement',
        description: 'Extra windows, expanded living space, and added privacy.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/corner.svg',
        amount: 96,
        exclusivityRatio: 0.2,
      },
      {
        id: 203,
        name: 'Executive Floor Access',
        description: 'High-floor access with dedicated elevator and lounge privileges.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/building.svg',
        amount: 120,
        exclusivityRatio: 0.05,
      },
      {
        id: 204,
        name: 'Garden Terrace Patio',
        description: 'Ground-floor terrace with private outdoor seating.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/garden.svg',
        amount: 54,
        exclusivityRatio: 0.45,
      },
      {
        id: 205,
        name: 'City Skyline Panorama',
        description: 'High-rise perspective of the financial district skyline.',
        icon: 'https://cdn.hotelverse.tech/assets/ui/icons/city.svg',
        amount: 68,
        exclusivityRatio: 0.32,
      },
    ],
  },
]

export const consultationPreviewSelection = [101, 202, 204]
export const limitedAvailabilityAttributeIds = [103, 105, 202]
