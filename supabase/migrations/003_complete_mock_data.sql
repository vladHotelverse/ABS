-- Complete seed data with all original mock data
-- Clear existing data first
DELETE FROM compatibility_rules;
DELETE FROM customization_options;
DELETE FROM special_offers;
DELETE FROM room_types;

-- Insert all room types from mock data
INSERT INTO room_types (room_code, title, room_type, description, base_price, main_image, images, amenities) VALUES
('deluxe', 
 '{"en": "Live luxury''s pinnacle by the sea", "es": "Vive el pináculo del lujo junto al mar"}'::jsonb,
 'DELUXE GOLD',
 '{"en": "True rock stars look down from above. A space covering 33 square metres with spectacular sea views, a private furnished terrace and elegant décor for a superior experience from the fifth floor upwards. Exceed even your own expectations, and relax with chromotherapy lighting that you can personalise. Lie back like a rock star in a luxurious king-sized bed, or in two full-sized single beds, and enjoy this room''s ultra-modern facilities: thoughtfully selected state-of-the-art furniture, a 43 SMART TV screen, a dock station and a comfortable reading corner with a sofa bed.", "es": "Las verdaderas estrellas del rock miran desde arriba. Un espacio de 33 metros cuadrados con espectaculares vistas al mar, una terraza privada amueblada y una decoración elegante para una experiencia superior desde el quinto piso hacia arriba."}'::jsonb,
 22.00,
 'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/c37cc822-a6bf-4345-93f8-deb22d186d10/image.webp',
 '["https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/49a54c09-0945-4a87-893d-8d28d79e0f5b/image.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/9d29265c-3fc9-4c70-b953-7e3335f200aa/image.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/61c2250a-8967-446e-91b4-2bc50bf9be1a/image.webp"]'::jsonb,
 '["24 Hours Room Service", "30 to 35 m2 / 325 to 375 sqft", "AC", "Balcony", "Bathrobe and slippers", "Bluetooth sound system", "Desk", "Hairdryer", "In Main Building", "Iron & Board", "Landmark View", "Magnifying mirror", "Minibar", "Non-smoking Room", "Pet Friendly", "Phone", "Pillow Menu", "Premium Wi-Fi", "Rain shower", "Safe", "Shoe kit", "Smart TV", "Table and chairs set", "Tea Set"]'::jsonb
),
('deluxe-swim-up',
 '{"en": "Dive in from your private terrace", "es": "Sumérgete desde tu terraza privada"}'::jsonb,
 'DELUXE SWIM-UP',
 '{"en": "What about adding to your Double room a furnished outdoors terrace with a direct access to the meandering pool and private sun lounger waiting for you to enjoy the splash.", "es": "¿Qué tal añadir a tu habitación doble una terraza exterior amueblada con acceso directo a la piscina serpenteante y una tumbona privada esperándote para disfrutar del chapuzón."}'::jsonb,
 31.00,
 'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt634/cdf69769-f553-4c82-aa06-e3e8867954fb/image.webp',
 '["https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt634/cdf69769-f553-4c82-aa06-e3e8867954fb/image.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt634/c46d320b-89d6-4975-9af0-febbeaf4b450/image.webp"]'::jsonb,
 '["24 Hours Room Service", "30 to 35 m2 / 325 to 375 sqft", "AC", "Afternoon Sun", "Bathrobe and slippers", "Bluetooth sound system", "Close to Pool", "Desk", "Hairdryer", "Iron & Board", "Magnifying mirror", "Minibar", "Non-smoking Room", "Pet Friendly", "Phone", "Piazza View", "Pillow Menu", "Premium Wi-Fi", "Rain shower", "Safe", "Shared Pool", "Shoe kit", "Smart TV", "Table and chairs set", "Tea Set", "Terrace"]'::jsonb
),
('rocksuite',
 '{"en": "Supreme luxury with divine views", "es": "Lujo supremo con vistas divinas"}'::jsonb,
 'ROCK SUITE',
 '{"en": "Our contemporary Hard Rock Ibiza Suites perfectly capture the authenticity and irreverence of rock ''n'' roll with the sensuality and sophistication of Ibiza Island. Three connecting spaces - Living/ lounge, bedroom and bathroom - allowing you to decide when it''s time for plugging in or chilling out. Totally unpredictable, totally Ibiza Hard Rock.", "es": "Nuestras contemporáneas Hard Rock Ibiza Suites capturan perfectamente la autenticidad e irreverencia del rock ''n'' roll con la sensualidad y sofisticación de la Isla de Ibiza."}'::jsonb,
 89.00,
 'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt640/3e7e2260-63e3-4934-9358-ebf08bb6d96a/image.webp',
 '["https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt640/3e7e2260-63e3-4934-9358-ebf08bb6d96a/image.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt640/cb767423-cda2-4345-9008-dd1a42573ead/image.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt640/04386083-34f1-4175-8379-685ae5071a12/image.webp"]'::jsonb,
 '["24 Hours Room Service", "60 to 70 m2 / 645 to 755 sqft", "AC", "Balcony", "Bathrobe and slippers", "Bluetooth sound system", "Close to Pool", "Coffee Machine", "Desk", "Hairdryer", "Hydromassage Bathtub", "Iron & Board", "Landmark View", "Lateral Streets View", "Living Room", "Magnifying mirror", "Minibar", "Non-smoking Room", "Pet Friendly", "Phone", "Pillow Menu", "Pool View", "Premium Wi-Fi", "Rain shower", "Recyclables Coffee Capsules", "Safe", "Shoe kit", "Smart TV", "Sofa Bed - Double", "Table and chairs set", "Tea Set"]'::jsonb
),
('80s-suite',
 '{"en": "80s nostalgia unleashed", "es": "Nostalgia de los 80 desatada"}'::jsonb,
 '80S SUITE',
 '{"en": "60 square-meter space with an 80s setting, among which vinyl, mirror ball, music cassettes with 80s music and some 80''s gifts like a welcome kit that includes a t-shirt.", "es": "Espacio de 60 metros cuadrados con un ambiente de los 80, entre los que se encuentran vinilos, bola de espejos, casetes de música con música de los 80 y algunos regalos de los 80 como un kit de bienvenida que incluye una camiseta."}'::jsonb,
 120.00,
 'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt635/24fa2b9d-307c-4d23-9021-eb174520dbc0/image.webp',
 '["https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt641/850e6840-cc2b-48f8-9059-3a64d2b9b097/image.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt641/f356e89d-6dca-443e-9ac4-9bb975a84b07/image.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt641/e69fa285-5242-4992-831b-7e67d401ba00/image.webp"]'::jsonb,
 '["24 Hours Room Service", "60 to 70 m2 / 645 to 755 sqft", "AC", "Balcony", "Bathrobe and slippers", "Bluetooth sound system", "Close to Pool", "Coffee Machine", "Desk", "Hairdryer", "Hydromassage Bathtub", "Iron & Board", "King Size Bed", "Landmark View", "Living Room", "Magnifying mirror", "Minibar", "Morning Sun", "Non-smoking Room", "Pet Friendly", "Phone", "Pillow Menu", "Pool View", "Premium Wi-Fi", "Rain shower", "Safe", "Smart TV", "Sofa Bed - Double", "Shoe kit", "Table and chairs set", "Tea Set"]'::jsonb
),
('rock-suite-diamond',
 '{"en": "Glam rock with infinite views", "es": "Rock glamuroso con vistas infinitas"}'::jsonb,
 'ROCK SUITE DIAMOND',
 '{"en": "Reach the pinnacle of rock in this 75 square meter space authentically inspired by rock stars that offers that touch of glamorous life. With unbounded exuberance, it includes infinite views that extend from the suite to the terrace, and a bathtub with exposed fittings in the middle of the main bedroom so you don''t miss the slightest detail of the landscape while enjoying infinite pleasure.", "es": "Llega a la cima del rock en este espacio de 75 metros cuadrados auténticamente inspirado en estrellas del rock y que ofrece ese toque de vida glamourosa. Con una exuberancia sin límites, incluye unas vistas infinitas que se prolongan desde la suite hasta la terraza, y una bañera de grifería vista en mitad del dormitorio principal para que no te pierdas el mínimo detalle del paisaje mientras disfrutas de un placer infinito."}'::jsonb,
 199.00,
 'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt643/5a6459fb-7a86-4d9d-9d9d-acd9a80033d5/original.webp',
 '["https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt643/5a6459fb-7a86-4d9d-9d9d-acd9a80033d5/original.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt643/e58aeb29-1399-422a-906f-6efc480221c4/original.webp", "https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt643/40f0715d-3d66-49b7-b71b-cbd8e9d6ed1c/original.webp"]'::jsonb,
 '["24 Hours Room Service", "60 to 70 m2 / 645 to 755 sqft", "AC", "Balcony", "Bathrobe and slippers", "Bluetooth sound system", "Close to Pool", "Coffee Machine", "Desk", "Hairdryer", "Hydromassage Bathtub", "Iron & Board", "Landmark View", "Living Room", "Magnifying mirror", "Minibar", "Non-smoking Room", "Pet Friendly", "Phone", "Pillow Menu", "Premium Wi-Fi", "Rain shower", "Safe", "Smart TV", "Sofa Bed - Double", "Table and chairs set", "Tea Set", "Terrace"]'::jsonb
);

-- Insert all customization options
INSERT INTO customization_options (category, option_code, name, description, price, icon, label) VALUES
-- Beds
('beds', 'twin', 
 '{"en": "2 x Twin Beds", "es": "2 x Camas Gemelas"}'::jsonb,
 '{"en": "Two separate single beds", "es": "Dos camas individuales separadas"}'::jsonb,
 0, 'bed-twin', '{"en": "2 x Twin Beds", "es": "2 x Camas Gemelas"}'::jsonb),
('beds', 'king',
 '{"en": "King Size Bed", "es": "Cama King Size"}'::jsonb,
 '{"en": "One extra-large king-sized bed", "es": "Una cama king-size extra grande"}'::jsonb,
 5, 'bed-king', '{"en": "King Size Bed", "es": "Cama King Size"}'::jsonb),
('beds', 'sofa',
 '{"en": "Sofa Bed - Single", "es": "Sofá Cama - Individual"}'::jsonb,
 '{"en": "Single sofa bed for additional sleeping space", "es": "Sofá cama individual para espacio adicional para dormir"}'::jsonb,
 2, 'sofa', '{"en": "Sofa Bed - Single", "es": "Sofá Cama - Individual"}'::jsonb),

-- Features
('features', 'adapted-room',
 '{"en": "Adapted Room", "es": "Habitación Adaptada"}'::jsonb,
 '{"en": "Accessible room designed for guests with disabilities", "es": "Habitación accesible diseñada para huéspedes con discapacidades"}'::jsonb,
 0, 'accessibility', '{"en": "Adapted Room", "es": "Habitación Adaptada"}'::jsonb),

-- Orientation
('orientation', 'afternoon-sun',
 '{"en": "Afternoon Sun", "es": "Sol de Tarde"}'::jsonb,
 '{"en": "West-facing room with warm afternoon sunlight", "es": "Habitación orientada al oeste con cálida luz solar de la tarde"}'::jsonb,
 2, 'sun', '{"en": "Afternoon Sun", "es": "Sol de Tarde"}'::jsonb),
('orientation', 'all-day-sun',
 '{"en": "All-day Sun", "es": "Sol Todo el Día"}'::jsonb,
 '{"en": "South-facing room with sunlight throughout the day", "es": "Habitación orientada al sur con luz solar durante todo el día"}'::jsonb,
 6, 'sun', '{"en": "All-day Sun", "es": "Sol Todo el Día"}'::jsonb),

-- Location
('location', 'main-building',
 '{"en": "In Main Building", "es": "En Edificio Principal"}'::jsonb,
 '{"en": "Located in the main hotel building", "es": "Ubicada en el edificio principal del hotel"}'::jsonb,
 0, 'building', '{"en": "In Main Building", "es": "En Edificio Principal"}'::jsonb),
('location', 'main-restaurant',
 '{"en": "Close to Main Restaurant", "es": "Cerca del Restaurante Principal"}'::jsonb,
 '{"en": "Convenient access to the main restaurant", "es": "Acceso conveniente al restaurante principal"}'::jsonb,
 2, 'utensils', '{"en": "Close to Main Restaurant", "es": "Cerca del Restaurante Principal"}'::jsonb),
('location', 'miniclub',
 '{"en": "Close to Miniclub", "es": "Cerca del Miniclub"}'::jsonb,
 '{"en": "Perfect for families with children", "es": "Perfecto para familias con niños"}'::jsonb,
 2, 'baby', '{"en": "Close to Miniclub", "es": "Cerca del Miniclub"}'::jsonb),
('location', 'pool',
 '{"en": "Close to Pool", "es": "Cerca de la Piscina"}'::jsonb,
 '{"en": "Easy access to swimming facilities", "es": "Fácil acceso a las instalaciones de natación"}'::jsonb,
 4, 'waves', '{"en": "Close to Pool", "es": "Cerca de la Piscina"}'::jsonb),
('location', 'wellness',
 '{"en": "Close to Wellness", "es": "Cerca del Bienestar"}'::jsonb,
 '{"en": "Near spa and wellness facilities", "es": "Cerca de las instalaciones de spa y bienestar"}'::jsonb,
 2, 'heart', '{"en": "Close to Wellness", "es": "Cerca del Bienestar"}'::jsonb),
('location', 'beach-access',
 '{"en": "Direct Access to Beach", "es": "Acceso Directo a la Playa"}'::jsonb,
 '{"en": "Direct pathway to the beach", "es": "Camino directo a la playa"}'::jsonb,
 6, 'umbrella', '{"en": "Direct Access to Beach", "es": "Acceso Directo a la Playa"}'::jsonb),
('location', 'quiet-zone',
 '{"en": "Quiet Hotel Zone", "es": "Zona Tranquila del Hotel"}'::jsonb,
 '{"en": "Peaceful area for relaxation", "es": "Área tranquila para la relajación"}'::jsonb,
 4, 'volume-x', '{"en": "Quiet Hotel Zone", "es": "Zona Tranquila del Hotel"}'::jsonb),

-- Floor
('floor', 'ground-floor',
 '{"en": "Ground Floor Location", "es": "Ubicación en Planta Baja"}'::jsonb,
 '{"en": "Easy access without elevators", "es": "Fácil acceso sin ascensores"}'::jsonb,
 6, 'home', '{"en": "Ground Floor Location", "es": "Ubicación en Planta Baja"}'::jsonb),
('floor', 'upper-floor',
 '{"en": "Upper Floor", "es": "Piso Superior"}'::jsonb,
 '{"en": "Higher floors with better views", "es": "Pisos más altos con mejores vistas"}'::jsonb,
 6, 'arrow-up', '{"en": "Upper Floor", "es": "Piso Superior"}'::jsonb),

-- Distribution
('distribution', 'garden-access',
 '{"en": "Access to Garden", "es": "Acceso al Jardín"}'::jsonb,
 '{"en": "Direct access to hotel gardens", "es": "Acceso directo a los jardines del hotel"}'::jsonb,
 4, 'flower', '{"en": "Access to Garden", "es": "Acceso al Jardín"}'::jsonb),
('distribution', 'pool-access',
 '{"en": "Access to Pool", "es": "Acceso a la Piscina"}'::jsonb,
 '{"en": "Direct access to swimming pool", "es": "Acceso directo a la piscina"}'::jsonb,
 10, 'waves', '{"en": "Access to Pool", "es": "Acceso a la Piscina"}'::jsonb),
('distribution', 'balcony',
 '{"en": "Balcony", "es": "Balcón"}'::jsonb,
 '{"en": "Private balcony with outdoor seating", "es": "Balcón privado con asientos al aire libre"}'::jsonb,
 2, 'door-open', '{"en": "Balcony", "es": "Balcón"}'::jsonb),
('distribution', 'connecting-room',
 '{"en": "Connecting Room", "es": "Habitación Conectada"}'::jsonb,
 '{"en": "Adjacent rooms with connecting door", "es": "Habitaciones adyacentes con puerta de conexión"}'::jsonb,
 15, 'link', '{"en": "Connecting Room", "es": "Habitación Conectada"}'::jsonb),
('distribution', 'living-room',
 '{"en": "Living Room", "es": "Sala de Estar"}'::jsonb,
 '{"en": "Separate living area in the room", "es": "Área de estar separada en la habitación"}'::jsonb,
 10, 'sofa', '{"en": "Living Room", "es": "Sala de Estar"}'::jsonb),
('distribution', 'terrace',
 '{"en": "Terrace", "es": "Terraza"}'::jsonb,
 '{"en": "Large outdoor terrace area", "es": "Gran área de terraza al aire libre"}'::jsonb,
 6, 'sun', '{"en": "Terrace", "es": "Terraza"}'::jsonb),

-- Views
('view', 'city-view',
 '{"en": "City View", "es": "Vista a la Ciudad"}'::jsonb,
 '{"en": "Room with a view of the city", "es": "Habitación con vista a la ciudad"}'::jsonb,
 0, 'city-view', '{"en": "City View", "es": "Vista a la Ciudad"}'::jsonb),
('view', 'garden-view',
 '{"en": "Garden View", "es": "Vista al Jardín"}'::jsonb,
 '{"en": "Room with a view of the garden", "es": "Habitación con vista al jardín"}'::jsonb,
 2, 'corner-up-right', '{"en": "Garden View", "es": "Vista al Jardín"}'::jsonb),
('view', 'lateral-sea-view',
 '{"en": "Lateral Sea View", "es": "Vista Lateral al Mar"}'::jsonb,
 '{"en": "Room with a lateral view of the sea", "es": "Habitación con vista lateral al mar"}'::jsonb,
 6, 'waves', '{"en": "Lateral Sea View", "es": "Vista Lateral al Mar"}'::jsonb),
('view', 'pool-view',
 '{"en": "Pool View", "es": "Vista a la Piscina"}'::jsonb,
 '{"en": "Room with a view of the pool", "es": "Habitación con vista a la piscina"}'::jsonb,
 5, 'waves', '{"en": "Pool View", "es": "Vista a la Piscina"}'::jsonb),
('view', 'sea-frontal-view',
 '{"en": "Sea Frontal View", "es": "Vista Frontal al Mar"}'::jsonb,
 '{"en": "Room with a frontal view of the sea", "es": "Habitación con vista frontal al mar"}'::jsonb,
 10, 'waves', '{"en": "Sea Frontal View", "es": "Vista Frontal al Mar"}'::jsonb),
('view', 'stage-view',
 '{"en": "Stage View", "es": "Vista al Escenario"}'::jsonb,
 '{"en": "Room with a view of the stage", "es": "Habitación con vista al escenario"}'::jsonb,
 6, 'corner-up-right', '{"en": "Stage View", "es": "Vista al Escenario"}'::jsonb),

-- Exact Views
('exactView', 'city-view-exact',
 '{"en": "Exact view.", "es": "Vista exacta."}'::jsonb,
 '{"en": "Room with a view of the city", "es": "Habitación con vista a la ciudad"}'::jsonb,
 0, 'arrow-up', '{"en": "City View", "es": "Vista a la Ciudad"}'::jsonb),
('exactView', 'garden-view-exact',
 '{"en": "Exact view.", "es": "Vista exacta."}'::jsonb,
 '{"en": "Room with a view of the garden", "es": "Habitación con vista al jardín"}'::jsonb,
 2, 'corner-up-right', '{"en": "Garden View", "es": "Vista al Jardín"}'::jsonb),
('exactView', 'lateral-sea-view-exact',
 '{"en": "Exact view.", "es": "Vista exacta."}'::jsonb,
 '{"en": "Room with a lateral view of the sea", "es": "Habitación con vista lateral al mar"}'::jsonb,
 6, 'waves', '{"en": "Lateral Sea View", "es": "Vista Lateral al Mar"}'::jsonb),
('exactView', 'pool-view-exact',
 '{"en": "Exact view.", "es": "Vista exacta."}'::jsonb,
 '{"en": "Room with a view of the pool", "es": "Habitación con vista a la piscina"}'::jsonb,
 5, 'waves', '{"en": "Pool View", "es": "Vista a la Piscina"}'::jsonb),
('exactView', 'sea-frontal-view-exact',
 '{"en": "Exact view.", "es": "Vista exacta."}'::jsonb,
 '{"en": "Room with a frontal view of the sea", "es": "Habitación con vista frontal al mar"}'::jsonb,
 10, 'waves', '{"en": "Sea Frontal View", "es": "Vista Frontal al Mar"}'::jsonb),
('exactView', 'stage-view-exact',
 '{"en": "Exact view.", "es": "Vista exacta."}'::jsonb,
 '{"en": "Room with a view of the stage", "es": "Habitación con vista al escenario"}'::jsonb,
 6, 'corner-up-right', '{"en": "Stage View", "es": "Vista al Escenario"}'::jsonb);

-- Update exact view options with image URLs
UPDATE customization_options SET image_url = 'https://hvdatauatstgweu.blob.core.windows.net/roommediaimages/h83/r18127/outside/5630a049-2134-485a-846c-9b01d0728c31/image_c.webp' WHERE option_code = 'city-view-exact';
UPDATE customization_options SET image_url = 'https://hvdatauatstgweu.blob.core.windows.net/roommediaimages/h83/r18174/outside/2b47e562-59f0-41da-9617-16ea6c310639/image_c.webp' WHERE option_code = 'garden-view-exact';
UPDATE customization_options SET image_url = 'https://hvdatauatstgweu.blob.core.windows.net/roommediaimages/h83/r18231/outside/dd68f329-aab9-4b80-a4f7-4046e0ace158/image_c.webp' WHERE option_code = 'lateral-sea-view-exact';
UPDATE customization_options SET image_url = 'https://hvdatauatstgweu.blob.core.windows.net/roommediaimages/h83/r18260/outside/5f07a642-07b0-44aa-aa67-f6141c3aec04/image_c.webp' WHERE option_code = 'pool-view-exact';
UPDATE customization_options SET image_url = 'https://hvdatauatstgweu.blob.core.windows.net/roommediaimages/h83/r18321/outside/04424aec-0f76-4c0c-98a7-ef0e3d550483/image_c.webp' WHERE option_code = 'sea-frontal-view-exact';
UPDATE customization_options SET image_url = 'https://hvdatauatstgweu.blob.core.windows.net/roommediaimages/h83/r18364/outside/bd15466f-eef8-4464-bc45-d5dc5a6daeba/image_c.webp' WHERE option_code = 'stage-view-exact';

-- Insert all special offers
INSERT INTO special_offers (offer_code, title, description, image, base_price, price_type, requires_date_selection, allows_multiple_dates) VALUES
('all-inclusive',
 '{"en": "All inclusive package", "es": "Paquete todo incluido"}'::jsonb,
 '{"en": "Enjoy unlimited access to all amenities, meals and beverages.", "es": "Disfruta de acceso ilimitado a todas las comodidades, comidas y bebidas."}'::jsonb,
 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
 50.00,
 'perPerson',
 false,
 false
),
('spa-access',
 '{"en": "Spa Access", "es": "Acceso al Spa"}'::jsonb,
 '{"en": "Enjoy a day of relaxation at our luxury spa - select your preferred date.", "es": "Disfruta de un día de relajación en nuestro spa de lujo - selecciona tu fecha preferida."}'::jsonb,
 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
 50.00,
 'perPerson',
 true,
 true
),
('airport-transfer',
 '{"en": "Airport Transfer", "es": "Traslado al Aeropuerto"}'::jsonb,
 '{"en": "Convenient transportation to and from the airport (uses reservation person count).", "es": "Transporte conveniente desde y hacia el aeropuerto (usa el conteo de personas de la reserva)."}'::jsonb,
 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 35.00,
 'perPerson',
 false,
 false
),
('gourmet-dinner',
 '{"en": "Gourmet Dinner", "es": "Cena Gourmet"}'::jsonb,
 '{"en": "Exquisite dinner at our award-winning restaurant - choose your dining date.", "es": "Cena exquisita en nuestro restaurante galardonado - elige tu fecha de cena."}'::jsonb,
 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
 60.00,
 'perPerson',
 true,
 false
),
('private-beach-service',
 '{"en": "Private Beach Service", "es": "Servicio de Playa Privada"}'::jsonb,
 '{"en": "Exclusive beach service with premium amenities for the ultimate relaxation.", "es": "Servicio de playa exclusivo con comodidades premium para la relajación máxima."}'::jsonb,
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
 30.00,
 'perStay',
 false,
 false
),
('wine-tasting',
 '{"en": "Wine Tasting Experience", "es": "Experiencia de Cata de Vinos"}'::jsonb,
 '{"en": "Premium wine tasting session with our sommelier - experience the finest selections.", "es": "Sesión de cata de vinos premium con nuestro sommelier - experimenta las mejores selecciones."}'::jsonb,
 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 45.00,
 'perPerson',
 true,
 false
),
('fitness-classes',
 '{"en": "Fitness Classes", "es": "Clases de Fitness"}'::jsonb,
 '{"en": "Join our daily fitness classes including yoga, pilates, and aqua aerobics.", "es": "Únete a nuestras clases de fitness diarias incluyendo yoga, pilates y aeróbicos acuáticos."}'::jsonb,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 25.00,
 'perPerson',
 false,
 false
),
('late-checkout',
 '{"en": "Late Checkout", "es": "Salida Tardía"}'::jsonb,
 '{"en": "Extend your stay until 4 PM with our late checkout service.", "es": "Extiende tu estancia hasta las 4 PM con nuestro servicio de salida tardía."}'::jsonb,
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 20.00,
 'perStay',
 false,
 false
),
('room-upgrade',
 '{"en": "Complimentary Room Upgrade", "es": "Mejora de Habitación Gratuita"}'::jsonb,
 '{"en": "Subject to availability - upgrade to the next room category at no extra cost.", "es": "Sujeto a disponibilidad - mejora a la siguiente categoría de habitación sin costo adicional."}'::jsonb,
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
 0.00,
 'perStay',
 false,
 false
);

-- Add more section configs for all categories
INSERT INTO section_configs (section_code, language, title, description, info_text, icon) VALUES
('features', 'en', 'Features', 'Additional room features',
 'Additional features can enhance your stay experience. Select the amenities that matter most to you.',
 'Package'),
('features', 'es', 'Características', 'Características adicionales de la habitación',
 'Las características adicionales pueden mejorar tu experiencia de estancia. Selecciona las comodidades que más te importan.',
 'Package'),
('orientation', 'en', 'Orientation', 'Room sun orientation',
 'Room orientation affects natural light and views. Choose based on your preference for morning or evening light.',
 'Compass'),
('orientation', 'es', 'Orientación', 'Orientación solar de la habitación',
 'La orientación de la habitación afecta la luz natural y las vistas. Elige según tu preferencia por luz matutina o vespertina.',
 'Compass'),
('floor', 'en', 'Floor', 'Floor preference',
 'Select your preferred floor level. Higher floors typically offer better views and less noise from street level activities.',
 'ArrowUp'),
('floor', 'es', 'Piso', 'Preferencia de piso',
 'Selecciona tu nivel de piso preferido. Los pisos más altos típicamente ofrecen mejores vistas y menos ruido de las actividades a nivel de calle.',
 'ArrowUp'),
('distribution', 'en', 'Distribution', 'Room layout and access',
 'Choose the room layout that best fits your needs. Different distributions offer various amenities and space configurations.',
 'Home'),
('distribution', 'es', 'Distribución', 'Diseño y acceso de la habitación',
 'Elige la distribución de habitación que mejor se adapte a tus necesidades. Diferentes distribuciones ofrecen varias comodidades y configuraciones de espacio.',
 'Home'),
('exactView', 'en', 'Exact View', 'Preview your room view',
 'See exactly what view you will have from your room window. Preview the specific scenery from your selected room.',
 'Eye'),
('exactView', 'es', 'Vista Exacta', 'Previsualiza la vista de tu habitación',
 'Ve exactamente qué vista tendrás desde la ventana de tu habitación. Previsualiza el paisaje específico desde tu habitación seleccionada.',
 'Eye')
ON CONFLICT (section_code, language) DO NOTHING;

-- Add comprehensive compatibility rules
INSERT INTO compatibility_rules (option1_category, option1_code, option2_category, option2_code, rule_type) VALUES
-- Mutually exclusive groups
('view', 'city-view', 'view', 'garden-view', 'incompatible'),
('view', 'city-view', 'view', 'lateral-sea-view', 'incompatible'),
('view', 'city-view', 'view', 'pool-view', 'incompatible'),
('view', 'city-view', 'view', 'sea-frontal-view', 'incompatible'),
('view', 'city-view', 'view', 'stage-view', 'incompatible'),
('view', 'garden-view', 'view', 'lateral-sea-view', 'incompatible'),
('view', 'garden-view', 'view', 'pool-view', 'incompatible'),
('view', 'garden-view', 'view', 'sea-frontal-view', 'incompatible'),
('view', 'garden-view', 'view', 'stage-view', 'incompatible'),
('view', 'lateral-sea-view', 'view', 'pool-view', 'incompatible'),
('view', 'lateral-sea-view', 'view', 'sea-frontal-view', 'incompatible'),
('view', 'lateral-sea-view', 'view', 'stage-view', 'incompatible'),
('view', 'pool-view', 'view', 'sea-frontal-view', 'incompatible'),
('view', 'pool-view', 'view', 'stage-view', 'incompatible'),
('view', 'sea-frontal-view', 'view', 'stage-view', 'incompatible'),

-- Bed configurations
('beds', 'twin', 'beds', 'king', 'incompatible'),
('beds', 'twin', 'beds', 'sofa', 'incompatible'),
('beds', 'king', 'beds', 'sofa', 'incompatible'),

-- Floor preferences
('floor', 'ground-floor', 'floor', 'upper-floor', 'incompatible'),

-- Orientation preferences
('orientation', 'afternoon-sun', 'orientation', 'all-day-sun', 'incompatible'),

-- Logical conflicts
('location', 'beach-access', 'view', 'city-view', 'incompatible'),
('location', 'quiet-zone', 'location', 'pool', 'incompatible'),
('distribution', 'garden-access', 'distribution', 'pool-access', 'incompatible'),
('floor', 'ground-floor', 'view', 'sea-frontal-view', 'incompatible'),

-- Recommended combinations
('location', 'beach-access', 'view', 'sea-frontal-view', 'recommended'),
('location', 'pool', 'view', 'pool-view', 'recommended'),
('distribution', 'garden-access', 'view', 'garden-view', 'recommended')
ON CONFLICT DO NOTHING;