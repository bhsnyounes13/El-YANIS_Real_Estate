/*
  # Add Multilingual Support to Real Estate Schema

  1. Changes to Tables
    - `properties`
      - Add `title_ar` (text) - Arabic title
      - Add `title_fr` (text) - French title
      - Add `description_ar` (text) - Arabic description
      - Add `description_fr` (text) - French description
      - Rename `title` to `title_en` for consistency
      - Rename `description` to `description_en` for consistency

    - `agents`
      - Add `bio_ar` (text) - Arabic bio
      - Add `bio_fr` (text) - French bio
      - Rename `bio` to `bio_en` for consistency

  2. Important Notes
    - Default values set to empty strings for all new fields
    - Existing data in `title` and `description` columns will be preserved as English versions
    - No data loss - all operations are additive or safe renames
*/

-- Add multilingual fields to properties table
DO $$
BEGIN
  -- Add Arabic title if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'title_ar'
  ) THEN
    ALTER TABLE properties ADD COLUMN title_ar text DEFAULT '';
  END IF;

  -- Add French title if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'title_fr'
  ) THEN
    ALTER TABLE properties ADD COLUMN title_fr text DEFAULT '';
  END IF;

  -- Add Arabic description if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'description_ar'
  ) THEN
    ALTER TABLE properties ADD COLUMN description_ar text DEFAULT '';
  END IF;

  -- Add French description if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'description_fr'
  ) THEN
    ALTER TABLE properties ADD COLUMN description_fr text DEFAULT '';
  END IF;

  -- Rename title to title_en if it hasn't been renamed yet
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'title'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'title_en'
  ) THEN
    ALTER TABLE properties RENAME COLUMN title TO title_en;
  END IF;

  -- Rename description to description_en if it hasn't been renamed yet
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'description'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'description_en'
  ) THEN
    ALTER TABLE properties RENAME COLUMN description TO description_en;
  END IF;
END $$;

-- Add multilingual fields to agents table
DO $$
BEGIN
  -- Add Arabic bio if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'bio_ar'
  ) THEN
    ALTER TABLE agents ADD COLUMN bio_ar text DEFAULT '';
  END IF;

  -- Add French bio if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'bio_fr'
  ) THEN
    ALTER TABLE agents ADD COLUMN bio_fr text DEFAULT '';
  END IF;

  -- Rename bio to bio_en if it hasn't been renamed yet
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'bio'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'bio_en'
  ) THEN
    ALTER TABLE agents RENAME COLUMN bio TO bio_en;
  END IF;
END $$;
