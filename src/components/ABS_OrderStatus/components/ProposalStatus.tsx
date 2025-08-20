import type React from 'react'
import type { ProposalItem } from '../../../services/orderStorage'

export interface ProposalStatusProps {
  currentStatus: ProposalItem['status']
  isExpired: boolean
}

const ProposalStatus: React.FC<ProposalStatusProps> = ({
  currentStatus,
  isExpired,
}) => {
  if (currentStatus === 'accepted') {
    return (
      <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">You accepted this proposal</span>
      </div>
    )
  }

  if (currentStatus === 'rejected') {
    return (
      <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-sm font-medium">You rejected this proposal</span>
      </div>
    )
  }

  if (isExpired && currentStatus === 'pending') {
    return (
      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">This proposal has expired</span>
      </div>
    )
  }

  return null
}

export default ProposalStatus