//For the implementation of other providers:
// Google:

// GoogleProvider({
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET
//   })

// get the clientId and client Secret from google cloud console.
// 1. Open the project
// 2. Go to api and services -- Oauth consent screen -- fill all the details -- save
// 3. Come back to credentials.
// 4. Create Oauth clientId -- leave all as it is and add Authorized redirect URIs as "http://localhost:3000/api/auth/callback/google"
// 5. Call the signIn("google") function in client side (no await needed).


import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../models/userModel";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "prajjwol@gmail.com" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any, req): Promise<any> {
                await dbConnect()

                try {
                    const user = await UserModel.findOne({ email: credentials.email })
                    if (!user)
                        throw new Error("User doesnot exist with this email")
                    if (!user.isVerfied)
                        throw new Error("Verify your account before login")
                    console.log(credentials, user.password);
                    const isPasswordCorrect = bcrypt.compareSync(credentials.password, user.password)
                    if (!isPasswordCorrect)
                        throw new Error("Incorrect Password")
                    else
                        return user
                } catch (error) {
                    throw new Error(error)
                }


            }
        })

    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string
                session.user.isVerified = token.isVerified as boolean
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
                session.user.username = token.username as string
            }

            return session
        },
    },
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET_KEY
}
