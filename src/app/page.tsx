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

            {/* Subtle Geometric Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-950/80" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full">

                {/* Hero Section - Full Screen & Symmetrical */}
                <div className="min-h-screen flex flex-col items-center justify-center relative px-6">

                    {/* Minimalist Logo/Title */}
                    <div className="w-full max-w-2xl text-center mb-16 space-y-6">
                        <div className="inline-block px-3 py-1 mb-4 border border-zinc-800 rounded-full">
                            <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                                Anonymous Sharing
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-light text-zinc-100 tracking-tight">
                            Anon<span className="font-medium">Streak</span>
                        </h1>
                        <p className="text-zinc-500 text-sm md:text-base max-w-sm mx-auto font-light leading-relaxed">
                            Share moments in silence. Clean, secure, and ephemeral.
                        </p>
                    </div>

                    {/* Upload Zone - Elegant Container */}
                    <div className="w-full max-w-md">
                        <UploadZone />
                    </div>

                    {/* Refined Scroll Indicator */}
                    <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
                        <div className="h-12 w-px bg-gradient-to-b from-zinc-800 to-zinc-500"></div>
                        <span className="text-[10px] text-zinc-500 tracking-[0.3em] uppercase transform rotate-90 translate-y-8 origin-top">
                            The Wall
                        </span>
                    </div>
                </div>

                {/* Public Gallery Section */}
                <div className="min-h-screen bg-black flex flex-col items-center py-32 px-4 border-t border-zinc-900">
                    <PublicGallery initialImages={publicImages} />
                </div>
            </div>
        </div>
    );
}
