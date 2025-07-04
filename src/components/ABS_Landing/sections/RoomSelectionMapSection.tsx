import React from 'react'
import { ABS_RoomSelection } from '../../ABS_RoomSelection'
import type { RoomSelectionConfig } from '../../ABS_RoomSelection/types'

export interface RoomSelectionMapSectionProps {
  roomSelectionConfig: RoomSelectionConfig
  isVisible?: boolean
  className?: string
}

export interface RoomSelectionMapTexts {
  title: string
  description: string
}

const RoomSelectionMapSection: React.FC<RoomSelectionMapSectionProps> = ({
  roomSelectionConfig,
  isVisible = true,
  className = '',
}) => {
  if (!isVisible) {
    return null
  }

  return (
    <ABS_RoomSelection
      title={roomSelectionConfig.title}
      description={roomSelectionConfig.description}
      url={roomSelectionConfig.url}
      iframe={roomSelectionConfig.iframe}
      className={className}
    />
  )
}

export default RoomSelectionMapSection