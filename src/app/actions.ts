"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { generateSignature, deleteFromCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

/**
 * Generate Cloudinary upload signature and parameters
 * This is called before uploading to get signed upload credentials
 */
export async function getUploadSignature() {
    try {
        // Validate environment variables
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            throw new Error("Missing Cloudinary configuration");
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = "anonstreak";

        const paramsToSign = {
            timestamp,
            folder,
        };

        const signature = generateSignature(paramsToSign);

        return {
            success: true,
            signature,
            timestamp,
            folder,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        };
    } catch (error) {
        console.error("Error generating upload signature:", error);
        return {
            success: false,
            error: "Failed to generate upload signature",
        };
    }
}

/**
 * Save uploaded image metadata to Supabase
 */
export async function saveImageMetadata(
    cloudinaryPublicId: string,
    imageUrl: string
) {
    try {
        // Validate inputs
        if (!cloudinaryPublicId || !imageUrl) {
            return {
                success: false,
                error: "Missing required parameters",
            };
        }

        const { data, error } = await supabase
            .from("messages")
            .insert([
                {
                    cloudinary_public_id: cloudinaryPublicId,
                    image_url: imageUrl,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            return {
                success: false,
                error: "Failed to save image metadata",
            };
        }

        // Revalidate admin page to show new image
        revalidatePath("/admin/dashboard");

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Error saving image metadata:", error);
        return {
            success: false,
            error: "Failed to save image metadata",
        };
    }
}

/**
 * Get all uploaded images (admin only)
 */
export async function getImages() {
    try {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            return {
                success: false,
                error: "Failed to fetch images",
                data: [],
            };
        }

        return {
            success: true,
            data: data || [],
        };
    } catch (error) {
        console.error("Error fetching images:", error);
        return {
            success: false,
            error: "Failed to fetch images",
            data: [],
        };
    }
}

/**
 * Delete image from both Cloudinary and Supabase (admin only)
 */
export async function deleteImage(id: string, cloudinaryPublicId: string) {
    try {
        // Validate inputs
        if (!id || !cloudinaryPublicId) {
            return {
                success: false,
                error: "Missing required parameters",
            };
        }

        // Delete from Cloudinary first
        await deleteFromCloudinary(cloudinaryPublicId);

        // Then delete from Supabase using admin client
        const { error } = await supabaseAdmin
            .from("messages")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Supabase error:", error);
            return {
                success: false,
                error: "Failed to delete image from database",
            };
        }

        // Revalidate admin page to update the list
        revalidatePath("/admin/dashboard");

        return {
            success: true,
        };
    } catch (error) {
        console.error("Error deleting image:", error);
        return {
            success: false,
            error: "Failed to delete image",
        };
    }
}

/**
 * Track visitor - called when someone visits the site
 */
export async function trackVisitor() {
    try {
        // Use supabaseAdmin to bypass RLS policies
        const { data, error } = await supabaseAdmin
            .from("visitors")
            .insert([{}])
            .select();

        if (error) {
            console.error("Error tracking visitor:", error);
            // Don't return error to client to avoid disrupting the UI
            return { success: false };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error tracking visitor:", JSON.stringify(error, null, 2));
        return { success: false };
    }
}

/**
 * Get total visitor count (admin only)
 */
export async function getVisitorCount() {
    try {
        // Use supabaseAdmin to bypass RLS policies
        const { count, error } = await supabaseAdmin
            .from("visitors")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Error getting visitor count:", error);
            return {
                success: false,
                count: 0,
            };
        }

        return {
            success: true,
            count: count || 0,
        };
    } catch (error) {
        console.error("Error getting visitor count:", error);
        return {
            success: false,
            count: 0,
        };
    }
}

/**
 * Toggle public status of an image (admin only)
 */
export async function togglePublicStatus(id: string, isPublic: boolean) {
    try {
        const { data, error } = await supabaseAdmin
            .from("messages")
            .update({ is_public: isPublic })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error toggling public status:", error);
            return { success: false, error: "Failed to update status" };
        }

        revalidatePath("/admin/dashboard");
        revalidatePath("/"); // Revalidate home page as well

        return { success: true, data };
    } catch (error) {
        console.error("Error toggling public status:", error);
        return { success: false, error: "An error occurred" };
    }
}

/**
 * Get public images for the wall
 */
export async function getPublicImages() {
    try {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("is_public", true)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching public images:", error);
            return { success: false, data: [] };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        console.error("Error fetching public images:", error);
        return { success: false, data: [] };
    }
}
