-- Update special offers to use room-based data matching ABS_RoomSelectionCarousel
-- This migration replaces the old custom special offers with room-based ones

-- First, delete old special offers
DELETE FROM customization_options WHERE section_code = 'specialOffers';

-- Insert new room-based special offers
INSERT INTO customization_options (section_code, option_code, name, description, price, icon, claim) VALUES

-- Deluxe Gold Offer (based on 'deluxe' room from carousel)
('specialOffers', 'deluxe_gold_offer',
 '{"en": "Live luxury''s pinnacle by the sea", "es": "Vive el pináculo del lujo junto al mar"}'::jsonb,
 '{"en": "DELUXE GOLD room with premium amenities and sea views", "es": "Habitación DELUXE GOLD con servicios premium y vistas al mar"}'::jsonb,
 22.00, 'star-bold', '{"en": "Deluxe Gold Experience", "es": "Experiencia Deluxe Gold"}'::jsonb),

-- Swim-Up Offer (based on 'deluxe-swim-up' room from carousel)
('specialOffers', 'swim_up_offer',
 '{"en": "Dive in from your private terrace", "es": "Sumérgete desde tu terraza privada"}'::jsonb,
 '{"en": "DELUXE SWIM-UP room with direct pool access from private terrace", "es": "Habitación DELUXE SWIM-UP con acceso directo a la piscina desde terraza privada"}'::jsonb,
 31.00, 'star-bold', '{"en": "Swim-Up Paradise", "es": "Paraíso Swim-Up"}'::jsonb),

-- Rock Suite Offer (based on 'rocksuite' room from carousel)
('specialOffers', 'rock_suite_offer',
 '{"en": "Supreme luxury with divine views", "es": "Lujo supremo con vistas divinas"}'::jsonb,
 '{"en": "ROCK SUITE with spacious layout and premium amenities", "es": "ROCK SUITE con diseño espacioso y servicios premium"}'::jsonb,
 89.00, 'star-bold', '{"en": "Rock Suite Premium", "es": "Rock Suite Premium"}'::jsonb),

-- 80s Suite Offer (based on '80s-suite' room from carousel)
('specialOffers', 'eighties_suite_offer',
 '{"en": "80s nostalgia unleashed", "es": "Nostalgia de los 80 desatada"}'::jsonb,
 '{"en": "80S SUITE with vintage decor and unique 80s experience", "es": "80S SUITE con decoración vintage y experiencia única de los 80"}'::jsonb,
 120.00, 'star-bold', '{"en": "80s Nostalgia Experience", "es": "Experiencia Nostalgia 80s"}'::jsonb);

-- Update compatibility rules to include new special offer IDs
-- Delete old incompatibility rules for special offers
DELETE FROM compatibility_rules WHERE 
  option1_code IN ('deluxe_experience', 'premium_business', 'romantic_getaway', 'wellness_spa') OR
  option2_code IN ('deluxe_experience', 'premium_business', 'romantic_getaway', 'wellness_spa');

-- Insert new incompatibility rules for special offers (only one can be selected)
INSERT INTO compatibility_rules (option1_code, option2_code, rule_type, reason) VALUES
('deluxe_gold_offer', 'swim_up_offer', 'incompatible', 'Only one special offer can be selected'),
('deluxe_gold_offer', 'rock_suite_offer', 'incompatible', 'Only one special offer can be selected'),
('deluxe_gold_offer', 'eighties_suite_offer', 'incompatible', 'Only one special offer can be selected'),
('swim_up_offer', 'rock_suite_offer', 'incompatible', 'Only one special offer can be selected'),
('swim_up_offer', 'eighties_suite_offer', 'incompatible', 'Only one special offer can be selected'),
('rock_suite_offer', 'eighties_suite_offer', 'incompatible', 'Only one special offer can be selected');

-- Add logical conflicts based on room characteristics
INSERT INTO compatibility_rules (option1_code, option2_code, rule_type, reason) VALUES
('swim_up_offer', 'upper-floor', 'incompatible', 'Swim-up rooms are typically ground level'),
('rock_suite_offer', 'ground-floor', 'incompatible', 'Rock suites are premium upper-floor accommodations'),
('eighties_suite_offer', 'ground-floor', 'incompatible', '80s suites are premium upper-floor accommodations'),
('rock_suite_offer', 'twin', 'incompatible', 'Rock suites feature king beds'),
('eighties_suite_offer', 'twin', 'incompatible', '80s suites feature king beds');