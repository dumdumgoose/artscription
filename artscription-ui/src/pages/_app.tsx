import '../app/globals.css'; // 如果有全局样式，确保路径正确
import { AppProps } from 'next/app';
import { Web3Modal } from "@/context/Web3Modal";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Web3Modal>
            <div className='pt-20'>
                <Navbar />
                <Component {...pageProps} />
                <Footer />
            </div>
        </Web3Modal>);
}

export default MyApp;
