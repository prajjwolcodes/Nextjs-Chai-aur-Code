// RESEND FUNCTIONALITY LEFT
// USED SAME SHADCN FORM AS SIGNUP

'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

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
import { Button } from "@/components/ui/button"
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from 'app/schemas/verifySchema'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Mail } from 'lucide-react'

const page = () => {
  const params = useParams()
  const { username } = params
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)


  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: ""
    }
  })

  async function onSubmit(data: z.infer<typeof verifySchema>) {
    setIsLoading(true)
    try {
      const res = await axios.post("/api/verify-code", {
        username, otp: data.otp
      })
      if (res.data.proceed) {
        toast.success(res.data.message)
        router.replace('/signin')
      }
      else
        toast.error(res.data.message)
    } catch (error) {
      console.log("Error in verifying OTP", error)

    } finally {
      setIsLoading(false)

    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          {/* Header Section */}
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verify your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a verification code to your email address
            </p>
          </div>

          {/* Form Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Enter your verification code
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="appearance-none text-center text-lg tracking-[0.3em] font-mono rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="00000"
                          maxLength={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </div>
            </form>
          </Form>

          {/* Footer Help Text */}
          <p className="mt-4 text-center text-xs text-gray-500">
            Please check your spam folder if you don't see the email in your inbox
          </p>
        </div>
      </div>

    </>
  )
}

export default page