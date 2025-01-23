'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Message } from "app/models/userModel"
import toast from "react-hot-toast"

type messageCardProps = {
    message: Message
}

const MessageCard = ({ message }: messageCardProps) => {
    async function handleDelete(params) {
        try {
            const res = await axios.delete(`/api/delete-message/${message?._id}`)
            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in deleting message", error);
            toast.error("Error deleting the message");



        }

    }
    return (


        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
            <Card className="border-none">
                <CardHeader className="bg-gray-50 p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-800">Feedback Details</CardTitle>
                            <CardDescription className="text-gray-500 mt-2">Review and manage your submitted feedback</CardDescription>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-bold text-gray-800">Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-600">
                                        This action cannot be undone. This will permanently delete your feedback and remove all associated data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex space-x-4">
                                    <AlertDialogCancel className="border-gray-300 hover:bg-gray-100">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="bg-gray-100 rounded-lg p-4">
                        <p className="text-gray-700">Your feedback helps us improve our services and understand your experience.</p>
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}

export default MessageCard