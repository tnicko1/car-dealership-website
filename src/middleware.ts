import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isUserAdmin = req.nextauth.token?.role === "admin";

        if (isAdminRoute && !isUserAdmin) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        const isAccountPage = req.nextUrl.pathname.startsWith("/account");
        const user = req.nextauth.token;

        if (user && !isAccountPage) {
            const { firstName, lastName, phone } = user;
            if (!firstName || !lastName || !phone) {
                return NextResponse.redirect(new URL("/account", req.url));
            }
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
