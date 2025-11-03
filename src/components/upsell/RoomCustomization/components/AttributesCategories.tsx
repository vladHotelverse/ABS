'use client'

import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface Attribute {
  id: number
  name: string
  description?: string
  icon: string
  amount?: number
  exclusivityRatio?: number
}

interface Category {
  id: number
  name: string
  description?: string
  attributes: Attribute[]
}

interface AttributesCategoriesProps {
  categories: Category[]
  renderAttributeCard: (attribute: Attribute, categoryId: number) => React.ReactNode
  initialItemsCount?: number
}

const AttributesCategories: React.FC<AttributesCategoriesProps> = ({
  categories,
  renderAttributeCard,
  initialItemsCount: _defaultInitialItemsCount = 3,
}) => {
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({})
  const [showInfo, setShowInfo] = useState<Record<number, boolean>>({})
  const [showAllAttributes, setShowAllAttributes] = useState<Record<number, boolean>>({})

  // Use breakpoint hook for responsive initial items count
  const breakpoint = useBreakpoint()
  const initialItemsCount = breakpoint === '2xl' ? 3 : breakpoint === 'mobile' ? 1 : 2

  // Initialize all categories as open
  useEffect(() => {
    const initialOpenState = categories.reduce(
      (acc, category) => {
        acc[category.id] = true
        return acc
      },
      {} as Record<number, boolean>
    )
    setOpenCategories(initialOpenState)
  }, [categories.length])

  const toggleCategory = (categoryId: number) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const toggleInfo = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInfo((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const toggleShowAllAttributes = (categoryId: number) => {
    setShowAllAttributes((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <ul className="space-y-8">
      {categories.map((category) => {
        const showAll = showAllAttributes[category.id] ?? false
        const shouldShowMoreButton = category.attributes.length > initialItemsCount
        const sortedAttributes = [...category.attributes].sort(
          (a, b) => (a.exclusivityRatio ?? 0) - (b.exclusivityRatio ?? 0)
        )
        const displayAttributes = showAll ? sortedAttributes : sortedAttributes.slice(0, initialItemsCount)
        const remainingCount = category.attributes.length - initialItemsCount

        return (
          <li key={category.id}>
            {/* Section Header - Simple title only */}
            <h4 className="mb-4 font-medium text-foreground text-lg sm:font-semibold sm:text-lg">{category.name}</h4>

            {/* Attributes Grid */}
            <ul className="grid grid-cols-1 gap-4 transition-all duration-300 sm:grid-cols-2 2xl:grid-cols-3">
              {displayAttributes.map((attribute) => renderAttributeCard(attribute, category.id))}
            </ul>

            {/* Show More/Less Button */}
            {shouldShowMoreButton && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => toggleShowAllAttributes(category.id)}
                  className="rounded-lg border border-border px-4 py-2 font-medium text-primary text-sm transition-colors duration-200 hover:border-ring hover:bg-accent hover:text-primary/80"
                  type="button"
                >
                  {showAll ? 'Show Less' : `Show More (${remainingCount} more)`}
                </button>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default AttributesCategories
