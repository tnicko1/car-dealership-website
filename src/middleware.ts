import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        // If the user is not an admin, redirect them to the home page.
        if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, // A user is authorized if they have a token (are logged in)
        },
    }
)

// This applies the middleware to all routes under /admin
export const config = { matcher: ["/admin/:path*"] }
