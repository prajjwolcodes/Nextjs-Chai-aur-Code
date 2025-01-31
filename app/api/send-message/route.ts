import { NextRequest } from "next/server";
import dbConnect from "../../lib/dbConnect";
import UserModel, { Message } from "../../models/userModel";

export async function POST(req: NextRequest) {
    await dbConnect()

    try {
        const { content, username } = await req.json()
        const user = await UserModel.findOne({ username })

        if (!user)
            return Response.json({
                message: "No user Found"
            })

        if (!user.isAcceptingMessage)
            return Response.json({
                message: "User is not accepting messages right now",
                proceed: false
            })

        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            message: "Message Succesfully send",
            proceed: true
        })

    } catch (error) {
        console.log("Error in Sending messages");
        return Response.json({
            message: error.message || "Error in Sending message"
        })
    }
}