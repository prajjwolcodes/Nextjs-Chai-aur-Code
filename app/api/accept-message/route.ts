import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "../../models/userModel";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !user) {
        return Response.json({
            message: "Error in fetching message acceptance status, no session found"
        })
    }

    const userId = user?._id

    try {
        const existingUser = await UserModel.findById(userId)
        if (!existingUser) {
            return Response.json({
                message: "No user Found"
            })
        }

        return Response.json({
            message: "message acceptance status fetched sucessfully",
            isAcceptingMessage: existingUser.isAcceptingMessage
        })

    } catch (error) {
        console.log("Error in cfetching message acceptance status");
        return Response.json({
            message: error.message || "Error in cfetching message acceptance status"
        })
    }

}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !user) {
        return Response.json({
            message: "Error in updating message acceptance status, no session found"
        })
    }

    const userId = user?._id
    const acceptMessageFlag = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessageFlag,
            new: true
        })

        if (!updatedUser) {
            return Response.json({
                message: "No user Found"
            })
        }

        await updatedUser.save()

        return Response.json({
            message: "message acceptance status fetched sucessfully",
            isAcceptingMessage: updatedUser.isAcceptingMessage,
            updatedUser

        })

    } catch (error) {
        console.log("Error in fetching message acceptance status");
        return Response.json({
            message: error.message || "Error in cfetching message acceptance status"
        })
    }

}