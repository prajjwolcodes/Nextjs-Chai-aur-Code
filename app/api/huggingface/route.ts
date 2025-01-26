import { HfInference } from "@huggingface/inference";
import { NextRequest } from "next/server";

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {


    try {
        // Use a Hugging Face text generation model
        const feedbackPrompt = `Generate 4 unique, professional, and positive feedback messages with no more than eight words.  
    Do not number the messages.Ensure each message is distinct. Format each message on a new line, `;

        const out = await hf.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
                {
                    role: "system",
                    content: "You are an AI that generates unique, professional feedback messages."
                },
                {
                    role: "user",
                    content: feedbackPrompt
                }
            ],
            max_tokens: 300
        });

        // More robust parsing to extract unique messages
        const rawFeedback = out.choices[0].message.content;
        const messages = rawFeedback
            .split('\n')
            .filter(msg => msg.trim().length > 10 && !msg.includes('Generated'))
            .map(msg => msg.replace(/^[*•-]\s*/, '').trim())
            .filter((msg, index, self) =>
                self.findIndex(m => m === msg) === index
            )
            .slice(0, 4);


        return Response.json({ message: messages });
    } catch (error) {
        console.error("Error communicating with Hugging Face:", error);
        return Response.json({ error: "Failed to fetch AI response" });
    }
}



