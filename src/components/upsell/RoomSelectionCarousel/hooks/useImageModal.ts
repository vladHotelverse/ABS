import { useCallback, useState } from 'react'

export interface UseImageModalReturn {
  // Card detail modal states and handlers
  isCardDetailModalOpen: boolean
  handleCardImageClick: () => void
  handleCloseCardDetailModal: () => void
  // Image gallery modal states and handlers (used within detail modal)
  isImageModalOpen: boolean
  currentImageIndex: number
  handleImageClick: () => void
  handleCloseModal: () => void
}

export const useImageModal = (initialImageIndex: number = 0): UseImageModalReturn => {
  // Card detail modal state
  const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState(false)
  // Image gallery modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  // Open card detail modal when user clicks image
  const handleCardImageClick = useCallback(() => {
    setIsCardDetailModalOpen(true)
  }, [])

  // Close card detail modal
  const handleCloseCardDetailModal = useCallback(() => {
    setIsCardDetailModalOpen(false)
  }, [])

  // Open image gallery modal when user clicks image in card detail modal
  const handleImageClick = useCallback(() => {
    setIsImageModalOpen(true)
  }, [])

  // Close image gallery modal
  const handleCloseModal = useCallback(() => {
    setIsImageModalOpen(false)
  }, [])

  return {
    isCardDetailModalOpen,
    handleCardImageClick,
    handleCloseCardDetailModal,
    isImageModalOpen,
    currentImageIndex: initialImageIndex,
    handleImageClick,
    handleCloseModal,
  }
}
