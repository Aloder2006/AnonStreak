import { z } from "zod";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
];

export const imageUploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "File size must be less than 5MB",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only image files (JPEG, PNG, WebP, GIF) are allowed",
        }),
});

export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
