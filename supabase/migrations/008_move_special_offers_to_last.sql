-- Move Special Offers section to be the last section
-- This updates the sort order so Special Offers appears after Exact View

-- Update exact view to be second to last
UPDATE section_configs SET sort_order = 5 WHERE section_code = 'exactView';

-- Move special offers to be last
UPDATE section_configs SET sort_order = 6 WHERE section_code = 'specialOffers';