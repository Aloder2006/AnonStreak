"use client";

import { useRouter } from "next/navigation";
import { logoutAdmin } from "../auth-actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const result = await logoutAdmin();
        if (result.success) {
            toast.success("تم تسجيل الخروج بنجاح");
            router.push("/admin");
            router.refresh();
        }
    };

    return (
        <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            تسجيل الخروج
        </Button>
    );
}
