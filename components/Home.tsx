'use client'

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import Navbar from './Navbar';
import Link from 'next/link';

const HomePage = () => {
    const { data: session } = useSession()
    const user = session?.user
    return (
        <>
            <Navbar />
            <div className="max-w-2xl mx-auto">
                <Card className="p-6 shadow-lg text-center">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">
                        Welcome, {user?.username}
                    </h1>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-blue-800 mb-3">
                            Your personal communication hub is ready!
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href='/dashboard'>
                                <Button variant="outline">
                                    View Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>


            </div>
        </>
    );
};

export default HomePage;