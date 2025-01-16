interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <div className="font-sans max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Email Verification</h2>
      <p className="mt-4 text-lg text-gray-600">
        Hi <span className="font-semibold">{username}</span>,
      </p>
      <p className="mt-2 text-gray-600">
        Thank you for signing up! Please use the following OTP (One-Time Password) to verify your email:
      </p>
      <div className="mt-4 text-xl font-bold text-green-600 text-center bg-green-50 border border-green-300 rounded-md py-2">
        {otp}
      </div>
      <p className="mt-4 text-gray-600">
        The OTP is valid for the next 1 hour. If you didn’t request this email, you can safely ignore it.
      </p>
      <p className="mt-6 text-gray-600">
        Regards, <br />
        <span className="font-semibold">Your Company Team</span>
      </p>
      <footer className="mt-6 text-sm text-gray-500 text-center border-t border-gray-300 pt-4">
        This is an automated email. Please do not reply.
      </footer>
    </div>
  );
}
