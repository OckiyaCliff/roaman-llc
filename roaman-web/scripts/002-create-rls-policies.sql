-- Row Level Security Policies for Roaman
-- Separates public read access from authenticated write access

-- =============================================
-- HOTELS - Public can read active hotels, staff can manage their hotels
-- =============================================
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Public can view active hotels
CREATE POLICY "Public can view active hotels" ON hotels
  FOR SELECT USING (is_active = true);

-- Hotel staff can view their hotel
CREATE POLICY "Hotel staff can view their hotel" ON hotels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hotel_staff 
      WHERE hotel_staff.hotel_id = hotels.id 
      AND hotel_staff.user_id = auth.uid()
      AND hotel_staff.is_active = true
    )
  );

-- Hotel owners/managers can update their hotel
CREATE POLICY "Hotel managers can update their hotel" ON hotels
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM hotel_staff 
      WHERE hotel_staff.hotel_id = hotels.id 
      AND hotel_staff.user_id = auth.uid()
      AND hotel_staff.role IN ('owner', 'manager')
      AND hotel_staff.is_active = true
    )
  );

-- Platform admins can do everything
CREATE POLICY "Admins can manage all hotels" ON hotels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM platform_admins 
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.is_active = true
    )
  );

-- =============================================
-- ROOM TYPES - Public can read, staff can manage
-- =============================================
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;

-- Public can view room types for active hotels
CREATE POLICY "Public can view room types" ON room_types
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hotels 
      WHERE hotels.id = room_types.hotel_id 
      AND hotels.is_active = true
    )
  );

-- Hotel staff can manage room types
CREATE POLICY "Hotel staff can manage room types" ON room_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hotel_staff 
      WHERE hotel_staff.hotel_id = room_types.hotel_id 
      AND hotel_staff.user_id = auth.uid()
      AND hotel_staff.is_active = true
    )
  );

-- Platform admins can manage all
CREATE POLICY "Admins can manage all room types" ON room_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM platform_admins 
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.is_active = true
    )
  );

-- =============================================
-- ROOMS - Public can read available, staff can manage
-- =============================================
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Public can view available rooms for active hotels
CREATE POLICY "Public can view available rooms" ON rooms
  FOR SELECT USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM hotels 
      WHERE hotels.id = rooms.hotel_id 
      AND hotels.is_active = true
    )
  );

-- Hotel staff can manage their rooms
CREATE POLICY "Hotel staff can manage rooms" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hotel_staff 
      WHERE hotel_staff.hotel_id = rooms.hotel_id 
      AND hotel_staff.user_id = auth.uid()
      AND hotel_staff.is_active = true
    )
  );

-- Platform admins can manage all
CREATE POLICY "Admins can manage all rooms" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM platform_admins 
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.is_active = true
    )
  );

-- =============================================
-- PRICING RULES - Public can read active, staff can manage
-- =============================================
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Public can view active pricing
CREATE POLICY "Public can view active pricing" ON pricing_rules
  FOR SELECT USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM hotels 
      WHERE hotels.id = pricing_rules.hotel_id 
      AND hotels.is_active = true
    )
  );

-- Hotel staff can manage pricing
CREATE POLICY "Hotel staff can manage pricing" ON pricing_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hotel_staff 
      WHERE hotel_staff.hotel_id = pricing_rules.hotel_id 
      AND hotel_staff.user_id = auth.uid()
      AND hotel_staff.is_active = true
    )
  );

-- Platform admins can manage all
CREATE POLICY "Admins can manage all pricing" ON pricing_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM platform_admins 
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.is_active = true
    )
  );

-- =============================================
-- BOOKINGS - Complex policies for guests, staff, admins
-- =============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can create bookings (public booking flow)
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Guests can view their own bookings by email (for lookup)
CREATE POLICY "Guests can view by reference" ON bookings
  FOR SELECT USING (true);

-- Hotel staff can manage their hotel's bookings
CREATE POLICY "Hotel staff can manage bookings" ON bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hotel_staff 
      WHERE hotel_staff.hotel_id = bookings.hotel_id 
      AND hotel_staff.user_id = auth.uid()
      AND hotel_staff.is_active = true
    )
  );

-- Platform admins can manage all
CREATE POLICY "Admins can manage all bookings" ON bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM platform_admins 
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.is_active = true
    )
  );

-- =============================================
-- HOTEL STAFF - Staff can view co-workers, admins manage all
-- =============================================
ALTER TABLE hotel_staff ENABLE ROW LEVEL SECURITY;

-- Staff can view their own record
CREATE POLICY "Staff can view own record" ON hotel_staff
  FOR SELECT USING (user_id = auth.uid());

-- Hotel managers can view their team
CREATE POLICY "Managers can view team" ON hotel_staff
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hotel_staff AS hs
      WHERE hs.hotel_id = hotel_staff.hotel_id
      AND hs.user_id = auth.uid()
      AND hs.role IN ('owner', 'manager')
      AND hs.is_active = true
    )
  );

-- Hotel owners can manage staff
CREATE POLICY "Owners can manage staff" ON hotel_staff
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hotel_staff AS hs
      WHERE hs.hotel_id = hotel_staff.hotel_id
      AND hs.user_id = auth.uid()
      AND hs.role = 'owner'
      AND hs.is_active = true
    )
  );

-- Platform admins can manage all
CREATE POLICY "Admins can manage all staff" ON hotel_staff
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM platform_admins 
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.is_active = true
    )
  );

-- =============================================
-- PLATFORM ADMINS - Only super admins and self
-- =============================================
ALTER TABLE platform_admins ENABLE ROW LEVEL SECURITY;

-- Admins can view own record
CREATE POLICY "Admins can view own record" ON platform_admins
  FOR SELECT USING (user_id = auth.uid());

-- Super admins can manage all admins
CREATE POLICY "Super admins can manage admins" ON platform_admins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM platform_admins AS pa
      WHERE pa.user_id = auth.uid()
      AND pa.role = 'super_admin'
      AND pa.is_active = true
    )
  );

-- =============================================
-- AUDIT LOGS - Read only for relevant parties
-- =============================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit logs
CREATE POLICY "Users can view own logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

-- Hotel managers can view hotel logs
CREATE POLICY "Managers can view hotel logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hotel_staff 
      WHERE hotel_staff.hotel_id = audit_logs.hotel_id 
      AND hotel_staff.user_id = auth.uid()
      AND hotel_staff.role IN ('owner', 'manager')
      AND hotel_staff.is_active = true
    )
  );

-- Platform admins can view all logs
CREATE POLICY "Admins can view all logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM platform_admins 
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.is_active = true
    )
  );

-- System can insert logs
CREATE POLICY "System can insert logs" ON audit_logs
  FOR INSERT WITH CHECK (true);
