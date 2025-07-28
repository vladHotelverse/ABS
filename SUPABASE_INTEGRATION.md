# Supabase Integration Guide

This guide explains how the Supabase integration works to replace static text with dynamic content from the database.

## Overview

The integration allows all text content, room data, customization options, and special offers to be managed dynamically from Supabase instead of being hardcoded in the application.

## Database Schema

### Tables Created

1. **translations** - Stores all UI text translations
   - `key`: Translation key (e.g., 'roomTitle')
   - `language`: Language code ('en', 'es')
   - `value`: Translated text
   - `category`: Optional category for grouping

2. **room_types** - Dynamic room data
   - Multilingual title and description (JSONB)
   - Pricing, images, and amenities
   - Active/inactive status

3. **customization_options** - Room customization choices
   - Categories: beds, location, floor, view, etc.
   - Multilingual names and descriptions
   - Pricing and icons

4. **special_offers** - Dynamic special offers
   - Multilingual content
   - Price types: perPerson, perNight, perStay
   - Date selection requirements

5. **section_configs** - Section configurations
   - Section titles and descriptions
   - Info text for user guidance
   - Sort order and active status

6. **compatibility_rules** - Option compatibility rules
   - Defines which options work together
   - Types: incompatible, requires, recommended

## Setup Instructions

### 1. Apply Database Migrations

Run the migration files in your Supabase project:

```bash
# Apply schema creation
supabase db push supabase/migrations/001_create_translations_schema.sql

# Apply seed data
supabase db push supabase/migrations/002_seed_translations_data.sql
```

### 2. Configure Environment Variables

Ensure your `.env.local` file has the Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Using the Integration

The app now uses Supabase by default for all content. The integration replaces all static data with dynamic content from the database.

## Key Components

### Hooks

- `useTranslations()` - Fetch UI translations
- `useRoomTypes()` - Fetch room data
- `useCustomizationOptions()` - Fetch customization options
- `useSpecialOffers()` - Fetch special offers
- `useSectionConfigs()` - Fetch section configurations
- `useCompatibilityRules()` - Fetch compatibility rules
- `useLandingPageContent()` - Combined hook for all content

### Data Converters

The `supabaseDataConverter.ts` file contains functions to convert Supabase data to the component format:

- `convertRoomType()` - Convert room data
- `convertCustomizationOption()` - Convert options
- `convertSpecialOffer()` - Convert offers
- `convertTranslations()` - Convert translation map

### Components

- `App.tsx` - Main app component now fetches data from Supabase
- Shows loading skeletons while fetching
- Displays error states if fetch fails
- Processes and converts data for existing components
- Uses the existing `ABSLanding` component with dynamic data

## Managing Content

### Adding Translations

```sql
INSERT INTO translations (key, language, value, category) VALUES
('newKey', 'en', 'English text', 'category_name'),
('newKey', 'es', 'Texto en español', 'category_name');
```

### Adding Room Types

```sql
INSERT INTO room_types (room_code, title, room_type, description, base_price, main_image) VALUES
('new-room', 
 '{"en": "Room Title", "es": "Título de Habitación"}'::jsonb,
 'ROOM TYPE',
 '{"en": "Description", "es": "Descripción"}'::jsonb,
 99.00,
 'https://image-url.jpg'
);
```

### Adding Special Offers

```sql
INSERT INTO special_offers (offer_code, title, description, image, base_price, price_type) VALUES
('new-offer',
 '{"en": "Offer Title", "es": "Título de Oferta"}'::jsonb,
 '{"en": "Description", "es": "Descripción"}'::jsonb,
 'https://image-url.jpg',
 50.00,
 'perPerson'
);
```

## Language Support

The system supports multiple languages:
- Content is stored in JSONB format with language keys
- Fallback to English if translation is missing
- Language can be switched dynamically

## Benefits

1. **Dynamic Content**: Update text without deploying
2. **Multi-language**: Easy to add new languages
3. **A/B Testing**: Test different content variations
4. **Content Management**: Non-developers can update content
5. **Consistency**: Single source of truth for all text

## Future Enhancements

1. Add admin panel for content management
2. Implement content versioning
3. Add preview functionality
4. Cache content for better performance
5. Add content approval workflow