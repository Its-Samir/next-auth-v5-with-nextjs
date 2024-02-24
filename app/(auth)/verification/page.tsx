import VerificationForm from "@/components/auth/verification-form";
import { getVerificationToken } from "@/lib/queries/verification-token";
import { redirect } from "next/navigation";

interface VerificationPageProps {
  searchParams: {
    token: string;
  }
}

export default async function VerificationPage({ searchParams }: VerificationPageProps) {
  if (!searchParams.token) {
    redirect("/");
  }

  const token = await getVerificationToken(searchParams.token);

  if (!token) {
    redirect("/");
  }

  return (
    <VerificationForm token={token.token} />
  )
}
