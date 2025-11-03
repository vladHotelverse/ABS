import type { Multimedia } from '../types'

export interface MediaItem {
  type: 'image' | 'video' | 'matterport'
  url: string // URL to display
  thumbnailUrl?: string // Optional thumbnail URL for images
}

/**
 * Flattens a Multimedia object into a linear array of media items for carousel display
 * @param multimedia - The multimedia object containing images, videos, and matterport
 * @param fallbackImages - Optional array of image URLs to use if multimedia is undefined
 * @returns Array of media items with type and url
 */
export function flattenMultimedia(multimedia?: Multimedia, fallbackImages?: string[]): MediaItem[] {
  const mediaItems: MediaItem[] = []

  // If no multimedia object, fall back to images array (backward compatibility)
  if (!multimedia) {
    if (fallbackImages && fallbackImages.length > 0) {
      return fallbackImages.map((url) => ({ type: 'image', url }))
    }
    return []
  }

  // Add all images with their thumbnail URLs
  if (multimedia.images && multimedia.images.length > 0) {
    multimedia.images.forEach(({ url, thumbnailUrl }) => {
      mediaItems.push({
        type: 'image',
        url,
        thumbnailUrl,
      })
    })
  }

  // Add all videos
  if (multimedia.videos && multimedia.videos.length > 0) {
    multimedia.videos.forEach((url) => {
      mediaItems.push({ type: 'video', url })
    })
  }

  // Add matterport (single instance)
  if (multimedia.matterport) {
    mediaItems.push({ type: 'matterport', url: multimedia.matterport })
  }

  return mediaItems
}

/**
 * Gets a count summary of media types
 * @param multimedia - The multimedia object
 * @returns Object with counts for each media type
 */
export function getMediaCounts(multimedia?: Multimedia): {
  images: number
  videos: number
  matterport: number
  total: number
} {
  if (!multimedia) {
    return { images: 0, videos: 0, matterport: 0, total: 0 }
  }

  const images = multimedia.images?.length || 0
  const videos = multimedia.videos?.length || 0
  const matterport = multimedia.matterport ? 1 : 0

  return {
    images,
    videos,
    matterport,
    total: images + videos + matterport,
  }
}
