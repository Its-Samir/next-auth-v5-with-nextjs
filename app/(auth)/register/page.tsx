import RegisterForm from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Auth - Register",
	description: "next-auth-v5 Register",
};

export default function RegisterPage() {
    return (
        <RegisterForm />
    )
}
