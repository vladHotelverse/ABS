import type React from 'react'
import { ABS_RoomCustomization } from '../../ABS_RoomCustomization'
import type { OrderData } from '../../../services/orderStorage'
import type { SelectedCustomizations } from '../../ABS_RoomCustomization/types'

export interface CustomizationsDisplayProps {
  orderData: OrderData
  processedSectionData: {
    sectionsData: any[]
    sectionOptions: Record<string, any[]>
  }
}

export const CustomizationsDisplay: React.FC<CustomizationsDisplayProps> = ({
  orderData,
  processedSectionData
}) => {
  if (orderData.selections.customizations.length === 0) {
    return null
  }

  // Convert customizations for display
  const convertedCustomizations = (): SelectedCustomizations => {
    const converted: SelectedCustomizations = {}
    
    // Map English categories to Spanish section keys
    const categoryMapping: Record<string, string> = {
      'beds': 'camas',
      'view': 'vista', 
      'exactView': 'vistaExacta',
      'distribution': 'distribucion',
      'features': 'features',
      'orientation': 'orientation',
      'location': 'ubicacion'
    }
    
    orderData.selections.customizations.forEach((customization) => {
      let sectionKey = customization.category
      
      if (customization.category && categoryMapping[customization.category]) {
        sectionKey = categoryMapping[customization.category]
      } else if (customization.category) {
        sectionKey = customization.category
      } else {
        // Try to infer category from the customization name
        if (customization.name.toLowerCase().includes('bed')) {
          sectionKey = 'camas'
        } else if (customization.name.toLowerCase().includes('view')) {
          sectionKey = 'vista'
        } else {
          sectionKey = 'features'
        }
      }
      
      if (sectionKey) {
        converted[sectionKey] = {
          id: customization.id,
          label: customization.name,
          price: customization.price,
        }
      }
    })
    
    return converted
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Room Customizations</h2>
      <div className="order-consultation-mode">
        <ABS_RoomCustomization
          title="Room Customizations"
          subtitle="Selected customizations for your room"
          sections={processedSectionData.sectionsData}
          sectionOptions={processedSectionData.sectionOptions}
          initialSelections={convertedCustomizations()}
          onCustomizationChange={() => {}} // Disabled in consultation mode
          mode="consultation"
          readonly={true}
          texts={{
            improveText: 'Upgrade',
            selectedText: 'Selected',
            selectText: 'Select',
            pricePerNightText: 'EUR/night',
            featuresText: 'Features and benefits',
            understood: 'Got it',
            addForPriceText: 'Add for',
            availableOptionsText: 'Available Options:',
            removeText: 'Remove',
            showMoreText: 'Show More',
            showLessText: 'Show Less',
            optionDisabledText: 'Not Available',
            conflictWithText: 'Conflicts with',
            keepCurrentText: 'Keep Current Selection',
            switchToNewText: 'Switch to New Option',
            conflictDialogTitle: 'Option Conflict',
            conflictDialogDescription: 'These options cannot be selected together.',
          }}
        />
      </div>
    </div>
  )
}