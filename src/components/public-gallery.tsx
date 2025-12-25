"use client";

import { Message } from "@/lib/supabase";
import Image from "next/image";
import { Calendar, X } from "lucide-react";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface PublicGalleryProps {
    initialImages: Message[];
}

export function PublicGallery({ initialImages }: PublicGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<Message | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
        }).format(date);
    };

    if (initialImages.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-5xl mt-24">
            <div className="text-center mb-16 space-y-2">
                <h2 className="text-xl font-medium tracking-widest text-slate-200 uppercase">
                    The Collection
                </h2>
                <div className="h-px w-12 bg-slate-800 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full">
                {initialImages.map((image) => (
                    <div
                        key={image.id}
                        className="group relative aspect-[4/5] overflow-hidden bg-slate-900/20 cursor-pointer transition-all duration-700 hover:shadow-2xl hover:shadow-slate-900/50"
                        onClick={() => setSelectedImage(image)}
                    >
                        <Image
                            src={image.image_url}
                            alt="Public snap"
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />

                        {/* Elegant overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                            <div className="flex items-center text-xs tracking-widest text-slate-300 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                <Calendar className="h-3 w-3 mr-2 text-slate-400" />
                                {formatDate(image.created_at)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Minimalist Dialog */}
            <DialogPrimitive.Root open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-screen-xl translate-x-[-50%] translate-y-[-50%] gap-4 p-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">

                        <div className="relative w-full h-[85vh] flex flex-col items-center justify-center outline-none">
                            {selectedImage && (
                                <>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={selectedImage.image_url}
                                            alt="Full view"
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>

                                    <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                                        <span className="inline-block px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-slate-300 text-xs tracking-widest uppercase border border-white/5">
                                            {formatDate(selectedImage.created_at)}
                                        </span>
                                    </div>
                                </>
                            )}

                            <DialogPrimitive.Close className="absolute right-0 top-0 p-2 text-slate-400 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md border border-white/10 outline-none">
                                <X className="h-6 w-6" />
                                <span className="sr-only">Close</span>
                            </DialogPrimitive.Close>
                        </div>

                    </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
        </div>
    );
}
