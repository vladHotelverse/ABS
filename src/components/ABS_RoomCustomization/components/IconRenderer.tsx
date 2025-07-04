import { 
  ArrowUp, 
  Bed, 
  Building2, 
  CornerUpRight, 
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
  Sun,
  Users,
  Compass,
  Eye,
  Package
} from 'lucide-react'
import type React from 'react'

const iconMap = {
  bed: Bed,
  hotel: Hotel,
  building: Building2,
  'corner-up-right': CornerUpRight,
  waves: Waves,
  home: Home,
  layout: LayoutGrid,
  layers: Layers,
  'arrow-up': ArrowUp,
  location: CornerUpRight,
  floor: Layers,
  // Location icons
  utensils: Utensils,
  baby: Baby,
  heart: Heart,
  umbrella: Umbrella,
  'volume-x': VolumeX,
  // Distribution icons
  flower: Flower,
  'door-open': DoorOpen,
  link: Link,
  sofa: Sofa,
  sun: Sun,
  // New section icons
  users: Users,
  compass: Compass,
  eye: Eye,
  package: Package,
  // Additional common icons
  accessibility: Users, // Using Users icon for accessibility
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
