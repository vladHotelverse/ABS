import type React from 'react'
import { memo } from 'react'
import type { PricingItem } from '../types'

// Section configuration interface
export interface SectionConfig {
  id: string
  title: string
  items: PricingItem[]
  shouldRender?: boolean
  className?: string
  ariaLabelledBy?: string
}

export interface SectionRendererProps {
  sections: SectionConfig[]
  euroSuffix: string
  onRemoveItem: (item: PricingItem) => void
  renderSection?: (section: SectionConfig, euroSuffix: string, onRemoveItem: (item: PricingItem) => void) => React.ReactNode
}

const SectionRenderer: React.FC<SectionRendererProps> = memo(({
  sections,
  euroSuffix,
  onRemoveItem,
  renderSection
}) => {
  // Filter out sections that shouldn't render or have no items
  const sectionsToRender = sections.filter(section => {
    const hasItems = section.items.length > 0
    const shouldRender = section.shouldRender !== false
    return hasItems && shouldRender
  })

  if (sectionsToRender.length === 0) return null

  return (
    <>
      {sectionsToRender.map((section) => {
        if (renderSection) {
          return renderSection(section, euroSuffix, onRemoveItem)
        }
        
        // Default section rendering
        return (
          <section 
            key={section.id}
            aria-labelledby={section.ariaLabelledBy || `${section.id}-section-title`}
            className={section.className || "bg-gray-50 rounded-lg p-3 mb-4"}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 
                id={section.ariaLabelledBy || `${section.id}-section-title`} 
                className="text-base font-semibold"
              >
                {section.title}
              </h3>
            </div>
            {section.items.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {item.price}{euroSuffix}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${item.name}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )
      })}
    </>
  )
})

SectionRenderer.displayName = 'SectionRenderer'

export default SectionRenderer