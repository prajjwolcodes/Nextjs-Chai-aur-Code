'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from 'app/schemas/messageSchema'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'

const page = () => {
    const { username } = useParams()
    const [accepttanceStatus, setAccepttanceStatus] = useState<boolean>()
    const [response, setResponse] = useState<string[]>([]);
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    })

    const handleFeedbackClick = (message: string) => {
        // Set the form value to the clicked feedback message
        form.setValue('content', message);
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`/api/huggingface?t=${Date.now()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`, // Replace with your Hugging Face API key
                    },
                }
            );
            setResponse(res.data.message);
        } catch (error) {
            console.error("Error fetching AI response:", error);
        } finally {
            setLoading(false)
        }

    };


    async function onSubmit(data: z.infer<typeof messageSchema>) {
        try {
            const res = await axios.post("/api/send-message", { content: data.content, username })
            if (!res.data.proceed) {
                setAccepttanceStatus(false)
                toast.error(res.data.message)
            }
            else {
                setAccepttanceStatus(true)
                toast.success(res.data.message)
                form.reset()
            }

        } catch (error) {
            console.log("Error in sending the message", error)
        }

    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Anonymous Message</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your anonymous message" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold">Your AI friend to suggest feedbacks for me</h1>

                <button
                    className={`px-4 py-2 text-white ${loading ? "bg-blue-200" : "bg-blue-500"} rounded-lg`}
                    onClick={handleSubmit}
                    disabled={loading}
                >  Generate Feedback

                </button>
                {response.length !== 0 &&
                    (
                        response.map((message, index) => (
                            <div
                                key={index}
                                className="p-1 bg-gray-100 rounded-md"
                            >
                                <button onClick={() => handleFeedbackClick(message)}>
                                    {message}

                                </button>
                            </div>
                        ))
                    )}
            </div>
        </>
    )
}

export default page

