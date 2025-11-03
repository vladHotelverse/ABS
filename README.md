# ABS UI Toolkit

This repository now serves as a lightweight playground for the **ABS component library**. The original booking
application codebase (Supabase integration, routing layers, mock booking flow, etc.) has been removed so you can focus on
building reusable React components and documenting them in Storybook.

## What's inside?

- **UI primitives only** – Everything in `src/components/ui` is ready to be imported into Storybook stories or composed
  into higher-level components.
- **Tailwind 4 theme tokens** – Update `src/index.css` to tweak global design tokens and keep Storybook docs in sync.
- **Minimal Vite app** – `pnpm dev` spins up a simple preview shell that renders a few primitives while you iterate.
- **Strict TypeScript + ESLint** – The config is preserved so new components stay type-safe and linted.

## Getting started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` to preview the primitives. Update `src/App.tsx` as needed while migrating components or
stories.

## Suggested next steps

1. **Add Storybook** – Install Storybook (`pnpm dlx storybook@latest init --builder @storybook/builder-vite`) and point it
   at `src/components`.
2. **Create design tokens docs** – Expose the values defined in `src/index.css` inside Storybook so designers and
   engineers share the same source of truth.
3. **Layer higher-level components** – New composite components can live under `src/components` alongside the existing UI
   primitives.
4. **Write tests as needed** – Vitest remains configured; add test files next to components once behaviour matters.

## Tooling reference

| Tool       | Purpose            |
| ---------- | ------------------ |
| Vite       | Local development  |
| Tailwind 4 | Styling + tokens   |
| Radix UI   | Accessibility layer |
| Vitest     | Optional unit tests |

---

Happy building! As you migrate stories and components, keep the footprint lean so Storybook stays focused and fast.
