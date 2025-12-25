-- Complete fix: Drop the old table and create the correct one for AnonSnap
-- This will remove any existing messages table and create the correct structure

-- Drop the existing table (WARNING: This will delete all existing data!)
DROP TABLE IF EXISTS messages CASCADE;

-- Create the correct messages table for AnonSnap
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cloudinary_public_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create an index on created_at for faster sorting
CREATE INDEX messages_created_at_idx ON messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since this is for personal use)
CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL
  USING (true)
  WITH CHECK (true);
