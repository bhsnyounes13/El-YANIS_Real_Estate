/*
  # Fix Storage Upload Policies

  1. Changes
    - Drop all existing storage policies for property-images
    - Recreate policies with proper permissions
    - Allow authenticated admins to upload, update, and delete images
    - Allow public read access to all images

  2. Security
    - Public can view all images (bucket is public)
    - Authenticated users can upload images
    - Authenticated users can update their uploaded images
    - Authenticated users can delete images
*/

-- Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update property images" ON storage.objects;

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public can view property images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'property-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update property images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images')
  WITH CHECK (bucket_id = 'property-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');
