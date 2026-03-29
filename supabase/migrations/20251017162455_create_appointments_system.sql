/*
  # Create Appointments System

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key) - Unique identifier for each appointment
      - `property_id` (uuid) - Reference to the property being viewed
      - `agent_id` (uuid) - Reference to the agent conducting the viewing
      - `client_name` (text) - Name of the client booking the appointment
      - `client_email` (text) - Email address for confirmation
      - `client_phone` (text) - Phone number for contact
      - `appointment_date` (date) - Date of the appointment
      - `appointment_time` (text) - Time slot for the appointment
      - `status` (text) - Status: pending, confirmed, cancelled, completed
      - `notes` (text, optional) - Additional notes from the client
      - `created_at` (timestamptz) - When the appointment was created
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `appointments` table
    - Allow anyone to insert appointments (public booking)
    - Allow anyone to read appointments for checking availability
    - Restrict updates and deletes to authenticated users only

  3. Indexes
    - Index on property_id for faster lookups
    - Index on agent_id for agent schedule queries
    - Index on appointment_date and appointment_time for availability checks
*/

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  CONSTRAINT no_duplicate_bookings UNIQUE (agent_id, appointment_date, appointment_time)
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert appointments (public booking without authentication)
CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read appointments (needed for availability checking)
CREATE POLICY "Anyone can view appointments"
  ON appointments FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can update appointments
CREATE POLICY "Authenticated users can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete appointments
CREATE POLICY "Authenticated users can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_property ON appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_agent ON appointments(agent_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();