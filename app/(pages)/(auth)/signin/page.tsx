'use client'

import { signUpSchema } from 'app/schemas/signUpSchema'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounceCallback } from 'usehooks-ts'
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { z } from 'zod'
import toast from 'react-hot-toast';
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
import Link from 'next/link'
import { signInSchema } from 'app/schemas/signInSchema'
import { signIn, useSession } from 'next-auth/react'

const page = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const user = session?.user

    if (user)
        router.replace("/dashboard")
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        setIsLoading(true)
        console.log(data);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password
            })
            if (res.ok) {
                toast.success("Succesfully Logged in")
                router.replace("/dashboard")
            }

            if (res.error)
                toast.error("Invalid Credentials")
        } catch (error) {
            console.log("Error while signing in", error);
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>

                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}

                            </Button>
                        </div>
                        <p className="text-center text-sm">
                            Dont have an account?{' '}
                            <Link
                                href="/signup"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page