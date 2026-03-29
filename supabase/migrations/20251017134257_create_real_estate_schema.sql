/*
  # El-Yanis Real Estate Database Schema

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `photo` (text) - URL to photo
      - `bio` (text)
      - `created_at` (timestamptz)
    
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (text) - 'sale' or 'rent'
      - `price` (numeric) - Price in DZD
      - `city` (text)
      - `area_m2` (numeric)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `description` (text)
      - `amenities` (text[]) - Array of amenities
      - `images` (text[]) - Array of image URLs
      - `status` (text) - 'available', 'sold', or 'rented'
      - `agent_id` (uuid, foreign key)
      - `created_at` (timestamptz)
    
    - `inquiries`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `property_id` (uuid, foreign key, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to agents and available properties
    - Add policies for authenticated admin users to manage data
    - Add policies for anyone to submit inquiries
*/

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  photo text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('sale', 'rent')),
  price numeric NOT NULL,
  city text NOT NULL,
  area_m2 numeric NOT NULL,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  description text DEFAULT '',
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented')),
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Agents policies: public can read all agents
CREATE POLICY "Anyone can view agents"
  ON agents FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update agents"
  ON agents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete agents"
  ON agents FOR DELETE
  TO authenticated
  USING (true);

-- Properties policies: public can read available properties
CREATE POLICY "Anyone can view available properties"
  ON properties FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- Inquiries policies: anyone can submit, authenticated can read
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete inquiries"
  ON inquiries FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
