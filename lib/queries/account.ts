import { db } from "@/lib/db";
import type { Account } from "@prisma/client";

export function getAccountByUserId(userId: string): Promise<Account | null> {
    return db.account.findFirst({ where: { userId } });
}