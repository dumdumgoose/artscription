import '@/ui/globals.css';
import { Web3Modal } from '@/context/Web3Modal';
import Navbar from '@/components/Navbar';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
