"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { loginFormSchema } from "@/lib/schemas/login-form-schema";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { getAccountByUserId } from "@/lib/queries/account";
import { getUserByEmail } from "@/lib/queries/user";

export async function login(values: z.infer<typeof loginFormSchema>) {
	let redirectUrl: string;

	try {
		const validationResult = loginFormSchema.safeParse(values);

		if (!validationResult.success) {
			return { error: "Invalid inputs" };
		}

		const { email, password } = validationResult.data;

		const existingUser = await getUserByEmail(email);

		if (!existingUser) {
			return { error: "User not found" };
		}

		/* check if the user's email is registered with any OAuth provider */
		const userAccount = await getAccountByUserId(existingUser.id);

		if (userAccount && userAccount.type === "oauth") {
			return { error: "User is already registered with another method" };
		}

		const isCorrectPassword = await bcrypt.compare(
			password,
			existingUser.password!
		);

		if (!isCorrectPassword) {
			return { error: "Invalid credentials" };
		}

		/* this is the extra check for email verification, if not want email verification we can remove this check, and directly allow the user to sign in */
		if (!existingUser.emailVerified) {
			const verificationToken = await generateVerificationToken(
				existingUser.email!
			);

			await sendVerificationEmail(
				verificationToken.email,
				verificationToken.token
			);

			return { success: "Verification mail sent to your email" };
		}

		try {
			/* signIn method will directly redirect user from here (if redirect option is not set), but we are not doing it, we are saving the returned redirect url and using the redirect method provided by nextjs */
			redirectUrl = await signIn("credentials", {
				email,
				password,
				redirectTo: "/",
				redirect: false,
			});
		} catch (error) {
			return { error: "Failed to signed in, Try again later" };
		}
	} catch (error) {
		return { error: "Something went wrong" };
	}

	/* we cannot use redirect method directly inside try-catch block, if we do then nextjs will take it as a redirect error (NEXT_REDIRECT) */
	redirect(redirectUrl);
}
