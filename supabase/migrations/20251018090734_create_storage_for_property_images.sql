/*
  # Create Storage for Property Images

  1. Storage Setup
    - Create a public bucket called 'property-images' for storing property photos
    - Enable public access for viewing images
    - Set up storage policies for authenticated users to upload images

  2. Security
    - Allow public read access to all images
    - Allow authenticated users to upload images
    - Allow authenticated users to delete images
*/

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete property images" ON storage.objects;

-- Allow public access to view images
CREATE POLICY "Public can view property images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');