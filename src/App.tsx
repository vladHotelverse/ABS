import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

const demoTabs = [
  { value: 'overview', label: 'Overview', description: 'A quick tour of the component library scaffold.' },
  { value: 'tokens', label: 'Tokens', description: 'Design tokens live in Tailwind and can power Storybook docs.' },
  { value: 'actions', label: 'Actions', description: 'Buttons, inputs, and other primitives render here.' },
]

export default function App() {
  const defaultTab = useMemo(() => demoTabs[0]?.value ?? 'overview', [])

  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-50 px-6 py-16 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50">
      <section className="w-full max-w-3xl space-y-10">
        <header className="space-y-4 text-center">
          <Badge variant="secondary" className="px-3 py-1 text-xs uppercase tracking-[0.2em]">
            Component Library Preview
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">ABS UI Toolkit</h1>
          <p className="mx-auto max-w-xl text-sm text-neutral-600 dark:text-neutral-300">
            This project has been trimmed down to highlight reusable UI primitives. Plug these components into Storybook
            and build out new experiences without the baggage of the original booking app.
          </p>
        </header>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {demoTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Ready for Storybook</CardTitle>
                <CardDescription>The runtime exists only to preview base components.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                <p>
                  The application shell is intentionally lightweight. Use this space for manual QA while you wire the same
                  components into Storybook stories.
                </p>
                <p>
                  Add new components under <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">src/components</code> and keep
                  shared utilities inside <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">src/lib</code>.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens">
            <Card>
              <CardHeader>
                <CardTitle>Design Tokens</CardTitle>
                <CardDescription>Tailwind 4 powers the current theme.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                <p>
                  Global theme values live in <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">src/index.css</code>. Reference
                  these tokens from Storybook&apos;s docs to keep design and implementation aligned.
                </p>
                <p>
                  Update <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">tailwind.config</code> or add CSS variables as needed; the build setup
                  is already configured for PostCSS and Tailwind.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Interactive primitives</CardTitle>
                <CardDescription>Buttons and stateful controls stay available during the Storybook migration.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
