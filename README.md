# 🏨 ABS - Advanced Booking System

A modern, React-based hotel booking platform that provides guests with an interactive and customizable booking experience.

## ✨ Features

- **Interactive Room Selection**: Browse rooms with high-quality images and detailed information
- **Room Customization**: Upgrade beds, views, floors, and amenities with fixed pricing
- **Special Offers**: Dynamic offer system with real-time pricing
- **Multi-Booking System**: Manage multiple room bookings with unified state management
- **Multi-language Support**: English and Spanish localization
- **Order Tracking**: Real-time booking status and management
- **Interactive Maps**: Visual room selection via hotel floor plans
- **Mobile Responsive**: Optimized for all devices and screen sizes
- **Dynamic Content**: Content management through Supabase integration
- **Performance Optimized**: Zustand-powered state management with optimistic updates

### 🚨 Recent Changes
- **Bidding System Temporarily Disabled** - Fixed pricing model currently active ([See Re-enable Guide](BIDDING_FUNCTIONALITY.md))
- **Unified State Management** - Migrated to Zustand store for improved performance
- **Enhanced Testing** - Comprehensive E2E testing with Playwright

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ABS

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Environment Setup

1. Copy environment file and configure:
```bash
cp .env.example .env.local
```

2. Add your Supabase credentials to `.env.local`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests |
| `pnpm test:ui` | Run tests with UI |
| `pnpm test:coverage` | Generate test coverage |
| `pnpm test:e2e` | Run end-to-end tests |

### Project Structure

```
src/
├── components/           # React components
│   ├── ABS_Landing/     # Main booking interface
│   ├── ABS_OrderStatus/ # Order tracking
│   ├── ABS_RoomSelection/ # Room selection logic
│   ├── ABS_RoomCustomization/ # Room upgrades
│   ├── ABS_SpecialOffers/ # Special offers
│   ├── ABS_PricingSummaryPanel/ # Cart & pricing
│   └── ui/              # Base UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── services/            # API services
├── types/               # TypeScript definitions
└── i18n/                # Internationalization
```

## 🧪 Testing

### Unit Tests
```bash
pnpm test           # Run all tests
pnpm test:ui        # Interactive test runner
pnpm test:coverage  # Generate coverage report
```

### End-to-End Tests
```bash
pnpm test:e2e           # Run E2E tests
pnpm test:e2e:ui        # Interactive E2E runner
pnpm test:e2e:report    # View test results
```

## 🗄️ Database

The project uses Supabase for dynamic content management. Database migrations are located in `supabase/migrations/`.

### Running Migrations

```bash
# Apply migrations
node scripts/apply-migration.js
```

## 🌐 Internationalization

The app supports multiple languages using i18next:

- English (default)
- Spanish (es)

Translations are stored in `src/i18n/locales/`.

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI Framework |
| TypeScript | ~5.8.3 | Type Safety |
| Vite | ^5.4.19 | Build Tool |
| Tailwind CSS | ^4.0.0 | Styling |
| Radix UI | Various | Accessible Components |
| Supabase | ^2.52.0 | Backend Services |
| React Router | ^7.7.0 | Routing |
| i18next | ^25.3.0 | Internationalization |
| **Zustand** | ^5.0.8 | **Unified State Management** |
| Playwright | Latest | E2E Testing |
| Vitest | Latest | Unit Testing |
| Immer | Latest | Immutable State Updates |

### 🔄 Architecture Highlights
- **Unified Booking Store** - Single source of truth for all booking operations
- **Optimistic Updates** - Fast UI responses with automatic rollback on errors
- **Multi-Booking Support** - Complex room-specific state management
- **Performance Monitoring** - Real-time performance tracking and optimization

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory and root-level guides:

### 🚀 Getting Started
- **[README](README.md)** - This file - project overview and quick start
- **[Development Guide](docs/guides/04-development-guide.md)** - Complete setup and development workflow
- **[Supabase Integration](docs/guides/SUPABASE_INTEGRATION.md)** - Database setup and configuration

### 🏗️ Architecture & Technical Design
- **[Architecture Overview](docs/architecture/01-project-overview.md)** - System architecture and technology stack
- **[Component Architecture](docs/architecture/02-component-architecture.md)** - Unified Zustand store patterns and component breakdown
- **[Database Integration](docs/architecture/03-database-integration.md)** - Supabase schema and integration patterns

### 📚 Comprehensive Documentation
- **[Developer Handbook](docs/reference/DEVELOPER_HANDBOOK.md)** - 50+ page complete technical architecture guide
- **[State Management Migration](docs/guides/06-state-management-migration-guide.md)** - Zustand migration guide (COMPLETED)
- **[Bidding System Guide](docs/guides/BIDDING_FUNCTIONALITY.md)** - Complete guide to re-enabling bidding features

### 📋 Feature Specifications (Requirements → Design → Implementation)
- **[All Specifications](docs/specs/)** - Complete feature specifications with implementation details
- [Multi-Booking System](docs/specs/multi-booking-system/) - Complex room-specific booking management
- [Room Customization System](docs/specs/room-customization-system/) - Room upgrade and customization features
- [Special Offers System](docs/specs/special-offers-system/) - Dynamic promotional offers
- [Testing Framework](docs/specs/testing-framework/) - Quality assurance and E2E testing
- [Order Management](docs/specs/order-management/) - Booking lifecycle and order tracking
- [Content Management](docs/specs/content-management/) - Dynamic content through Supabase
- [Internationalization](docs/specs/internationalization/) - Multi-language support implementation

### 📊 Project Status & Analysis
- **[Completed Features](docs/reference/09-completed-features.md)** - Comprehensive list of implemented functionality
- **[Roadmap & Next Steps](docs/reference/10-next-steps.md)** - Planned improvements and development roadmap
- **[Mobile UX Analysis](docs/analysis/mobile-booking-ux-analysis.md)** - Mobile user experience research and optimization recommendations
- **[Component Analysis](docs/analysis/05-room-selection-pricing-components-review.md)** - Detailed technical component review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.
