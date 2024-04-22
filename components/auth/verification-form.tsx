"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { verifyEmail } from "@/actions/auth/verification";
import Wrapper from "./wrapper";
import FormStatus from "./form-status";

export default function VerificationForm({ token }: { token: string }) {
	const [isPending, startTransition] = useTransition();
	const [status, setStatus] = useState({ success: false, message: "" });

	useEffect(() => {
		function verify() {
			startTransition(() => {
				verifyEmail(token)
					.then((data) => {
						if (data && data.error) {
							setStatus({ message: data.error, success: false });
						} else if (!data || !data.error) {
							setStatus({
								message: "Email verified successfully",
								success: true,
							});
						}
					})
					.catch((err) => {
						setStatus({
							message: err.message || "Something went wrong",
							success: false,
						});
					});
			});
		}

		/* this would trigger twice because of react strict mode, so even if first response is success, then the second response would be an error, because after we check the email we are simply deleting the token, so it would not be able to find that token again, but that's totally ok and only happens in development */
		verify();
	}, [token]);

	return (
		<Wrapper
			url="/login"
			header="EMAIL VERIFICATION"
			text="Back to login."
			social={false}
		>
			{status.message === "" ? (
				<Loader2 className="animate-spin mx-auto my-5" size={50} />
			) : null}
			<FormStatus
				message={status.message}
				success={status.success}
				className="justify-center"
			/>
		</Wrapper>
	);
}
