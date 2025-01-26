"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "app/schemas/acceptMessageSchema";
import { Message } from "app/models/userModel";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import MessageCard from "@/components/MessageCard";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, Link } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = () => {
    const { data: session, status } = useSession();
    const username = session?.user?.username;
    const [currentMessageStatus, setCurrentMessageStatus] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [profileUrl, setProfileUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined" && username) {
            setProfileUrl(`${window.location.origin}/you/${username}`);
        }
    }, [username]);

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue, handleSubmit } = form;
    const acceptMessages = watch("acceptMessages");

    const fetchIsAcceptingMessageStatus = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const res = await axios.get("/api/accept-message");
            setValue("acceptMessages", res.data.isAcceptingMessage); // Safe in `useEffect`
            setCurrentMessageStatus(res.data.isAcceptingMessage); // Safe in `useEffect`
        } catch (error) {
            console.error("Error while fetching status", error);
            toast.error("Failed to fetch message status.");
        } finally {
            setIsSwitchLoading(false)

        }
    }, [setValue]);

    const fetchMessages = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/get-messages");
            setMessages(res.data.message || []);
        } catch (error) {
            console.error("Error while fetching messages", error);
            toast.error("Failed to fetch messages.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAcceptingMessageStatusChange = async () => {
        setIsLoading(true);
        setIsSwitchLoading(true)

        try {
            const res = await axios.post("/api/accept-message", {
                acceptMessages: !acceptMessages,
            });
            setValue("acceptMessages", !acceptMessages);
            setCurrentMessageStatus(!acceptMessages);
            toast.success("Status updated");
        } catch (error) {
            console.error("Error while changing status", error);
            toast.error("Failed to change status.");
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false)

        }
    };

    const handleDeleteMessage = async (messageid: string) => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageid));
        try {
            const res = await axios.delete(`/api/delete-message/${messageid}`);
            console.log(res.data)
            toast.success(res.data.message);
        } catch (error) {
            console.error("Error while deleting message", error);
            toast.error("Failed to delete message.");
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            toast.success("Profile URL copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy text: ", error);
            toast.error("Failed to copy text.");
        }
    };


    useEffect(() => {
        if (!session || !session.user) return;

        // Fetch message status and messages after the component mounts
        fetchIsAcceptingMessageStatus();
        fetchMessages();
    }, [session, fetchIsAcceptingMessageStatus, fetchMessages]);

    if (!session || !session.user) return <div>Please Login</div>;
    if (status === "loading") return <div>Loading...</div>;
    console.log(messages, "sdadsadas")

    return (
        <div className=" mx-auto p-6 space-y-6">
            <Card className="p-6 shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>

                <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link className="text-blue-500" />
                        <span className="text-gray-700 font-medium">{profileUrl}</span>
                    </div>
                    <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="hover:bg-blue-50"
                    >
                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                    </Button>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <Switch
                        id="message-toggle"
                        checked={acceptMessages}
                        onCheckedChange={handleAcceptingMessageStatusChange}
                        disabled={isSwitchLoading}
                        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
                    />
                    <Label htmlFor="message-toggle" className="text-gray-700">
                        Accept Messages
                    </Label>
                </div>
            </Card>

            <div className="grid grid-cols-3 space-x-4">
                {messages.length > 0 ?
                    messages.map((msg, index) => (
                        <Card key={index} className="p-4 hover:shadow-sm transition-shadow">
                            <MessageCard handleDelete={handleDeleteMessage} message={msg} />
                        </Card>
                    ))
                    :
                    <h1>No messages to display</h1>
                }
            </div>
        </div>
    );
};


export default Page;
