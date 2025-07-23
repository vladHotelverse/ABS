/**
 * Booking ID Generator Utility
 * Generates unique booking IDs for order consultation system
 */

/**
 * Generate a random alphanumeric string of specified length
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a unique booking ID
 * Format: ABS-{timestamp}-{random}
 * Example: ABS-20250723-A1B2C3
 */
export function generateBookingId(): string {
  const now = new Date()
  const timestamp = now.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
  const randomPart = generateRandomString(6)
  
  return `ABS-${timestamp}-${randomPart}`
}

/**
 * Validate booking ID format
 */
export function isValidBookingId(id: string): boolean {
  const pattern = /^ABS-\d{8}-[A-Z0-9]{6}$/
  return pattern.test(id)
}

/**
 * Extract date from booking ID
 */
export function extractDateFromBookingId(id: string): Date | null {
  if (!isValidBookingId(id)) {
    return null
  }
  
  const parts = id.split('-')
  const dateStr = parts[1] // YYYYMMDD
  const year = parseInt(dateStr.substring(0, 4), 10)
  const month = parseInt(dateStr.substring(4, 6), 10) - 1 // Month is 0-indexed
  const day = parseInt(dateStr.substring(6, 8), 10)
  
  return new Date(year, month, day)
}

/**
 * Format booking ID for display with separators
 */
export function formatBookingIdForDisplay(id: string): string {
  if (!isValidBookingId(id)) {
    return id
  }
  
  const parts = id.split('-')
  return `${parts[0]}-${parts[1]}-${parts[2]}`
}

/**
 * Generate a short reference code from booking ID (last 6 characters)
 */
export function getShortReference(id: string): string {
  if (!isValidBookingId(id)) {
    return id
  }
  
  return id.split('-')[2] // Return just the random part
}