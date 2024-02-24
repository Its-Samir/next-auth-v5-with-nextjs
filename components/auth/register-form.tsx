'use client';

import { useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterFormSchema } from "@/lib/schemas/register-form-schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { register } from "@/actions/auth/register";
import { BeatLoader } from "react-spinners";
import Wrapper from "./wrapper";
import FormStatus from "./form-status";

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState({ success: false, message: '' });
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });

    function onFormSubmit(values: z.infer<typeof RegisterFormSchema>) {
        setShowPassword(false);

        startTransition(() => {
            register(values).then(data => {
                if (data.error) {
                    setStatus({ message: data.error, success: false });

                } else if (data.success) {
                    setStatus({ message: data.success, success: true });
                }

            }).catch(err => {
                setStatus({
                    message: err.message || "Something went wrong",
                    success: false
                });
            });
        });
    }

    return (
        <Wrapper
            url="/login"
            header="CREATE AN ACCOUNT"
            text="Already have an account?"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-3">
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="John"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="test@email.com"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex justify-between items-center">
                                    <span>Password</span>
                                    <div
                                        children={showPassword ? "Hide" : "Show"}
                                        onClick={() => setShowPassword(p => !p)}
                                        className="cursor-pointer text-black"
                                    />
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="******"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormStatus message={status.message} success={status.success} />
                    <Button
                        className="w-full"
                        disabled={isPending}
                        type="submit"
                        children={isPending ? <BeatLoader color="white" size={8} /> : "Create an Account"}
                        size={"lg"}
                    />
                </form>
            </Form>
        </Wrapper>
    )
}
