import type React from 'react'
import ProposalWidget from './ProposalWidget'
import type { OrderData } from '../../../services/orderStorage'

export interface HotelProposalsSectionProps {
  proposals: OrderData['hotelProposals']
  orderId: string
  onProposalUpdate: (proposalId: string, status: 'accepted' | 'rejected') => void
}

const HotelProposalsSection: React.FC<HotelProposalsSectionProps> = ({
  proposals,
  orderId,
  onProposalUpdate,
}) => {
  if (proposals.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Hotel Proposals</h2>
      <p className="text-gray-600 mb-6">
        The hotel has made some proposals for your booking. Review and respond to each one below.
      </p>
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <ProposalWidget
            key={proposal.id}
            orderId={orderId}
            proposal={proposal}
            onProposalUpdate={onProposalUpdate}
          />
        ))}
      </div>
    </div>
  )
}

export default HotelProposalsSection