import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Auth - Login",
	description: "next-auth-v5 login",
};

export default function LoginPage() {
	return <LoginForm />;
}
