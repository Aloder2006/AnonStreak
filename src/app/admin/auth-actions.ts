"use server";

import { cookies } from "next/headers";

/**
 * Login action for admin authentication
 */
export async function loginAdmin(password: string) {
    try {
        // Check if password matches
        if (password === process.env.ADMIN_PASSWORD) {
            // Set a secure cookie for 7 days
            const cookieStore = await cookies();
            cookieStore.set("admin_auth", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/",
            });

            return { success: true };
        }

        return {
            success: false,
            error: "كلمة المرور غير صحيحة",
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: "حدث خطأ أثناء تسجيل الدخول",
        };
    }
}

/**
 * Logout action
 */
export async function logoutAdmin() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("admin_auth");
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false };
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
    try {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get("admin_auth");
        return authCookie?.value === "authenticated";
    } catch (error) {
        return false;
    }
}
