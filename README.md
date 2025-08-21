# 🏨 ABS - Advanced Booking System

A modern, React-based hotel booking platform that provides guests with an interactive and customizable booking experience.

## ✨ Features

- **Interactive Room Selection**: Browse rooms with high-quality images and detailed information
- **Room Customization**: Upgrade beds, views, floors, and amenities
- **Special Offers**: Dynamic offer system with real-time pricing
- **Multi-language Support**: English and Spanish localization
- **Order Tracking**: Real-time booking status and management
- **Interactive Maps**: Visual room selection via hotel floor plans
- **Mobile Responsive**: Optimized for all devices and screen sizes
- **Dynamic Content**: Content management through Supabase integration

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

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- [Project Overview](docs/01-project-overview.md)
- [Component Architecture](docs/02-component-architecture.md) 
- [Database Integration](docs/03-database-integration.md)
- [Development Guide](docs/04-development-guide.md)
- [Testing Framework](docs/testing-framework.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.
