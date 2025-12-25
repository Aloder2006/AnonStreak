-- Add is_public column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Update RLS policies to allow public read access for public images
DROP POLICY IF EXISTS "Public can view public images" ON messages;

CREATE POLICY "Public can view public images"
ON messages FOR SELECT
TO anon
USING (is_public = true);

-- Ensure index exists for performance
CREATE INDEX IF NOT EXISTS idx_messages_is_public ON messages(is_public);
