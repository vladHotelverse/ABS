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
    <ul className="space-y-4">
      {categories.map((category) => {
        const isOpen = openCategories[category.id] ?? true
        const showCategoryInfo = showInfo[category.id] ?? false
        const showAll = showAllAttributes[category.id] ?? false
        const shouldShowMoreButton = category.attributes.length > initialItemsCount
        const sortedAttributes = [...category.attributes].sort(
          (a, b) => (a.exclusivityRatio ?? 0) - (b.exclusivityRatio ?? 0)
        )
        const displayAttributes = showAll ? sortedAttributes : sortedAttributes.slice(0, initialItemsCount)
        const remainingCount = category.attributes.length - initialItemsCount
        const hasAccordion = category.attributes.length > 4

        // Render without accordion if 4 or fewer items
        if (!hasAccordion) {
          return (
            <li key={category.id}>
              <h4 className="mb-4 font-medium text-foreground text-lg sm:font-semibold sm:text-lg">{category.name}</h4>
              <ul className="grid grid-cols-1 gap-4 transition-all duration-300 sm:grid-cols-2 2xl:grid-cols-3">
                {sortedAttributes.map((attribute) => renderAttributeCard(attribute, category.id))}
              </ul>
            </li>
          )
        }

        // Render with accordion if more than 4 items
        return (
          <li key={category.id} className="overflow-hidden rounded-lg bg-card">
            {/* Section Header */}
            <div className="relative flex w-full items-center justify-between border-neutral-200 border-b-2 py-3">
              <button
                className="flex w-full cursor-pointer items-center justify-between text-left"
                onClick={() => toggleCategory(category.id)}
                type="button"
              >
                <div className="flex items-center">
                  <h4 className="pl-10 font-medium text-foreground text-lg sm:font-semibold sm:text-xl">
                    {category.name}
                  </h4>
                </div>
                <span className="text-muted-foreground">
                  {isOpen ? (
                    <Icon icon="solar:alt-arrow-up-bold" className="h-6 w-6" />
                  ) : (
                    <Icon icon="solar:alt-arrow-down-bold" className="h-6 w-6" />
                  )}
                </span>
              </button>
              {category.description && (
                <button
                  onClick={(e) => toggleInfo(category.id, e)}
                  className="absolute left-0 ml-2 text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  <Icon icon="solar:info-circle-bold" className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Section Content */}
            {isOpen && (
              <div>
                {/* Info Panel */}
                {category.description && showCategoryInfo && (
                  <div className="col-span-full px-4 pt-4 transition-all duration-300 ease-in-out">
                    <div className="flex items-start justify-between rounded-lg bg-accent p-3 text-accent-foreground text-sm">
                      {category.description}
                      <button
                        onClick={() => setShowInfo((prev) => ({ ...prev, [category.id]: false }))}
                        className="ml-4 rounded-full p-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                        type="button"
                      >
                        <Icon icon="solar:close-circle-bold" className="h-4 w-4 text-accent-foreground" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Attributes Grid */}
                <ul className="grid grid-cols-1 gap-4 p-4 transition-all duration-300 sm:grid-cols-2 2xl:grid-cols-3">
                  {displayAttributes.map((attribute) => renderAttributeCard(attribute, category.id))}
                </ul>

                {/* Show More/Less Button */}
                {shouldShowMoreButton && (
                  <div className="col-span-full flex justify-center pb-4">
                    <button
                      onClick={() => toggleShowAllAttributes(category.id)}
                      className="rounded-lg border border-border px-4 py-2 font-medium text-primary text-sm transition-colors duration-200 hover:border-ring hover:bg-accent hover:text-primary/80"
                      type="button"
                    >
                      {showAll ? 'Show Less' : `Show More (${remainingCount} more)`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default AttributesCategories
