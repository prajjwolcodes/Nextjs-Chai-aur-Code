import { sendVerificationEmail } from "../../helpers/sendVerificationEmail";
import dbConnect from "../../lib/dbConnect";
import UserModel, { User } from "../../models/userModel";
import bcrypt from "bcryptjs"
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect()
    try {
        const { email, username, password } = await req.json();
        const existingUserByEmail = await UserModel.findOne({ email })

        if (existingUserByEmail)
            return Response.json({
                message: "This email is already taken"
            })

        const existingUserByUsername = await UserModel.findOne({ username, isVerfied: true })
        if (existingUserByUsername)
            return Response.json({
                message: "This username is already taken"
            }, {
                status: 400
            })

        console.log(email, username, password)

        const verifyCode = (Math.floor(Math.random() * 900000) + 100000).toString()
        const verifyCodeExpiry = new Date()
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)
        const hashedPassword = bcrypt.hashSync(password, 10)

        const newUser = new UserModel({
            email, username,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry,
            messages: []

        })

        await newUser.save()

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        console.log(emailResponse)


        return Response.json({
            message: "User Succesfully Created, Please verify your Email",
            user: newUser
        })


    } catch (error) {
        console.error("Error in Signing up a user", error);
        return Response.json({
            message: "Internal Server Error",
            error: error.message,
        });
    }

}


export async function GET(req: NextRequest) {
    const users = await UserModel.find()
    return Response.json({ users })


}