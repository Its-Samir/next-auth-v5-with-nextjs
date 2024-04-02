"use client";

import { useSession } from "next-auth/react";

export default function Home() {
    /* for client component, its useSession hook to access the session */
    const { data: session, status } = useSession();

    let content;

    /* check for showing loading ui */
    if (status === "loading") {
        content = (
            <h1 className="text-5xl text-center mt-[4rem]">
                Loading user...
            </h1>
        )
    }

    else if (status === "authenticated")
        content = (
            <>
                <h1 className="text-5xl text-center mt-[4rem]">
                    Hello, {" "}
                    <span className="text-slate-500">
                        {session.user.username?.toUpperCase()}
                    </span>
                </h1>
                <div className="mx-auto w-max my-[2rem] border p-2 bg-emerald-200">
                    <p className="text-xl text-emerald-700">You are logged in successfully</p>
                </div>
            </>
        );

    return content;
}
