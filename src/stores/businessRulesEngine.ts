/**
 * Business Rules Engine
 * Centralized business logic and compatibility rules for booking system
 */

import type { BookingItem, RoomBooking } from './bookingStore'

// Rule definitions
export interface BusinessRule {
  id: string
  name: string
  type: 'validation' | 'compatibility' | 'pricing' | 'availability'
  severity: 'error' | 'warning' | 'info'
  priority: number
}

export interface CompatibilityRule extends BusinessRule {
  type: 'compatibility'
  rule: 'mutually_exclusive' | 'requires' | 'prevents' | 'enhances'
  itemTypes: string[]
  categories?: string[]
  message: string
  resolution?: string
}

export interface ValidationRule extends BusinessRule {
  type: 'validation'
  validate: (item: BookingItem, room: RoomBooking) => ValidationResult
  message: string
}

export interface PricingRule extends BusinessRule {
  type: 'pricing'
  applyTo: string[]
  calculate: (items: BookingItem[], room: RoomBooking) => number
  description: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  conflicts: ConflictInfo[]
}

export interface ConflictInfo {
  conflictingItems: string[]
  ruleId: string
  severity: 'error' | 'warning' | 'info'
  message: string
  possibleResolutions: string[]
}

/**
 * Core Business Rules Configuration
 */
export const COMPATIBILITY_RULES: CompatibilityRule[] = [
  // Room selection rules
  {
    id: 'room-selection-exclusive',
    name: 'Only one room selection allowed',
    type: 'compatibility',
    rule: 'mutually_exclusive',
    severity: 'error',
    priority: 1,
    itemTypes: ['room'],
    message: 'Only one room can be selected at a time',
    resolution: 'Remove current room selection to choose a different room'
  },
  
  // Bidding rules
  {
    id: 'bid-room-exclusive',
    name: 'Bids and room selections are mutually exclusive',
    type: 'compatibility',
    rule: 'mutually_exclusive',
    severity: 'error',
    priority: 1,
    itemTypes: ['room', 'bid'],
    message: 'Cannot have both a room selection and a bid for upgrade',
    resolution: 'Either select a room or place a bid, not both'
  },
  
  // View customization rules
  {
    id: 'view-exclusive',
    name: 'Only one view type allowed',
    type: 'compatibility',
    rule: 'mutually_exclusive',
    severity: 'error',
    priority: 2,
    itemTypes: ['customization'],
    categories: ['view'],
    message: 'Only one view preference can be selected',
    resolution: 'Choose either ocean view, city view, or garden view'
  },
  
  // Bed type rules
  {
    id: 'bed-exclusive',
    name: 'Only one bed type allowed',
    type: 'compatibility',
    rule: 'mutually_exclusive',
    severity: 'error',
    priority: 2,
    itemTypes: ['customization'],
    categories: ['beds'],
    message: 'Only one bed configuration can be selected',
    resolution: 'Choose either king bed, queen bed, or twin beds'
  },
  
  // Floor preference rules
  {
    id: 'floor-exclusive',
    name: 'Only one floor preference allowed',
    type: 'compatibility',
    rule: 'mutually_exclusive',
    severity: 'error',
    priority: 2,
    itemTypes: ['customization'],
    categories: ['floor'],
    message: 'Only one floor preference can be selected',
    resolution: 'Choose either high floor or low floor preference'
  },
  
  // Ocean view requires high floor
  {
    id: 'ocean-view-high-floor',
    name: 'Ocean view requires high floor',
    type: 'compatibility',
    rule: 'requires',
    severity: 'warning',
    priority: 3,
    itemTypes: ['customization'],
    categories: ['view', 'floor'],
    message: 'Ocean view typically requires high floor (5th floor or above)',
    resolution: 'Consider selecting high floor preference for better ocean views'
  },
  
  // Spa access enhances wellness offers
  {
    id: 'spa-wellness-enhancement',
    name: 'Spa access enhances wellness offers',
    type: 'compatibility',
    rule: 'enhances',
    severity: 'info',
    priority: 5,
    itemTypes: ['offer'],
    message: 'Spa access works great with other wellness offers',
    resolution: 'Consider adding massage or wellness package for complete experience'
  }
]

export const VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'room-capacity-check',
    name: 'Room capacity validation',
    type: 'validation',
    severity: 'error',
    priority: 1,
    message: 'Room capacity exceeded',
    validate: (item: BookingItem, room: RoomBooking): ValidationResult => {
      // Implement room capacity validation logic
      if (item.type === 'room' && room.guests && room.guests > 4) {
        return {
          isValid: false,
          errors: ['Room capacity exceeded'],
          warnings: [],
          conflicts: []
        }
      }
      return {
        isValid: true,
        errors: [],
        warnings: [],
        conflicts: []
      }
    }
  },
  
  {
    id: 'offer-availability-check',
    name: 'Special offer availability',
    type: 'validation',
    severity: 'warning',
    priority: 2,
    message: 'Offer may not be available for selected dates',
    validate: (item: BookingItem, _room: RoomBooking): ValidationResult => {
      if (item.type === 'offer') {
        // Check offer availability logic
        const isAvailable = true // Placeholder for actual availability check
        
        return {
          isValid: isAvailable,
          errors: isAvailable ? [] : ['Offer not available for selected dates'],
          warnings: [],
          conflicts: []
        }
      }
      
      return {
        isValid: true,
        errors: [],
        warnings: [],
        conflicts: []
      }
    }
  }
]

export const PRICING_RULES: PricingRule[] = [
  {
    id: 'multi-offer-discount',
    name: 'Multiple offer discount',
    type: 'pricing',
    severity: 'info',
    priority: 3,
    applyTo: ['offer'],
    description: 'Apply 10% discount when 3 or more offers are selected',
    calculate: (items, _room) => {
      const offerItems = items.filter(item => item.type === 'offer')
      if (offerItems.length >= 3) {
        const offerTotal = offerItems.reduce((sum, item) => sum + item.price, 0)
        return offerTotal * 0.1 // 10% discount
      }
      return 0
    }
  },
  
  {
    id: 'night-duration-multiplier',
    name: 'Multi-night pricing',
    type: 'pricing',
    severity: 'info',
    priority: 2,
    applyTo: ['customization'],
    description: 'Apply per-night pricing for customizations',
    calculate: (items, room) => {
      const customizationItems = items.filter(item => item.type === 'customization')
      const additionalNights = Math.max(0, room.nights - 1)
      
      return customizationItems.reduce((total, item) => {
        // Some customizations apply per night
        const isPerNight = item.metadata?.perNight || false
        return total + (isPerNight ? item.price * additionalNights : 0)
      }, 0)
    }
  }
]

/**
 * Business Rules Engine Implementation
 */
export class BusinessRulesEngine {
  private compatibilityRules: CompatibilityRule[]
  private validationRules: ValidationRule[]
  private pricingRules: PricingRule[]
  
  constructor() {
    this.compatibilityRules = COMPATIBILITY_RULES
    this.validationRules = VALIDATION_RULES
    this.pricingRules = PRICING_RULES
  }
  
  /**
   * Check compatibility when adding an item to a room
   */
  checkCompatibility(
    newItem: BookingItem, 
    existingItems: BookingItem[], 
    room: RoomBooking
  ): ValidationResult {
    const conflicts: ConflictInfo[] = []
    const errors: string[] = []
    const warnings: string[] = []
    
    // Check all compatibility rules
    for (const rule of this.compatibilityRules) {
      const ruleResult = this.evaluateCompatibilityRule(rule, newItem, existingItems, room)
      
      if (!ruleResult.isValid) {
        const conflict: ConflictInfo = {
          conflictingItems: ruleResult.conflictingItems || [],
          ruleId: rule.id,
          severity: rule.severity,
          message: rule.message,
          possibleResolutions: rule.resolution ? [rule.resolution] : []
        }
        
        conflicts.push(conflict)
        
        if (rule.severity === 'error') {
          errors.push(rule.message)
        } else if (rule.severity === 'warning') {
          warnings.push(rule.message)
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      conflicts
    }
  }
  
  /**
   * Validate all items in a room
   */
  validateRoom(room: RoomBooking): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const conflicts: ConflictInfo[] = []
    
    // Run validation rules for each item
    for (const item of room.items) {
      for (const rule of this.validationRules) {
        const result = rule.validate(item, room)
        
        errors.push(...result.errors)
        warnings.push(...result.warnings)
        conflicts.push(...result.conflicts)
      }
    }
    
    // Check compatibility between existing items
    for (let i = 0; i < room.items.length; i++) {
      for (let j = i + 1; j < room.items.length; j++) {
        const compatibilityResult = this.checkItemCompatibility(
          room.items[i], 
          room.items[j], 
          room
        )
        
        if (!compatibilityResult.isValid) {
          errors.push(...compatibilityResult.errors)
          warnings.push(...compatibilityResult.warnings)
          conflicts.push(...compatibilityResult.conflicts)
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: [...new Set(errors)], // Remove duplicates
      warnings: [...new Set(warnings)],
      conflicts
    }
  }
  
  /**
   * Calculate dynamic pricing adjustments
   */
  calculatePricingAdjustments(room: RoomBooking): {
    discounts: number
    surcharges: number
    details: Array<{ ruleId: string; amount: number; description: string }>
  } {
    let totalDiscounts = 0
    let totalSurcharges = 0
    const details: Array<{ ruleId: string; amount: number; description: string }> = []
    
    for (const rule of this.pricingRules) {
      const relevantItems = room.items.filter(item => 
        rule.applyTo.includes(item.type)
      )
      
      if (relevantItems.length > 0) {
        const adjustment = rule.calculate(relevantItems, room)
        
        if (adjustment !== 0) {
          details.push({
            ruleId: rule.id,
            amount: adjustment,
            description: rule.description
          })
          
          if (adjustment > 0) {
            totalSurcharges += adjustment
          } else {
            totalDiscounts += Math.abs(adjustment)
          }
        }
      }
    }
    
    return {
      discounts: totalDiscounts,
      surcharges: totalSurcharges,
      details
    }
  }
  
  /**
   * Get suggestions for resolving conflicts
   */
  getResolutionSuggestions(conflicts: ConflictInfo[]): Array<{
    action: 'remove' | 'replace' | 'modify'
    targetItemId: string
    suggestion: string
    priority: number
  }> {
    const suggestions: Array<{
      action: 'remove' | 'replace' | 'modify'
      targetItemId: string
      suggestion: string
      priority: number
    }> = []
    
    for (const conflict of conflicts) {
      const rule = this.compatibilityRules.find(r => r.id === conflict.ruleId)
      
      if (rule && conflict.conflictingItems.length > 0) {
        // Generate contextual suggestions based on rule type
        if (rule.rule === 'mutually_exclusive') {
          suggestions.push({
            action: 'remove',
            targetItemId: conflict.conflictingItems[0],
            suggestion: `Remove ${conflict.conflictingItems[0]} to add the new selection`,
            priority: rule.priority
          })
        }
      }
    }
    
    return suggestions.sort((a, b) => a.priority - b.priority)
  }
  
  /**
   * Private helper methods
   */
  private evaluateCompatibilityRule(
    rule: CompatibilityRule,
    newItem: BookingItem,
    existingItems: BookingItem[],
    _room: RoomBooking
  ): { isValid: boolean; conflictingItems?: string[] } {
    // Skip if rule doesn't apply to this item type
    if (!rule.itemTypes.includes(newItem.type)) {
      return { isValid: true }
    }
    
    // Skip if rule specifies categories and item doesn't match
    if (rule.categories && rule.categories.length > 0) {
      if (!newItem.category || !rule.categories.includes(newItem.category)) {
        return { isValid: true }
      }
    }
    
    // Apply rule logic
    switch (rule.rule) {
      case 'mutually_exclusive':
        return this.checkMutualExclusion(rule, newItem, existingItems)
        
      case 'requires':
        return this.checkRequirement(rule, newItem, existingItems)
        
      case 'prevents':
        return this.checkPrevention(rule, newItem, existingItems)
        
      default:
        return { isValid: true }
    }
  }
  
  private checkMutualExclusion(
    rule: CompatibilityRule,
    newItem: BookingItem,
    existingItems: BookingItem[]
  ): { isValid: boolean; conflictingItems?: string[] } {
    const conflictingItems: string[] = []
    
    for (const existingItem of existingItems) {
      // Check type conflict
      if (rule.itemTypes.includes(existingItem.type) && 
          rule.itemTypes.includes(newItem.type)) {
        
        // If categories are specified, check category conflict
        if (rule.categories && rule.categories.length > 0) {
          if (existingItem.category && rule.categories.includes(existingItem.category) &&
              newItem.category && rule.categories.includes(newItem.category) &&
              existingItem.category === newItem.category) {
            conflictingItems.push(existingItem.id)
          }
        } else if (existingItem.type === newItem.type) {
          // Same type conflict when no categories specified
          conflictingItems.push(existingItem.id)
        } else if (rule.itemTypes.includes(existingItem.type) && 
                   rule.itemTypes.includes(newItem.type) &&
                   existingItem.type !== newItem.type) {
          // Cross-type conflict (e.g., room vs bid)
          conflictingItems.push(existingItem.id)
        }
      }
    }
    
    return {
      isValid: conflictingItems.length === 0,
      conflictingItems: conflictingItems.length > 0 ? conflictingItems : undefined
    }
  }
  
  private checkRequirement(
    rule: CompatibilityRule,
    newItem: BookingItem,
    existingItems: BookingItem[]
  ): { isValid: boolean; conflictingItems?: string[] } {
    // Implementation for requirement checking
    // Check if required items are present
    if (rule.categories && newItem.category) {
      // Example: Ocean view requires high floor
      if (newItem.category === 'view' && newItem.name.toLowerCase().includes('ocean')) {
        const hasHighFloor = existingItems.some(item => 
          item.category === 'floor' && item.name.toLowerCase().includes('high')
        )
        return { isValid: hasHighFloor }
      }
    }
    return { isValid: true }
  }
  
  private checkPrevention(
    rule: CompatibilityRule,
    newItem: BookingItem,
    existingItems: BookingItem[]
  ): { isValid: boolean; conflictingItems?: string[] } {
    // Implementation for prevention checking
    // Check if conflicting items prevent this addition
    const preventingItems = existingItems.filter(item => {
      if (rule.itemTypes.includes(item.type) && rule.itemTypes.includes(newItem.type)) {
        // Custom prevention logic based on rule
        const prevents = item.metadata?.prevents as string[] | undefined
        return prevents?.includes(newItem.name) || false
      }
      return false
    })
    
    return {
      isValid: preventingItems.length === 0,
      conflictingItems: preventingItems.length > 0 ? preventingItems.map(item => item.id) : undefined
    }
  }
  
  private checkItemCompatibility(
    item1: BookingItem,
    item2: BookingItem,
    _room: RoomBooking
  ): ValidationResult {
    // Check compatibility between two existing items
    const errors: string[] = []
    const warnings: string[] = []
    const conflicts: ConflictInfo[] = []
    
    // Example: Check if two items of same category conflict
    if (item1.category && item2.category && 
        item1.category === item2.category && 
        item1.type === 'customization' && item2.type === 'customization') {
      errors.push(`Only one ${item1.category} customization allowed`)
      conflicts.push({
        conflictingItems: [item1.id, item2.id],
        ruleId: `${item1.category}-exclusive`,
        severity: 'error',
        message: `Conflicting ${item1.category} customizations`,
        possibleResolutions: [`Keep only one ${item1.category} option`]
      })
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      conflicts
    }
  }
}

// Export singleton instance
export const businessRulesEngine = new BusinessRulesEngine()

// Utility functions for common operations
export const validateBookingItem = (
  item: BookingItem,
  room: RoomBooking,
  existingItems: BookingItem[]
): ValidationResult => {
  return businessRulesEngine.checkCompatibility(item, existingItems, room)
}

export const validateBookingRoom = (room: RoomBooking): ValidationResult => {
  return businessRulesEngine.validateRoom(room)
}

export const calculateRoomPricing = (room: RoomBooking) => {
  const basePrice = room.items.reduce((sum, item) => sum + item.price, 0)
  const adjustments = businessRulesEngine.calculatePricingAdjustments(room)
  
  return {
    basePrice,
    discounts: adjustments.discounts,
    surcharges: adjustments.surcharges,
    finalPrice: basePrice - adjustments.discounts + adjustments.surcharges,
    details: adjustments.details
  }
}