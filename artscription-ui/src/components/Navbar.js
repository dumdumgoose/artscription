"use client"

// components/Navbar.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { FaTwitter, FaTelegram } from 'react-icons/fa';

export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const router = useRouter();
    const [activeLink, setActiveLink] = useState('/');

    useEffect(() => {
        setActiveLink(router.pathname);
    }, [router.pathname]);

    return (
        <div className="fixed w-full top-0 border-b border-gray-200 bg-white z-50">
            <div className="flex flex-col w-full items-center p-0 mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-lg">
                <nav className="h-20 w-full flex justify-between items-center">
                    <Link href="/"
                          className="text-lg md:text-xl lg:text-2xl text-slate-500">ARTSCRIPTION</Link>
                    <div className="hidden md:flex text-gray-500">
                        <Link href="/artscriptions"
                              className={ `font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer mr-4 ${ activeLink === '/artscriptions' ? 'text-blue-600' : '' }` }>Collections</Link>
                        <Link href="/token"
                              className={ `font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer mr-4 ${ activeLink === '/token' ? 'text-blue-600' : '' }` }>Token</Link>
                        <Link href="/marketplace"
                              className={ `font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer mr-4 ${ activeLink === '/marketplace' ? 'text-blue-600' : '' }` }>Marketplace</Link>
                    </div>
                    <div className="hidden md:flex text-gray-500">
                        <Link href="https://twitter.com/Art_inscription" className='link-style'><FaTwitter
                          className='link-icon'/></Link>
                        <Link href="" className='link-disabled'><FaTelegram
                          className='link-icon'/></Link>
                    </div>
                    <ConnectButton/>
                </nav>
            </div>
        </div>
);

}
