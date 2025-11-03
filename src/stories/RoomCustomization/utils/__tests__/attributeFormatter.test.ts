import { describe, expect, it } from 'vitest'
import type { RoomCustomizationCategory } from '../../../mockData'
import {
  DEFAULT_ATTRIBUTE_DISPLAY_CONFIG,
  resolveInitialVisibleCount,
  sortAttributesByExclusivity,
} from '../attributeFormatter'

const mockCategories: RoomCustomizationCategory[] = [
  {
    id: 1,
    name: 'Comfort',
    attributes: [
      { id: 101, name: 'Late Checkout', icon: '', amount: 40, exclusivityRatio: 0.5 },
      { id: 102, name: 'Premium Bedding', icon: '', amount: 60, exclusivityRatio: 0.2 },
      { id: 103, name: 'Spa Access', icon: '', amount: 80, exclusivityRatio: 0.3 },
    ],
  },
]

describe('attributeFormatter utilities', () => {
  it('sorts attributes by exclusivity ratio ascending', () => {
    const [category] = sortAttributesByExclusivity(mockCategories)
    const attributeNames = category.attributes.map((item) => item.name)

    expect(attributeNames).toEqual(['Premium Bedding', 'Spa Access', 'Late Checkout'])
  })

  it('falls back to default breakpoint count when specific breakpoint is missing', () => {
    const count = resolveInitialVisibleCount('xl', {
      initialVisibleCount: {
        default: 2,
        sm: 1,
      },
    })

    expect(count).toBe(2)
  })

  it('returns the first available value when config is sparse', () => {
    const count = resolveInitialVisibleCount('xl', {
      initialVisibleCount: {
        sm: 3,
      },
    })

    expect(count).toBe(3)
  })

  it('respects the provided default configuration', () => {
    const count = resolveInitialVisibleCount('2xl', DEFAULT_ATTRIBUTE_DISPLAY_CONFIG)
    expect(count).toBe(3)
  })
})
