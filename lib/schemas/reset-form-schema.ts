import { z } from 'zod';

export const ResetFormSchema = z.object({
    email: z.string().email({ message: "Email is required" })
});