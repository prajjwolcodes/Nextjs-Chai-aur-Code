import { z } from "zod";

export const verifySchema = z.object({
    verifyCode: z.string()
        .length(5, "Verification Code must be 5 letters")
})
