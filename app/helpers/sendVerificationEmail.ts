import VerificationEmail from "../../email/verificationEmail";
import { Resend } from 'resend';


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string) {

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log(email, username, verifyCode)
        const { data, error } = await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'FeedBoo || Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        if (error) {
            return Response.json({ error, message: "Error Sending" }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error, message: "Error in Resend config" }, { status: 500 });
    }
}
