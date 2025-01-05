import { NextApiRequest, NextApiResponse } from "next";
import { sendVerificationEmail } from "../../helpers/sendVerificationEmail";
import dbConnect from "../../lib/dbConnect";
import UserModel, { User } from "../../models/userModel";
import bcrypt from "bcryptjs"



export async function POST(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect()

    try {
        const { email, username, password }: User = await req.body;

        const user = await UserModel.create({
            email, username,
            password: bcrypt.hash(10, password)
        })

        return res.json({
            message: "User Succesfully Created",
            user: user
        })

    } catch (error) {
        console.log("Error in Signing up a user", error)
    }



    // sendVerificationEmail(email, username, verifyCode);
}


