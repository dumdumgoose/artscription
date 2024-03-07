'use client'
import SketchMap from "./components/SketchMap";
import Card from "./components/Card";
import Link from 'next/link';
import React, { useRef } from 'react';
export default function Home() {
    const secondScreenRef = useRef<HTMLDivElement>(null);
    const scrollToSecondScreen = (): void => {
        const navbarHeight: number = 105;

        if (secondScreenRef.current) {
            const secondScreenPosition = secondScreenRef.current.offsetTop;
            window.scrollTo({
                top: secondScreenPosition - navbarHeight, // 减去Navbar的高度以避免遮挡
                behavior: 'smooth',
            });
        }
    };
    return (
        <main>
            <div className="flex flex-col gap-12 items-center p-4 md:w-[1200px] m-auto overflow-hidden">
                <div className="flex min-h-screen flex-col items-center justify-center px-0">
                    <div
                        className="relative flex flex-col place-items-center text-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
                        <p className="text-[48px] text-blod">Layer Inscription</p>
                        <p className="text-[24px] pt-10">Offload execution workload from Layer 1 and provide the productive execution
                            sublayer for inscription-based decentralized applications.</p>
                    </div>
                    <div className="font-mono pt-20">
                        <button onClick={scrollToSecondScreen} className="bg-blue-500 text-white text-[18px] cursor-pointer ml-8 hover:bg-blue-700 duration-200 rounded-lg px-4 py-2">Learn More</button>
                        <Link
                            href="/token">
                            <button className="bg-blue-500 text-white text-[18px] cursor-pointer ml-8 hover:bg-blue-700 duration-200 rounded-lg px-4 py-2">Mint Now!</button>
                        </Link>
                    </div>
                </div>
                <div ref={secondScreenRef}>
                    <SketchMap />
                </div>

                <div className="flex flex-col items-center px-4 md:w-[1200px] m-auto">
                    <div className="flex flex-col items-center justify-center  bg-white p-4">
                        <h1 className="text-3xl font-bold text-gray-700 mb-4">Features</h1>
                        <p className="w-4/5 text-md text-center">
                            Make Inscription productive: decentralized, secure, programmable
                        </p>
                        <hr className="w-full border-t mt-4 mb-8" />
                        <div className="flex flex-col sm:flex-row justify-center gap-12 sm:gap-20" >
                            <div className="flex flex-col flex-1">
                                <Card disabled={true} title="Shared Security" className="flex flex-col flex-grow">
                                    <div className="pl-4 pr-2 flex flex-col gap-4 text-md flex-grow">
                                        <p>Indexers stake $ARTS in Layer 1 to offer layer inscription security.</p>
                                        <p>Indexers periodically synchronize world states.</p>
                                        <p>Slashing happens if the indexer offers the wrong state.</p>
                                    </div>
                                </Card>
                            </div>
                            <div className="flex flex-col flex-1">
                                <Card disabled={true} title="Smart Inscription" className="flex flex-col flex-grow">
                                    <div className="pl-4 pr-2 flex flex-col gap-4 text-md flex-grow">
                                        <p>Inscriptions trigger smart contracts execution in Layer Inscription.</p>
                                        <p>Inscription contracts are no longer limited to the traditional EVM execution environment, they can customize a more flexible execution environment.</p>
                                    </div>
                                </Card>
                            </div>
                            <div className="flex flex-col flex-1">
                                <Card disabled={true} title="Interoperability" className="flex flex-col flex-grow">
                                    <div className="pl-4 pr-2 flex flex-col gap-4 text-md flex-grow">
                                        <p>An async communication channel between Layer 1 smart contracts and Layer inscription contracts.</p>
                                        <p>Keep composability between Layer 1 dApps and inscription based dApps</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-16 items-center p-0 md:w-[1200px] m-auto">
                    <div className="flex flex-col items-center justify-center bg-white p-4">
                        <h1 className="text-3xl font-bold text-gray-700 mb-4 text-center">
                            Layer Inscription Philosophy
                        </h1>
                        <p className="w-4/5 text-md text-center">
                            Layer Inscription separates “application-level consensus” from Layer 1 consensus to rebalance the blockchain trilemma
                        </p>
                        <hr className="w-full border-t mt-4 mb-8" />
                        <div className="flex flex-col justify-center gap-8">
                            <Card className="w-full" title="Application-level Consensus">
                                <div className="pl-4 pr-2 flex flex-col gap-4 text-md">
                                    <p>The essence of a smart contract is an application-level consensus. Even if Layer 1 has countless nodes, a few people behind the onwer interface defined by the smart contract can modify the contract’s protocol or any data.</p>
                                    <p>Unless it is an immutable smart contract, contract’s security is equivalent to the security of the owner interface, not the security of Layer 1.</p>
                                    <p><strong>The security model of Layer Inscription is based on the application layer consensus security model. </strong>Under this security model, Layer Inscription can provide execution performance beyond Layer 1 and implement more complex protocols.</p>
                                </div>
                            </Card>
                            <Card className="w-full" title="Rebalancing Blockchain Trilemma">
                                <div className="pl-4 pr-2 flex flex-col gap-4 text-md">
                                    <p>Under the blockchain trilemma, Application-level Consensus is weaker than Layer 1 consensus. Correspondingly, Layer inscription can achieve higher scalability and complete more complex decentralized protocols.</p>
                                    <p>Due to the limited execution capabilities of Layer 1, current dApps have to integrate off-chain middleware. According to the barrel theory, these off-chain security shortcomings reduce the overall security of dApps to the off-chain level, making Layer 1 security is in name only.</p>
                                    <p>Layer inscription can eliminate security shortcomings in dApps through Application-level Consensus because higher execution performance makes dApps no longer have reason to rely on off-chain components.</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-16 items-center p-0 md:w-[1200px] m-auto">
                    <div className="flex flex-col items-center justify-center bg-white p-4">
                        <h1 className="text-3xl font-bold text-gray-700 mb-4">
                            Roadmap
                        </h1>
                        <p className=" text-md text-center">
                            Keeping pace with Artela network
                        </p>
                        <hr className="w-full border-t mt-4 mb-8" />
                        <div className="flex flex-col justify-center gap-8">
                            <Card className="w-full" title="Testnet (Living)">
                                <div className="pl-4 pr-2 flex flex-col gap-4 text-md">
                                    <p>Artscription testnet is living, mint test arts-20 token to earn Artela Galxe campaign reward.
                                    </p>
                                </div>
                            </Card>
                            <Card className="w-full" title="Public Mint">
                                <div className="pl-4 pr-2 flex flex-col gap-4 text-md">
                                    <p>Public mint art-20 token $ARTS! Hold, co-built, earn Artscription and Artela ecosystem incentive, and claim Artscription main-net art-20.
                                    </p>
                                </div>
                            </Card>
                            <Card className="w-full" title="Smart Inscription Network">
                                <div className="pl-4 pr-2 flex flex-col gap-4 text-md">
                                    <p>Release MVP network which supports Smart Inscription. Based on this version, Artscription main-net will be launched.
                                    </p>
                                </div>
                            </Card>
                            <Card className="w-full" title="Integration Network">
                                <div className="pl-4 pr-2 flex flex-col gap-4 text-md">
                                    <p>Integrates Artela heterogeneous Aspect and implements shared security from Artela L1.
                                    </p>
                                </div>
                            </Card>
                            <Card className="w-full" title="Interoperability Network">
                                <div className="pl-4 pr-2 flex flex-col gap-4 text-md">
                                    <p>Implements  Interoperability of Artscription. Layer inscription completes the construction of cornerstone network features, and large-scale applications can be logged in.</p>
                                </div>
                            </Card>

                        </div>
                    </div>
                </div>

                {/* <div className="pl-4 pr-2 my-4" >
                    The blockchain Trilemma, that is security, decentralization,and scalability has been a persistent challenge that the industry has been striving to address. For traditional smart contract paradigms, developers could only default to the choice of the underlying blockchain systems and are not capable to extend or modify it. However, we believe that there is no one-size-fits-all answer to the blockchain Trilemma. Instead, developers should have the autonomy to choose and balance these three key attributes according to their needs, allowing them the freedom to construct their ideal dApps.
                </div>
                <div className="pl-4 pr-2 my-4" >
                    The emergence of Artela and the Inscription architecture gives us the opportunity to break through the limitations of the blockchain Trilemma. This is why we represented the Artscription project. In Artscription, we combine the features of Artela blockchain and Inscription. Leveraging Artela&apos;s extensible network capabilities, developers are allowed to use the Layer Inscription architecture to realize application-level consensus. While preserving composability with Artela L1 ecosystem, developers have the autonomy to make their own choice and adjustment among decentralization, security, and scalability, maximizing the value and productivity of decentralized applications.
                </div> */}
                {/* <div className="w-4/6 pl-4 pr-2 my-4" >
                    一直以来，关于去中心化，安全性，可拓展性的区块链不可能三角一直是行业不断努力去解决的挑战，对于传统的智能合约范式而言，去中心化应用的开发者只能默认选择底层区块链系统的配置，而我们认为，区块链的不可能三角没有标准答案，而是应该允许开发者有足够的自主权，根据自己的需求，去自由的取舍这三个关键属性，来搭建自己理想中的应用.
                </div>
                <div className="w-4/6 pl-4 pr-2 my-4" >
                    <div className="flex mb-2 items-center justify-center mx-auto">
                        <div className="bg-custom-blue h-5 w-5 flex flex-col items-center justify-center">D</div>
                    </div>
                    artela 和铭文架构的出现使得我们终于可以有机会去突破区块链不可能三角的限制。这就是我们推出Artscription这个项目的原因，在Artscription，我们结合了Artela 和inscription的技术特点。利用了artela的可拓展网络的特性，允许开发者利用layer inscription的架构，去构建应用级别的共识网络，在保留与artela l1可组合性的基础之上，允许开发者自由的在去中心化，安全性，可拓展性这三者之间做选择，最大程度解放去中心化应用的价值与生产力
                </div> */}

                <div className="mt-20 h-40"></div>

            </div>
        </main>
    )
}
