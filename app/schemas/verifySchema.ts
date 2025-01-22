import { z } from "zod";

export const verifySchema = z.object({
    otp: z.string()
        .length(5, "Verification Code must be 5 letters")
})
