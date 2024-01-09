"use client"

// components/Navbar.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

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
                    <Link href="/" className="text-lg md:text-xl lg:text-2xl text-slate-500 text-blue-600">ARTSCRIPTION</Link>
                    {/*<div className="hidden md:flex text-gray-500">*/}
                    {/*    <Link href="/artscriptions" className={`font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer mr-4 ${activeLink === '/artscriptions' ? 'text-blue-600' : ''}`}>Artscriptions</Link>*/}
                    {/*    <Link href="/token" className={`font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer mr-4 ${activeLink === '/token' ? 'text-blue-600' : ''}`}>Token</Link>*/}
                    {/*    <Link href="/marketplace" className={`font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer mr-4 ${activeLink === '/marketplace' ? 'text-blue-600' : ''}`}>Marketplace</Link>*/}
                    {/*</div>*/}
                    <ConnectButton />
                    <button className="md:hidden text-4xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>=</button>
                </nav>
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-md py-2 md:hidden">
                        <Link href="/artscriptions" className={`block py-2 text-center font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer ${activeLink === '/artscriptions' ? 'text-blue-600' : ''}`}>Artscriptions</Link>
                        <Link href="/token" className={`block py-2 text-center font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer ${activeLink === '/token' ? 'text-blue-600' : ''}`}>Token</Link>
                        <Link href="/marketplace" className={`block py-2 text-center font-bold hover:text-blue-600 text-sm md:text-base cursor-pointer ${activeLink === '/marketplace' ? 'text-blue-600' : ''}`}>Marketplace</Link>
                    </div>
                )}
            </div>
        </div>
    );

}
