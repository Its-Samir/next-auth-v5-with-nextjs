import { db } from "@/lib/db";
import type { User } from "@prisma/client";

export async function getUserById(id: string): Promise<User | null> {
    return db.user.findUnique({
        where: { id },
    });
}

export async function getUserByUsername(username: string): Promise<User | null> {
    return db.user.findFirst({
        where: { username },
    });
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
        where: { email },
    });
}
