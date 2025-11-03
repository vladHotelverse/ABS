/**
 * Best Practices Example
 *
 * Complete working example showing all architectural patterns working together.
 * Demonstrates the proper way to structure components following Phase 1-2 refactoring.
 *
 * Patterns shown:
 * 1. Business logic in hooks (useProductDisplay hook)
 * 2. Data formatting in utilities (formatProductList)
 * 3. Pure UI components (ProductCard, ProductStats)
 * 4. Parent handles visibility (filters before rendering)
 * 5. Parent handles validation (checks before rendering)
 * 6. Error boundary wraps components (ConfigurationErrorBoundary)
 */

import type { Meta, StoryObj } from '@storybook/react'
import React, { useMemo, useState } from 'react'
import { ConfigurationErrorBoundary } from '../components/ConfigurationErrorBoundary'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Product {
  id: string
  name: string
  price: number
  stock: number
  rating: number
  category: 'electronics' | 'clothing' | 'books'
}

interface ProductStats {
  totalProducts: number
  totalValue: number
  averagePrice: number
  averageRating: number
}

// ============================================================================
// BUSINESS LOGIC LAYER - Utilities & Hooks
// ============================================================================

/**
 * Utility: Format product for display
 * Pure function - no side effects
 */
const formatProductForDisplay = (product: Product) => {
  return {
    ...product,
    formattedPrice: `$${product.price.toFixed(2)}`,
    isInStock: product.stock > 0,
    hasGoodRating: product.rating >= 4,
  }
}

/**
 * Utility: Filter products by availability
 * Pure function - handles visibility logic
 */
const filterAvailableProducts = (products: Product[]): Product[] => {
  return products.filter(p => p.stock > 0)
}

/**
 * Utility: Calculate product statistics
 * Pure function - no side effects
 */
const calculateProductStats = (products: Product[]): ProductStats => {
  if (products.length === 0) {
    return {
      totalProducts: 0,
      totalValue: 0,
      averagePrice: 0,
      averageRating: 0,
    }
  }

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts
  const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts

  return {
    totalProducts,
    totalValue,
    averagePrice,
    averageRating,
  }
}

/**
 * Hook: Manage product display with filters and sorting
 * Business logic lives here, not in components
 */
const useProductDisplay = (products: Product[], options?: { onlyAvailable?: boolean }) => {
  const { onlyAvailable = true } = options ?? {}

  return useMemo(() => {
    // Step 1: Filter (visibility logic)
    let filtered = onlyAvailable ? filterAvailableProducts(products) : products

    // Step 2: Sort (business logic)
    const sorted = [...filtered].sort((a, b) => {
      // Prioritize: high rating, then in stock, then by name
      if (a.rating !== b.rating) return b.rating - a.rating
      if (a.stock > 0 && b.stock === 0) return -1
      if (a.stock === 0 && b.stock > 0) return 1
      return a.name.localeCompare(b.name)
    })

    // Step 3: Format (display formatting)
    const formatted = sorted.map(formatProductForDisplay)

    // Step 4: Calculate stats
    const stats = calculateProductStats(filtered)

    return {
      products: formatted,
      stats,
      hasProducts: filtered.length > 0,
    }
  }, [products, onlyAvailable])
}

// ============================================================================
// PURE UI COMPONENTS
// ============================================================================

/**
 * Pure component: Product Card
 * No business logic - just displays what it receives
 * Assumes all props are valid (TypeScript enforces)
 */
interface ProductCardProps {
  name: string
  price: string
  rating: number
  isInStock: boolean
  hasGoodRating: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  rating,
  isInStock,
  hasGoodRating,
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-lg">{name}</h3>
        {hasGoodRating && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">⭐ Top Rated</span>}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">{price}</span>
        <span className={`text-sm ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
          {isInStock ? '✓ In Stock' : '✗ Out of Stock'}
        </span>
      </div>

      <div className="flex items-center gap-1 text-sm text-yellow-500">
        {'⭐'.repeat(Math.floor(rating))}
        <span className="text-gray-500">{rating}/5</span>
      </div>

      <button className={`w-full py-2 rounded text-white font-medium ${
        isInStock
          ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          : 'bg-gray-400 cursor-not-allowed'
      }`}>
        {isInStock ? 'Add to Cart' : 'Unavailable'}
      </button>
    </div>
  )
}

/**
 * Pure component: Product Stats
 * No business logic - just displays stats
 */
interface ProductStatsProps {
  totalProducts: number
  totalValue: number
  averagePrice: number
  averageRating: number
}

const ProductStats: React.FC<ProductStatsProps> = ({
  totalProducts,
  totalValue,
  averagePrice,
  averageRating,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-6">
      <div>
        <p className="text-gray-600 text-sm">Total Products</p>
        <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
      </div>

      <div>
        <p className="text-gray-600 text-sm">Total Value</p>
        <p className="text-3xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
      </div>

      <div>
        <p className="text-gray-600 text-sm">Avg Price</p>
        <p className="text-3xl font-bold text-blue-600">${averagePrice.toFixed(2)}</p>
      </div>

      <div>
        <p className="text-gray-600 text-sm">Avg Rating</p>
        <p className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}/5</p>
      </div>
    </div>
  )
}

/**
 * Pure component: Product List
 * No business logic - just renders what it receives
 */
interface ProductListProps {
  products: Array<{
    id: string
    name: string
    formattedPrice: string
    rating: number
    isInStock: boolean
    hasGoodRating: boolean
  }>
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map(product => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.formattedPrice}
          rating={product.rating}
          isInStock={product.isInStock}
          hasGoodRating={product.hasGoodRating}
        />
      ))}
    </div>
  )
}

// ============================================================================
// CONTAINER COMPONENT - Orchestrates business logic
// ============================================================================

/**
 * Container: Product List Container
 * Orchestrates: hooks, utilities, parent validation, error handling
 * Demonstrates the complete pattern working together
 */
interface ProductListContainerProps {
  products: Product[]
  showUnavailable?: boolean
}

const ProductListContainer: React.FC<ProductListContainerProps> = ({
  products,
  showUnavailable = false,
}) => {
  // Step 1: Validate input data
  if (!Array.isArray(products)) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
        <p>Invalid products data</p>
      </div>
    )
  }

  // Step 2: Use hook for business logic
  const { products: displayProducts, stats, hasProducts } = useProductDisplay(products, {
    onlyAvailable: !showUnavailable,
  })

  // Step 3: Handle empty state (parent responsibility)
  if (!hasProducts && !showUnavailable) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
        <p>No products in stock</p>
      </div>
    )
  }

  // Step 4: Render with error boundary
  return (
    <ConfigurationErrorBoundary>
      <div className="space-y-6">
        {/* Stats section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Inventory Stats</h2>
          <ProductStats
            totalProducts={stats.totalProducts}
            totalValue={stats.totalValue}
            averagePrice={stats.averagePrice}
            averageRating={stats.averageRating}
          />
        </section>

        {/* Products section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <ProductList products={displayProducts} />
        </section>
      </div>
    </ConfigurationErrorBoundary>
  )
}

// ============================================================================
// STORYBOOK STORIES
// ============================================================================

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    stock: 15,
    rating: 4.8,
    category: 'electronics',
  },
  {
    id: '2',
    name: 'USB-C Cable',
    price: 9.99,
    stock: 0,
    rating: 4.2,
    category: 'electronics',
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    price: 24.99,
    stock: 50,
    rating: 4.5,
    category: 'clothing',
  },
  {
    id: '4',
    name: 'Jeans',
    price: 59.99,
    stock: 30,
    rating: 4.6,
    category: 'clothing',
  },
  {
    id: '5',
    name: 'JavaScript Book',
    price: 39.99,
    stock: 8,
    rating: 4.9,
    category: 'books',
  },
  {
    id: '6',
    name: 'Python Book',
    price: 44.99,
    stock: 0,
    rating: 4.7,
    category: 'books',
  },
]

const meta = {
  title: 'Patterns/Best Practices Example',
  component: ProductListContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Complete working example showing all architectural patterns working together. Shows proper separation of concerns between business logic, utilities, and UI components.',
      },
    },
  },
  argTypes: {
    showUnavailable: {
      control: 'boolean',
      description: 'Show unavailable products in the list',
    },
  },
} satisfies Meta<typeof ProductListContainer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Story: Shows all available products
 * Demonstrates:
 * - Business logic in hooks (useProductDisplay)
 * - Filtering (availability logic)
 * - Pure UI components
 * - Parent handles validation
 * - Error boundary wraps components
 */
export const WithAvailableProducts: Story = {
  args: {
    products: mockProducts,
    showUnavailable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows products that are in stock, sorted by rating and availability.',
      },
    },
  },
}

/**
 * Story: Shows all products including unavailable
 * Demonstrates:
 * - Same component, different behavior
 * - Parent controls visibility via props
 * - Reusability through configuration
 */
export const WithAllProducts: Story = {
  args: {
    products: mockProducts,
    showUnavailable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows all products including out-of-stock items, with visual indicators.',
      },
    },
  },
}

/**
 * Story: Empty state
 * Demonstrates:
 * - Parent handles empty state
 * - Graceful degradation
 * - User-friendly messaging
 */
export const EmptyProducts: Story = {
  args: {
    products: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows empty state when no products are available.',
      },
    },
  },
}

/**
 * Story: Single product category
 * Demonstrates:
 * - Filtering by criteria (done at parent level)
 * - Dynamic data selection
 * - Real-world use case
 */
export const ElectronicsOnly: Story = {
  render: (args) => (
    <ProductListContainer
      {...args}
      products={mockProducts.filter(p => p.category === 'electronics')}
    />
  ),
  args: {
    products: [],
    showUnavailable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filtered to show only electronics. Parent filters data before passing to container.',
      },
    },
  },
}

/**
 * Story: Interactive with toggle
 * Demonstrates:
 * - Component responsiveness to prop changes
 * - Real-time filtering
 * - User interaction handling
 */
export const InteractiveToggle: Story = {
  render: (args) => {
    const [showUnavailable, setShowUnavailable] = useState(false)

    return (
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showUnavailable}
            onChange={e => setShowUnavailable(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Show unavailable products</span>
        </label>

        <ProductListContainer {...args} showUnavailable={showUnavailable} />
      </div>
    )
  },
  args: {
    products: mockProducts,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive story showing real-time filtering. Toggle to show/hide unavailable products.',
      },
    },
  },
}

/**
 * Story: Pattern breakdown
 * Demonstrates:
 * - Architecture separation
 * - Each layer responsibility
 * - How patterns work together
 */
export const PatternBreakdown: Story = {
  render: (args) => {
    const { products: displayProducts, stats } = useProductDisplay(args.products)

    return (
      <div className="space-y-8">
        {/* Explain the pattern */}
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">Architecture Pattern</h3>
          <ul className="text-sm text-blue-900 space-y-1">
            <li>✓ <strong>Business Logic:</strong> useProductDisplay hook</li>
            <li>✓ <strong>Data Utilities:</strong> filterAvailableProducts, formatProductForDisplay</li>
            <li>✓ <strong>Pure Components:</strong> ProductCard, ProductStats, ProductList</li>
            <li>✓ <strong>Parent Validation:</strong> ProductListContainer checks input</li>
            <li>✓ <strong>Error Handling:</strong> ConfigurationErrorBoundary wraps all</li>
          </ul>
        </div>

        {/* Show the result */}
        <div>
          <h3 className="font-bold text-lg mb-4">Rendered Result</h3>
          <ProductListContainer {...args} />
        </div>

        {/* Show debug info */}
        <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-2">Debug Info</h3>
          <pre className="text-xs overflow-auto text-gray-700">
            {JSON.stringify({
              inputProducts: args.products.length,
              displayProducts: displayProducts.length,
              stats: {
                totalValue: stats.totalValue.toFixed(2),
                averagePrice: stats.averagePrice.toFixed(2),
                averageRating: stats.averageRating.toFixed(1),
              },
            }, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
  args: {
    products: mockProducts,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how each layer of the architecture works together with debug info.',
      },
    },
  },
}
