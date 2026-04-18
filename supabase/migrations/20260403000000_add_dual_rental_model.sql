-- ==========================================
-- EL-YANIS v2.1 - Dual Rental Model
-- ==========================================

-- 1. CREATE ENUM TYPES
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rental_category') THEN
    CREATE TYPE rental_category AS ENUM ('long_term', 'short_term');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'price_period') THEN
    CREATE TYPE price_period AS ENUM ('night', 'month');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
  END IF;
END$$;

-- 2. UPDATE PROPERTIES TABLE
ALTER TABLE properties 
  ADD COLUMN IF NOT EXISTS rental_category rental_category DEFAULT 'long_term',
  ADD COLUMN IF NOT EXISTS price_period price_period DEFAULT 'month',
  ADD COLUMN IF NOT EXISTS minimum_nights integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS maximum_nights integer DEFAULT 365,
  ADD COLUMN IF NOT EXISTS cleaning_fee numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS security_deposit numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_guests integer DEFAULT 4,
  ADD COLUMN IF NOT EXISTS instant_book boolean DEFAULT false;

UPDATE properties 
SET rental_category = 'long_term', 
    price_period = 'month' 
WHERE rental_category IS NULL;

-- 3. CREATE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  number_of_nights integer NOT NULL,
  nightly_rate numeric NOT NULL,
  base_price numeric NOT NULL,
  cleaning_fee numeric DEFAULT 0,
  service_fee numeric DEFAULT 0,
  total_price numeric NOT NULL,
  booking_status booking_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT positive_prices CHECK (total_price > 0)
);

CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in_date);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);

-- 4. CREATE AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date date NOT NULL,
  is_available boolean DEFAULT true,
  price_override numeric,
  minimum_nights_override integer,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(property_id, date)
);

CREATE INDEX IF NOT EXISTS idx_availability_property_date ON availability(property_id, date);

-- 5. RLS POLICIES
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bookings" ON bookings FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Authenticated can update bookings" ON bookings FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Anyone can view availability" ON availability FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated can manage availability" ON availability FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. PREVENT DOUBLE-BOOKING TRIGGER
CREATE OR REPLACE FUNCTION prevent_overlapping_bookings()
RETURNS TRIGGER AS $$
DECLARE
  overlap_count integer;
BEGIN
  SELECT COUNT(*) INTO overlap_count
  FROM bookings
  WHERE property_id = NEW.property_id
    AND booking_status != 'cancelled'
    AND check_in_date < NEW.check_out_date
    AND check_out_date > NEW.check_in_date;
  
  IF overlap_count > 0 THEN
    RAISE EXCEPTION 'Property is not available for the selected dates. Overlapping booking detected.';
  END IF;
  
  SELECT COUNT(*) INTO overlap_count
  FROM availability
  WHERE property_id = NEW.property_id
    AND is_available = false
    AND date >= NEW.check_in_date
    AND date < NEW.check_out_date;
  
  IF overlap_count > 0 THEN
    RAISE EXCEPTION 'Property is not available. Some dates are blocked.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_overlapping_bookings ON bookings;
CREATE TRIGGER trg_prevent_overlapping_bookings
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION prevent_overlapping_bookings();

-- 7. CALCULATE BOOKING TOTAL FUNCTION
CREATE OR REPLACE FUNCTION calculate_booking_total(
  p_nightly_rate numeric,
  p_nights integer,
  p_cleaning_fee numeric DEFAULT 0,
  p_service_fee_percentage numeric DEFAULT 12
) RETURNS numeric AS $$
DECLARE
  base_price numeric;
  service_fee numeric;
  total numeric;
BEGIN
  base_price := p_nightly_rate * p_nights;
  service_fee := base_price * (p_service_fee_percentage / 100);
  total := base_price + p_cleaning_fee + service_fee;
  RETURN total;
END;
$$ LANGUAGE plpgsql;
