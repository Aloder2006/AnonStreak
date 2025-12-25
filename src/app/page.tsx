import { UploadZone } from "@/components/upload-zone";
import { trackVisitor, getPublicImages } from "./actions";
import { PublicGallery } from "@/components/public-gallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    // Track visitor
    await trackVisitor();

    // Fetch public images
    const result = await getPublicImages();
    const publicImages = result.success ? result.data : [];

    return (
        <div className="min-h-screen bg-zinc-950 relative overflow-y-auto overflow-x-hidden selection:bg-zinc-800 selection:text-zinc-200">

            {/* Animated GIF Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 animate-[pulse_8s_ease-in-out_infinite]">
                    <img
                        src="https://res.cloudinary.com/dj5c8iuxx/image/upload/v1766644428/facb6eamqvgbdwefe8wj.gif"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60 scale-110"
                    />
                </div>
                {/* Gradient Overlay for Fade Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/80 to-zinc-950" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full">

                {/* Hero Section - Full Screen & Symmetrical */}
                <div className="min-h-screen flex flex-col items-center justify-center relative px-6">

                    {/* Minimalist Logo/Title */}
                    <div className="w-full max-w-2xl text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-light text-zinc-100 tracking-tight drop-shadow-2xl">
                            Anon<span className="font-medium">Streak</span>
                        </h1>
                    </div>

                    {/* Upload Zone - Elegant Container */}
                    <div className="w-full max-w-md">
                        <UploadZone />
                    </div>

                    {/* Refined Scroll Indicator */}
                    <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
                        <div className="h-12 w-px bg-gradient-to-b from-zinc-500 to-transparent"></div>
                        <span className="text-[10px] text-zinc-400 tracking-[0.3em] uppercase transform rotate-90 translate-y-8 origin-top font-light">
                            The Wall
                        </span>
                    </div>
                </div>

                {/* Public Gallery Section */}
                <div className="min-h-screen bg-black/40 backdrop-blur-sm flex flex-col items-center py-32 px-4 border-t border-white/5">
                    <PublicGallery initialImages={publicImages} />
                </div>
            </div>
        </div>
    );
}
