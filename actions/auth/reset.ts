"use server";

import ActionsReturnType from "@/types";
import { z } from 'zod';
import { sendResetPasswordEmail } from "@/lib/mail";
import { resetFormSchema } from "@/lib/schemas/reset-form-schema";
import { generateVerificationToken } from "@/lib/token";
import { getUserByEmail } from "@/lib/queries/user";

/* only need if using email verification */
export async function sendEmail(values: z.infer<typeof resetFormSchema>): Promise<ActionsReturnType> {
    try {
        const validationResult = resetFormSchema.safeParse(values);

        if (!validationResult.success) {
            return { error: "Invalid inputs" };
        }

        const existingUser = await getUserByEmail(validationResult.data.email);

        if (!existingUser) {
            return { error: "User not found" }
        }

        const verificationToken = await generateVerificationToken(existingUser.email!);

        await sendResetPasswordEmail(verificationToken.email, verificationToken.token);

        return { success: "Reset link sent to your email" }

    } catch (error) {
        return { error: "Something went wrong" }
    }
}