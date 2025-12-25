-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON visitors;
DROP POLICY IF EXISTS "Allow authenticated read" ON visitors;
DROP POLICY IF EXISTS "Allow all insert" ON visitors;

-- Add visitors table to track site visits
CREATE TABLE IF NOT EXISTS visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);

-- Enable Row Level Security
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for tracking visits)
CREATE POLICY "Allow all insert" ON visitors
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow anyone to read
CREATE POLICY "Allow authenticated read" ON visitors
    FOR SELECT
    TO authenticated
    USING (true);
