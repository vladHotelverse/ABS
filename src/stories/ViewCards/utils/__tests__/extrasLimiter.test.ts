import { describe, expect, it } from 'vitest'
import { limitExtras, type LimitedItems } from '../extrasLimiter'

// Mock item type for testing
interface TestItem {
  id: number
  name: string
}

describe('limitExtras', () => {
  describe('edge cases', () => {
    it('handles empty array', () => {
      const result = limitExtras<TestItem>([])

      expect(result.visible).toEqual([])
      expect(result.hiddenCount).toBe(0)
    })

    it('handles single item', () => {
      const items: TestItem[] = [{ id: 1, name: 'Item 1' }]
      const result = limitExtras(items)

      expect(result.visible).toEqual(items)
      expect(result.hiddenCount).toBe(0)
    })

    it('handles negative maxVisible (treats as 0)', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]
      const result = limitExtras(items, -1)

      expect(result.visible).toEqual([])
      expect(result.hiddenCount).toBe(2)
    })

    it('handles zero maxVisible', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]
      const result = limitExtras(items, 0)

      expect(result.visible).toEqual([])
      expect(result.hiddenCount).toBe(2)
    })
  })

  describe('default maxVisible (5 items)', () => {
    it('shows all items when count equals maxVisible', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
      ]
      const result = limitExtras(items)

      expect(result.visible).toHaveLength(5)
      expect(result.visible).toEqual(items)
      expect(result.hiddenCount).toBe(0)
    })

    it('shows all items when count is less than maxVisible', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]
      const result = limitExtras(items)

      expect(result.visible).toHaveLength(3)
      expect(result.visible).toEqual(items)
      expect(result.hiddenCount).toBe(0)
    })

    it('limits items when count exceeds maxVisible', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
        { id: 6, name: 'Item 6' },
        { id: 7, name: 'Item 7' },
      ]
      const result = limitExtras(items)

      expect(result.visible).toHaveLength(5)
      expect(result.visible).toEqual(items.slice(0, 5))
      expect(result.hiddenCount).toBe(2)
    })

    it('calculates hiddenCount correctly for 10 items', () => {
      const items: TestItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }))
      const result = limitExtras(items)

      expect(result.visible).toHaveLength(5)
      expect(result.hiddenCount).toBe(5)
    })
  })

  describe('custom maxVisible values', () => {
    it('respects custom maxVisible of 3', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
      ]
      const result = limitExtras(items, 3)

      expect(result.visible).toHaveLength(3)
      expect(result.visible).toEqual(items.slice(0, 3))
      expect(result.hiddenCount).toBe(2)
    })

    it('respects custom maxVisible of 10', () => {
      const items: TestItem[] = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }))
      const result = limitExtras(items, 10)

      expect(result.visible).toHaveLength(10)
      expect(result.hiddenCount).toBe(5)
    })

    it('shows all items when maxVisible exceeds array length', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]
      const result = limitExtras(items, 100)

      expect(result.visible).toHaveLength(2)
      expect(result.visible).toEqual(items)
      expect(result.hiddenCount).toBe(0)
    })
  })

  describe('immutability', () => {
    it('does not modify the original array', () => {
      const items: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
        { id: 6, name: 'Item 6' },
      ]
      const originalLength = items.length
      const originalFirst = items[0]

      limitExtras(items, 3)

      expect(items).toHaveLength(originalLength)
      expect(items[0]).toBe(originalFirst)
    })
  })

  describe('type safety', () => {
    it('works with different item types', () => {
      interface PriceSummaryItem {
        id: string
        name: string
        price: string
      }

      const items: PriceSummaryItem[] = [
        { id: '1', name: 'Extra 1', price: '$10' },
        { id: '2', name: 'Extra 2', price: '$20' },
        { id: '3', name: 'Extra 3', price: '$30' },
      ]

      const result: LimitedItems<PriceSummaryItem> = limitExtras(items, 2)

      expect(result.visible).toHaveLength(2)
      expect(result.visible[0].price).toBe('$10')
    })

    it('works with primitive types', () => {
      const numbers = [1, 2, 3, 4, 5, 6]
      const result = limitExtras(numbers, 3)

      expect(result.visible).toEqual([1, 2, 3])
      expect(result.hiddenCount).toBe(3)
    })
  })
})
