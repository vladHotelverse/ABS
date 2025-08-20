import type React from 'react'
import { useState } from 'react'
import { UiButton } from '../../ui/button'

export interface OrderStatusInputFormProps {
  onSubmit: (orderId: string) => void
  onBackToHome?: () => void
}

const OrderStatusInputForm: React.FC<OrderStatusInputFormProps> = ({
  onSubmit,
  onBackToHome,
}) => {
  const [inputOrderId, setInputOrderId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputOrderId.trim()) {
      onSubmit(inputOrderId.trim())
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Your Order</h2>
          <p className="text-gray-600">Enter your booking ID to view your order status</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
              Booking ID
            </label>
            <input
              type="text"
              id="orderId"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value.toUpperCase())}
              placeholder="ABS-20250723-A1B2C3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={17}
            />
          </div>
          
          <UiButton 
            type="submit" 
            className="w-full"
            disabled={!inputOrderId.trim()}
          >
            View Order Status
          </UiButton>
        </form>
        
        {onBackToHome && (
          <div className="mt-4 text-center">
            <button
              onClick={onBackToHome}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderStatusInputForm