"use client"

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
    MessageSquareMore,
    Wand2,
    Send,
    Sparkles
} from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { messageSchema } from 'app/schemas/messageSchema'

const Page = () => {
    const { username } = useParams()
    const [response, setResponse] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: "" },
    })

    const handleFeedbackClick = (message: string) => {
        form.setValue('content', message)
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`/api/huggingface?t=${Date.now()}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
                },
            })
            setResponse(res.data.message)
        } catch (error) {
            console.error("Error fetching AI response:", error)
        } finally {
            setLoading(false)
        }
    }

    async function onSubmit(data: z.infer<typeof messageSchema>) {
        try {
            const res = await axios.post("/api/send-message", {
                content: data.content,
                username
            })

            res.data.proceed
                ? toast.success(res.data.message)
                : toast.error(res.data.message)

            form.reset()
        } catch (error) {
            console.log("Error in sending the message", error)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquareMore className="text-blue-500" />
                        Anonymous Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Sparkles className="text-purple-500" />
                                            Your Message
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Write your anonymous message"
                                                {...field}
                                                className="focus:ring-2 focus:ring-blue-300"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between items-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className="flex items-center gap-2"
                                            >
                                                <Wand2 className="w-4 h-4" />
                                                {loading ? "Generating..." : "AI Suggestions"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Generate AI-powered feedback suggestions
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <Button
                                    type="submit"
                                    className="flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {response.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Sparkles className="text-purple-500" />
                        AI Generated Suggestions
                    </h3>
                    {response.map((message, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg"
                        >
                            <button
                                onClick={() => handleFeedbackClick(message)}
                                className="w-full text-left p-3 text-sm text-gray-800 hover:text-blue-600"
                            >
                                {message}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Page