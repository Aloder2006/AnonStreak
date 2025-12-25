"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Calendar, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { deleteImage } from "@/app/actions";
import { toast } from "sonner";
import type { Message } from "@/lib/supabase";

interface ImageGridProps {
    images: Message[];
}

export function ImageGrid({ images }: ImageGridProps) {
    const [selectedImage, setSelectedImage] = useState<Message | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!selectedImage) return;

        setIsDeleting(true);
        try {
            const result = await deleteImage(
                selectedImage.id,
                selectedImage.cloudinary_public_id
            );

            if (result.success) {
                toast.success("Image deleted successfully");
                setDeleteDialogOpen(false);
                setSelectedImage(null);
            } else {
                toast.error(result.error || "Failed to delete image");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("An error occurred while deleting");
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    if (images.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No images uploaded yet</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden group">
                        <CardContent className="p-0">
                            <div className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(image)}>
                                <Image
                                    src={image.image_url}
                                    alt="Uploaded image"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-3 bg-card">
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(image.created_at)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Image</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this image? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Image Preview Dialog */}
            <Dialog
                open={selectedImage !== null && !deleteDialogOpen}
                onOpenChange={(open) => !open && setSelectedImage(null)}
            >
                <DialogContent className="max-w-3xl w-full h-[80vh] flex flex-col">
                    {selectedImage && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Image Preview</DialogTitle>
                                <DialogDescription>
                                    Uploaded on {formatDate(selectedImage.created_at)}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="relative flex-1 min-h-0 w-full bg-slate-950/50 rounded-md overflow-hidden">
                                <Image
                                    src={selectedImage.image_url}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <DialogFooter className="mt-4 flex flex-row items-center justify-between gap-2">
                                <Button
                                    variant="destructive"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>

                                <Button
                                    variant="secondary"
                                    onClick={async () => {
                                        try {
                                            toast.info("Downloading...");
                                            const response = await fetch(selectedImage.image_url);
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement("a");
                                            a.href = url;
                                            a.download = `anonsnap-${selectedImage.id.slice(0, 8)}.jpg`;
                                            document.body.appendChild(a);
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                            document.body.removeChild(a);
                                            toast.success("Download started");
                                        } catch (error) {
                                            console.error("Download error:", error);
                                            toast.error("Download failed, opening in new tab");
                                            window.open(selectedImage.image_url, "_blank");
                                        }
                                    }}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Image
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
