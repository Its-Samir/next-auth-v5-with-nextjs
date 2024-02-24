import { z } from 'zod';

export const RegisterFormSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required"
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Password should be more than 5 character",
    })
});