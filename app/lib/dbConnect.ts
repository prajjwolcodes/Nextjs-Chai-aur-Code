import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("DB is already Connected")
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || "")
        console.log("DB Connected")
    } catch (error) {
        console.log("ERROR in DB CONNECTION", error)
        process.exit(1)
    }
}

export default dbConnect;