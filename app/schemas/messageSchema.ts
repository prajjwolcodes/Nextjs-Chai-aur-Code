import { z } from "zod";

export const messageSchema = z.object({
    content: z.string()
        .max(300, "No more than 300")
        .min(10, "No min than 10")

});