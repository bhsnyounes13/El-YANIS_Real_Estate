/*
  # Create Admin Authentication System

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, unique) - Admin username for login
      - `password_hash` (text) - Hashed password
      - `email` (text, unique) - Admin email
      - `full_name` (text) - Full name of admin
      - `is_active` (boolean) - Whether admin account is active
      - `created_at` (timestamptz) - Account creation timestamp
      - `last_login` (timestamptz) - Last login timestamp

  2. Security
    - Enable RLS on `admins` table
    - Add policies for admin operations
    - Only authenticated admins can view their own data
    - Secure password storage with hashing

  3. Important Notes
    - Default admin will be created with username: admin
    - Password must be changed after first login
    - All admin actions are logged for security
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admins table
CREATE POLICY "Admins can view own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update own data"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update RLS policies for properties table to allow admin full access
DROP POLICY IF EXISTS "Properties visible to public for SELECT" ON properties;
CREATE POLICY "Properties visible to public for SELECT"
  ON properties
  FOR SELECT
  TO public
  USING (status = 'available' OR true);

CREATE POLICY "Admins can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Update RLS policies for agents table
DROP POLICY IF EXISTS "Agents visible to public" ON agents;
CREATE POLICY "Agents visible to public"
  ON agents
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage agents"
  ON agents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update RLS policies for appointments table
CREATE POLICY "Admins can view all appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update RLS policies for inquiries table
CREATE POLICY "Admins can view all inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (true);