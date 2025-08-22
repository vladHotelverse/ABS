# ABS (Advanced Booking System) - Project Documentation

Welcome to the ABS project documentation. This React-based hotel booking system provides a comprehensive solution for room selection, customization, special offers, and order management.

## 📚 Documentation Structure

### Core Documentation
- [Project Overview](./01-project-overview.md) - High-level architecture and technology stack
- [Component Architecture](./02-component-architecture.md) - Detailed component breakdown
- [Database Integration](./03-database-integration.md) - Supabase integration guide
- [Development Guide](./04-development-guide.md) - Setup and development workflow

### Feature Specifications (NEW ✨)
- **[Feature Specifications](./specs/)** - Requirements → Design → Implementation workflow
  - [Multi-Booking System](./specs/multi-booking-system/) - Room-specific customizations
  - [Room Customization System](./specs/room-customization-system/) - Room customization and upgrades
  - [Testing Framework](./specs/testing-framework/) - Quality assurance and automation
  - [Special Offers System](./specs/special-offers-system/) - Dynamic offer management
  - [Order Management](./specs/order-management/) - Booking tracking and proposals
  - [Content Management](./specs/content-management/) - Database-driven content
  - [Internationalization](./specs/internationalization/) - Multilingual support

### Legacy Documentation
- [Completed Features](./09-completed-features.md) - List of implemented functionality
- [Next Steps](./10-next-steps.md) - Planned improvements and roadmap

> **Note**: Multi-booking guides, testing framework documentation, and booking flow details have been migrated to the new [Feature Specifications](./specs/) structure.

## 🚀 Quick Start

1. **Clone and Setup**
   ```bash
   git clone [repository-url]
   cd ABS
   pnpm install
   ```

2. **Configure Supabase**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

4. **Build for Production**
   ```bash
   pnpm build
   ```

## 📋 Project Status

- **Current Version**: 0.0.0
- **Last Updated**: 2025-08-20
- **Development Stage**: Active Development
- **Primary Framework**: React 19.1.0 + TypeScript + Vite
- **UI Library**: Tailwind CSS + Radix UI
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Hooks + Context
- **Internationalization**: i18next
- **Testing**: [To be configured]

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Radix UI Components
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Routing**: React Router v7
- **Internationalization**: i18next + react-i18next
- **Icons**: Lucide React, Iconify
- **Package Manager**: pnpm

## 📝 Recent Updates

- Enhanced component structure and styling
- Added segment-based pricing and discounts
- Improved order status tracking
- Enhanced room selection carousel with drag & drop
- Supabase integration for dynamic content

For detailed changelog, see [Completed Features](./09-completed-features.md).