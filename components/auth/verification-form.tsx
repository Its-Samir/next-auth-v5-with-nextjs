'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition } from "react";
import { verifyEmail } from '@/actions/auth/verification';
import Wrapper from "./wrapper";
import FormStatus from "./form-status";

export default function VerificationForm({ token }: { token: string }) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState({ success: false, message: '' });

    function verify() {
        startTransition(() => {
            verifyEmail(token).then(data => {
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

    useEffect(() => {
        verify();
    }, []);

    return (
        <Wrapper
            url="/login"
            header="EMAIL VERIFICATION"
            text="Back to login."
            social={false}
        >
            {isPending || status.message === "" ? (
                <Loader2 className='animate-spin mx-auto my-5' size={50} />
            ) : null}
            <FormStatus message={status.message} success={status.success} className="justify-center" />
        </Wrapper>
    )
}
