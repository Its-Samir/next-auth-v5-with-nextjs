import PasswordResetForm from "@/components/auth/password-reset-form";
import { getVerificationToken } from "@/lib/queries/verification-token";
import { redirect } from "next/navigation";

interface PasswordResetPageProps {
    searchParams: {
        token: string;
    }
}

export default async function PasswordResetPage({ searchParams }: PasswordResetPageProps) {
    if (!searchParams.token) {
        redirect("/");
    }

    const token = await getVerificationToken(searchParams.token);

    if (!token) {
        redirect("/");
    }

    return (
        <PasswordResetForm token={token.token} />
    )
}
