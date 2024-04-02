import { z } from 'zod';

export const resetFormSchema = z.object({
    email: z.string().email({ message: "Email is required" })
});