import { NextRequest } from "next/server";
import dbConnect from "../../lib/dbConnect";

export async function POST(req: NextRequest) {
    await dbConnect()
    const { email, password } = await req.json()
    console.log(email, password)

    return Response.json({
        message: "Succesfully Logged In"
    })
}