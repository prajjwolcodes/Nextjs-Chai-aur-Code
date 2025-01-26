import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "../../models/userModel";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !user) {
        return Response.json({
            message: "Error in fetching messages, no session found"
        })
    }

    const userId = new mongoose.Types.ObjectId(user?._id)

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } }, // $$$$$ left here
            { $group: { _id: '$_id', messages: { $push: "$messages" } } }
        ])
        if (!user || user.length === 0) {
            return Response.json({
                message: "No User Found"
            })
        }

        return Response.json({
            message: user[0].messages
        })

    } catch (error) {
        console.log("Error in fetching messages");
        return Response.json({
            message: error.message || "Error in fetching message"
        })
    }
}