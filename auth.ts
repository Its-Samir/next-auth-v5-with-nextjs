import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { authConfig } from '@/auth.config';
import { getUserById } from '@/lib/queries/user';

const authOptions = NextAuth({
    adapter: PrismaAdapter(db),
    pages: {
        signIn: "/login",
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                }
            });
        },
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.name = token.name;
                session.user.username = token.username;
                session.user.emailVerified = token.emailVerified;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const user = await getUserById(token.sub);

            if (!user) return token;

            if (user.email && !user.username) {
                await db.user.update({
                    where: { id: user.id },
                    data: {
                        username: user.email.split("@")[0].toLowerCase(),
                    }
                });
            }

            token.name = user.name;
            token.username = user.username!;
            token.emailVerified = user.emailVerified!;

            return token;
        },
    },
    session: { strategy: "jwt" },
    ...authConfig,
});

export const { auth, handlers: { GET, POST }, signIn, signOut } = authOptions;