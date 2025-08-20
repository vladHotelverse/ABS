# Database Integration Guide

## 🗄️ Supabase Integration Overview

The ABS project uses Supabase as its backend-as-a-service, providing PostgreSQL database, authentication, and real-time subscriptions. This integration replaces static content with dynamic, manageable data.

## 📊 Database Schema

### Core Tables

#### 1. `translations` Table
**Purpose**: Multi-language UI text storage
```sql
CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  language VARCHAR(10) NOT NULL,
  value TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(key, language)
);
```

**Usage Example**:
```typescript
// Fetching translations
const { translations } = useTranslations('en')
console.log(translations.roomTitle) // "Choose Your Room"
```

#### 2. `room_types` Table
**Purpose**: Dynamic room configuration and pricing
```sql
CREATE TABLE room_types (
  id SERIAL PRIMARY KEY,
  room_code VARCHAR(50) UNIQUE NOT NULL,
  title JSONB NOT NULL, -- {"en": "Deluxe Ocean View", "es": "Vista al Océano Deluxe"}
  room_type VARCHAR(100),
  description JSONB,
  base_price DECIMAL(10,2),
  main_image TEXT,
  gallery_images TEXT[],
  amenities TEXT[],
  max_occupancy INTEGER DEFAULT 2,
  segment_discounts JSONB, -- {"vip": 0.15, "corporate": 0.10}
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `customization_options` Table
**Purpose**: Room upgrade options and configurations
```sql
CREATE TABLE customization_options (
  id SERIAL PRIMARY KEY,
  option_code VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'bed', 'view', 'floor', 'amenities'
  name JSONB NOT NULL,
  description JSONB,
  price DECIMAL(10,2) DEFAULT 0,
  price_type VARCHAR(20) DEFAULT 'perStay', -- 'perStay', 'perNight', 'perPerson'
  icon VARCHAR(100),
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);
```

#### 4. `special_offers` Table
**Purpose**: Dynamic special offers management
```sql
CREATE TABLE special_offers (
  id SERIAL PRIMARY KEY,
  offer_code VARCHAR(50) UNIQUE NOT NULL,
  title JSONB NOT NULL,
  description JSONB,
  image TEXT,
  base_price DECIMAL(10,2),
  price_type VARCHAR(20) DEFAULT 'perPerson', -- 'perPerson', 'perNight', 'perStay'
  min_quantity INTEGER DEFAULT 1,
  max_quantity INTEGER,
  requires_date_selection BOOLEAN DEFAULT FALSE,
  available_from DATE,
  available_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);
```

#### 5. `section_configs` Table
**Purpose**: UI section configuration and ordering
```sql
CREATE TABLE section_configs (
  id SERIAL PRIMARY KEY,
  section_id VARCHAR(50) UNIQUE NOT NULL,
  title JSONB,
  description JSONB,
  info_text JSONB,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);
```

#### 6. `compatibility_rules` Table
**Purpose**: Option compatibility and conflict management
```sql
CREATE TABLE compatibility_rules (
  id SERIAL PRIMARY KEY,
  rule_type VARCHAR(20) NOT NULL, -- 'incompatible', 'requires', 'recommended'
  option_codes TEXT[] NOT NULL, -- Array of option codes involved in rule
  description JSONB,
  is_active BOOLEAN DEFAULT TRUE
);
```

## 🔄 Data Flow Architecture

### 1. Content Loading Pattern
```typescript
// Hook for loading all content
export const useLandingPageContent = (language: 'en' | 'es') => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Data states
  const [translations, setTranslations] = useState({})
  const [roomTypes, setRoomTypes] = useState([])
  const [customizationOptions, setCustomizationOptions] = useState([])
  const [specialOffers, setSpecialOffers] = useState([])
  const [sections, setSections] = useState([])
  const [compatibilityRules, setCompatibilityRules] = useState([])
  
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true)
        
        // Parallel data fetching
        const [
          translationsData,
          roomTypesData,
          customizationData,
          offersData,
          sectionsData,
          rulesData
        ] = await Promise.all([
          supabase.from('translations').select('*').eq('language', language),
          supabase.from('room_types').select('*').eq('is_active', true),
          supabase.from('customization_options').select('*').eq('is_active', true),
          supabase.from('special_offers').select('*').eq('is_active', true),
          supabase.from('section_configs').select('*').eq('is_active', true),
          supabase.from('compatibility_rules').select('*').eq('is_active', true)
        ])
        
        // Process and set data
        setTranslations(processTranslations(translationsData.data))
        setRoomTypes(roomTypesData.data || [])
        setCustomizationOptions(customizationData.data || [])
        setSpecialOffers(offersData.data || [])
        setSections(sectionsData.data || [])
        setCompatibilityRules(rulesData.data || [])
        
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    loadContent()
  }, [language])
  
  return {
    translations,
    roomTypes,
    customizationOptions,
    specialOffers,
    sections,
    compatibilityRules,
    loading,
    error
  }
}
```

### 2. Data Conversion Layer
**Location**: `src/utils/supabaseDataConverter.ts`

```typescript
// Convert Supabase room data to component format
export const convertRoomType = (room: SupabaseRoomType, language: string): RoomOption => {
  return {
    id: room.room_code,
    title: room.title[language] || room.title.en,
    type: room.room_type,
    description: room.description?.[language] || room.description?.en || '',
    price: room.base_price,
    currency: 'EUR',
    mainImage: room.main_image,
    images: room.gallery_images || [],
    amenities: room.amenities || [],
    maxOccupancy: room.max_occupancy,
    segmentDiscounts: room.segment_discounts || {}
  }
}

// Convert customization options with category grouping
export const groupCustomizationOptions = (options: SupabaseCustomizationOption[]) => {
  return options.reduce((groups, option) => {
    const category = option.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(option)
    return groups
  }, {} as Record<string, SupabaseCustomizationOption[]>)
}
```

## 🚀 Migration System

### Migration Files Structure
```
supabase/migrations/
├── 001_create_translations_schema.sql
├── 002_seed_translations_data_fixed.sql
├── 003_complete_mock_data.sql
├── 004_create_orders_schema.sql
├── 005_fix_orders_id_column.sql
├── 006_add_special_offers_section.sql
├── 007_update_special_offers_with_room_data.sql
├── 008_move_special_offers_to_last.sql
└── 009_add_online_checkin_offer.sql
```

### Running Migrations
```bash
# Apply all pending migrations
supabase db push

# Apply specific migration
supabase db push supabase/migrations/001_create_translations_schema.sql
```

### Migration Best Practices
1. **Incremental Changes**: Each migration should be atomic and reversible
2. **Data Validation**: Include data integrity checks
3. **Backup Strategy**: Always backup before major schema changes
4. **Testing**: Test migrations on staging environment first

## 🔐 Row Level Security (RLS)

### Security Policies
```sql
-- Enable RLS on all tables
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for public booking interface)
CREATE POLICY "Allow anonymous read access to translations"
  ON translations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to active room types"
  ON room_types FOR SELECT
  TO anon
  USING (is_active = true);

-- Restrict admin operations to authenticated users
CREATE POLICY "Allow authenticated users to manage content"
  ON translations FOR ALL
  TO authenticated
  USING (true);
```

## 📊 Performance Optimization

### Query Optimization
```typescript
// Efficient data fetching with selective fields
const { data: roomTypes } = await supabase
  .from('room_types')
  .select('room_code, title, base_price, main_image, amenities')
  .eq('is_active', true)
  .order('sort_order')

// Use indexes for frequently queried columns
CREATE INDEX idx_room_types_active ON room_types(is_active);
CREATE INDEX idx_customization_category ON customization_options(category);
CREATE INDEX idx_translations_key_lang ON translations(key, language);
```

### Caching Strategy
```typescript
// Cache translations for better performance
const translationCache = new Map<string, Record<string, string>>()

export const getCachedTranslations = async (language: string) => {
  const cacheKey = `translations_${language}`
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }
  
  const { data } = await supabase
    .from('translations')
    .select('key, value')
    .eq('language', language)
  
  const translations = data?.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {} as Record<string, string>) || {}
  
  translationCache.set(cacheKey, translations)
  return translations
}
```

## 🔄 Real-time Updates

### Subscription Setup
```typescript
// Real-time content updates
export const useRealTimeContent = () => {
  const [content, setContent] = useState(null)
  
  useEffect(() => {
    // Subscribe to room type changes
    const roomTypesSubscription = supabase
      .channel('room-types-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'room_types' 
        },
        (payload) => {
          console.log('Room type updated:', payload)
          // Refresh content
          refreshRoomTypes()
        }
      )
      .subscribe()
    
    return () => {
      roomTypesSubscription.unsubscribe()
    }
  }, [])
  
  return content
}
```

## 🛠️ Development Tools

### Supabase CLI Commands
```bash
# Start local development environment
supabase start

# Generate TypeScript types from database
supabase gen types typescript --local > src/types/supabase.ts

# Reset database to clean state
supabase db reset

# View database logs
supabase logs
```

### Environment Configuration
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🧪 Testing Database Integration

### Mock Data for Testing
```typescript
// src/utils/createSampleData.ts
export const createMockSupabaseData = () => ({
  translations: {
    roomTitle: { en: 'Choose Your Room', es: 'Elige Tu Habitación' },
    selectText: { en: 'Select', es: 'Seleccionar' }
  },
  roomTypes: [
    {
      room_code: 'deluxe-ocean',
      title: { en: 'Deluxe Ocean View', es: 'Vista al Océano Deluxe' },
      base_price: 250,
      is_active: true
    }
  ]
})
```

### Integration Test Patterns
```typescript
// __tests__/supabase-integration.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useLandingPageContent } from '../hooks/useSupabaseContent'

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: mockData }))
      }))
    }))
  }
}))

test('loads content from Supabase', async () => {
  const { result } = renderHook(() => useLandingPageContent('en'))
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })
  
  expect(result.current.roomTypes).toHaveLength(3)
  expect(result.current.error).toBeNull()
})
```

## 🚨 Error Handling

### Graceful Fallbacks
```typescript
// Fallback to mock data when Supabase fails
useEffect(() => {
  if (!loading) {
    const useMockData = error || !translations || roomTypes.length === 0
    
    if (useMockData) {
      console.warn('Using mock data due to Supabase error:', error)
      setProcessedData({
        roomOptions: mockRoomOptions,
        translations: mockTranslations[currentLang],
        // ... other mock data
      })
    } else {
      // Use Supabase data
      setProcessedData(convertSupabaseData())
    }
  }
}, [loading, error, translations, roomTypes])
```

### Error Monitoring
```typescript
// Log Supabase errors for monitoring
const handleSupabaseError = (error: Error, context: string) => {
  console.error(`Supabase error in ${context}:`, error)
  
  // Send to error monitoring service
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      tags: { component: 'supabase', context }
    })
  }
}
```

## 📈 Monitoring and Analytics

### Query Performance Monitoring
```sql
-- Enable query performance insights
-- View slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE mean_time > 100 
ORDER BY mean_time DESC;
```

### Usage Analytics
```typescript
// Track content usage patterns
export const trackContentUsage = (contentType: string, contentId: string) => {
  // Analytics tracking
  gtag('event', 'content_view', {
    content_type: contentType,
    content_id: contentId
  })
}
```