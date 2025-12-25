"use client";

import { useState, useCallback } from "react";
import { Camera, Check, X, Zap } from "lucide-react";
import { getUploadSignature, saveImageMetadata } from "@/app/actions";
import { cn } from "@/lib/utils";

export function UploadZone() {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const validateFile = (file: File): string | null => {
        const MAX_SIZE = 5 * 1024 * 1024;
        const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Only images allowed";
        }

        if (file.size > MAX_SIZE) {
            return "Max 5MB";
        }

        return null;
    };

    const uploadToCloudinary = async (file: File) => {
        try {
            setIsUploading(true);
            setUploadStatus("idle");
            setUploadProgress(0);
            setErrorMessage("");

            const validationError = validateFile(file);
            if (validationError) {
                setErrorMessage(validationError);
                setUploadStatus("error");
                return;
            }

            setUploadProgress(10);

            const signatureData = await getUploadSignature();
            if (!signatureData.success) {
                setErrorMessage("Failed to prepare");
                setUploadStatus("error");
                return;
            }

            setUploadProgress(20);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("timestamp", signatureData.timestamp!.toString());
            formData.append("folder", signatureData.folder!);
            formData.append("signature", signatureData.signature!);
            formData.append("api_key", signatureData.apiKey!);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 70) + 20;
                    setUploadProgress(percentComplete);
                }
            });

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.addEventListener("load", () => {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error("Upload failed"));
                    }
                });
                xhr.addEventListener("error", () => reject(new Error("Upload failed")));
                xhr.open("POST", `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`);
                xhr.send(formData);
            });

            const cloudinaryData = await uploadPromise as any;
            setUploadProgress(90);

            const saveResult = await saveImageMetadata(
                cloudinaryData.public_id,
                cloudinaryData.secure_url
            );

            if (!saveResult.success) {
                setErrorMessage("Failed to save");
                setUploadStatus("error");
                return;
            }

            setUploadProgress(100);
            setUploadStatus("success");

            setTimeout(() => {
                setUploadStatus("idle");
                setUploadProgress(0);
            }, 2000);
        } catch (error) {
            console.error("Upload error:", error);
            setErrorMessage("Upload failed");
            setUploadStatus("error");
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            uploadToCloudinary(files[0]);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            uploadToCloudinary(files[0]);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="relative flex flex-col items-center"
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                disabled={isUploading}
            />

            {/* Main Upload Button - Circular Design */}
            <label
                htmlFor="file-upload"
                className={cn(
                    "group relative cursor-pointer transition-all duration-500",
                    isUploading && "cursor-not-allowed"
                )}
            >
                {/* Outer glow ring */}
                <div className={cn(
                    "absolute inset-0 rounded-full blur-2xl transition-all duration-500",
                    isDragging && "bg-slate-500/30 scale-110",
                    !isDragging && uploadStatus === "idle" && "bg-slate-600/20 group-hover:bg-slate-500/25 group-hover:scale-105",
                    uploadStatus === "success" && "bg-green-500/30",
                    uploadStatus === "error" && "bg-red-500/30"
                )} />

                {/* Main circle */}
                <div className={cn(
                    "relative w-48 h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center",
                    "bg-gradient-to-br transition-all duration-500",
                    "border-4",
                    isDragging && "from-slate-700/25 to-slate-600/25 border-slate-500 scale-105",
                    !isDragging && uploadStatus === "idle" && "from-slate-800/20 to-slate-700/20 border-slate-600/30 group-hover:border-slate-500/50 group-hover:scale-105",
                    uploadStatus === "success" && "from-green-600/20 to-emerald-600/20 border-green-500",
                    uploadStatus === "error" && "from-red-600/20 to-orange-600/20 border-red-500",
                    isUploading && "animate-pulse"
                )}>
                    {/* Inner glow */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-500/10 to-slate-600/10 blur-xl" />

                    {/* Icon */}
                    <div className="relative z-10 mb-3">
                        {uploadStatus === "success" ? (
                            <Check className="w-16 h-16 md:w-20 md:h-20 text-green-400" strokeWidth={2.5} />
                        ) : uploadStatus === "error" ? (
                            <X className="w-16 h-16 md:w-20 md:h-20 text-red-400" strokeWidth={2.5} />
                        ) : (
                            <Camera className={cn(
                                "w-16 h-16 md:w-20 md:h-20 transition-all duration-300",
                                isDragging ? "text-slate-300 scale-110" : "text-slate-400 group-hover:text-slate-300 group-hover:scale-110"
                            )} strokeWidth={2} />
                        )}
                    </div>

                    {/* Text inside circle */}
                    <div className="relative z-10 text-center px-4">
                        <p className={cn(
                            "text-base md:text-lg font-bold transition-colors",
                            uploadStatus === "success" && "text-green-400",
                            uploadStatus === "error" && "text-red-400",
                            uploadStatus === "idle" && "text-slate-300"
                        )}>
                            {isUploading
                                ? "Sending..."
                                : uploadStatus === "success"
                                    ? "Sent!"
                                    : uploadStatus === "error"
                                        ? "Failed"
                                        : "Tap Here"}
                        </p>
                    </div>

                    {/* Progress ring */}
                    {isUploading && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-slate-700/20"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                                strokeDashoffset={2 * Math.PI * 45 * (1 - uploadProgress / 100)}
                                className="text-slate-400 transition-all duration-300"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </div>
            </label>

            {/* Text below button */}
            <div className="mt-6 text-center space-y-2">
                {uploadStatus === "idle" && !isUploading && (
                    <>
                        <p className="text-xl md:text-2xl font-semibold text-slate-300 flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5 text-slate-400" />
                            Send Anonymous Streak
                        </p>
                        <p className="text-sm text-slate-500">
                            Tap the circle or drag & drop
                        </p>
                    </>
                )}

                {uploadStatus === "success" && (
                    <p className="text-lg text-green-400 font-medium">
                        Your streak was sent anonymously
                    </p>
                )}

                {uploadStatus === "error" && errorMessage && (
                    <p className="text-sm text-red-400">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
}
