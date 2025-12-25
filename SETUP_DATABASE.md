# Quick Setup Guide - Supabase Database

## Problem
You're getting this error:
```
Could not find the 'cloudinary_public_id' column of 'messages' in the schema cache
```

This means the `messages` table hasn't been created in your Supabase database yet.

## Solution - Create the Table

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste this SQL**
   ```sql
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
   CREATE POLICY "Allow all operations on messages" ON messages
     FOR ALL
     USING (true)
     WITH CHECK (true);
   ```

4. **Run the query**
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - You should see "Success. No rows returned"

5. **Verify the table was created**
   - Click on "Table Editor" in the left sidebar
   - You should see a `messages` table with columns:
     - `id` (uuid)
     - `cloudinary_public_id` (text)
     - `image_url` (text)
     - `created_at` (timestamptz)

### Option 2: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Navigate to your project
cd d:\codes\NglSnap

# Run the schema file
supabase db push --file supabase-schema.sql
```

## After Creating the Table

1. **Restart your Next.js dev server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

2. **Test the upload**
   - Go to `http://localhost:3000`
   - Try uploading an image
   - The error should be gone!

## Verify Your Environment Variables

While you're at it, make sure your `.env.local` has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

You can find these in your Supabase project:
- Go to Settings > API
- Copy the Project URL
- Copy the `anon` `public` key
- Copy the `service_role` `secret` key (⚠️ keep this secret!)

## Still Having Issues?

If you still get errors after creating the table:

1. **Check if the table exists**
   - Go to Supabase Dashboard > Table Editor
   - Look for `messages` table

2. **Check column names**
   - Make sure columns are exactly: `id`, `cloudinary_public_id`, `image_url`, `created_at`
   - Column names are case-sensitive!

3. **Check RLS policies**
   - Go to Authentication > Policies
   - Make sure the "Allow all operations on messages" policy exists

4. **Clear Supabase cache**
   - In Supabase Dashboard, go to Settings > API
   - Click "Reset API" (this will refresh the schema cache)
