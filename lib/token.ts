import { db } from "@/lib/db";
import type { VerificationToken } from "@prisma/client";

export async function generateVerificationToken(email: string) {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await db.verificationToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id },
        });
    }

    const newToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return newToken;
}