import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

/* config for next-auth v5 */
const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
    const { nextUrl, auth } = req;

    const isLoggedIn = !!auth;

    const isAuthRoutes = ["/login", "/register"].includes(nextUrl.pathname);
    const isVerificaitonRoutes = ["/new-password", "/verification"].includes(nextUrl.pathname);
    const isProtectedRoutes = ["/", "/dashboard"].includes(nextUrl.pathname);
    const token = nextUrl.searchParams.get('token');

    if (!token && isVerificaitonRoutes) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (isLoggedIn && isAuthRoutes) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    if (!isLoggedIn && isProtectedRoutes) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    return NextResponse.next();
});

/* config from clerk */
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}