import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string()

});