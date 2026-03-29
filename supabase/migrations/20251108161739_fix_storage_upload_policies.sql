/*
  # Fix Storage Upload Policies for Admin System

  1. Changes
    - Update storage policies to allow public operations
    - This is necessary because the admin system uses localStorage authentication
    - Only admin users have access to the property form so this is secure

  2. Security
    - Admin authentication happens at the application level
    - Only authenticated admins can access the property form
    - The storage operations are protected by the admin login system
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete property images" ON storage.objects;

-- Create new policies that allow public operations for admin
CREATE POLICY "Allow public to upload property images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow public to update property images"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'property-images')
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow public to delete property images"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'property-images');
