# ABS (Advanced Booking System) - Project Documentation

Welcome to the ABS project documentation. This React-based hotel booking system provides a comprehensive solution for room selection, customization, special offers, and order management.

## 📚 Documentation Structure

### 🏗️ Architecture & Technical Design
- **[Architecture Overview](./architecture/01-project-overview.md)** - High-level system architecture and technology stack
- **[Component Architecture](./architecture/02-component-architecture.md)** - Detailed component breakdown with unified store patterns
- **[Database Integration](./architecture/03-database-integration.md)** - Supabase integration and schema design

### 📖 Developer Guides
- **[Development Guide](./guides/04-development-guide.md)** - Complete setup and development workflow
- **[State Management Migration](./guides/06-state-management-migration-guide.md)** - Zustand migration guide (COMPLETED)
- **[Bidding System Guide](./guides/BIDDING_FUNCTIONALITY.md)** - Complete guide to re-enabling bidding features
- **[Supabase Quick Start](./guides/SUPABASE_INTEGRATION.md)** - Quick setup guide (see [Database Integration](./architecture/03-database-integration.md) for details)

### 🔬 Analysis & Reviews
- **[Documentation Audit](./analysis/DOCUMENTATION_AUDIT.md)** - Complete documentation modernization plan
- **[Component Review](./analysis/05-room-selection-pricing-components-review.md)** - Detailed technical component analysis
- **[Mobile UX Analysis](./analysis/mobile-booking-ux-analysis.md)** - Mobile user experience research and optimization

### 📚 Reference Documentation
- **[Developer Handbook](./reference/DEVELOPER_HANDBOOK.md)** - Comprehensive 50+ page technical architecture guide
- **[Completed Features](./reference/09-completed-features.md)** - Complete list of implemented functionality
- **[Roadmap & Next Steps](./reference/10-next-steps.md)** - Planned improvements and development roadmap

### ⚙️ Feature Specifications
- **[Feature Specifications](./specs/)** - Complete Requirements → Design → Implementation workflow
  - [Multi-Booking System](./specs/multi-booking-system/) - Advanced room-specific customizations
  - [Room Customization System](./specs/room-customization-system/) - Room upgrades and amenities
  - [Testing Framework](./specs/testing-framework/) - Quality assurance and E2E testing
  - [Special Offers System](./specs/special-offers-system/) - Dynamic promotional offers
  - [Order Management](./specs/order-management/) - Booking lifecycle and tracking
  - [Content Management](./specs/content-management/) - Database-driven content system
  - [Internationalization](./specs/internationalization/) - Multilingual support implementation

### 📁 Archive
- **[Historical Documentation](./archive/)** - Archived and legacy documentation

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

- **Current Version**: 1.0.0-beta
- **Last Updated**: 2025-09-01
- **Development Stage**: Beta - Core Features Functional, Testing & Production Prep Ongoing
- **Primary Framework**: React 19.1.0 + TypeScript + Vite
- **UI Library**: Tailwind CSS v4 + Radix UI
- **Backend**: Supabase (PostgreSQL + Realtime)
- **State Management**: **Zustand Store (Unified Architecture)**
- **Internationalization**: i18next + Database-driven translations
- **Testing**: Playwright E2E + Vitest Unit Testing (In Progress)

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Radix UI Components
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **State Management**: **Zustand + Immer (Unified Store)**
- **Routing**: React Router v7
- **Internationalization**: i18next + react-i18next + Database translations
- **Testing**: Playwright (E2E) + Vitest (Unit)
- **Icons**: Lucide React, Iconify
- **Package Manager**: pnpm

## 🚀 Recent Major Updates (September 2025)

- **🏗️ State Management Progress**: Ongoing migration to unified Zustand store architecture
- **💰 Pricing Calculations**: Enhanced pricing logic and item management across components
- **🧪 Testing Framework Setup**: Basic Playwright E2E and Vitest unit testing infrastructure implemented
- **📱 Multi-Booking Enhancements**: Improved room-specific state management and UI synchronization
- **🔄 Component Refactoring**: Ongoing unification of pricing item handling across ABS components
- **🎨 UI Improvements**: Enhanced styling and accessibility updates across components

### 🔄 Architecture Evolution
- **Legacy Hook System** → **Unified Zustand Store**
- **Dual State Management** → **Single Source of Truth**
- **Manual State Synchronization** → **Automatic Consistency**
- **Basic Error Handling** → **Comprehensive Error Boundaries with Recovery**

For detailed changelog, see [Completed Features](./09-completed-features.md).