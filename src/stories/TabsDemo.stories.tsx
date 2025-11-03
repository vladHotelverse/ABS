import type { Meta, StoryObj } from '@storybook/react'
import { Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TabsStrip, type TabsStripTab } from './components'
import { tabsDemoTheme } from './mockData'

type Tab = { id: string; label: string; guests?: number }

const buildTabs = (tabs: Tab[]): TabsStripTab[] =>
  tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    badge:
      typeof tab.guests === 'number' ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-primary text-xs">
          <Users className="h-4 w-4" /> {tab.guests}
        </span>
      ) : undefined,
  }))

const meta = {
  title: 'Upsell/TabsDemo',
  component: TabsStrip,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onChange: { action: 'tab changed' },
  },
} satisfies Meta<typeof TabsStrip>

export default meta
type Story = StoryObj<typeof meta>

const tabsSample: Tab[] = [
  { id: 'room-1', label: 'Room 1', guests: 2 },
  { id: 'room-2', label: 'Room 2', guests: 4 },
  { id: 'room-3', label: 'Room 3', guests: 2 },
]

export const TabsOnly: Story = {
  args: {
    tabs: buildTabs(tabsSample),
    sticky: true,
  },
  render: (args) => (
    <div style={tabsDemoTheme}>
      <TabsStrip {...args} />
    </div>
  ),
}

export const TabsWithPreview: Story = {
  render: () => (
    <div className="bg-muted" style={tabsDemoTheme}>
      <TabsStrip tabs={buildTabs(tabsSample)} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-bold text-2xl">Upgrade Your Room - TRIPLE DELUXE GOLF VIEW</h2>
            <p className="text-muted-foreground">Choose an upgrade for your currently selected room.</p>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl bg-white p-0 shadow-[var(--shadow-depth-2)] ring-1 ring-border/60"
                >
                  <div className="relative">
                    <Skeleton className="h-44 w-full" />
                    <div className="absolute top-2 left-2 space-x-2">
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs">Mountain View</span>
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs">Kitchenette</span>
                    </div>
                    <div className="absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-0.5 text-xs">
                      8 photos
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">JUNIOR SUITE</h3>
                    <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                      Enjoy a spacious retreat of 84 m² designed for complete relaxation...
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-muted-foreground">
                        <span className="font-bold text-2xl">60</span> € / night
                      </div>
                      <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm">
                        UPGRADE NOW
                      </button>
                    </div>
                    <p className="text-muted-foreground text-xs">Additional cost per night</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-0 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center justify-between border-border border-b p-4">
              <h3 className="font-medium">Customize your stay</h3>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-primary text-xs">3 rooms</span>
            </div>
            <div className="p-10 text-center text-muted-foreground">
              No selections made for this room yet.
              <br />
              Add upgrades or customizations to see them here.
            </div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">€0.00</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-muted-foreground text-sm">
              <span className="inline-flex items-center gap-2">
                <span className="rounded-sm border px-1.5 py-0.5">Pay at Hotel</span>
              </span>
              <span className="italic">Subject to availability</span>
            </div>
            <button className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-primary-foreground">
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
}
