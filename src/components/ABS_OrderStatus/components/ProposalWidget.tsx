import type React from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { UiButton } from '../../ui/button'
import type { ProposalItem } from '../../../services/orderStorage'
import { updateProposalStatus } from '../../../services/orderStorage'

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
      const success = updateProposalStatus(orderId, proposal.id, status)
      
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

  const getStatusColor = (status: typeof currentStatus) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProposalTypeIcon = (type: ProposalItem['type']) => {
    switch (type) {
      case 'room_change':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        )
      case 'customization_change':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'offer_change':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        )
      case 'price_change':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const formatPrice = (price: number) => {
    return price >= 0 ? `+€${price}` : `-€${Math.abs(price)}`
  }

  const isExpired = proposal.expiresAt && new Date(proposal.expiresAt) < new Date()

  return (
    <div className={clsx(
      'bg-white rounded-lg border shadow-sm overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">
              {getProposalTypeIcon(proposal.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{proposal.title}</h3>
              <p className="text-sm text-gray-600">Hotel Proposal</p>
            </div>
          </div>
          
          <div className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium border',
            getStatusColor(currentStatus)
          )}>
            {currentStatus === 'accepted' && 'Accepted by hotel'}
            {currentStatus === 'rejected' && 'Rejected'}
            {currentStatus === 'pending' && (isExpired ? 'Expired' : 'Pending Response')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-700 mb-4">{proposal.description}</p>
        
        {/* Comparison */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Item */}
            {proposal.originalItem && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Current Selection</p>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="font-medium text-gray-800">{proposal.originalItem.name}</p>
                  <p className="text-sm text-gray-600">€{proposal.originalItem.price}</p>
                </div>
              </div>
            )}
            
            {/* Proposed Item */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Hotel Proposal</p>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="font-medium text-gray-800">{proposal.proposedItem.name}</p>
                <p className="text-sm text-blue-700">€{proposal.proposedItem.price}</p>
              </div>
            </div>
          </div>
          
          {/* Price Difference */}
          {proposal.priceDifference !== 0 && (
            <div className="mt-4 text-center">
              <div className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                proposal.priceDifference > 0 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              )}>
                <span>Price difference: {formatPrice(proposal.priceDifference)}</span>
              </div>
            </div>
          )}
        </div>

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
        {currentStatus === 'pending' && !isExpired && (
          <div className="flex gap-3">
            <UiButton
              onClick={() => handleStatusUpdate('accepted')}
              disabled={isUpdating}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isUpdating ? 'Accepting...' : 'Accept Proposal'}
            </UiButton>
            
            <UiButton
              onClick={() => handleStatusUpdate('rejected')}
              disabled={isUpdating}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            >
              {isUpdating ? 'Rejecting...' : 'Reject'}
            </UiButton>
          </div>
        )}

        {/* Status Message */}
        {currentStatus === 'accepted' && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">You accepted this proposal</span>
          </div>
        )}

        {currentStatus === 'rejected' && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-medium">You rejected this proposal</span>
          </div>
        )}

        {isExpired && currentStatus === 'pending' && (
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">This proposal has expired</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProposalWidget