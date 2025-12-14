-- Database Views and Functions for Roaman
-- Optimized views for public API and business logic functions

-- =============================================
-- PUBLIC HOTEL AVAILABILITY VIEW
-- Optimized for public browsing - only exposes necessary data
-- =============================================
CREATE OR REPLACE VIEW public_hotel_availability AS
SELECT 
  h.id,
  h.name,
  h.slug,
  h.description,
  h.address,
  h.city,
  h.state,
  h.country,
  h.latitude,
  h.longitude,
  h.star_rating,
  h.amenities,
  h.thumbnail,
  h.images,
  (
    SELECT COUNT(*) 
    FROM rooms r 
    WHERE r.hotel_id = h.id 
    AND r.status = 'available' 
    AND r.is_active = true
  ) AS available_rooms,
  (
    SELECT MIN(rt.base_price) 
    FROM room_types rt 
    WHERE rt.hotel_id = h.id
  ) AS min_price,
  (
    SELECT MAX(rt.base_price) 
    FROM room_types rt 
    WHERE rt.hotel_id = h.id
  ) AS max_price
FROM hotels h
WHERE h.is_active = true;

-- =============================================
-- HOTEL ROOM DETAILS VIEW
-- For hotel detail pages
-- =============================================
CREATE OR REPLACE VIEW hotel_room_details AS
SELECT 
  rt.id AS room_type_id,
  rt.hotel_id,
  rt.name AS room_type_name,
  rt.description,
  rt.base_price,
  rt.max_occupancy,
  rt.amenities,
  rt.images,
  (
    SELECT COUNT(*) 
    FROM rooms r 
    WHERE r.room_type_id = rt.id 
    AND r.status = 'available' 
    AND r.is_active = true
  ) AS available_count
FROM room_types rt
WHERE EXISTS (
  SELECT 1 FROM hotels h 
  WHERE h.id = rt.hotel_id 
  AND h.is_active = true
);

-- =============================================
-- FUNCTION: Generate Booking Reference
-- =============================================
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    ref := 'ROM-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT COUNT(*) INTO exists_count FROM bookings WHERE booking_reference = ref;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- FUNCTION: Calculate Distance (Haversine)
-- =============================================
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := RADIANS(lat2 - lat1);
  dlon := RADIANS(lon2 - lon1);
  a := SIN(dlat/2) * SIN(dlat/2) + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlon/2) * SIN(dlon/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- FUNCTION: Get Nearby Available Hotels
-- =============================================
CREATE OR REPLACE FUNCTION get_nearby_hotels(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km DECIMAL DEFAULT 10,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  star_rating INTEGER,
  amenities TEXT[],
  thumbnail TEXT,
  available_rooms BIGINT,
  min_price DECIMAL,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.name,
    h.slug,
    h.description,
    h.address,
    h.city,
    h.latitude,
    h.longitude,
    h.star_rating,
    h.amenities,
    h.thumbnail,
    h.available_rooms,
    h.min_price,
    calculate_distance(user_lat, user_lon, h.latitude, h.longitude) AS distance_km
  FROM public_hotel_availability h
  WHERE h.available_rooms > 0
    AND calculate_distance(user_lat, user_lon, h.latitude, h.longitude) <= radius_km
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- FUNCTION: Reserve Room (with conflict check)
-- =============================================
CREATE OR REPLACE FUNCTION reserve_room(
  p_room_id UUID,
  p_check_in TIMESTAMPTZ,
  p_check_out TIMESTAMPTZ,
  p_guest_name TEXT,
  p_guest_email TEXT,
  p_guest_phone TEXT,
  p_stay_type TEXT,
  p_total_amount DECIMAL,
  p_special_requests TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  booking_id UUID,
  booking_reference TEXT,
  error_message TEXT
) AS $$
DECLARE
  v_room RECORD;
  v_booking_ref TEXT;
  v_booking_id UUID;
  v_conflict_count INTEGER;
BEGIN
  -- Get room details with lock
  SELECT r.*, h.id AS hotel_id, rt.id AS room_type_id 
  INTO v_room
  FROM rooms r
  JOIN hotels h ON h.id = r.hotel_id
  JOIN room_types rt ON rt.id = r.room_type_id
  WHERE r.id = p_room_id
  FOR UPDATE;
  
  -- Check if room exists and is available
  IF v_room IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Room not found'::TEXT;
    RETURN;
  END IF;
  
  IF v_room.status != 'available' THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Room is not available'::TEXT;
    RETURN;
  END IF;
  
  -- Check for booking conflicts
  SELECT COUNT(*) INTO v_conflict_count
  FROM bookings b
  WHERE b.room_id = p_room_id
    AND b.booking_status NOT IN ('cancelled', 'checked_out', 'no_show')
    AND (
      (p_check_in >= b.check_in AND p_check_in < b.check_out)
      OR (p_check_out > b.check_in AND p_check_out <= b.check_out)
      OR (p_check_in <= b.check_in AND p_check_out >= b.check_out)
    );
  
  IF v_conflict_count > 0 THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Room has conflicting bookings'::TEXT;
    RETURN;
  END IF;
  
  -- Generate booking reference
  v_booking_ref := generate_booking_reference();
  v_booking_id := uuid_generate_v4();
  
  -- Create booking
  INSERT INTO bookings (
    id, booking_reference, hotel_id, room_id, room_type_id,
    guest_name, guest_email, guest_phone,
    check_in, check_out, stay_type, total_amount,
    special_requests, booking_status, payment_status
  ) VALUES (
    v_booking_id, v_booking_ref, v_room.hotel_id, p_room_id, v_room.room_type_id,
    p_guest_name, p_guest_email, p_guest_phone,
    p_check_in, p_check_out, p_stay_type, p_total_amount,
    p_special_requests, 'confirmed', 'pending'
  );
  
  -- Update room status to reserved
  UPDATE rooms SET status = 'reserved' WHERE id = p_room_id;
  
  RETURN QUERY SELECT true, v_booking_id, v_booking_ref, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- FUNCTION: Auto-release expired reservations
-- =============================================
CREATE OR REPLACE FUNCTION release_expired_reservations()
RETURNS INTEGER AS $$
DECLARE
  released_count INTEGER;
BEGIN
  WITH expired AS (
    UPDATE bookings
    SET booking_status = 'cancelled'
    WHERE booking_status = 'confirmed'
      AND payment_status = 'pending'
      AND created_at < NOW() - INTERVAL '15 minutes'
    RETURNING room_id
  )
  UPDATE rooms
  SET status = 'available'
  WHERE id IN (SELECT room_id FROM expired);
  
  GET DIAGNOSTICS released_count = ROW_COUNT;
  RETURN released_count;
END;
$$ LANGUAGE plpgsql;
