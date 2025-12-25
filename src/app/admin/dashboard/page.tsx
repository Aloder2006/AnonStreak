import { redirect } from "next/navigation";
import { isAuthenticated } from "../auth-actions";
import { getImages, getVisitorCount } from "@/app/actions";
import { ImageGrid } from "@/components/image-grid";
import { Shield, Images, Users } from "lucide-react";
import { LogoutButton } from "./logout-button";


export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    // Check if user is authenticated
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/admin");
    }

    const result = await getImages();
    const images = result.success ? result.data || [] : [];

    const visitorResult = await getVisitorCount();
    const visitorCount = visitorResult.success ? visitorResult.count : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">لوحة التحكم</h1>
                                <p className="text-muted-foreground">
                                    إدارة الصور المرفوعة
                                </p>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <Images className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">إجمالي الصور</p>
                                <p className="text-2xl font-bold">{images.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">عدد الزوار</p>
                                <p className="text-2xl font-bold">{visitorCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Grid */}
                <ImageGrid images={images} />
            </div>
        </div>
    );
}
