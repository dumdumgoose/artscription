import '@/ui/globals.css';
import { Web3Modal } from '@/context/Web3Modal';
import Navbar from '@/components/Navbar';

import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body>
        <Web3Modal>
          <div className="flex flex-col min-h-screen">
            <Navbar></Navbar>
            <div className='mt-20'>
              {children}
            </div>
          </div>
        </Web3Modal>
      </body>
    </html>
  );
}
