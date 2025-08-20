import {
  createMockRoomOption,
  createMockPricingItem,
  createMockSpecialOffer,
  createMockCustomization,
  createMockBookingState,
  createMockAvailableSection,
} from './mock-factory'

/**
 * Builder for creating complete booking flow scenarios
 */
export class BookingFlowBuilder {
  private rooms: any[] = []
  private customizations: any[] = []
  private offers: any[] = []
  private availableSections: any[] = []
  private bookingState: any = createMockBookingState()

  withRooms(rooms: any[]) {
    this.rooms = rooms
    return this
  }

  withCustomizations(customizations: any[]) {
    this.customizations = customizations
    return this
  }

  withOffers(offers: any[]) {
    this.offers = offers
    return this
  }

  withAvailableSections(sections: any[]) {
    this.availableSections = sections
    return this
  }

  withBookingState(state: any) {
    this.bookingState = { ...this.bookingState, ...state }
    return this
  }

  // Convenience methods for common scenarios
  withDefaultRooms(count = 3) {
    this.rooms = Array.from({ length: count }, (_, index) => 
      createMockRoomOption({
        name: `Room Type ${index + 1}`,
        price: 150 + (index * 50),
      })
    )
    return this
  }

  withDefaultCustomizations(count = 2) {
    this.customizations = Array.from({ length: count }, (_, index) =>
      createMockCustomization({
        name: `Upgrade ${index + 1}`,
        price: 25 + (index * 15),
      })
    )
    return this
  }

  withDefaultOffers(count = 3) {
    this.offers = Array.from({ length: count }, (_, index) =>
      createMockSpecialOffer({
        title: `Special Offer ${index + 1}`,
        price: 50 + (index * 20),
      })
    )
    return this
  }

  withDefaultAvailableSections() {
    this.availableSections = [
      createMockAvailableSection({ type: 'room', label: 'Room Selection', count: this.rooms.length }),
      createMockAvailableSection({ type: 'customization', label: 'Room Upgrades', count: this.customizations.length }),
      createMockAvailableSection({ type: 'offer', label: 'Special Offers', count: this.offers.length }),
    ]
    return this
  }

  build() {
    return {
      rooms: this.rooms,
      customizations: this.customizations,
      offers: this.offers,
      availableSections: this.availableSections,
      bookingState: this.bookingState,
    }
  }
}

/**
 * Builder for creating pricing scenarios with automatic calculations
 */
export class PricingScenarioBuilder {
  private items: any[] = []
  private subtotal = 0
  private taxes = 0
  private currency = 'EUR'
  private taxRate = 0.21 // 21% default tax rate

  withItems(items: any[]) {
    this.items = items
    this.recalculateTotals()
    return this
  }

  withCurrency(currency: string) {
    this.currency = currency
    return this
  }

  withTaxRate(rate: number) {
    this.taxRate = rate
    this.recalculateTotals()
    return this
  }

  withRoom(room: Partial<any> = {}) {
    const roomItem = createMockPricingItem({ 
      type: 'room',
      title: 'Standard Room',
      price: 150,
      ...room 
    })
    this.items.push(roomItem)
    this.recalculateTotals()
    return this
  }

  withCustomization(customization: Partial<any> = {}) {
    const customizationItem = createMockPricingItem({ 
      type: 'customization',
      title: 'Room Upgrade',
      price: 50,
      ...customization 
    })
    this.items.push(customizationItem)
    this.recalculateTotals()
    return this
  }

  withOffer(offer: Partial<any> = {}) {
    const offerItem = createMockPricingItem({ 
      type: 'offer',
      title: 'Spa Package',
      price: 75,
      ...offer 
    })
    this.items.push(offerItem)
    this.recalculateTotals()
    return this
  }

  withTaxes(taxes: number) {
    this.taxes = taxes
    return this
  }

  private recalculateTotals() {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity || 1), 0)
    this.taxes = Math.round(this.subtotal * this.taxRate * 100) / 100
  }

  build() {
    return {
      items: this.items.map(item => ({ ...item, currency: this.currency })),
      pricing: {
        subtotal: this.subtotal,
        taxes: this.taxes,
      },
      total: this.subtotal + this.taxes,
      currency: this.currency,
    }
  }
}

/**
 * Builder for creating multi-booking scenarios
 */
export class MultiBookingBuilder {
  private bookings: any[] = []

  withBooking(booking: any) {
    this.bookings.push(booking)
    return this
  }

  withDefaultBookings(count = 2) {
    this.bookings = Array.from({ length: count }, (_, index) => 
      new BookingFlowBuilder()
        .withDefaultRooms(1)
        .withBookingState({
          selectedRoom: createMockRoomOption({ name: `Room ${index + 1}` }),
          guests: { adults: 2, children: index },
        })
        .build()
    )
    return this
  }

  build() {
    return {
      bookings: this.bookings,
      totalBookings: this.bookings.length,
      totalGuests: this.bookings.reduce((sum, booking) => 
        sum + booking.bookingState.guests.adults + booking.bookingState.guests.children, 0
      ),
    }
  }
}