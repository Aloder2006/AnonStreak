import { UploadZone } from "@/components/upload-zone";
import { trackVisitor } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    // Track visitor
    await trackVisitor();

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 relative overflow-hidden flex items-center justify-center">
            {/* GIF Background */}
            <div className="absolute inset-0 opacity-80">
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
                className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Centered Content */}
            <div className="relative z-10 px-4 w-full max-w-lg">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent tracking-tight">
                        AnonStreak
                    </h1>
                </div>

                {/* Upload Zone */}
                <UploadZone />
            </div>
        </div>
    );
}
