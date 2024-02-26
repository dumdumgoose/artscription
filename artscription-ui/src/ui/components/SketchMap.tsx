'use client'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import ArrowDown from "@/public/arrowDown.png"
import ArrowRight from "@/public/arrowRight.png"
import BigFolder from "@/public/bigFolder.png"
import BigCylinder from "@/public/bigCylinder.png"
import Folder from "@/public/folder.png"
import Cylinder from "@/public/cylinder.png"
function SketchMap() {

    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        // 更新窗口宽度状态
        const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', updateWindowWidth);
        updateWindowWidth(); // 初始检查

        return () => window.removeEventListener('resize', updateWindowWidth);
    }, []);

    // 使用Folder2图片的屏幕宽度阈值，例如768px
    const imageSrc = windowWidth < 768 ? ArrowDown : ArrowRight;
    return (
        <div className="flex flex-col items-center px-4  w-[380px] md:w-[1200px] m-auto gap-5 md:gap-10">
            <div className="px-2 md:px-5 w-full">
                <div className="border-2 border-blue-800 rounded-md p-2 md:p-4 hover:scale-105 hover:shadow-lg transition-all flex flex-col items-center justify-center">
                    <div className="text-xl md:text-3xl mb-3 md:mb-5 text-center" >Layer1</div>
                    <div className="text-lg md:text-2xl text-center mb-10">Consensus:basic verification & sequence</div>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-5 mb-5">
                        <div className="flex flex-col justify-center items-center">
                            <div className="border-2 border-blue-800 rounded-full px-5 text-xl">
                                tx #1
                            </div>
                            <div className="text-xl">
                                ···
                            </div>
                            <div className="border-2 border-blue-800 rounded-full px-5 text-xl">
                                tx #n
                            </div>
                        </div>
                        <div className="">
                            <Image
                                src={imageSrc}
                                alt=""
                                width={30}
                                height={30}
                            />
                        </div>
                        <div className="border-2 border-blue-800 px-8 py-8 text-xl">
                            Consensus
                        </div>
                        <div className="">
                            <Image
                                src={imageSrc}
                                alt=""
                                width={30}
                                height={30}
                            />
                        </div>
                        <div className="border-2 border-blue-800 rounded-md px-8 py-8 text-xl">
                            block
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex md:flex-row justify-between w-full">
                <div className="ml-20 md:ml-80">
                    <Image
                        src={ArrowDown}
                        alt=""
                        width={30}
                        height={30}
                    />
                </div>
                <div className="mr-20 md:mr-80">
                    <Image
                        src={ArrowDown}
                        alt=""
                        width={30}
                        height={30}
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-around gap-5 md:gap-1 px-2 md:px-5 w-full">
                <div className="w-full md:w-[700px] border-2 border-blue-800 rounded-md p-2 md:p-4 hover:scale-105 hover:shadow-lg transition-all mr-5">
                    <div className="text-xl md:text-3xl mb-3 md:mb-5 text-center" >Layer Insciption</div>
                    <div className="text-lg md:text-2xl text-center mb-10">Execution:inscription contract,world state</div>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-5 mb-5">
                        <div className="flex flex-col justify-center items-center">
                            <div className="border-2 border-blue-800 rounded-full px-5 text-xl">
                                tx #m
                            </div>
                            <div className="text-xl">
                                ···
                            </div>
                            <div className="border-2 border-blue-800 rounded-full px-5 text-xl">
                                tx #n
                            </div>
                        </div>
                        <div className="">
                            <Image
                                src={imageSrc}
                                alt=""
                                width={30}
                                height={30}
                            />
                        </div>

                        <div
                            className="text-xl text-center h-80 w-40 pt-12"
                            style={{
                                backgroundImage: `url(${BigFolder.src})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                height: '150px'
                            }}
                        >
                            Inscription<br />Contract
                        </div>

                        <div className="">
                            <Image
                                src={imageSrc}
                                alt=""
                                width={30}
                                height={30}
                            />
                        </div>
                        <div
                            className="text-xl text-center h-70 w-36 pt-12"
                            style={{
                                backgroundImage: `url(${BigCylinder.src})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                height: '140px'
                            }}
                        >
                            Inscription<br />State
                        </div>

                    </div>
                </div>

                <div className="w-full md:w-[200px] border-2 border-blue-800 rounded-md p-2 md:p-4 hover:scale-105 hover:shadow-lg transition-all flex flex-col items-center">
                    <div className="text-xl md:text-3xl mb-3 md:mb-5 text-center">Layer</div>
                    <div className="text-lg md:text-2xl text-center mb-10">Inscription</div>
                    <div className="flex justify-center w-full">
                        <Image
                            src={Folder}
                            alt=""
                            width={110}
                            height={110}
                        />
                    </div>
                    <div className=" mt-5 flex justify-center w-full">
                        <Image
                            src={Cylinder}
                            alt=""
                            width={110}
                            height={110}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="w-full text-center text-3xl">···</div>
                </div>
                <div className="w-full md:w-[200px] border-2 border-blue-800 rounded-md p-2 md:p-4 hover:scale-105 hover:shadow-lg transition-all flex flex-col items-center">
                    <div className="text-xl md:text-3xl mb-3 md:mb-5 text-center">Layer</div>
                    <div className="text-lg md:text-2xl text-center mb-10">Inscription</div>
                    <div className="flex justify-center w-full">
                        <Image
                            src={Folder}
                            alt=""
                            width={110}
                            height={110}
                        />
                    </div>
                    <div className="mt-5 flex justify-center w-full">
                        <Image
                            src={Cylinder}
                            alt=""
                            width={110}
                            height={110}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SketchMap;