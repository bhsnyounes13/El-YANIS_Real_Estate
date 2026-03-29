/*
  # Fix Admin Login Policies

  1. Security Updates
    - Allow public read access to admins table for login verification
    - This is necessary for the login process to work
    - Password validation happens in the application layer

  2. Changes
    - Update SELECT policy to allow public access for login
    - Keep other operations restricted to authenticated users
*/

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admins can view own data" ON admins;

-- Create new policy that allows public read for login
CREATE POLICY "Allow login verification"
  ON admins
  FOR SELECT
  TO public
  USING (true);