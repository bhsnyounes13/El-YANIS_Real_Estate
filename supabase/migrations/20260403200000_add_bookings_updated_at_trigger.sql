-- ==========================================
-- EL-YANIS v2.1.1 - Bookings updated_at Trigger
-- ==========================================

CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_bookings_updated_at ON bookings;

CREATE TRIGGER trg_update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();
