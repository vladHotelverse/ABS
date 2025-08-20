import { describe, it, expect } from 'vitest'
import { 
  createMockRoomOption, 
  createMockPricingItem, 
  createMockSpecialOffer,
  BookingFlowBuilder,
  PricingScenarioBuilder 
} from './index'

describe('Test Utilities', () => {
  describe('Mock Factories', () => {
    it('should create mock room option with defaults', () => {
      const room = createMockRoomOption()
      
      expect(room).toHaveProperty('id')
      expect(room).toHaveProperty('name')
      expect(room).toHaveProperty('price')
      expect(room.currency).toBe('EUR')
      expect(room.available).toBe(true)
    })

    it('should create mock room option with overrides', () => {
      const room = createMockRoomOption({
        name: 'Deluxe Suite',
        price: 300,
        currency: 'USD',
      })
      
      expect(room.name).toBe('Deluxe Suite')
      expect(room.price).toBe(300)
      expect(room.currency).toBe('USD')
    })

    it('should create mock pricing item', () => {
      const item = createMockPricingItem()
      
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('type')
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('price')
    })

    it('should create mock special offer', () => {
      const offer = createMockSpecialOffer()
      
      expect(offer).toHaveProperty('id')
      expect(offer).toHaveProperty('title')
      expect(offer).toHaveProperty('price')
      expect(offer.isAvailable).toBe(true)
    })
  })

  describe('Test Builders', () => {
    it('should build booking flow with default data', () => {
      const bookingFlow = new BookingFlowBuilder()
        .withDefaultRooms(2)
        .withDefaultCustomizations(1)
        .withDefaultOffers(2)
        .build()
      
      expect(bookingFlow.rooms).toHaveLength(2)
      expect(bookingFlow.customizations).toHaveLength(1)
      expect(bookingFlow.offers).toHaveLength(2)
    })

    it('should build pricing scenario with calculations', () => {
      const pricing = new PricingScenarioBuilder()
        .withRoom({ price: 100 })
        .withCustomization({ price: 25 })
        .withOffer({ price: 50 })
        .build()
      
      expect(pricing.items).toHaveLength(3)
      expect(pricing.pricing.subtotal).toBe(175)
      expect(pricing.total).toBeGreaterThan(175) // includes taxes
    })

    it('should handle different currencies in pricing scenario', () => {
      const pricing = new PricingScenarioBuilder()
        .withCurrency('USD')
        .withRoom({ price: 100 })
        .build()
      
      expect(pricing.currency).toBe('USD')
      expect(pricing.items[0].currency).toBe('USD')
    })
  })
})