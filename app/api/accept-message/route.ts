import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "../../models/userModel";
import dbConnect from "app/lib/dbConnect";

export async function GET(req: NextRequest) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !user) {
        return Response.json({
            message: "Error in fetching message acceptance status, no session found"
        })
    }

    const userId = user?._id

    try {
        console.log(userId, "SDSDDSD");
        const existingUser = await UserModel.findOne({ _id: userId })
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
        console.log("Error in fetching message acceptance status", error);
        return Response.json({
            message: error.message || "Error in fetching message acceptance status"
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
    const { acceptMessages } = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessages,
            new: true
        })

        if (!updatedUser) {
            return Response.json({
                message: "No user Found"
            })
        }

        await updatedUser.save()

        return Response.json({
            message: "message acceptance status changed sucessfully",
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