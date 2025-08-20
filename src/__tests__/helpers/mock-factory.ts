import { faker } from '@faker-js/faker'

// Mock factory for room options
export const createMockRoomOption = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 100, max: 500 }),
  currency: 'EUR',
  images: [faker.image.url()],
  features: Array.from({ length: 3 }, () => faker.lorem.word()),
  maxOccupancy: faker.number.int({ min: 1, max: 4 }),
  size: faker.number.int({ min: 20, max: 60 }),
  available: true,
  ...overrides,
})

// Mock factory for pricing items
export const createMockPricingItem = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(['room', 'customization', 'offer']),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 10, max: 200 }),
  currency: 'EUR',
  quantity: 1,
  category: faker.lorem.word(),
  isRemovable: true,
  ...overrides,
})

// Mock factory for special offers
export const createMockSpecialOffer = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 20, max: 150 }),
  originalPrice: faker.number.int({ min: 30, max: 200 }),
  currency: 'EUR',
  discount: faker.number.int({ min: 10, max: 50 }),
  image: faker.image.url(),
  validFrom: faker.date.future(),
  validTo: faker.date.future(),
  maxQuantity: faker.number.int({ min: 1, max: 5 }),
  category: faker.helpers.arrayElement(['spa', 'dining', 'activities', 'packages']),
  isAvailable: true,
  ...overrides,
})

// Mock factory for customization options
export const createMockCustomization = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 15, max: 100 }),
  currency: 'EUR',
  icon: faker.helpers.arrayElement(['bed', 'wifi', 'tv', 'bath', 'view']),
  category: faker.helpers.arrayElement(['upgrade', 'amenity', 'service']),
  isAvailable: true,
  isSelected: false,
  maxQuantity: faker.number.int({ min: 1, max: 3 }),
  ...overrides,
})

// Mock factory for booking state
export const createMockBookingState = (overrides: Partial<any> = {}) => ({
  selectedRoom: null,
  customizations: [],
  offers: [],
  guests: {
    adults: 2,
    children: 0,
  },
  dates: {
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  pricing: {
    subtotal: 0,
    taxes: 0,
    total: 0,
  },
  currency: 'EUR',
  locale: 'en-US',
  ...overrides,
})

// Mock factory for available sections
export const createMockAvailableSection = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(['room', 'customization', 'offer']),
  label: faker.commerce.department(),
  count: faker.number.int({ min: 0, max: 10 }),
  isExpanded: false,
  ...overrides,
})

// Mock factory for pricing labels (for internationalization)
export const createMockPricingLabels = (overrides: Partial<any> = {}) => ({
  roomImageAltText: 'Room image',
  customizeStayTitle: 'Customize Your Stay',
  subtotalLabel: 'Subtotal',
  taxesLabel: 'Taxes & Fees',
  totalLabel: 'Total',
  perNightLabel: 'per night',
  confirmAllLabel: 'Confirm All',
  removeLabel: 'Remove',
  loadingLabel: 'Loading...',
  emptyStateMessage: 'No items selected',
  ...overrides,
})