/*
  # Make Property Fields Optional

  1. Changes
    - Make area_m2, bedrooms, and bathrooms nullable in properties table
    - These fields are now optional when creating/editing properties
  
  2. Notes
    - Price is already nullable
    - This allows more flexibility for different property types
*/

-- Make area_m2 nullable
ALTER TABLE properties 
ALTER COLUMN area_m2 DROP NOT NULL;

-- Make bedrooms nullable
ALTER TABLE properties 
ALTER COLUMN bedrooms DROP NOT NULL;

-- Make bathrooms nullable
ALTER TABLE properties 
ALTER COLUMN bathrooms DROP NOT NULL;
