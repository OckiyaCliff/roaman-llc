-- Sample Data for Roaman Development
-- Hotels in Lagos, Nigeria area

-- Insert sample hotels
INSERT INTO hotels (name, slug, description, address, city, state, country, latitude, longitude, phone, email, star_rating, amenities, thumbnail, is_active) VALUES
('The Azure Lagos', 'azure-lagos', 'Modern boutique hotel in the heart of Victoria Island with stunning ocean views and contemporary amenities.', '12 Adeola Odeku Street, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 6.4281, 3.4219, '+234 812 345 6789', 'info@azurelagos.com', 4, ARRAY['wifi', 'pool', 'gym', 'restaurant', 'parking', 'air-conditioning', 'room-service'], '/placeholder.svg?height=400&width=600', true),
('Ikoyi Suites', 'ikoyi-suites', 'Elegant serviced apartments offering home-like comfort with hotel-class services in upscale Ikoyi.', '45 Bourdillon Road, Ikoyi', 'Lagos', 'Lagos', 'Nigeria', 6.4488, 3.4335, '+234 802 987 6543', 'reservations@ikoyisuites.com', 4, ARRAY['wifi', 'kitchen', 'gym', 'laundry', 'parking', 'air-conditioning', 'concierge'], '/placeholder.svg?height=400&width=600', true),
('Lagos Airport Inn', 'lagos-airport-inn', 'Convenient and comfortable accommodation just minutes from Murtala Muhammed International Airport.', '23 Airport Road, Ikeja', 'Lagos', 'Lagos', 'Nigeria', 6.5774, 3.3214, '+234 809 111 2222', 'stay@lagosairportinn.com', 3, ARRAY['wifi', 'shuttle', 'restaurant', 'parking', 'air-conditioning', '24-hour-desk'], '/placeholder.svg?height=400&width=600', true),
('Lekki Gardens Lodge', 'lekki-gardens', 'Peaceful retreat in Lekki Phase 1 with lush gardens and family-friendly facilities.', '8 Admiralty Way, Lekki Phase 1', 'Lagos', 'Lagos', 'Nigeria', 6.4404, 3.4577, '+234 816 333 4444', 'hello@lekkigardens.com', 3, ARRAY['wifi', 'pool', 'garden', 'playground', 'parking', 'air-conditioning', 'restaurant'], '/placeholder.svg?height=400&width=600', true),
('Marina Executive Hotel', 'marina-executive', 'Business-focused hotel on Lagos Island with meeting facilities and executive services.', '56 Marina Road, Lagos Island', 'Lagos', 'Lagos', 'Nigeria', 6.4479, 3.3958, '+234 803 555 6666', 'business@marinaexecutive.com', 4, ARRAY['wifi', 'business-center', 'restaurant', 'bar', 'parking', 'air-conditioning', 'meeting-rooms'], '/placeholder.svg?height=400&width=600', true),
('Festac Budget Stay', 'festac-budget', 'Affordable and clean accommodation in Festac Town, perfect for budget-conscious travelers.', '22 2nd Avenue, Festac Town', 'Lagos', 'Lagos', 'Nigeria', 6.4659, 3.2832, '+234 817 777 8888', 'book@festacbudget.com', 2, ARRAY['wifi', 'parking', 'air-conditioning', 'security'], '/placeholder.svg?height=400&width=600', true);

-- Insert room types for each hotel
-- The Azure Lagos
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities, images) VALUES
((SELECT id FROM hotels WHERE slug = 'azure-lagos'), 'Standard Room', 'Comfortable room with city views, queen bed, and modern amenities.', 25000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning', 'minibar', 'safe'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'azure-lagos'), 'Deluxe Ocean View', 'Spacious room with panoramic ocean views, king bed, and premium amenities.', 45000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning', 'minibar', 'safe', 'balcony', 'ocean-view'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'azure-lagos'), 'Executive Suite', 'Luxurious suite with separate living area, ocean views, and exclusive services.', 85000.00, 4, ARRAY['wifi', 'tv', 'air-conditioning', 'minibar', 'safe', 'balcony', 'ocean-view', 'living-room', 'jacuzzi'], ARRAY['/placeholder.svg?height=400&width=600']);

-- Ikoyi Suites
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities, images) VALUES
((SELECT id FROM hotels WHERE slug = 'ikoyi-suites'), 'Studio Apartment', 'Cozy studio with kitchenette, perfect for short stays.', 30000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning', 'kitchen', 'washer'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'ikoyi-suites'), 'One Bedroom Apartment', 'Spacious one-bedroom with full kitchen and living area.', 50000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning', 'kitchen', 'washer', 'living-room', 'balcony'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'ikoyi-suites'), 'Two Bedroom Penthouse', 'Premium penthouse with two bedrooms, terrace, and city views.', 95000.00, 4, ARRAY['wifi', 'tv', 'air-conditioning', 'kitchen', 'washer', 'living-room', 'terrace', 'city-view'], ARRAY['/placeholder.svg?height=400&width=600']);

-- Lagos Airport Inn
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities, images) VALUES
((SELECT id FROM hotels WHERE slug = 'lagos-airport-inn'), 'Transit Room', 'Basic room for quick layovers, hourly rates available.', 8000.00, 1, ARRAY['wifi', 'tv', 'air-conditioning'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'lagos-airport-inn'), 'Standard Double', 'Comfortable room with double bed and airport shuttle access.', 18000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning', 'minibar', 'shuttle'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'lagos-airport-inn'), 'Family Room', 'Spacious room with two double beds, ideal for families.', 28000.00, 4, ARRAY['wifi', 'tv', 'air-conditioning', 'minibar', 'shuttle'], ARRAY['/placeholder.svg?height=400&width=600']);

-- Lekki Gardens Lodge
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities, images) VALUES
((SELECT id FROM hotels WHERE slug = 'lekki-gardens'), 'Garden View Room', 'Peaceful room overlooking our tropical gardens.', 20000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning', 'garden-view'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'lekki-gardens'), 'Pool Access Room', 'Ground floor room with direct pool access.', 32000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning', 'pool-access', 'patio'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'lekki-gardens'), 'Family Chalet', 'Standalone chalet with two bedrooms and private garden.', 55000.00, 6, ARRAY['wifi', 'tv', 'air-conditioning', 'kitchen', 'private-garden', 'bbq'], ARRAY['/placeholder.svg?height=400&width=600']);

-- Marina Executive Hotel
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities, images) VALUES
((SELECT id FROM hotels WHERE slug = 'marina-executive'), 'Business Single', 'Efficient room designed for business travelers.', 22000.00, 1, ARRAY['wifi', 'tv', 'air-conditioning', 'work-desk', 'safe'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'marina-executive'), 'Business Double', 'Spacious room with work area and city views.', 35000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning', 'work-desk', 'safe', 'city-view', 'minibar'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'marina-executive'), 'Boardroom Suite', 'Executive suite with private meeting room.', 75000.00, 4, ARRAY['wifi', 'tv', 'air-conditioning', 'work-desk', 'safe', 'city-view', 'minibar', 'meeting-room', 'living-room'], ARRAY['/placeholder.svg?height=400&width=600']);

-- Festac Budget Stay
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities, images) VALUES
((SELECT id FROM hotels WHERE slug = 'festac-budget'), 'Economy Single', 'Clean and simple single room at great value.', 6000.00, 1, ARRAY['wifi', 'fan', 'shared-bathroom'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'festac-budget'), 'Standard Room', 'Private room with air conditioning and en-suite bathroom.', 10000.00, 2, ARRAY['wifi', 'tv', 'air-conditioning'], ARRAY['/placeholder.svg?height=400&width=600']),
((SELECT id FROM hotels WHERE slug = 'festac-budget'), 'Family Room', 'Larger room with multiple beds for families.', 15000.00, 4, ARRAY['wifi', 'tv', 'air-conditioning'], ARRAY['/placeholder.svg?height=400&width=600']);

-- Insert rooms for each hotel/room type
DO $$
DECLARE
  rt RECORD;
  room_count INTEGER;
  i INTEGER;
BEGIN
  FOR rt IN SELECT id, hotel_id, name FROM room_types LOOP
    -- Determine room count based on room type
    CASE 
      WHEN rt.name LIKE '%Suite%' OR rt.name LIKE '%Penthouse%' OR rt.name LIKE '%Chalet%' THEN room_count := 2;
      WHEN rt.name LIKE '%Deluxe%' OR rt.name LIKE '%Executive%' THEN room_count := 4;
      ELSE room_count := 6;
    END CASE;
    
    FOR i IN 1..room_count LOOP
      INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status, is_active)
      VALUES (
        rt.hotel_id,
        rt.id,
        (FLOOR(RANDOM() * 4 + 1)::TEXT || LPAD(i::TEXT, 2, '0')),
        FLOOR(RANDOM() * 4 + 1)::INTEGER,
        CASE WHEN RANDOM() > 0.3 THEN 'available' ELSE 'occupied' END,
        true
      );
    END LOOP;
  END LOOP;
END $$;

-- Insert sample pricing rules
INSERT INTO pricing_rules (hotel_id, room_type_id, name, rule_type, price, min_hours, max_hours, is_active) 
SELECT 
  rt.hotel_id,
  rt.id,
  'Hourly Rate',
  'hourly',
  ROUND(rt.base_price * 0.15, -2),
  2,
  6,
  true
FROM room_types rt;

INSERT INTO pricing_rules (hotel_id, room_type_id, name, rule_type, price, is_active)
SELECT 
  rt.hotel_id,
  rt.id,
  'Nightly Rate',
  'nightly',
  rt.base_price,
  true
FROM room_types rt;
