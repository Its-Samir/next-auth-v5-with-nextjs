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

    /* 
        this token validation is just for ux purpose,
        that's why we are not querying/checking for correct token,
        the main validation/check already implemented inside all the verification pages
        which are listed into the isVerificationRoutes array,
        this is just an example how we can check for token extracted from cookies/url params
     */
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