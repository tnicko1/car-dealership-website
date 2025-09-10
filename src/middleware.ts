import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https: http: ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://www.google.com;
    frame-ancestors 'none';
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', cspHeader);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('x-nonce', nonce);

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    if (token) {
        const profileComplete = token.firstName && token.lastName && token.username;

        if (!profileComplete && pathname !== "/account/setup") {
            const setupUrl = new URL("/account/setup", req.url);
            setupUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(setupUrl);
        }

        if (profileComplete && pathname === "/account/setup") {
            return NextResponse.redirect(new URL("/account", req.url));
        }
    }

    const protectedRoutes = ["/admin", "/account", "/my-listings", "/wishlist", "/my-listings/edit"];
    const isAdminRoute = pathname.startsWith("/admin");

    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        if (isAdminRoute && token.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*", "/account/:path*", "/my-listings/:path*", "/wishlist/:path*"],
};
