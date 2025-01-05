import { NextApiRequest, NextApiResponse } from "next";
import { sendVerificationEmail } from "../../helpers/sendVerificationEmail";

interface SignupRequestBody {
    email: string,
    username: string;
    verifyCode: string;
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { email, username, verifyCode }: SignupRequestBody = await req.body;
    sendVerificationEmail(email, username, verifyCode);
}