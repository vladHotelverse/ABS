-- Fix the orders table ID column to be TEXT instead of UUID
-- This allows us to use the ABS-YYYYMMDD-XXXXXX format for booking IDs

-- First, drop the existing table if it exists (since it might have wrong column type)
DROP TABLE IF EXISTS hotel_proposals CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Recreate orders table with correct TEXT id
CREATE TABLE orders (
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

-- Recreate order_items table
CREATE TABLE order_items (
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

-- Recreate hotel_proposals table
CREATE TABLE hotel_proposals (
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

-- Create indexes
CREATE INDEX idx_orders_user_email ON orders(user_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_check_in ON orders(check_in);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_type ON order_items(type);

CREATE INDEX idx_hotel_proposals_order_id ON hotel_proposals(order_id);
CREATE INDEX idx_hotel_proposals_status ON hotel_proposals(status);

-- Apply update triggers
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotel_proposals_updated_at BEFORE UPDATE ON hotel_proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_proposals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON orders FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON hotel_proposals FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON hotel_proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON hotel_proposals FOR UPDATE USING (true);