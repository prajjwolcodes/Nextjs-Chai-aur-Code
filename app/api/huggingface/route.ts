import { HfInference } from "@huggingface/inference";
import { NextRequest } from "next/server";

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {

    const { text } = await req.json();
    console.log(text);

    if (!text) {
        return Response.json({ error: "Text input is required" });
    }

    try {
        // Use a Hugging Face text generation model
        const result = await hf.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
                {
                    role: "user",
                    content: text,
                },
            ],
            max_tokens: 1000,
        });

        return Response.json({ message: result.choices[0].message.content });
    } catch (error) {
        console.error("Error communicating with Hugging Face:", error);
        return Response.json({ error: "Failed to fetch AI response" });
    }
}



// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";
// import { parse } from "url";
// import { HfInference } from "@huggingface/inference";

// export async function POST(request: NextRequest) {
//     const inference = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);
//     const { query } = parse(request.url, true);
//     const type = query.type;

//     const formData = await request.formData();

//     try {
//         //chat completion
//         if (type == "comp") {
//             let message = formData.get("message");

//             const out = await inference.chatCompletion({
//                 model: "mistralai/Mistral-7B-Instruct-v0.2",
//                 messages: [
//                     {
//                         role: "user",
//                         content: message,
//                     },
//                 ],
//                 max_tokens: 1000,
//             });

//             console.log(out.choices[0].message);

//             return NextResponse.json(
//                 { message: out.choices[0].message },
//                 { status: 200 }
//             );
//         } //chat completion  ending

//         //translation
//         if (type == "translation") {
//             const text = formData.get("text");

//             const out = await inference.translation({
//                 model: "t5-base",
//                 inputs: text,
//             });

//             console.log(out);
//             return NextResponse.json({ message: out }, { status: 200 });
//         } //translation ending

//         if (type == "imgtt") {
//             const imageBlob = formData.get("image");

//             if (!imageBlob) {
//                 throw new Error("No image file found in the request");
//             }

//             const out = await inference.imageToText({
//                 data: imageBlob,
//                 model: "nlpconnect/vit-gpt2-image-captioning",
//             });

//             console.log(out);

//             return NextResponse.json({ message: out }, { status: 200 });
//         }

//         if (type == "ttimg") {
//             const prompt = formData.get("prompt");

//             const out = await inference.textToImage({
//                 model: "stabilityai/stable-diffusion-xl-base-1.0",
//                 inputs: prompt,
//                 parameters: {
//                     negative_prompt: "blurry",
//                 },
//             });

//             console.log(out);

//             const buffer = Buffer.from(await out.arrayBuffer());

//             const imagePath = path.join(
//                 process.cwd(),
//                 "public",
//                 "images",
//                 "generated-image.jpg"
//             );

//             await fs.writeFile(imagePath, buffer);

//             const baseUrl = "http://localhost:3000";
//             const imageUrl = `${baseUrl}/images/generated-image.jpg`;

//             return NextResponse.json({ message: imageUrl }, { status: 200 });


//         }
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: error }, { status: 500 });
//     }
// }


