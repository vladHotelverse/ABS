-- Add online check-in option to special offers
-- This migration adds a convenient online check-in service as a special offer

INSERT INTO special_offers (offer_code, title, description, image, base_price, price_type, requires_date_selection, allows_multiple_dates) VALUES
('online-checkin',
 '{"en": "Online Check-in", "es": "Check-in Online"}'::jsonb,
 '{"en": "Skip the front desk lines with our convenient online check-in service. Complete your registration from the comfort of your room or on-the-go.", "es": "Evita las colas de recepción con nuestro cómodo servicio de check-in online. Completa tu registro desde la comodidad de tu habitación o sobre la marcha."}'::jsonb,
 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
 15.00,
 'perStay',
 false,
 false
);