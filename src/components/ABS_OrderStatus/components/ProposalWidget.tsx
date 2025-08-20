import type React from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import type { ProposalItem } from '../../../services/orderStorage'
import { updateProposalStatus } from '../../../services/orderStorage'

// Import subcomponents
import ProposalHeader from './ProposalHeader'
import ProposalComparison from './ProposalComparison'
import ProposalActions from './ProposalActions'
import ProposalStatus from './ProposalStatus'

export interface ProposalWidgetProps {
  orderId: string
  proposal: ProposalItem
  onProposalUpdate?: (proposalId: string, status: 'accepted' | 'rejected') => void
  className?: string
}

const ProposalWidget: React.FC<ProposalWidgetProps> = ({
  orderId,
  proposal,
  onProposalUpdate,
  className,
}) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(proposal.status)

  const handleStatusUpdate = async (status: 'accepted' | 'rejected') => {
    setIsUpdating(true)
    
    try {
      const success = await updateProposalStatus(orderId, proposal.id, status)
      
      if (success) {
        setCurrentStatus(status)
        onProposalUpdate?.(proposal.id, status)
      } else {
        console.error('Failed to update proposal status')
      }
    } catch (error) {
      console.error('Error updating proposal status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Utility functions moved to subcomponents

  const isExpired = Boolean(proposal.expiresAt && new Date(proposal.expiresAt) < new Date())

  return (
    <div className={clsx(
      'bg-white rounded-lg border shadow-sm overflow-hidden',
      className
    )}>
      {/* Header */}
      <ProposalHeader
        proposal={proposal}
        currentStatus={currentStatus}
        isExpired={isExpired}
      />

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-700 mb-4">{proposal.description}</p>
        
        {/* Comparison */}
        <ProposalComparison proposal={proposal} />

        {/* Expiration Notice */}
        {proposal.expiresAt && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {isExpired ? (
                <span className="text-red-600 font-medium">This proposal has expired</span>
              ) : (
                <>
                  Expires on: {new Date(proposal.expiresAt).toLocaleDateString()} at{' '}
                  {new Date(proposal.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <ProposalActions
          currentStatus={currentStatus}
          isExpired={isExpired}
          isUpdating={isUpdating}
          onAccept={() => handleStatusUpdate('accepted')}
          onReject={() => handleStatusUpdate('rejected')}
        />

        {/* Status Message */}
        <ProposalStatus
          currentStatus={currentStatus}
          isExpired={isExpired}
        />
      </div>
    </div>
  )
}

export default ProposalWidget