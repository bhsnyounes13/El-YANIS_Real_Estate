-- ==========================================
-- EL-YANIS v2.2 - Auth hardening + query performance
-- ==========================================

-- 1) Harden legacy admins table (remove public login surface)
ALTER TABLE IF EXISTS public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow login verification" ON public.admins;
DROP POLICY IF EXISTS "Admins can view own data" ON public.admins;
DROP POLICY IF EXISTS "Admins can update own data" ON public.admins;

REVOKE ALL ON TABLE public.admins FROM anon;
REVOKE ALL ON TABLE public.admins FROM authenticated;

COMMENT ON TABLE public.admins IS
  'Legacy table retained temporarily for migration safety. Authentication is handled by auth.users + profiles.';

ALTER TABLE IF EXISTS public.admins
  DROP COLUMN IF EXISTS password_hash;

-- 2) Restrict direct booking reads (contains guest PII)
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view bookings" ON public.bookings;

CREATE POLICY "Public can create bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 3) Expose availability-safe booking calendar data for public clients
CREATE OR REPLACE VIEW public.booking_calendar_blocks AS
SELECT
  b.property_id,
  b.check_in_date,
  b.check_out_date
FROM public.bookings b
WHERE b.booking_status <> 'cancelled';

GRANT SELECT ON public.booking_calendar_blocks TO anon, authenticated;

-- 4) Tighten availability management to admins
ALTER TABLE IF EXISTS public.availability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can manage availability" ON public.availability;
DROP POLICY IF EXISTS "Admins can manage availability" ON public.availability;

CREATE POLICY "Admins can manage availability"
  ON public.availability
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Keep public read access for calendar UX
DROP POLICY IF EXISTS "Anyone can view availability" ON public.availability;
CREATE POLICY "Anyone can view availability"
  ON public.availability
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5) Indexes for pagination/filter performance
CREATE INDEX IF NOT EXISTS idx_properties_created_at_desc
  ON public.properties (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_properties_filter_compound
  ON public.properties (status, type, city, price, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_property_date_range
  ON public.bookings (property_id, check_in_date, check_out_date, booking_status);

CREATE INDEX IF NOT EXISTS idx_availability_property_date_available
  ON public.availability (property_id, date, is_available);

