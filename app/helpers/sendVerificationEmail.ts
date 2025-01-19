import VerificationEmail from "../../email/verificationEmail";
import { Resend } from 'resend';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string): Promise<any> {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log(email, username, verifyCode)
        const data = await resend.emails.send({
            from: 'Feedboo <onboarding@resend.dev>',
            to: email,
            subject: 'FeedBoo || Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        console.log(data)

        return { message: "Email Succesfully sent" }
    } catch (error) {
        return { message: "Fail in Sending email" }
    }
}
