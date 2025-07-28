-- Create orders and related tables for order management
-- These tables store booking orders created through the ABS system

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- ABS-YYYYMMDD-XXXXXX format
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  reservation_code TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room_type TEXT NOT NULL,
  occupancy TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'modified')),
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create order_items table to store selected items (rooms, customizations, offers)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('room_upgrade', 'customization', 'special_offer')),
  item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB, -- Store additional item data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create hotel_proposals table for hotel-initiated proposals
CREATE TABLE IF NOT EXISTS hotel_proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('room_change', 'customization_change', 'offer_change', 'price_change')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  original_item_id TEXT,
  proposed_item_data JSONB, -- Store proposed item details
  price_difference DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_check_in ON orders(check_in);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_type ON order_items(type);

CREATE INDEX IF NOT EXISTS idx_hotel_proposals_order_id ON hotel_proposals(order_id);
CREATE INDEX IF NOT EXISTS idx_hotel_proposals_status ON hotel_proposals(status);

-- Apply update triggers (drop first if they exist)
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hotel_proposals_updated_at ON hotel_proposals;
CREATE TRIGGER update_hotel_proposals_updated_at BEFORE UPDATE ON hotel_proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_proposals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
-- For now, allowing public access for demo purposes
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow public read access" ON orders;
DROP POLICY IF EXISTS "Allow public write access" ON orders;
DROP POLICY IF EXISTS "Allow public update access" ON orders;

CREATE POLICY "Allow public read access" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON order_items;
DROP POLICY IF EXISTS "Allow public write access" ON order_items;

CREATE POLICY "Allow public read access" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON hotel_proposals;
DROP POLICY IF EXISTS "Allow public write access" ON hotel_proposals;
DROP POLICY IF EXISTS "Allow public update access" ON hotel_proposals;

CREATE POLICY "Allow public read access" ON hotel_proposals FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON hotel_proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON hotel_proposals FOR UPDATE USING (true);