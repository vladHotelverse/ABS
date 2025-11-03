import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  consultationPreviewSelection,
  defaultRoomCustomizationCategories,
  limitedAvailabilityAttributeIds,
  RoomCustomizationPreview,
} from './utils/RoomCustomizationPreview'

const meta = {
  title: 'Upsell/RoomCustomization',
  component: RoomCustomizationPreview,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    nights: {
      control: { type: 'number', min: 1, step: 1 },
    },
  },
} satisfies Meta<typeof RoomCustomizationPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Customize your stay',
    description: 'Pick room add-ons to tailor the experience before guests arrive.',
    currency: 'EUR',
    nights: 4,
    categories: defaultRoomCustomizationCategories,
  },
  parameters: {
    docs: {
      description: {
        story: `
Recreates the upsell page layout where room customization lives beneath the upgrade carousel. Tweak the controls to
simulate hotel data, attribute pricing, or length of stay without opening \`apps/upsell-app\`.
        `,
      },
    },
  },
}

export const ConsultationReview: Story = {
  args: {
    title: 'Requested add-ons',
    description: 'Guests asked for the following amenities during the call. Review before confirming.',
    currency: 'EUR',
    nights: 4,
    categories: defaultRoomCustomizationCategories,
    initialSelectedIds: consultationPreviewSelection,
    readonly: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Matches the consultation/read-only flow where selections come from a concierge interaction. Agents review the locked
choices with editing disabled.
        `,
      },
    },
  },
}

export const LimitedInventory: Story = {
  args: {
    title: 'Limited availability',
    description: 'Some upgrades are temporarily unavailable for this booking window.',
    currency: 'EUR',
    nights: 3,
    categories: defaultRoomCustomizationCategories,
    disabledAttributes: limitedAvailabilityAttributeIds,
    initialSelectedIds: [101],
  },
  parameters: {
    docs: {
      description: {
        story: `
Simulates the service inventory fallback when availability rules disable certain attributes after pricing refresh.
Disabled cards show the tooltip and selection is prevented.
        `,
      },
    },
  },
}

export const LoadingState: Story = {
  args: {
    title: 'Customize your stay',
    description: 'Loading personalization options…',
    currency: 'EUR',
    nights: 4,
    categories: defaultRoomCustomizationCategories,
  },
  render: (args) => (
    <div className="relative">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur">
        <div className="space-y-3 rounded-lg bg-white p-6 shadow-md">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg sm:col-span-2" />
          </div>
        </div>
      </div>
      <RoomCustomizationPreview {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Shows the optimistic loading overlay used while attribute pricing resolves. Beneath the skeleton, the eventual layout
renders so spacing and scroll behaviour stay consistent.
        `,
      },
    },
  },
}
