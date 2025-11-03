import { Skeleton } from '@/components/ui/skeleton'

const ViewSummarySkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Main content skeleton for booking summary cards */}
      <div className="space-y-4">
        {/* Date and occupancy info skeleton */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>

        {/* Booking card skeleton */}
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          {/* Guest info */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Room info */}
          <Skeleton className="h-24 w-full rounded-lg" />

          {/* Upgrade section */}
          <Skeleton className="h-20 w-full rounded-lg" />

          {/* Attributes section */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>

          {/* Service price */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Total section skeleton */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Modify button skeleton */}
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default ViewSummarySkeleton
