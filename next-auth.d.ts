import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    username: string,
    emailVerified: Date,
}

/* extend the detials of Session if needed */
declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}

/* extend the detials of JWT if needed */
declare module "@auth/core/jwt" {
    interface JWT {
        username: string,
        emailVerified: Date,
    }
}