import { NextRequest } from "next/server";
import dbConnect from "../../lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "../../schemas/signUpSchema";
import UserModel from "../../models/userModel";

const usernameSchema = z.object({
    username: usernameValidation
})

export async function GET(req: NextRequest) {
    await dbConnect()

    try {
        const { searchParams } = new URL(req.url)
        const params = {
            username: searchParams.get("username")
        }

        // validate with zod 
        const result = usernameSchema.safeParse(params)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                message: usernameErrors[0] || "Invalid Query Parameter"
            })
        }

        const { username } = result.data
        const existingUser = await UserModel.findOne({ username, isVerfied: true })
        if (existingUser)
            return Response.json({
                message: "Username is already taken",
                proceed: false
            })

        return Response.json({
            message: "Username is unique",
            proceed: true
        })

    } catch (error) {
        console.log("Error in checking unique username");
        return Response.json({
            message: error.message
        })
    }
}