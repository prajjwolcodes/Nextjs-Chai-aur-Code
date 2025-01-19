import { NextRequest } from "next/server";
import UserModel from "../../models/userModel";

export async function POST(req: NextRequest) {
    try {
        const { otp, username } = await req.json()
        const decodedUsername = decodeURIComponent(username)  // changes space into %20 and more for easing database quering
        const existingUser = await UserModel.findOne({ username })
        if (!existingUser) {
            return Response.json({
                message: "No user exists with that username",
                proceed: false
            })
        }

        const isOtpExpired = new Date(existingUser.verifyCodeExpiry) < new Date()

        if (!isOtpExpired) {
            return Response.json({
                message: "OTP is already Expired please sign in again yo g",
                proceed: false
            })
        }

        if (otp !== existingUser.verifyCode) {
            return Response.json({
                message: "OTP did not match",
                proceed: false
            })
        }

        existingUser.isVerfied = true
        await existingUser.save()

        return Response.json({
            message: "OTP matched you are now verified",
            proceed: true
        })

    } catch (error) {
        console.log("Error in verifying OTP");
        return Response.json({
            message: error.message || "Error in verifying OTP"
        })
    }
}