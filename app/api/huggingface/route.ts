import { HfInference } from "@huggingface/inference";
import { NextRequest } from "next/server";

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
    console.log(hf, "asdjkadhjkasd");

    const { text } = await req.json();

    if (!text) {
        return Response.json({ error: "Text input is required" });
    }

    try {
        // Use a Hugging Face text generation model
        const result = await hf.textGeneration({
            model: "EleutherAI/gpt-neo-1.3B", // You can replace this with another model, e.g., "EleutherAI/gpt-neo-1.3B"
            inputs: text,
        });

        return Response.json({ result });
    } catch (error) {
        console.error("Error communicating with Hugging Face:", error);
        return Response.json({ error: "Failed to fetch AI response" });
    }
}
