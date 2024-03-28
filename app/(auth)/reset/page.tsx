import ResetForm from "@/components/auth/required-reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Auth - Get Reset Mail",
};

export default function ResetPage() {
    return (
        <ResetForm />
    )
}
