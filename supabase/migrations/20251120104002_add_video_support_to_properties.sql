/*
  # Add Video Support to Properties

  1. Changes
    - Add videos column to properties table to store video URLs
    - Videos will be stored as an array of text URLs
  
  2. Notes
    - Videos can be stored in Supabase storage or external URLs
    - This allows properties to have both images and videos
*/

-- Add videos column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS videos text[] DEFAULT '{}';
