"use server";

import bcrypt from 'bcryptjs';
import { z } from "zod";
import { LoginFormSchema } from "@/lib/schemas/login-form-schema";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { getAccountByUserId } from '@/lib/queries/account';
import { getUserByEmail } from '@/lib/queries/user';

export async function login(values: z.infer<typeof LoginFormSchema>) {
    let redirectUrl;

    try {
        const validationResult = LoginFormSchema.safeParse(values);

        if (!validationResult.success) {
            return { error: "Invalid inputs" };
        }

        const { email, password } = validationResult.data;

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return { error: "User not found" };
        }

        const userAccount = await getAccountByUserId(existingUser.id);

        if (userAccount && userAccount.type === "oauth") {
            return { error: "User is already registered with another method" };
        }

        const isCorrectPassword = await bcrypt.compare(password, existingUser.password!);

        if (!isCorrectPassword) {
            return { error: "Invalid credentials" };
        }

        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(existingUser.email!);

            await sendVerificationEmail(verificationToken.email, verificationToken.token);

            return { success: "Verification email sent" };
        }

        try {
            redirectUrl = await signIn("credentials", {
                email,
                password,
                redirectTo: "/",
                redirect: false,
            });

        } catch (error) {
            return { error: "Failed to signed in, Try again later" }
        }

    } catch (error) {
        return { error: "Something went wrong" }
    }

    redirect(redirectUrl);
} 