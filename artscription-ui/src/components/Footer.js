"use client"

import Link from 'next/link';
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
                <p> 👉
                    <Link href='https://twitter.com/artela_network' style={{ color: 'blue', textDecoration: 'underline' }}> Follow us on Twitter!</Link>
                </p>
            </div>
        </div>
    );
}
