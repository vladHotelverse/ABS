import type React from 'react'
import clsx from 'clsx'
import type { ProposalItem } from '../../../services/orderStorage'

export interface ProposalComparisonProps {
  proposal: ProposalItem
}

const formatPrice = (price: number) => {
  return price >= 0 ? `+€${price}` : `-€${Math.abs(price)}`
}

const ProposalComparison: React.FC<ProposalComparisonProps> = ({ proposal }) => {
  return (
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
  )
}

export default ProposalComparison