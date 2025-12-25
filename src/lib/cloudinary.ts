import { v2 as cloudinary } from "cloudinary";

// Validate environment variables
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined");
}
if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY is not defined");
}
if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET is not defined");
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Generate signature for signed uploads
export function generateSignature(paramsToSign: Record<string, string | number>) {
    const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET!
    );
    return signature;
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(`Failed to delete image: ${result.result}`);
        }

        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error;
    }
}
