import { db } from "@/lib/db";

export async function getVerificationToken(token: string) {
    return db.verificationToken.findUnique({ where: { token } });
}