'use client'

import { useMemo, useState } from 'react'

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
  displayConfig?: {
    initialVisibleCount?: number
    showMoreThreshold?: number
    showMoreLabel?: (remaining: number) => string
    showLessLabel?: string
  }
}

const AttributesCategories: React.FC<AttributesCategoriesProps> = ({
  categories,
  renderAttributeCard,
  initialItemsCount: legacyInitialCount,
  displayConfig,
}) => {
  const [showAllAttributes, setShowAllAttributes] = useState<Record<number, boolean>>({})

  const config = useMemo(() => {
    const initialVisibleCount = displayConfig?.initialVisibleCount ?? legacyInitialCount ?? 3
    const showMoreThreshold = displayConfig?.showMoreThreshold ?? initialVisibleCount
    return {
      initialVisibleCount,
      showMoreThreshold,
      showMoreLabel: displayConfig?.showMoreLabel,
      showLessLabel: displayConfig?.showLessLabel,
    }
  }, [categories.length, displayConfig, legacyInitialCount])

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
        const shouldShowMoreButton = category.attributes.length > config.showMoreThreshold
        const displayAttributes = showAll
          ? category.attributes
          : category.attributes.slice(0, config.initialVisibleCount)
        const remainingCount = Math.max(category.attributes.length - config.initialVisibleCount, 0)
        const showMoreLabel =
          config.showMoreLabel?.(remainingCount) ?? `Show More${remainingCount > 0 ? ` (${remainingCount} more)` : ''}`
        const showLessLabel = config.showLessLabel ?? 'Show Less'

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
                  {showAll ? showLessLabel : showMoreLabel}
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
