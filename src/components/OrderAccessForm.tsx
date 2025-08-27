/**
 * Order Access Form Component
 * Simple form for guests to access their orders using email and reservation code
 */

import React, { useState } from 'react'
import { UiButton } from './ui/button'
import clsx from 'clsx'

export interface OrderAccessFormProps {
  onAccess: (email: string, reservationCode: string) => void
  loading?: boolean
  error?: string
  className?: string
}

const OrderAccessForm: React.FC<OrderAccessFormProps> = ({
  onAccess,
  loading = false,
  error,
  className
}) => {
  const [email, setEmail] = useState('')
  const [reservationCode, setReservationCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() && reservationCode.trim()) {
      onAccess(email.trim(), reservationCode.trim())
    }
  }

  return (
    <div className={clsx('max-w-md mx-auto', className)}>
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Your Order
          </h2>
          <p className="text-muted-foreground">
            Enter your email and reservation code to view your hotel selections
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="guest@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="reservationCode" className="block text-sm font-medium text-foreground mb-1">
              Reservation Code
            </label>
            <input
              type="text"
              id="reservationCode"
              value={reservationCode}
              onChange={(e) => setReservationCode(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="e.g., oct003"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive rounded-md p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <UiButton
            type="submit"
            className="w-full"
            disabled={loading || !email.trim() || !reservationCode.trim()}
          >
            {loading ? 'Accessing...' : 'Access Order'}
          </UiButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your order information is protected and secure
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderAccessForm