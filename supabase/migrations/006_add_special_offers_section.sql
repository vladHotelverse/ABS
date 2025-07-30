-- Add special offers section to section_configs
-- This section will display upgrade packages as special offers

INSERT INTO section_configs (section_code, language, title, description, info_text, icon, sort_order) VALUES
('specialOffers', 'en', 'Special Offers', 'Exclusive upgrade packages',
 'Transform your stay with our exclusive upgrade packages. Each offer includes premium amenities and special benefits that elevate your experience beyond the standard room features.',
 'Star', 5),
('specialOffers', 'es', 'Ofertas Especiales', 'Paquetes de upgrade exclusivos',
 'Transforma tu estancia con nuestros paquetes de upgrade exclusivos. Cada oferta incluye servicios premium y beneficios especiales que elevan tu experiencia más allá de las características estándar de la habitación.',
 'Star', 5);

-- Create some example special offer customization options
-- These will be displayed as upgrade packages in the special offers section

INSERT INTO customization_options (category, option_code, name, description, price, icon, label) VALUES

-- Deluxe Experience Package
('specialOffers', 'deluxe_experience',
 '{"en": "Deluxe Experience Package", "es": "Paquete Experiencia Deluxe"}'::jsonb,
 '{"en": "Elevate your stay with premium ocean views, spa access, and exclusive amenities", "es": "Eleva tu estancia con vistas premium al océano, acceso al spa y servicios exclusivos"}'::jsonb,
 45.00, 'star-bold', '{"en": "Deluxe Experience Package", "es": "Paquete Experiencia Deluxe"}'::jsonb),

-- Premium Business Package  
('specialOffers', 'premium_business',
 '{"en": "Premium Business Package", "es": "Paquete Premium Business"}'::jsonb,
 '{"en": "Perfect for business travelers with dedicated workspace, concierge service, and premium connectivity", "es": "Perfecto para viajeros de negocios con espacio de trabajo dedicado, servicio de conserjería y conectividad premium"}'::jsonb,
 55.00, 'briefcase-bold', '{"en": "Premium Business Package", "es": "Paquete Premium Business"}'::jsonb),

-- Romantic Getaway Package
('specialOffers', 'romantic_getaway',
 '{"en": "Romantic Getaway Package", "es": "Paquete Escapada Romántica"}'::jsonb,
 '{"en": "Create unforgettable moments with private terrace, champagne service, and couples amenities", "es": "Crea momentos inolvidables con terraza privada, servicio de champagne y servicios para parejas"}'::jsonb,
 75.00, 'heart-bold', '{"en": "Romantic Getaway Package", "es": "Paquete Escapada Romántica"}'::jsonb),

-- Wellness & Spa Package
('specialOffers', 'wellness_spa',
 '{"en": "Wellness & Spa Package", "es": "Paquete Wellness & Spa"}'::jsonb,
 '{"en": "Rejuvenate with exclusive spa treatments, wellness amenities, and health-focused room features", "es": "Rejuvenécete con tratamientos exclusivos de spa, servicios de bienestar y características de habitación enfocadas en la salud"}'::jsonb,
 65.00, 'leaf-bold', '{"en": "Wellness & Spa Package", "es": "Paquete Wellness & Spa"}'::jsonb);

-- Update sort order for existing sections to make room for special offers
UPDATE section_configs SET sort_order = 1 WHERE section_code = 'beds';
UPDATE section_configs SET sort_order = 2 WHERE section_code = 'features';  
UPDATE section_configs SET sort_order = 3 WHERE section_code = 'orientation';
UPDATE section_configs SET sort_order = 4 WHERE section_code = 'distribution';
UPDATE section_configs SET sort_order = 6 WHERE section_code = 'exactView';