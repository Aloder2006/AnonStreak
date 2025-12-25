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
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 relative overflow-y-auto overflow-x-hidden scroll-smooth">
            {/* GIF Background - Fixed Position */}
            <div className="fixed inset-0 opacity-80 z-0">
                <img
                    src="https://res.cloudinary.com/dj5c8iuxx/image/upload/v1766644428/facb6eamqvgbdwefe8wj.gif"
                    alt="Background"
                    className="w-full h-full object-cover"
                />

                {/* Darker muted gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/70 via-slate-900/60 to-zinc-900/70" />
            </div>

            {/* Noise texture overlay */}
            <div
                className="fixed inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none z-[1]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Dark overlay */}
            <div className="fixed inset-0 bg-black/40 z-[2]" />

            {/* Content Container */}
            <div className="relative z-10 w-full">

                {/* Hero Section - Full Screen */}
                <div className="min-h-screen flex flex-col items-center justify-center relative px-4">
                    <div className="w-full max-w-lg text-center mb-8">
                        <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent tracking-tight">
                            AnonStreak
                        </h1>
                    </div>

                    {/* Upload Zone */}
                    <div className="w-full max-w-lg">
                        <UploadZone />
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce opacity-70">
                        <span className="text-sm text-slate-400 font-medium tracking-widest uppercase">The Wall</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-slate-400"
                        >
                            <path d="M12 5v14" />
                            <path d="m19 12-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Public Gallery Section */}
                <div className="min-h-screen flex flex-col items-center py-20 px-4 bg-black/20 backdrop-blur-sm">
                    <PublicGallery initialImages={publicImages} />
                </div>
            </div>
        </div>
    );
}
