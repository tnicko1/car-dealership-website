import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isUserAdmin = req.nextauth.token?.role === "admin";

        if (isAdminRoute && !isUserAdmin) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = { matcher: ["/admin/:path*", "/account", "/my-listings", "/wishlist"] };
