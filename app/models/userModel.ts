import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }
});


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerfied: boolean
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean
    messages: Message[];
}

const userSchema: Schema<User> = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true },
    verifyCode: { type: String, required: true },
    isVerfied: { type: Boolean, default: false },
    verifyCodeExpiry: { type: Date, required: true },
    isAcceptingMessage: { type: Boolean, default: true },
    messages: [messageSchema]
});

// const Message = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model("Message", messageSchema)
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel

