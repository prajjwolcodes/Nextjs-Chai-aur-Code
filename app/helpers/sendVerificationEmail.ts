import resend from "../lib/resend";
import VerificationEmail from "../../email/verificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'FeedBoo || Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
    } catch (error) {
        console.log("Error while sending verification code", error)
    }

}
