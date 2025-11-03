import { useCallback, useState } from 'react'

/**
 * Modal state types for RoomCard
 * - closed: No modal is open
 * - detail: Room detail modal is open
 * - gallery: Image gallery modal is open
 */
export type ModalState = 'closed' | 'detail' | 'gallery'

interface UseModalStateMachineReturn {
  modalState: ModalState
  isDetailModalOpen: boolean
  isGalleryModalOpen: boolean
  currentImageIndex: number
  openDetailModal: () => void
  closeDetailModal: () => void
  openGalleryModal: (imageIndex?: number) => void
  closeGalleryModal: () => void
}

/**
 * State machine hook for managing modal interactions in RoomCard
 * Simplifies modal coordination: detail modal opens first, then gallery can be opened from there
 */
export const useModalStateMachine = (): UseModalStateMachineReturn => {
  const [modalState, setModalState] = useState<ModalState>('closed')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openDetailModal = useCallback(() => {
    setModalState('detail')
  }, [])

  const closeDetailModal = useCallback(() => {
    setModalState('closed')
  }, [])

  const openGalleryModal = useCallback((imageIndex: number = 0) => {
    setCurrentImageIndex(imageIndex)
    setModalState('gallery')
  }, [])

  const closeGalleryModal = useCallback(() => {
    setModalState('closed')
  }, [])

  return {
    modalState,
    isDetailModalOpen: modalState === 'detail',
    isGalleryModalOpen: modalState === 'gallery',
    currentImageIndex,
    openDetailModal,
    closeDetailModal,
    openGalleryModal,
    closeGalleryModal,
  }
}
