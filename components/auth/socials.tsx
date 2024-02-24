"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from 'next-auth/react';

export default function Socials() {
    return (
        <>
            <div className="flex items-center justify-center gap-2">
                <div className="w-full h-[0.5px] bg-black dark:bg-white" />
                <span className="dark:text-white">or</span>
                <div className="w-full h-[0.5px] bg-black dark:bg-white" />
            </div>
            <Card className="flex gap-3 items-center border-none shadow-none">
                <Button
                    onClick={() => signIn("github", { callbackUrl: "/" })}
                    variant={"outline"}
                    className="p-4 border flex-1"
                >
                    Github
                </Button>
                <Button variant={"outline"} className="p-4 border flex-1">
                    Google
                </Button>
            </Card>
        </>
    )
}
