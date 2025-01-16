import { Resend } from 'resend';
import VerificationEmail from '../../../email/verificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(email: string,
    username: string,
    verifyCode: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Hello world',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        if (error) {
            return Response.json({ error, message: "Succesfully Sent" }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error, message: "Error Sending" }, { status: 500 });
    }
}
