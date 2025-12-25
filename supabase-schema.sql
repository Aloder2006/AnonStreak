-- Create the messages table for storing image metadata
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cloudinary_public_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since this is for personal use)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL
  USING (true)
  WITH CHECK (true);
