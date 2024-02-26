"use server";

import ActionsReturnType from "@/types";
import { db } from "@/lib/db";
import { getVerificationToken } from "@/lib/queries/verification-token";
import { getUserByEmail } from "@/lib/queries/user";

/* only need if using email verification */
export async function verifyEmail(token: string): Promise<ActionsReturnType> {
    try {
        const existingToken = await getVerificationToken(token);

        if (!existingToken) {
            return { error: "No token found" }
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return { error: "Token is expired" }
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return { error: "User not found" }
        }

        await db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                emailVerified: new Date(),
            }
        });

        await db.verificationToken.delete({
            where: { id: existingToken.id }
        });

        return { success: "Email successfully verified" }

    } catch (error: unknown) {
        return { error: "Something went wrong" }
    }
}