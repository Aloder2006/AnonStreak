import { createClient } from "@supabase/supabase-js";

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client for general operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations (deletions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Type for the messages table
export interface Message {
    id: string;
    cloudinary_public_id: string;
    image_url: string;
    created_at: string;
}
