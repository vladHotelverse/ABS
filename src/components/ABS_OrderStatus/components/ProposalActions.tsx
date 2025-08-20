import type React from 'react'
import { UiButton } from '../../ui/button'
import type { ProposalItem } from '../../../services/orderStorage'

export interface ProposalActionsProps {
  currentStatus: ProposalItem['status']
  isExpired: boolean
  isUpdating: boolean
  onAccept: () => void
  onReject: () => void
}

const ProposalActions: React.FC<ProposalActionsProps> = ({
  currentStatus,
  isExpired,
  isUpdating,
  onAccept,
  onReject,
}) => {
  if (currentStatus !== 'pending' || isExpired) {
    return null
  }

  return (
    <div className="flex gap-3 mb-4">
      <UiButton
        onClick={onAccept}
        disabled={isUpdating}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
      >
        {isUpdating ? 'Accepting...' : 'Accept Proposal'}
      </UiButton>
      
      <UiButton
        onClick={onReject}
        disabled={isUpdating}
        variant="outline"
        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
      >
        {isUpdating ? 'Rejecting...' : 'Reject'}
      </UiButton>
    </div>
  )
}

export default ProposalActions