import Navbar from '../components/Navbar';

export default function Home() {

    const deployArtscription = {
        "p": "art-20",
        "op": "deploy",
        "tick": "wave1",
        "max": "21000000",
        "lim": "1000"
    };

    const mintArtscription = {
        "p": "art-20",
        "op": "mint",
        "tick": "wave1",
        "amt": "1000"
    };

    const transferArtscription = {
        "p": "art-20",
        "op": "transfer",
        "tick": "wave1",
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
        <main>
            <Navbar/>
            <div className="flex flex-col items-center p-0 md:w-[1200px] m-auto">
                <div id="firstScreen" className="flex min-h-screen flex-col items-center justify-center px-4">
                    <div
                        className="relative flex flex-col place-items-center text-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
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
                            <div
                                className="h-60 p-10 text-black text-base whitespace-pre-wrap overflow-auto hover:text-lg">
                                {"data," + JSON.stringify(deployArtscription, null, 2)}
                            </div>
                            <div className="px-10 py-4 bg-gray-200 rounded-lg border">
                                <div className="text-gray-700 font-bold text-base">
                                    Deploy inscription
                                </div>
                                <div className="pt-2 text-gray-800 text-base hover:text-clip">
                                    <p>Deployer: `to` of the transaction</p>
                                    <p className="whitespace-pre-wrap"> </p>
                                </div>
                            </div>
                        </a>
                        <a className="h-auto p-1 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl">
                            <div
                                className="h-60 p-10 text-black text-base whitespace-pre-wrap overflow-auto hover:text-lg">
                                {"data," + JSON.stringify(mintArtscription, null, 2)}
                            </div>
                            <div className="px-10 py-4 bg-gray-200 rounded-lg border">
                                <div className="text-gray-700 font-bold text-base">
                                    Mint inscription
                                </div>
                                <div className="pt-2 text-gray-800 text-base hover:text-clip">
                                    <p>Minter: `to` of the transaction</p>
                                    <p className="whitespace-pre-wrap"> </p>
                                </div>
                            </div>
                        </a>
                        <a className="h-auto p-1 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl">
                            <div
                                className="h-60 p-10 text-black text-base whitespace-pre-wrap overflow-auto hover:text-lg">
                                {"data," + JSON.stringify(transferArtscription, null, 2)}
                            </div>
                            <div className="px-10 py-4 bg-gray-200 rounded-lg border">
                                <div className="text-gray-700 font-bold text-base">
                                    Transfer inscription
                                </div>
                                <div className="pt-2 text-gray-800 text-base truncate hover:text-clip">
                                    <p>Sender: `from` of the transaction</p>
                                    <p>Receiver: `to` of the transaction</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center mb-4">
                        <p className="text-xl text-gray-700">More to come...</p>
                    </div>
                </div>

                <div className="h-auto w-full flex flex-col py-8 px-8 mt-4 mb-4 rounded-lg">
                    <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center border-b mb-4">
                        <p className="text-3xl font-bold text-gray-700">Our trip</p>
                    </div>
                    <div
                        className="h-auto w-full text-center flex flex-col py-8 px-8 mt-4 mb-4 border border-gray-200 rounded-lg">
                        <p className="text-3xl font-bold text-gray-700 py-4">About Artscription</p>
                        <p className="text-xl text-gray-700 font-bold py-2">About Artscription at testnet stage in
                            Artela Blockchain</p>
                        <p className="text-xl text-gray-700 py-2">Artscription is the first inscription project in
                            Artela Blockchain, utilizing its unique Aspect programming to realize on-chain indexer and
                            unlock composability and programmability for inscription. We have great faith in the
                            prospects of this innovative inscription architecture and believe that it will unlock a new
                            paradigm for on-chain programming.</p>
                        <p className="text-xl text-gray-700 py-2">However, Inscription is now still in its early stages.
                            Indexers, as the core of the entire inscription architecture, are currently operating mostly
                            off-chain, centralized, and without incentives. In the long run, this poses significant
                            risks to the inscription ecosystem. Also, current mainstream indexer solutions are
                            unscalable, which makes it nearly impossible to support complex application scenarios or
                            interact with the existing decentralized ecosystem.</p>
                        <p className="text-xl text-gray-700 py-2">That&apos;s why we are launching this exciting inscription
                            project at this early stage with Artela team, stay tuned and the mint will be open very
                            soon!</p>
                    </div>

                    <div
                        className="h-auto w-full text-center flex flex-col py-8 px-8 mt-4 mb-4 border border-gray-200 rounded-lg">
                        <p className="text-3xl font-bold text-gray-700 py-4">Inscriptoin x Aspect</p>
                        <p className="text-xl text-gray-700 font-bold py-2">Develop a decentralized, secure,
                            programmable Indexer based on Aspect</p>
                        <p className="text-xl text-gray-700 py-2">We believe Artela&apos;s unique Aspect design is the right
                            answer for the above challenges. The simplest way to put Aspect is the extension modules
                            that can be customized to co-work with EVM for more computation power and new on-chain
                            functionalities. This makes Aspect a perfect container for achieving an on-chain
                            indexer.</p>
                        <p className="text-xl text-gray-700 py-2">Supported by Aspect, the Indexer of Artscritption will
                            become an extended part of Artela&apos;s network, which will make Artscription the
                            next-generation &quot;smart&quot; inscription that is well-incentivized, secure, decentralized, and
                            capable of interoperating with smart contracts and realizing more scenarios.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
