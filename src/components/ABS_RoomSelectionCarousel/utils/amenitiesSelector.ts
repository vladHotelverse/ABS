import type { RoomOption } from '../types'

/**
 * Priority scoring for different amenity categories
 * Higher values indicate higher priority for upgrades
 */
const AMENITY_PRIORITIES = {
  // Size and Space
  '60 to 70 m2 / 645 to 755 sqft': 10,
  '30 to 35 m2 / 325 to 375 sqft': 5,
  
  // Premium Features
  'Hydromassage Bathtub': 9,
  'Living Room': 9,
  'King Size Bed': 8,
  'Sofa Bed - Double': 7,
  
  // Views and Location
  'Pool View': 8,
  'Landmark View': 7,
  'Morning Sun': 9,
  'Afternoon Sun': 5,
  'Piazza View': 5,
  'Lateral Streets View': 4,
  
  // Unique Experience
  'Shared Pool': 9,
  'Terrace': 8,
  'Balcony': 7,
  'Close to Pool': 9,
  
  // Technology and Comfort
  'Bluetooth sound system': 6,
  'Smart TV': 5,
  'Premium Wi-Fi': 4,
  
  // Service and Convenience
  '24 Hours Room Service': 1,
  'Pillow Menu': 1,
  'Minibar': 4,
  'Safe': 3,
  
  // Basic Amenities (lower priority for upgrades)
  'AC': 2,
  'Hairdryer': 2,
  'Phone': 2,
  'Iron & Board': 2,
  'Rain shower': 3,
  'Bathrobe and slippers': 3,
  'Tea Set': 3,
  'Non-smoking Room': 1,
  'Pet Friendly': 2,
  'Desk': 2,
  'Table and chairs set': 2,
  'Magnifying mirror': 2,
  'Shoe kit': 2,
  'In Main Building': 1,
  'Recyclables Coffee Capsules': 2,
}

/**
 * Room type hierarchy - higher index means more premium
 */
const ROOM_HIERARCHY = [
  'DELUXE SILVER', // User's base room (not in upgrade options)
  'DELUXE GOLD',
  'DELUXE SWIM-UP',
  'ROCK SUITE',
  '80S SUITE',
  'ROCK SUITE DIAMOND',
  'ROCK SUITE LEGEND'
]

interface AmenityWithScore {
  amenity: string
  score: number
  isUnique: boolean
}

/**
 * Get the priority score for an amenity
 */
function getAmenityScore(amenity: string): number {
  return AMENITY_PRIORITIES[amenity as keyof typeof AMENITY_PRIORITIES] || 3
}

/**
 * Get room hierarchy level (higher = more premium)
 */
function getRoomLevel(roomType: string): number {
  const index = ROOM_HIERARCHY.indexOf(roomType)
  return index >= 0 ? index : 0
}


/**
 * Select the 3 best amenities for a room upgrade
 * @param room - The room option to analyze
 * @param currentRoomType - The user's current room type
 * @param currentRoomAmenities - Amenities from the user's current room
 * @param usedAmenities - Set of amenities already used by other rooms
 * @returns Array of the 3 best amenities for this upgrade
 */
export function selectBestAmenities(
  room: RoomOption,
  currentRoomType: string,
  currentRoomAmenities: string[] = [],
  usedAmenities: Set<string> = new Set()
): string[] {
  const roomLevel = getRoomLevel(room.roomType)
  const currentLevel = getRoomLevel(currentRoomType)
  const upgradeBonus = Math.max(0, (roomLevel - currentLevel) * 0.5)
  
  // Convert currentRoomAmenities to Set for O(1) lookups instead of O(n)
  const currentAmenitiesSet = new Set(currentRoomAmenities)
  
  // Use partial sort approach - find top 3 without fully sorting entire array
  const topAmenities: AmenityWithScore[] = []
  
  for (const amenity of room.amenities) {
    let score = getAmenityScore(amenity)
    const isUnique = !currentAmenitiesSet.has(amenity)
    
    // Apply scoring logic with early optimizations
    if (isUnique) score += 3
    score += upgradeBonus
    if (usedAmenities.has(amenity)) score -= 5
    
    const amenityWithScore: AmenityWithScore = { amenity, score, isUnique }
    
    // Use insertion approach to maintain top 3, avoiding full sort
    if (topAmenities.length < 3) {
      topAmenities.push(amenityWithScore)
      // Sort only when we have multiple items
      if (topAmenities.length > 1) {
        topAmenities.sort(compareAmenities)
      }
    } else {
      // Check if current amenity is better than worst in top 3
      const worstIndex = topAmenities.length - 1
      if (compareAmenities(amenityWithScore, topAmenities[worstIndex]) < 0) {
        topAmenities[worstIndex] = amenityWithScore
        // Re-sort only the top 3
        topAmenities.sort(compareAmenities)
      }
    }
  }
  
  return topAmenities.map(({ amenity }) => amenity)
}

// Extracted comparison function for better performance and reusability
function compareAmenities(a: AmenityWithScore, b: AmenityWithScore): number {
  // First sort by uniqueness (unique amenities first)
  if (a.isUnique !== b.isUnique) {
    return a.isUnique ? -1 : 1
  }
  // Then by score (descending)
  return b.score - a.score
}

// Cache for room levels to avoid repeated calculations
const roomLevelCache = new Map<string, number>()

/**
 * Get cached room level to avoid repeated calculations
 */
function getCachedRoomLevel(roomType: string): number {
  if (roomLevelCache.has(roomType)) {
    return roomLevelCache.get(roomType)!
  }
  const level = getRoomLevel(roomType)
  roomLevelCache.set(roomType, level)
  return level
}

/**
 * Get dynamic amenities for all rooms, ensuring no repetition
 * Optimized with caching and efficient data structures
 * @param rooms - Array of room options
 * @param currentRoomType - The user's current room type
 * @param currentRoomAmenities - Amenities from the user's current room
 * @returns Map of room ID to selected amenities
 */
export function getDynamicAmenitiesForAllRooms(
  rooms: RoomOption[],
  currentRoomType: string,
  currentRoomAmenities: string[] = []
): Map<string, string[]> {
  const usedAmenities = new Set<string>()
  const roomAmenities = new Map<string, string[]>()
  
  // Early return for empty rooms array
  if (rooms.length === 0) return roomAmenities
  
  // Pre-sort rooms by upgrade level using cached levels
  const sortedRooms = rooms
    .map(room => ({ room, level: getCachedRoomLevel(room.roomType) }))
    .sort((a, b) => b.level - a.level)
    .map(({ room }) => room)
  
  // Select amenities for each room with optimized processing
  for (const room of sortedRooms) {
    const selectedAmenities = selectBestAmenities(
      room,
      currentRoomType,
      currentRoomAmenities,
      usedAmenities
    )
    
    // Batch add amenities to used set
    selectedAmenities.forEach(amenity => usedAmenities.add(amenity))
    
    roomAmenities.set(room.id, selectedAmenities)
  }
  
  return roomAmenities
}

/**
 * Helper function to find user's current room amenities from room options
 * (fallback if current room is not in the upgrade list)
 */
export function getCurrentRoomAmenities(currentRoomType: string, rooms: RoomOption[]): string[] {
  // Try to find a similar room type in the available options
  const matchingRoom = rooms.find(room => 
    room.roomType.toLowerCase().includes(currentRoomType.toLowerCase()) ||
    currentRoomType.toLowerCase().includes(room.roomType.toLowerCase())
  )
  
  if (matchingRoom) {
    return matchingRoom.amenities
  }
  
  // Fallback: assume basic amenities for DELUXE SILVER
  return [
    'AC',
    'Hairdryer',
    'Phone',
    'Iron & Board',
    'Rain shower',
    'Bathrobe and slippers',
    'Tea Set',
    'Non-smoking Room',
    'Pet Friendly',
    'Desk',
    'Table and chairs set',
    'Magnifying mirror',
    'Shoe kit',
    'Premium Wi-Fi',
    'Smart TV',
    'Safe',
    'Minibar'
  ]
}