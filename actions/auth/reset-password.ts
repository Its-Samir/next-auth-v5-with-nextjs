"use server";

import ActionsReturnType from "@/types";
import bcrypt from 'bcryptjs';
import { db } from "@/lib/db";
import { passwordResetFormSchema } from "@/lib/schemas/password-reset-schema";
import { z } from "zod";
import { getUserByEmail } from "@/lib/queries/user";
import { getVerificationToken } from "@/lib/queries/verification-token";
import { redirect } from "next/navigation";

/* here for reseting password we are using email verification, if not want then remove 
the statements for checking the correct token */
export async function resetPassword(
    values: z.infer<typeof passwordResetFormSchema>,
    token: string
): Promise<ActionsReturnType> {
    try {
        const validationResult = passwordResetFormSchema.safeParse(values);

        if (!validationResult.success) {
            return { error: "Invalid inputs" }
        }

        const existingToken = await getVerificationToken(token);

        if (!existingToken) {
            return { error: "Token not found" }
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return { error: "User not found" }
        }

        const { password } = validationResult.data;

        const hashedPassword = await bcrypt.hash(password, 12);

        await db.user.update({
            where: { id: existingUser.id },
            data: {
                password: hashedPassword,
            }
        });

        await db.verificationToken.delete({
            where: { id: existingToken.id },
        });

    } catch (error) {
        return { error: "Something went wrong" }
    }

    redirect("/login");
}