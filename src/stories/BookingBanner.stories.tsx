import type { Meta, StoryObj } from '@storybook/react'
import type React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import BookingBanner from '@/components/upsell/BookingBanner'
import { ResponsiveContent, ResponsiveLayout, ResponsiveMain, ResponsiveSidebar } from '@/components/upsell/Layout'

// Decorator that mirrors how upsell-app positions the banner inside the responsive layout.
const BookingLayoutPreview: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ResponsiveLayout showMobileWidget className="bg-slate-100">
    {children}
    <ResponsiveMain>
      <ResponsiveContent>
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </ResponsiveContent>
      <ResponsiveSidebar>
        <div className="space-y-5">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <Skeleton className="h-5 w-32" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="mt-6 h-10 w-full rounded-md" />
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-3 h-4 w-2/3" />
          </div>
        </div>
      </ResponsiveSidebar>
    </ResponsiveMain>
    <div className="mt-4 rounded-t-lg bg-white p-4 shadow-sm lg:hidden">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  </ResponsiveLayout>
)

const meta = {
  title: 'Upsell/BookingBanner',
  component: BookingBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <BookingLayoutPreview>
        <Story />
      </BookingLayoutPreview>
    ),
  ],
  argTypes: {
    hotelImage: { control: 'text' },
    companyLogo: { control: 'text' },
    welcomeText: { control: 'object' },
    hotelName: { control: 'text' },
    bookingDateRange: { control: 'text' },
    bookingNights: { control: 'text' },
    bookingReference: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof BookingBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    welcomeText: {
      salutation: 'Welcome back,',
      greeting: 'Alex!',
    },
    hotelName: 'Hotel Paradise Resort',
    hotelImage:
      'https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp',
    companyLogo: 'https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp',
    bookingDateRange: '12 Aug 2024 - 19 Aug 2024',
    bookingNights: '7 nights',
    bookingReference: 'BCN-458921',
  },
  parameters: {
    docs: {
      description: {
        story: `
Mirrors the booking page usage from \`apps/upsell-app\`: the banner sits at the top of the responsive layout, followed by
main booking content and pricing widgets. Use the controls to test different hotel branding, imagery, and booking
details without opening the app.
        `,
      },
    },
  },
}

export const MobileBookingDetails: Story = {
  name: 'Mobile With Booking Details',
  args: {
    welcomeText: {
      salutation: 'Hey',
      greeting: 'Jamie!',
    },
    hotelName: 'Cloud Nine Resort',
    hotelImage:
      'https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp',
    companyLogo: 'https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp',
    bookingDateRange: '22 Sep 2024 - 25 Sep 2024',
    bookingNights: '3 nights',
    bookingReference: 'NYC-882144',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: `
Highlights the mobile layout where booking reference and stay dates are now visible beneath the hotel details. Use the
Storybook viewport toolbar to preview other breakpoints.
        `,
      },
    },
  },
}

export const BookingFlowContainer: Story = {
  args: {
    welcomeText: {
      salutation: 'Hi',
      greeting: 'Pat!',
    },
    hotelName: 'The Grand Budapest Hotel',
    hotelImage:
      'https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp',
    companyLogo: 'https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp',
  },
  parameters: {
    docs: {
      description: {
        story: `
Mirrors \`BookingBannerContainer\` in the upsell-app: data fetchers populate hotel name, logo, and image, while booking
metadata is omitted because it's retrieved deeper in the flow.
        `,
      },
    },
  },
}

export const MissingBrandAssets: Story = {
  args: {
    welcomeText: {
      salutation: 'Welcome',
      greeting: 'Traveler!',
    },
    hotelName: 'Hotel Without Assets',
  },
  parameters: {
    docs: {
      description: {
        story: `
Fallback view when masters data lacks imagery or branding. Useful for testing how the banner behaves in low-data
environments or for partner onboarding.
        `,
      },
    },
  },
}

export const LoadingState: Story = {
  args: {
    welcomeText: {
      salutation: 'Welcome back,',
      greeting: 'Alex!',
    },
    hotelName: 'Hotel Paradise Resort',
    hotelImage:
      'https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp',
    companyLogo: 'https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp',
  },
  render: (args) => (
    <div className="relative">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur">
        <div className="space-y-3 rounded-lg bg-white p-6 shadow-md">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <BookingBanner {...args} className="pointer-events-none opacity-30" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Simulates the optimistic loading state used while booking data hydrates. The semi-transparent banner shows the eventual
layout, while an overlay skeleton communicates that the fetch is still in progress.
        `,
      },
    },
  },
}
