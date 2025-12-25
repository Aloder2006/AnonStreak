import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Middleware is now handled by page-level authentication
    // The admin routes check authentication via cookies in the page component
    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
