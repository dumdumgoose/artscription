import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {

    const deployArtscription = {
        "p": "art-20",
        "op": "deploy",
        "tick": "arts",
        "max": "21000000",
        "lim": "1000"
    };

    const mintArtscription = {
        "p": "art-20",
        "op": "mint",
        "tick": "arts",
        "amt": "1000"
    };

    const transferArtscription = {
        "p": "art-20",
        "op": "transfer",
        "tick": "arts",
        "amt": "500"
    };

    const scrollToSecondScreen = () => {
        // const secondScreen = document.getElementById("secondScreen");

        // if (secondScreen) {
        //     secondScreen.scrollIntoView({ behavior: "smooth" });
        // }

        const firstScreen = document.getElementById("firstScreen");
        const secondScreen = document.getElementById("secondScreen");

        if (firstScreen && secondScreen) {
            const firstScreenHeight = firstScreen.offsetHeight;

            const secondScreenTop = secondScreen.offsetTop;

            const midpoint = secondScreenTop - (firstScreenHeight / 8);

            window.scrollTo({ top: midpoint, behavior: "smooth" });
        }
    };

    return (
        // <div className="layout-nav border-b border-black relative top-0">
        //         <nav className="h-20 px-24 px-0  m-auto flex justify-between items-center"></nav>
        <main >
            <Navbar />
            <div className="flex flex-col items-center p-0 md:w-[1200px] m-auto">
                <div id="firstScreen" className="flex min-h-screen flex-col items-center justify-center px-4">
                    <div className="relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
                        <p className="text-[48px] text-blod">Inscription in Artela</p>
                        <p className="text-[24px] pt-10">Support decentralized applications based on the indexer ledger architecture</p>
                    </div>
                    <div className="font-mono pt-20">
                        <button onClick={() => scrollToSecondScreen()} className="bg-blue-500 text-white text-[18px] cursor-pointer ml-8 hover:bg-blue-700 duration-200 rounded-lg px-4 py-2">Learn More</button>
                        <button onClick={() => window.location.href='/token'} className="bg-blue-500 text-white text-[18px] cursor-pointer ml-8 hover:bg-blue-700 duration-200 rounded-lg px-4 py-2">Mint Now!</button>
                    </div>
                </div>

                <div id="secondScreen" className="h-auto w-full flex flex-col px-8 mt-0 mb-4 rounded-lg">
                    <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center border-b mb-4">
                        <p className="text-3xl font-bold text-gray-700">Art20 Protocol</p>
                    </div>
                    <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a className="h-auto p-1 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl">
                            <div className="h-60 p-10 text-black text-base whitespace-pre-wrap overflow-auto hover:text-lg">
                                {"data," + JSON.stringify(deployArtscription, null, 2)}
                            </div>
                            <div className="px-10 py-4 bg-gray-200 rounded-lg border">
                                <div className="text-gray-700 font-bold text-base">
                                    Deploy artscription
                                </div>
                                <div className="pt-2 text-gray-800 text-base hover:text-clip">
                                    <p>Deployer: `to` of the transaction</p>
                                    <p className="whitespace-pre-wrap"> </p>
                                </div>
                            </div>
                        </a>
                        <a className="h-auto p-1 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl">
                            <div className="h-60 p-10 text-black text-base whitespace-pre-wrap overflow-auto hover:text-lg">
                                {"data," + JSON.stringify(mintArtscription, null, 2)}
                            </div>
                            <div className="px-10 py-4 bg-gray-200 rounded-lg border">
                                <div className="text-gray-700 font-bold text-base">
                                    Mint artscription
                                </div>
                                <div className="pt-2 text-gray-800 text-base hover:text-clip">
                                    <p>Minter: `to` of the transaction</p>
                                    <p className="whitespace-pre-wrap"> </p>
                                </div>
                            </div>
                        </a>
                        <a className="h-auto p-1 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl">
                            <div className="h-60 p-10 text-black text-base whitespace-pre-wrap overflow-auto hover:text-lg">
                                {"data," + JSON.stringify(transferArtscription, null, 2)}
                            </div>
                            <div className="px-10 py-4 bg-gray-200 rounded-lg border">
                                <div className="text-gray-700 font-bold text-base">
                                    Transfer artscription
                                </div>
                                <div className="pt-2 text-gray-800 text-base truncate hover:text-clip">
                                    <p>Sender: `from` of the transaction</p>
                                    <p>Receiver: `to` of the transaction</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center mb-4">
                        <p className="text-xl text-gray-700">Other Art20 artscriptions are in development. E.g. list.</p>
                    </div>
                </div>

                <div className="h-auto w-full flex flex-col py-8 px-8 mt-4 mb-4 rounded-lg">
                    <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center border-b mb-4">
                        <p className="text-3xl font-bold text-gray-700">Our trip</p>
                    </div>
                    <div className="h-auto w-full text-center flex flex-col py-8 px-8 mt-4 mb-4 border border-gray-200 rounded-lg">
                        <p className="text-3xl font-bold text-gray-700 py-4">Startup</p>
                        <p className="text-xl text-gray-700 font-bold py-2">Startup Artscription at testnet stage in Artela Blockchain</p>
                        <p className="text-xl text-gray-700 py-2">We believe in the potential of the inscription architecture, which is essentially an innovative use of block space, allowing applications to run on decentralized indexer ledgers.</p>
                        <p className="text-xl text-gray-700 py-2">Inscription is still in its early stages. First, there is a lack of incentive mechanism for the indexer to make the off-chain consensus sustainable. Secondly, the lack of decentralization of the indexer makes assets risky. Finally, the indexer lacks scalability, and it is difficult for current applications to customize protocols like smart contracts.</p>
                        <p className="text-xl text-gray-700 py-2">Artela&apos;s Aspect native extension can completely solve the above problems. On the Artela network, in addition to running the L1 consensus, the validator can selectively enable application-customized aspects. In this way, the indexer will be supported by some validators on the Artela network, and it will become an extended part of the L1 consensus! Indexer&apos;s incentives, security, decentralization, and customizability will get rid of the POC stage and truly integrate into the blockchain architecture!</p>
                        <p className="text-xl text-gray-700 py-2">That&apos;s why we launch this exciting inscription project together at the same time as the Artela testnet is launched!</p>
                    </div>

                    <div className="h-auto w-full text-center flex flex-col py-8 px-8 mt-4 mb-4 border border-gray-200 rounded-lg">
                        <p className="text-3xl font-bold text-gray-700 py-4">Artscription Aspect</p>
                        <p className="text-xl text-gray-700 font-bold py-2">Develop a decentralized, secure, programmable Indexer based on Aspect</p>
                        <p className="text-xl text-gray-700 py-2">Based on Aspect, our implementation will achieve: </p>
                        <p className="text-xl text-gray-700 py-2">1 )</p>
                        <p className="text-xl text-gray-700 py-2">Integrate Indexer into Aspect to ensure that enough validators of the Artela network will run Indexer and receive additional token incentives.</p>
                        <p className="text-xl text-gray-700 py-2">2 )</p>
                        <p className="text-xl text-gray-700 py-2">...</p>
                    </div>

                    <div className="h-auto w-full text-center flex flex-col py-8 px-8 mt-4 mb-4 border border-gray-200 rounded-lg">
                        <p className="text-3xl font-bold text-gray-700 py-4">Mapping</p>
                        <p className="text-xl text-gray-700 font-bold py-2">Mapping Arts to Main-net</p>
                        <p className="text-xl text-gray-700 py-2">xxxxxxx </p>
                        <p className="text-xl text-gray-700 py-2">xxxx</p>
                    </div>

                    <div className="h-auto w-full text-center flex flex-col py-8 px-8 mt-4 mb-4 border border-gray-200 rounded-lg">
                        <p className="text-3xl font-bold text-gray-700 py-4">Main-net!</p>
                        <p className="text-xl text-gray-700 font-bold py-2">Mapping Arts to Main-net</p>
                        <p className="text-xl text-gray-700 py-2">xxxxxxx </p>
                        <p className="text-xl text-gray-700 py-2">xxxx</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
