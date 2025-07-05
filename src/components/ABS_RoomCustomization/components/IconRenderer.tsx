import { 
  Building2, 
  Home, 
  Hotel, 
  Layers, 
  LayoutGrid, 
  Square, 
  Waves,
  Utensils,
  Baby,
  Heart,
  Umbrella,
  VolumeX,
  Flower,
  DoorOpen,
  Link,
  Sofa,
  Users,
  Compass,
  Eye,
  Package,
  TreePine,
  Mountain,
  Theater,
  Building,
  Sparkles,
  MapPin,
  Accessibility,
  BedDouble,
  Bed as BedSingle,
  Sunset,
  Circle
} from 'lucide-react'
import type React from 'react'

const iconMap = {
  // Bed icons - more specific representations
  bed: BedSingle, // Default bed icon
  'bed-twin': BedSingle, // Twin beds
  'bed-king': BedDouble, // King size bed
  'bed-double': BedDouble, // Double bed
  
  // Building and structure icons
  hotel: Hotel,
  building: Building2,
  home: Home,
  layout: LayoutGrid,
  layers: Layers,
  floor: Layers,
  
  // View icons - more specific to what guests see
  'city-view': Building, // City view - use building icon
  'garden-view': TreePine, // Garden view - use tree icon
  'stage-view': Theater, // Stage view - use theater icon
  'mountain-view': Mountain, // Mountain view if needed
  
  // Water/Sea view icons - differentiated
  waves: Waves, // Generic water/sea view
  'pool-view': Circle, // Pool view - use circle icon to represent pool shape
  'lateral-sea-view': Waves, // Lateral sea view - waves icon
  'sea-frontal-view': Waves, // Sea frontal view - waves icon
  
  // Location and amenity icons
  location: MapPin, // Better location indicator
  utensils: Utensils,
  baby: Baby,
  heart: Heart, // Wellness/spa
  umbrella: Umbrella, // Beach access
  'volume-x': VolumeX, // Quiet zone
  
  // Distribution and room feature icons
  flower: Flower, // Garden access
  'door-open': DoorOpen, // Balcony
  link: Link, // Connecting rooms
  sofa: Sofa, // Living room/sofa bed
  sun: Sunset, // Terrace/afternoon sun exposure
  
  // Special feature icons
  users: Users,
  compass: Compass,
  eye: Eye, // Best views
  package: Package,
  accessibility: Accessibility, // Proper accessibility icon
  sparkles: Sparkles, // Premium features
} as const

interface IconRendererProps {
  iconName?: string
  className?: string
  fallbackImageUrl?: string
}

export const IconRenderer: React.FC<IconRendererProps> = ({ iconName, className = 'h-10 w-10', fallbackImageUrl }) => {
  if (!iconName) {
    return fallbackImageUrl ? (
      <img src={fallbackImageUrl} alt="Icon" className="object-contain w-12 aspect-square" />
    ) : (
      <Square className={className} />
    )
  }

  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Square
  return <IconComponent className={className} />
}