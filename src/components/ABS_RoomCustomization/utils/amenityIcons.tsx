import { Icon } from '@iconify/react'

export interface AmenityIconMapping {
  [amenity: string]: string
}

export const amenityIcons: AmenityIconMapping = {
  // Room Features
  'Vista al mar': 'solar:eye-bold',
  'Sea View': 'solar:eye-bold',
  'Vista a la ciudad': 'solar:buildings-bold',
  'City View': 'solar:buildings-bold',
  'Vista al jardín': 'solar:leaf-bold',
  'Garden View': 'solar:leaf-bold',
  'Balcón': 'mdi:balcony',
  'Balcony': 'mdi:balcony',
  'Terraza': 'solar:sun-bold',
  'Terrace': 'solar:sun-bold',
  'Terraza privada': 'solar:sun-bold',
  'Private Terrace': 'solar:sun-bold',
  
  // Bathroom
  'Jacuzzi': 'solar:bath-bold',
  'Bañera': 'material-symbols:bathtub-outline',
  'Bathtub': 'material-symbols:bathtub-outline',
  'Hydromassage Bathtub': 'material-symbols:bathtub-outline',
  'Ducha de lluvia': 'solar:water-drop-bold',
  'Rain Shower': 'solar:water-drop-bold',
  'Amenidades de lujo': 'solar:star-bold',
  'Luxury Amenities': 'solar:star-bold',
  
  // Technology
  'Smart TV': 'solar:tv-bold',
  'TV inteligente': 'solar:tv-bold',
  'WiFi de alta velocidad': 'solar:wifi-router-bold',
  'High-speed WiFi': 'solar:wifi-router-bold',
  'Sistema de sonido': 'solar:soundwave-bold',
  'Sound System': 'solar:soundwave-bold',
  'Cargador inalámbrico': 'solar:smartphone-2-bold',
  'Wireless Charger': 'solar:smartphone-2-bold',
  
  // Comfort
  'Aire acondicionado': 'solar:snowflake-bold',
  'Air Conditioning': 'solar:snowflake-bold',
  'Calefacción': 'solar:fire-bold',
  'Heating': 'solar:fire-bold',
  'Cama King Size': 'solar:bed-bold',
  'King Size Bed': 'solar:bed-bold',
  'Almohadas premium': 'solar:moon-sleep-bold',
  'Premium Pillows': 'solar:moon-sleep-bold',
  
  // Kitchen & Dining
  'Mini bar': 'solar:wine-glass-bold',
  'Minibar': 'solar:wine-glass-bold',
  'Cafetera Nespresso': 'solar:cup-hot-bold',
  'Nespresso Machine': 'solar:cup-hot-bold',
  'Cocina equipada': 'solar:chef-hat-bold',
  'Equipped Kitchen': 'solar:chef-hat-bold',
  'Nevera': 'solar:fridge-bold',
  'Refrigerator': 'solar:fridge-bold',
  
  // Services
  'Servicio de habitación 24h': 'solar:bell-bold',
  '24h Room Service': 'solar:bell-bold',
  'Desayuno incluido': 'solar:donut-bold',
  'Breakfast Included': 'solar:donut-bold',
  'Limpieza diaria': 'solar:broom-bold',
  'Daily Cleaning': 'solar:broom-bold',
  'Servicio de conserjería': 'solar:user-check-bold',
  'Concierge Service': 'solar:user-check-bold',
  
  // Wellness
  'Acceso al spa': 'solar:leaf-bold',
  'Spa Access': 'solar:leaf-bold',
  'Acceso al gimnasio': 'solar:dumbbell-bold',
  'Gym Access': 'solar:dumbbell-bold',
  'Piscina privada': 'solar:swimming-bold',
  'Private Pool': 'solar:swimming-bold',
  
  // Work
  'Escritorio de trabajo': 'solar:laptop-bold',
  'Work Desk': 'solar:laptop-bold',
  'Zona de trabajo': 'solar:briefcase-bold',
  'Work Area': 'solar:briefcase-bold',
  
  // Storage
  'Caja fuerte': 'solar:safe-2-bold',
  'Safe': 'solar:safe-2-bold',
  'Armario amplio': 'solar:closet-bold',
  'Large Closet': 'solar:closet-bold',
  
  // Sun and Orientation
  'Afternoon Sun': 'wi:day-sunny',
  'Morning Sun': 'wi:sunrise',
  'All-day Sun': 'solar:sun-bold',
  
  // Room Size
  '30 to 35 m2 / 325 to 375 sqft': 'material-symbols:square-foot',
  '60 to 70 m2 / 645 to 755 sqft': 'material-symbols:square-foot',
  
  // Default
  'default': 'solar:check-circle-bold',
}

// Fallback patterns for common amenity types
const fallbackPatterns = [
  { pattern: /wifi|internet|conexi[oó]n/i, icon: 'solar:wifi-router-bold' },
  { pattern: /tv|television|smart/i, icon: 'solar:tv-bold' },
  { pattern: /hydromassage|bathtub|bañera/i, icon: 'material-symbols:bathtub-outline' },
  { pattern: /ba[ñn]o|bath|shower|ducha/i, icon: 'solar:bath-bold' },
  { pattern: /bed|cama|king|queen/i, icon: 'solar:bed-bold' },
  { pattern: /kitchen|cocina|cook/i, icon: 'solar:chef-hat-bold' },
  { pattern: /coffee|caf[eé]|nespresso/i, icon: 'solar:cup-hot-bold' },
  { pattern: /air|aire|conditioning|climate/i, icon: 'solar:snowflake-bold' },
  { pattern: /view|vista|window/i, icon: 'solar:eye-bold' },
  { pattern: /balc[oó]n|balcony/i, icon: 'mdi:balcony' },
  { pattern: /terrace|terraza/i, icon: 'material-symbols:deck-outline' },
  { pattern: /pool|piscina|swimming/i, icon: 'solar:swimming-bold' },
  { pattern: /gym|gimnasio|fitness/i, icon: 'solar:dumbbell-bold' },
  { pattern: /spa|wellness|relax/i, icon: 'solar:leaf-bold' },
  { pattern: /work|desk|escritorio|office/i, icon: 'solar:laptop-bold' },
  { pattern: /safe|caja fuerte|security/i, icon: 'solar:safe-2-bold' },
  { pattern: /closet|armario|wardrobe/i, icon: 'solar:closet-bold' },
  { pattern: /service|servicio|room service/i, icon: 'solar:bell-bold' },
  { pattern: /breakfast|desayuno|food/i, icon: 'solar:donut-bold' },
  { pattern: /cleaning|limpieza|housekeeping/i, icon: 'solar:broom-bold' },
  { pattern: /luxury|lujo|premium/i, icon: 'solar:star-bold' },
  { pattern: /minibar|mini bar|bar/i, icon: 'solar:wine-glass-bold' },
  { pattern: /fridge|nevera|refrigerator/i, icon: 'solar:fridge-bold' },
  { pattern: /sound|audio|music|sonido/i, icon: 'solar:soundwave-bold' },
  { pattern: /charging|charger|cargador/i, icon: 'solar:smartphone-2-bold' },
  { pattern: /heating|calefacci[oó]n|heat/i, icon: 'solar:fire-bold' },
  { pattern: /pillow|almohada|cushion/i, icon: 'solar:moon-sleep-bold' },
  { pattern: /concierge|conserjer[ií]a/i, icon: 'solar:user-check-bold' },
  { pattern: /m2|sqft|square.*feet|square.*foot/i, icon: 'material-symbols:square-foot' },
  { pattern: /afternoon.*sun/i, icon: 'wi:day-sunny' },
  { pattern: /morning.*sun/i, icon: 'wi:sunrise' },
  { pattern: /all.*day.*sun|sun.*all.*day/i, icon: 'solar:sun-bold' },
]

export function getAmenityIcon(amenity: string): string {
  // First, try exact match
  const exactMatch = amenityIcons[amenity]
  if (exactMatch) {
    return exactMatch
  }

  // Try case-insensitive exact match
  const lowerAmenity = amenity.toLowerCase()
  const caseInsensitiveMatch = Object.keys(amenityIcons).find(
    key => key.toLowerCase() === lowerAmenity
  )
  if (caseInsensitiveMatch) {
    return amenityIcons[caseInsensitiveMatch]
  }

  // Try pattern matching for fallbacks
  for (const { pattern, icon } of fallbackPatterns) {
    if (pattern.test(amenity)) {
      return icon
    }
  }

  // Final fallback
  return amenityIcons.default
}

export function AmenityIcon({ amenity, className }: { amenity: string; className?: string }) {
  const iconName = getAmenityIcon(amenity)
  
  return (
    <Icon 
      icon={iconName} 
      className={className}
      onError={() => {
        // If icon fails to load, try to use a different fallback
        console.warn(`Failed to load icon: ${iconName} for amenity: ${amenity}`)
      }}
      fallback={<Icon icon="solar:check-circle-bold" className={className} />}
    />
  )
}