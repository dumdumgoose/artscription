"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Footer() {

    const router = useRouter();
    const [activeLink, setActiveLink] = useState('/');

    useEffect(() => {
        setActiveLink(router.pathname);
    }, [router.pathname]);

    return (
        <div className="w-full h-20 mt-20 border-t border-gray-200 bg-white z-50">
            <div className="flex flex-col w-full items-center p-0 md:w-[1200px] m-auto py-[40px]">
                Follow us!
            </div>
        </div>
    );
}