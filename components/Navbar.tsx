
'use client'

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Navbar = () => {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { data: session } = useSession()
    const user = session?.user
    const handleAuth = async () => {
        if (user) {
            await signOut()
        } else {
            router.replace("/signin")
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Website Name */}
                <div className="text-2xl font-bold text-gray-800">
                    FeedBoo, <span className='text-sm pt-4 font-normal text-gray-500 '> {user?.username}</span>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Navigation Links and Login Button */}
                <div className={`
          fixed inset-0 bg-white z-50 flex flex-col 
          md:static md:flex-row md:bg-transparent md:z-auto 
          items-center justify-end 
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
        `}>
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition duration-300">Home</Link>
                        <Link href={`/you/${user ? user?.username : "guest"}`} className="text-gray-700 hover:text-blue-600 transition duration-300">You</Link>
                        <Link href={`/dashboard`} className="text-gray-700 hover:text-blue-600 transition duration-300">Dashboard</Link>

                        <button
                            onClick={handleAuth}
                            className={`
                px-4 py-2 rounded-full transition duration-300 
                ${user
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }
              `}
                        >
                            {user ? 'Logout' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;