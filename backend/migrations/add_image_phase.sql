-- Migration: Add phase column to vizzy_images table
-- Run this in phpMyAdmin or MySQL console
-- Date: 2025-11-20

-- Add phase column (SD, DD, Final, Approved, or NULL for unassigned)
ALTER TABLE vizzy_images
ADD COLUMN phase VARCHAR(20) DEFAULT NULL AFTER mime_type,
ADD INDEX idx_phase (phase);

-- Update: Set existing images to NULL (unassigned) - already default
-- No data update needed since DEFAULT NULL handles it

-- Verify the change
DESCRIBE vizzy_images;
