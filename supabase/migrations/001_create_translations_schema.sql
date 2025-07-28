-- Create translations table to store all text content
CREATE TABLE IF NOT EXISTS translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  value TEXT NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(key, language)
);

-- Create room types table for dynamic room data
CREATE TABLE IF NOT EXISTS room_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  title JSONB NOT NULL, -- {"en": "Live luxury's pinnacle by the sea", "es": "Vive el pináculo del lujo junto al mar"}
  room_type TEXT NOT NULL,
  description JSONB NOT NULL, -- {"en": "True rock stars...", "es": "Las verdaderas estrellas..."}
  base_price DECIMAL(10,2) NOT NULL,
  main_image TEXT NOT NULL,
  images JSONB, -- ["url1", "url2", ...]
  amenities JSONB, -- ["24 Hours Room Service", "AC", ...]
  capacity INTEGER DEFAULT 2,
  size_sqm INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create customization options table
CREATE TABLE IF NOT EXISTS customization_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'beds', 'location', 'floor', 'view', etc.
  option_code TEXT NOT NULL,
  name JSONB NOT NULL, -- {"en": "King Size Bed", "es": "Cama King Size"}
  description JSONB NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  icon TEXT,
  label JSONB, -- {"en": "King Size", "es": "King Size"}
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(category, option_code)
);

-- Create special offers table
CREATE TABLE IF NOT EXISTS special_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_code TEXT NOT NULL UNIQUE,
  title JSONB NOT NULL, -- {"en": "All inclusive package", "es": "Paquete todo incluido"}
  description JSONB NOT NULL,
  image TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  price_type TEXT NOT NULL CHECK (price_type IN ('perPerson', 'perNight', 'perStay')),
  requires_date_selection BOOLEAN DEFAULT false,
  allows_multiple_dates BOOLEAN DEFAULT false,
  max_quantity INTEGER,
  active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create sections configuration table
CREATE TABLE IF NOT EXISTS section_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_code TEXT NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  description TEXT,
  info_text TEXT,
  icon TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(section_code, language)
);

-- Create compatibility rules table
CREATE TABLE IF NOT EXISTS compatibility_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  option1_category TEXT NOT NULL,
  option1_code TEXT NOT NULL,
  option2_category TEXT NOT NULL,
  option2_code TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('incompatible', 'requires', 'recommended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_translations_key_lang ON translations(key, language);
CREATE INDEX idx_translations_category ON translations(category);
CREATE INDEX idx_room_types_active ON room_types(active);
CREATE INDEX idx_customization_options_category ON customization_options(category);
CREATE INDEX idx_customization_options_active ON customization_options(active);
CREATE INDEX idx_special_offers_active ON special_offers(active);
CREATE INDEX idx_section_configs_section_lang ON section_configs(section_code, language);

-- Create update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables with updated_at column
CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON room_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customization_options_updated_at BEFORE UPDATE ON customization_options
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_special_offers_updated_at BEFORE UPDATE ON special_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_section_configs_updated_at BEFORE UPDATE ON section_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for read access (all users can read)
CREATE POLICY "Allow public read access" ON translations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON room_types FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON customization_options FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON special_offers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON section_configs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON compatibility_rules FOR SELECT USING (true);

-- Note: Write policies should be added based on your authentication requirements