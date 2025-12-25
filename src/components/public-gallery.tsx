"use client";

import { Message } from "@/lib/supabase";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface PublicGalleryProps {
    initialImages: Message[];
}

export function PublicGallery({ initialImages }: PublicGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<Message | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
        }).format(date);
    };

    if (initialImages.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mt-16">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Featured Snaps
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Highlights from the community
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                {initialImages.map((image) => (
                    <Card
                        key={image.id}
                        className="overflow-hidden bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
                        onClick={() => setSelectedImage(image)}
                    >
                        <CardContent className="p-0">
                            <div className="relative aspect-square">
                                <Image
                                    src={image.image_url}
                                    alt="Public snap"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </div>
                            <div className="p-2">
                                <div className="flex items-center text-[10px] text-slate-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(image.created_at)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-slate-200">
                    <DialogHeader>
                        <DialogTitle>Public Snap</DialogTitle>
                        <DialogDescription>
                            {selectedImage && formatDate(selectedImage.created_at)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-900">
                        {selectedImage && (
                            <Image
                                src={selectedImage.image_url}
                                alt="Full view"
                                fill
                                className="object-contain"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
