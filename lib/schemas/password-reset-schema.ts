import { z } from 'zod';

export const passwordResetFormSchema = z.object({
    password: z.string().min(6, {
        message: "Password should be more than 5 character",
    })
});