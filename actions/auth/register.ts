"use server";

import ActionsReturnType from "@/types";
import bcrypt from 'bcryptjs';
import { RegisterFormSchema } from "@/lib/schemas/register-form-schema";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";

export async function register(values: z.infer<typeof RegisterFormSchema>): Promise<ActionsReturnType> {
    try {
        const validationResult = RegisterFormSchema.safeParse(values);

        if (!validationResult.success) {
            return { error: "Invalid inputs" }
        }

        const { username, email, password } = validationResult.data;

        const existingUser = await db.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });

        if (existingUser) {
            return { error: "Email or username is already in use" }
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await db.user.create({
            data: {
                username,
                name: username,
                email,
                password: hashedPassword,
            },
        });

        const verificationToken = await generateVerificationToken(email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Verification email sent" }

    } catch (error: unknown) {
        return { error: "Something went wrong" }
    }
}