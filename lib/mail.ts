import { Resend } from 'resend';

const resend = new Resend(`${process.env.RESEND_API_KEY}`);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${domain}/verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        subject: "Verify your email",
        to: email,
        html: `<p>Click on this <a href="${verificationLink}">link</a></p>`,
    });
}

export async function sendResetPasswordEmail(email: string, token: string) {
    const verificationLink = `${domain}/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        subject: "Email verification for new password",
        to: email,
        html: `<p>Click on this <a href="${verificationLink}">link</a></p>`,
    });
}