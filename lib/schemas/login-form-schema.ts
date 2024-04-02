import { z } from 'zod';

export const loginFormSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password should be more than 5 character",
    })
});