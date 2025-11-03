import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { AttributeCard, AttributesCategories } from '@/components/upsell/RoomCustomization/components'
import type { RoomCustomizationCategory } from '../mockData'

export type { RoomCustomizationAttribute, RoomCustomizationCategory } from '../mockData'
export {
  consultationPreviewSelection,
  defaultRoomCustomizationCategories,
  limitedAvailabilityAttributeIds,
} from '../mockData'

export type RoomCustomizationPreviewProps = {
  title: string
  description: string
  currency: string
  nights: number
  categories: RoomCustomizationCategory[]
  initialSelectedIds?: number[]
  readonly?: boolean
  disabledAttributes?: number[]
}

export const RoomCustomizationPreview: React.FC<RoomCustomizationPreviewProps> = ({
  title,
  description,
  currency,
  nights,
  categories,
  initialSelectedIds = [],
  readonly = false,
  disabledAttributes = [],
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, boolean>>(() => {
    return initialSelectedIds.reduce(
      (acc, id) => {
        acc[id] = true
        return acc
      },
      {} as Record<number, boolean>
    )
  })

  useEffect(() => {
    setSelectedAttributes(
      initialSelectedIds.reduce(
        (acc, id) => {
          acc[id] = true
          return acc
        },
        {} as Record<number, boolean>
      )
    )
  }, [initialSelectedIds.join(',')])

  const disabledSet = useMemo(() => new Set(disabledAttributes), [disabledAttributes])

  const toggleAttribute = (attributeId: number) => {
    if (readonly || disabledSet.has(attributeId)) return
    setSelectedAttributes((prev) => {
      const next = { ...prev }
      next[attributeId] = !next[attributeId]
      if (!next[attributeId]) {
        delete next[attributeId]
      }
      return next
    })
  }

  const selectedSummary = useMemo(() => {
    const items: Array<{ id: number; label: string; perStay: number }> = []
    let totalPerStay = 0

    for (const category of categories) {
      for (const attribute of category.attributes) {
        if (selectedAttributes[attribute.id]) {
          items.push({ id: attribute.id, label: attribute.name, perStay: attribute.amount })
          totalPerStay += attribute.amount
        }
      }
    }

    const totalPerNight = nights ? totalPerStay / nights : totalPerStay

    return {
      items,
      totalPerStay,
      totalPerNight,
    }
  }, [categories, nights, selectedAttributes])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-semibold text-foreground text-xl">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <AttributesCategories
        categories={categories}
        renderAttributeCard={(attribute) => {
          const isSelected = Boolean(selectedAttributes[attribute.id])
          const disabled = Boolean(attribute.disabled || disabledSet.has(attribute.id))
          const pricePerNight = nights ? attribute.amount / nights : attribute.amount

          return (
            <AttributeCard
              key={attribute.id}
              attribute={attribute}
              isSelected={isSelected}
              disabled={disabled}
              onToggle={() => toggleAttribute(attribute.id)}
              originalPrice={pricePerNight}
              displayCurrency={currency}
              readonly={readonly}
            />
          )
        }}
      />
      <div className="rounded-lg bg-muted p-4 shadow-inner">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">Selected add-ons</p>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary text-xs">
            {selectedSummary.items.length} selected
          </span>
        </div>
        {selectedSummary.items.length ? (
          <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
            {selectedSummary.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span>
                  {item.perStay.toFixed(2)} {currency} / stay
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted-foreground text-sm">
            Nothing selected yet. Toggle an add-on to preview totals.
          </p>
        )}
        <div className="mt-4 border-border border-t pt-3 text-sm">
          <div className="flex items-center justify-between text-foreground">
            <span>Total per stay</span>
            <span className="font-semibold">
              {selectedSummary.totalPerStay.toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total per night</span>
            <span>
              {selectedSummary.totalPerNight.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
