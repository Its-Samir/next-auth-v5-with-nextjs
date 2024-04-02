'use client';

import { useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/lib/schemas/login-form-schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/auth/login";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import Wrapper from "./wrapper";
import FormStatus from "./form-status";
import Link from "next/link";

export default function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState({ success: false, message: '' });
    const searchParams = useSearchParams();
    const errorQuery = searchParams.get("error");
    const oAuthError = errorQuery === "OAuthAccountNotLinked" ?
        "Another account already exists with the same email" :
        "";

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    function onFormSubmit(values: z.infer<typeof loginFormSchema>) {
        setShowPassword(false);

        startTransition(() => {
            login(values).then(data => {
                if (data?.error) {
                    setStatus({ message: data.error, success: false });

                } else if (data?.success) {
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
            url="/register"
            header="WELCOME BACK"
            text="Don't have an account?"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-3">
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

                    <span className="text-slate-700">
                        <Link href={"/reset"}>forgot password?</Link>
                    </span>
                    <FormStatus message={status.message || oAuthError} success={status.success} />
                    <Button
                        className="w-full"
                        disabled={isPending}
                        type="submit"
                        children={isPending ? <BeatLoader color="white" size={8} /> : "Login"}
                        size={"lg"}
                    />
                </form>
            </Form>
        </Wrapper>
    )
}
