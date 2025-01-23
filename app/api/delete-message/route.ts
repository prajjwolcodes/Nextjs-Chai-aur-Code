import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "app/models/userModel";
import dbConnect from "app/lib/dbConnect";

export async function DELETE(req: NextRequest, { params }: { params: { messageid: string } }) {
    await dbConnect()
    const { messageid } = params
    const session = await getServerSession(authOptions)

    const user = session?.user

    if (!session || !user) {
        return Response.json({
            message: "Error in deleting feedback, no session found"
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

        const updatedUserMessageBox = UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }

        )


        return Response.json({
            message: "Feedback Message Successfully Deleted",
            updatedUserMessageBox
        })

    } catch (error) {
        console.log("Error in deleting feedback message");
        return Response.json({
            message: error.message || "Error in deleting feedback message"
        })
    }


}