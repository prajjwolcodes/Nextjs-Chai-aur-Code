import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(3, { message: "Must be 3 or more characters long" })
    .max(15, { message: "Must be 15 or less characters long" })


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string()
        .min(8, { message: "Must be 3 or more characters long" })
        .max(15, { message: "Must be 15 or less characters long" })
});