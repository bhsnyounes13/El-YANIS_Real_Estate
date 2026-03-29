/*
  # Fix Security Issues

  1. Remove Unused Indexes
    - Drop `idx_properties_city`
    - Drop `idx_properties_type`
    - Drop `idx_properties_agent_id`
    - Drop `idx_inquiries_property_id`
    - Drop `idx_appointments_property`
    - Drop `idx_appointments_agent`
    - Drop `idx_appointments_date_time`
    - Drop `idx_appointments_status`

  2. Consolidate Duplicate RLS Policies
    - Remove duplicate SELECT policies on agents table
    - Remove duplicate policies on properties table
    - Remove duplicate policies on appointments table
    - Remove duplicate policies on inquiries table
    - Keep only one clear policy per action per role

  3. Fix Function Security
    - Set immutable search_path on `update_appointments_updated_at` function

  ## Security Notes
  - This migration improves security by removing policy conflicts
  - Unused indexes are removed to reduce maintenance overhead
  - Function search_path is secured to prevent injection attacks
*/

-- 1. Remove unused indexes
DROP INDEX IF EXISTS idx_properties_city;
DROP INDEX IF EXISTS idx_properties_type;
DROP INDEX IF EXISTS idx_properties_agent_id;
DROP INDEX IF EXISTS idx_inquiries_property_id;
DROP INDEX IF EXISTS idx_appointments_property;
DROP INDEX IF EXISTS idx_appointments_agent;
DROP INDEX IF EXISTS idx_appointments_date_time;
DROP INDEX IF EXISTS idx_appointments_status;

-- 2. Consolidate duplicate policies on agents table
DROP POLICY IF EXISTS "Agents visible to public" ON agents;
DROP POLICY IF EXISTS "Authenticated users can delete agents" ON agents;
DROP POLICY IF EXISTS "Authenticated users can insert agents" ON agents;
DROP POLICY IF EXISTS "Authenticated users can update agents" ON agents;

-- Keep only "Admins can manage agents" and "Anyone can view agents"

-- 3. Consolidate duplicate policies on properties table
DROP POLICY IF EXISTS "Admins can insert properties" ON properties;
DROP POLICY IF EXISTS "Admins can update properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;

-- Rename remaining policy for clarity
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON properties;
DROP POLICY IF EXISTS "Authenticated users can update properties" ON properties;
DROP POLICY IF EXISTS "Properties visible to public for SELECT" ON properties;

-- Create clear, consolidated policies
CREATE POLICY "Public can view all properties"
  ON properties FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can modify properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Consolidate duplicate policies on appointments table
DROP POLICY IF EXISTS "Admins can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can update appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;

-- Rename remaining policy for clarity
DROP POLICY IF EXISTS "Anyone can view appointments" ON appointments;

CREATE POLICY "Anyone can view all appointments"
  ON appointments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Consolidate duplicate policies on inquiries table
DROP POLICY IF EXISTS "Admins can view all inquiries" ON inquiries;

-- Keep "Authenticated users can view inquiries" only

-- 6. Fix function search path
DROP FUNCTION IF EXISTS update_appointments_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_appointments_updated_at()
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

-- Recreate trigger
DROP TRIGGER IF EXISTS update_appointments_updated_at_trigger ON appointments;

CREATE TRIGGER update_appointments_updated_at_trigger
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();
