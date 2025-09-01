# Content Management System - Design

## Architecture Overview

```typescript
// Content loading and management
const useSupabaseContent = (language: string) => {
  const [content, setContent] = useState<ContentData>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Real-time content subscription
  useEffect(() => {
    const subscription = supabase
      .channel('content-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public' },
        handleContentUpdate
      )
      .subscribe()
      
    return () => subscription.unsubscribe()
  }, [])
  
  return { content, loading, error }
}
```

## Database Schema

### Core Tables
```sql
-- Room content and configuration
CREATE TABLE room_types (
  id UUID PRIMARY KEY,
  room_code VARCHAR UNIQUE,
  title JSONB, -- Multilingual titles
  description JSONB, -- Multilingual descriptions  
  base_price DECIMAL,
  amenities JSONB[],
  images TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Multilingual translations
CREATE TABLE translations (
  id UUID PRIMARY KEY,
  key VARCHAR UNIQUE,
  translations JSONB, -- { "en": "text", "es": "texto" }
  context VARCHAR,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Special offers management
CREATE TABLE special_offers (
  id UUID PRIMARY KEY,
  title JSONB,
  description JSONB,
  category VARCHAR,
  pricing JSONB,
  availability JSONB,
  active BOOLEAN DEFAULT true
);
```

## Content Conversion Layer

```typescript
// Convert Supabase data to component format
export const convertRoomType = (
  room: SupabaseRoomType, 
  language: string
): RoomOption => {
  return {
    id: room.room_code,
    title: room.title[language] || room.title.en,
    description: room.description?.[language] || room.description?.en,
    price: room.base_price,
    amenities: room.amenities || [],
    images: room.images || [],
    // Additional conversions...
  }
}
```

## Fallback Strategy

- Graceful fallback to mock data when Supabase unavailable
- Content caching for performance optimization  
- Error boundary handling for content loading failures
- Real-time content updates with WebSocket connections