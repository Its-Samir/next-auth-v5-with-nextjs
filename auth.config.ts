import bcrypt from 'bcryptjs';
import Github from '@auth/core/providers/github';
import Credentials from '@auth/core/providers/credentials';
import { NextAuthConfig } from "next-auth";
import { LoginFormSchema } from "@/lib/schemas/login-form-schema";
import { getUserByEmail } from "@/lib/queries/user";

export const authConfig: NextAuthConfig = {
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validation = LoginFormSchema.safeParse(credentials);

                if (!validation.success) {
                    return null;
                }

                const { email, password } = validation.data;

                const existingUser = await getUserByEmail(email);

                if (!existingUser) return null;

                const isCorrectPassword = await bcrypt.compare(password, existingUser.password!);

                if (!isCorrectPassword) {
                    return null;
                }

                return existingUser;
            },
        }),
    ],
}