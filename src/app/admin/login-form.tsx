"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "./auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password) {
            toast.error("الرجاء إدخال كلمة المرور");
            return;
        }

        setIsLoading(true);

        try {
            const result = await loginAdmin(password);

            if (result.success) {
                toast.success("تم تسجيل الدخول بنجاح!");
                router.push("/admin/dashboard");
                router.refresh();
            } else {
                toast.error(result.error || "كلمة المرور غير صحيحة");
                setPassword("");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("حدث خطأ أثناء تسجيل الدخول");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">لوحة التحكم</CardTitle>
                    <CardDescription>
                        قم بتسجيل الدخول للوصول إلى لوحة التحكم
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="أدخل كلمة المرور"
                                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    disabled={isLoading}
                                    autoFocus
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                        </Button>
                    </form>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground text-center" dir="rtl">
                            💡 كلمة المرور موجودة في ملف .env.local
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
