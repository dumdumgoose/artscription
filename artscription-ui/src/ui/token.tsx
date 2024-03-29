// pages/token.js
"use client"
import './globals.css';
import React, { useEffect, useState } from 'react';
import { useAccount, useSendTransaction, usePrepareSendTransaction, useWaitForTransaction } from 'wagmi'
import { ethers } from 'ethers';


import Alert from '../components/Alert';
import Link from "next/link";

export default function Token() {
  const initDetail: any = {
    "owner": "0xc69990be8c0a98b749f52e293673d073f3df8216",
    "txHash": "0x1dc1d56f2188c90e83f044a0214b0aa302c0fe013665a439f771b64a4560af6b",
    "artscriptionId": "0x1dc1d56f2188c90e83f044a0214b0aa302c0fe013665a439f771b64a4560af6b",
    "max": "21000000",
    "lim": "1000",
    "tick": "wave1",
  }

  const initDetail2: any = {
    "owner": "0xc69990be8c0a98b749f52e293673d073f3df8216",
    "txHash": "0x280feed81534fb1934839e9c4b31bc19efc1ba930451d9b4ac54efa4fb126f6e",
    "artscriptionId": "0x280feed81534fb1934839e9c4b31bc19efc1ba930451d9b4ac54efa4fb126f6e",
    "max": "21000000",
    "lim": "1000",
    "tick": "wave1.1",
  }

  const initDetail3: any = {
    "owner": "0xc69990be8c0a98b749f52e293673d073f3df8216",
    "txHash": "0xb4db7963f24c04a0124b76c84c1cfa6e9980c1a9870278737c1e4e86aab26dc1",
    "artscriptionId": "0xb4db7963f24c04a0124b76c84c1cfa6e9980c1a9870278737c1e4e86aab26dc1",
    "max": "21000000",
    "lim": "10",
    "tick": "wave1.2",
  }

  // 'data:,{"p": "art-20","op": "transfer","tick": "arts","amt": "1"}'
  const transferInscriptionJson: any = {
    "p": "art-20",
    "op": "transfer",
    "tick": "wave1",
    "amt": "0"
  }

  const transferInscription2Json: any = {
    "p": "art-20",
    "op": "transfer",
    "tick": "wave1.1",
    "amt": "0"
  }

  const transferInscription3Json: any = {
    "p": "art-20",
    "op": "transfer",
    "tick": "wave1.2",
    "amt": "0"
  }

  const mintInscriptionJson: any = {
    "p": "art-20",
    "op": "mint",
    "tick": "wave1.2",
    "amt": "0"
  }

  const { address, isConnected } = useAccount()

  const [clientAddress, setClientAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState(initDetail);
  const [balance, setBalance] = useState("0");
  const [transferInscription, setTransferInscription] = useState("0x");
  const [mintInscription, setMintInscription] = useState("0x");
  const [alertMessage, setAlertMessage] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [mintAmount, setMintAmount] = useState(0);
  const [toAddress, setToAddress] = useState("");

  const [tokenInfo2, setTokenInfo2] = useState(initDetail2);
  const [balance2, setBalance2] = useState("0");
  const [transferInscription2, setTransferInscription2] = useState("0x");
  const [transferAmount2, setTransferAmount2] = useState(0);
  const [toAddress2, setToAddress2] = useState("");

  const [tokenInfo3, setTokenInfo3] = useState(initDetail3);
  const [balance3, setBalance3] = useState("0");
  const [transferInscription3, setTransferInscription3] = useState("0x");
  const [transferAmount3, setTransferAmount3] = useState(0);
  const [toAddress3, setToAddress3] = useState("");

  const showNewAlert = (msg: string) => {
    const newUniqueMessage = msg + "|" + new Date().toTimeString();
    setAlertMessage(newUniqueMessage);
  };

  const handleAddressChange = (event: any) => {
    const newAddress = event.target.value;
    setToAddress(newAddress);
  };

  const handleAddressChange2 = (event: any) => {
    const newAddress = event.target.value;
    setToAddress2(newAddress);
  };

  const handleAddressChange3 = (event: any) => {
    const newAddress = event.target.value;
    setToAddress3(newAddress);
  };

  const handleAmountChange = (event: any) => {
    const newAmount = event.target.value;
    transferInscriptionJson.amt = newAmount;

    let inscription = "data:," + JSON.stringify(transferInscriptionJson);
    console.log("inscription: " + inscription)
    console.log("inscription hex: " + stringToHex(inscription));

    setTransferInscription(stringToHex(inscription));
    setTransferAmount(parseInt(newAmount))
  };

  const handleAmountChange2 = (event: any) => {
    const newAmount = event.target.value;
    transferInscription2Json.amt = newAmount;

    let inscription = "data:," + JSON.stringify(transferInscription2Json);
    console.log("inscription: " + inscription)
    console.log("inscription hex: " + stringToHex(inscription));

    setTransferInscription2(stringToHex(inscription));
    setTransferAmount2(parseInt(newAmount))
  };

  const handleAmountChange3 = (event: any) => {
    const newAmount = event.target.value;
    transferInscription3Json.amt = newAmount;

    let inscription = "data:," + JSON.stringify(transferInscription3Json);
    console.log("inscription: " + inscription)
    console.log("inscription hex: " + stringToHex(inscription));

    setTransferInscription3(stringToHex(inscription));
    setTransferAmount3(parseInt(newAmount))
  };

  const handleMintAmountChange = (event: any) => {
    const newAmount = event.target.value;
    mintInscriptionJson.amt = newAmount;

    let inscription = "data:," + JSON.stringify(mintInscriptionJson);
    console.log("inscription: " + inscription)
    console.log("inscription hex: " + stringToHex(inscription));

    setMintInscription(stringToHex(inscription));
    setMintAmount(parseInt(newAmount))
  };

  const transferTxPre = usePrepareSendTransaction({
    to: toAddress.trim(),
    value: ethers.utils.parseEther('0').toBigInt(),
    data: transferInscription as `0x${string}`
  });

  const transferTxPre2 = usePrepareSendTransaction({
    to: toAddress2.trim(),
    value: ethers.utils.parseEther('0').toBigInt(),
    data: transferInscription2 as `0x${string}`
  })

  const transferTxPre3 = usePrepareSendTransaction({
    to: toAddress3.trim(),
    value: ethers.utils.parseEther('0').toBigInt(),
    data: transferInscription3 as `0x${string}`
  })

  const mintTxPre = usePrepareSendTransaction({
    to: address,
    value: ethers.utils.parseEther('0').toBigInt(),
    data: mintInscription as `0x${string}`
  });

  const transferTx =
    useSendTransaction(transferTxPre.config)

  const transferTx2 =
      useSendTransaction(transferTxPre2.config)

  const transferTx3 =
      useSendTransaction(transferTxPre3.config)

  const mintTx =
    useSendTransaction(mintTxPre.config)

  const waitForTransferTx = useWaitForTransaction({
    hash: transferTx.data?.hash,
  })

  const waitForTransferTx2 = useWaitForTransaction({
    hash: transferTx2.data?.hash,
  })

  const waitForTransferTx3 = useWaitForTransaction({
    hash: transferTx3.data?.hash,
  })

  const waitForMintTx = useWaitForTransaction({
    hash: mintTx.data?.hash,
  })

  useEffect(() => {
    if (isConnected && address) {
      setClientAddress(address);
    } else {
      setClientAddress("disconnected");
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/art20?tick=wave1.2`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setTokenInfo3(result);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }

      try {
        const response = await fetch(`/api/art20?tick=wave1.1`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setTokenInfo2(result);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }

      try {
        const response = await fetch(`/api/art20?tick=wave1`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setTokenInfo(result);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchData();

    if (isConnected) {
      const balance = async () => {
        try {
          console.log("updating balance");
          const response = await fetch(`/api/balance?tick=wave1.2&address=` + address);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const result = await response.json();
          setBalance3(result.balance);
        } catch (error) {
          console.error("Failed to fetch data: ", error);
        }

        try {
          console.log("updating balance");
          const response = await fetch(`/api/balance?tick=wave1.1&address=` + address);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const result = await response.json();
          setBalance2(result.balance);
        } catch (error) {
          console.error("Failed to fetch data: ", error);
        }

        try {
          console.log("updating balance");
          const response = await fetch(`/api/balance?tick=wave1&address=` + address);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const result = await response.json();
          setBalance(result.balance);
        } catch (error) {
          console.error("Failed to fetch data: ", error);
        }
      };

      balance();

      if (waitForTransferTx.data) {
        showNewAlert("transfer success:" + waitForTransferTx.data.transactionHash);
      }

      if (waitForTransferTx2.data) {
        showNewAlert("transfer success:" + waitForTransferTx2.data.transactionHash);
      }

      if (waitForTransferTx3.data) {
        showNewAlert("transfer success:" + waitForTransferTx3.data.transactionHash);
      }

      if (waitForMintTx.data) {
        showNewAlert("mint success:" + waitForMintTx.data.transactionHash);
      }
    }

  }, [address, isConnected, waitForTransferTx.data, waitForTransferTx2.data, waitForTransferTx3.data, waitForMintTx.data]);

  function stringToHex(str: string): string {
    let hexStr = '';
    for (let i = 0; i < str.length; i++) {
      hexStr += str.charCodeAt(i).toString(16);
    }
    return "0x" + hexStr;
  }

  return (
      <div className="flex flex-col w-full items-center p-0 md:w-[1200px] m-auto  px-8">

        <Alert message={alertMessage}/>

        <div className="h-auto w-full flex flex-col border border-gray-200 py-8 px-8 mt-16 mb-4 rounded-lg">
          <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center border-b mb-4">
            <p className="text-3xl font-bold text-gray-700">WAVE1.2<span className="subscript">art-20</span></p>
          </div>

          <div className="h-auto w-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-b break-all">
            <div>
              <div className="font-semibold whitespace-pre-wrap">Total Supply</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo3.max}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Minted</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo3.supply}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Limit Per Mint</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo3.lim}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Deployer</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">

                <Link className='link-style' href={`https://betanet-scan.artela.network/address/${tokenInfo3.owner}`}>
                  {tokenInfo3.owner}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Deployer Artcription</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1 truncate">
                <Link className='link-style'
                      href={`https://betanet-scan.artela.network/tx/${tokenInfo3.artscriptionId}`}>
                  {tokenInfo3.artscriptionId}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Holders</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo3.holders}</div>
            </div>
          </div>

          <div className="h-auto w-auto px-4 py-8 flex flex-col md:flex-row justify-around">
            <div className="h-auto w-64 p-4 flex flex-col justify-around">
              <div className="pb-2">
                <div className="font-semibold whitespace-pre-wrap text-center ">Your Balance</div>
                <div className="text-gray-700 whitespace-pre-wrap mt-1 text-center">{balance3} WAVE1.2</div>
              </div>
              <div className="pb-2">
                <div className="font-semibold whitespace-pre-wrap text-center">Your Wallet</div>
                <div
                    className="text-gray-700 whitespace-pre-wrap mt-1 text-center truncate hover:text-clip">{clientAddress} </div>
              </div>
            </div>

            <div className="h-auto p-4 flex flex-col justify-end">
              <div className="border-gray-200">
                <div className="my-2 font-bold">To</div>
                <input className="p-2 w-full md:w-64 border text-gray-700"
                       onChange={handleAddressChange3}
                       placeholder="0x..."></input>
              </div>
              <div className="">
                <div className="my-2 font-bold">Amount</div>
                <input className="p-2 w-full border text-gray-700"
                       type="number"
                       onChange={handleAmountChange3}
                       min="0"></input>
              </div>
              <button
                  className="mt-8 bg-blue-500 text-white cursor-pointer hover:bg-blue-700 duration-200 rounded-lg px-4 py-2"
                  onClick={() => {

                    if (!isConnected) {
                      showNewAlert("please connect your wallet.");
                      return;
                    }

                    if (!transferAmount3 || transferAmount3 <= 0) {
                      showNewAlert("error transfer amount!");
                      return;
                    }

                    console.log(toAddress3)
                    if (!toAddress3 || !toAddress3.trim().startsWith("0x") || toAddress3.trim().length != 42) {
                      showNewAlert("error to address: " + toAddress3);
                      console.log(toAddress3)
                      return;
                    }

                    if (!transferTx3.sendTransaction) {
                      showNewAlert("tx init fail");
                      return;
                    }

                    transferTx3.sendTransaction?.()
                  }}>Transfer
              </button>
            </div>

            <div className="h-auto p-4 flex flex-col justify-end ">
              <div className="">
                <div className="my-2 font-bold text-gray-700">Amount</div>
                <input className="p-2 w-full border"
                       type="number"
                       onChange={handleMintAmountChange}
                       min="0"
                ></input>
              </div>
              <button
                  className="mt-8 bg-blue-500 text-white cursor-pointer hover:bg-blue-700 duration-200 rounded-lg px-4 py-2"
                  onClick={() => {

                    if (!isConnected) {
                      showNewAlert("please connect your wallet.");
                      return;
                    }

                    if (!mintAmount || mintAmount <= 0) {
                      showNewAlert("error mint amount!");
                      return;
                    }

                    if (!mintTx.sendTransaction) {
                      showNewAlert("tx init fail");
                      return;
                    }

                    mintTx.sendTransaction?.();
                  }}>Mint
              </button>
            </div>
          </div>
        </div>

        <div className="h-auto w-full flex flex-col border border-gray-200 py-8 px-8 mt-16 mb-4 rounded-lg">
          <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center border-b mb-4">
            <p className="text-3xl font-bold text-gray-700">WAVE1.1<span className="subscript">art-20</span></p>
          </div>

          <div className="h-auto w-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-b break-all">
            <div>
              <div className="font-semibold whitespace-pre-wrap">Total Supply</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo2.max}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Minted</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo2.supply}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Limit Per Mint</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo2.lim}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Deployer</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">

                <Link className='link-style' href={`https://betanet-scan.artela.network/address/${tokenInfo2.owner}`}>
                  {tokenInfo2.owner}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Deployer Artcription</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1 truncate">
                <Link className='link-style'
                      href={`https://betanet-scan.artela.network/tx/${tokenInfo2.artscriptionId}`}>
                  {tokenInfo2.artscriptionId}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Holders</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo2.holders}</div>
            </div>
          </div>

          <div className="h-auto w-auto px-4 py-8 flex flex-col md:flex-row justify-around">
            <div className="h-auto w-64 p-4 flex flex-col justify-around">
              <div className="pb-2">
                <div className="font-semibold whitespace-pre-wrap text-center ">Your Balance</div>
                <div className="text-gray-700 whitespace-pre-wrap mt-1 text-center">{balance2} WAVE1.1</div>
              </div>
              <div className="pb-2">
                <div className="font-semibold whitespace-pre-wrap text-center">Your Wallet</div>
                <div
                    className="text-gray-700 whitespace-pre-wrap mt-1 text-center truncate hover:text-clip">{clientAddress} </div>
              </div>
            </div>

            <div className="h-auto p-4 flex flex-col justify-end">
              <div className="border-gray-200">
                <div className="my-2 font-bold">To</div>
                <input className="p-2 w-full md:w-64 border text-gray-700"
                       onChange={handleAddressChange2}
                       placeholder="0x..."></input>
              </div>
              <div className="">
                <div className="my-2 font-bold">Amount</div>
                <input className="p-2 w-full border text-gray-700"
                       type="number"
                       onChange={handleAmountChange2}
                       min="0"></input>
              </div>
              <button
                  className="mt-8 bg-blue-500 text-white cursor-pointer hover:bg-blue-700 duration-200 rounded-lg px-4 py-2"
                  onClick={() => {

                    if (!isConnected) {
                      showNewAlert("please connect your wallet.");
                      return;
                    }

                    if (!transferAmount2 || transferAmount2 <= 0) {
                      showNewAlert("error transfer amount!");
                      return;
                    }

                    console.log(toAddress2)
                    if (!toAddress2 || !toAddress2.trim().startsWith("0x") || toAddress2.trim().length != 42) {
                      showNewAlert("error to address: " + toAddress2);
                      console.log(toAddress2)
                      return;
                    }

                    if (!transferTx2.sendTransaction) {
                      showNewAlert("tx init fail");
                      return;
                    }

                    transferTx2.sendTransaction?.()
                  }}>Transfer
              </button>
            </div>

            <div className="h-auto p-4 flex flex-col justify-end ">
              <div className="">
                <div className="my-2 font-bold text-gray-700">Amount</div>
                <input className="p-2 w-full border"
                       type="number"
                       disabled
                       min="0"
                ></input>
              </div>
              <button
                  className="mt-8 bg-gray-500 text-white cursor-pointer duration-200 rounded-lg px-4 py-2"
                  disabled>Mint
              </button>
            </div>
          </div>
        </div>

        <div className="h-auto w-full flex flex-col border border-gray-200 py-8 px-8 mt-16 mb-4 rounded-lg">
          <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center border-b mb-4">
            <p className="text-3xl font-bold text-gray-700">WAVE1<span className="subscript">art-20</span></p>
          </div>

          <div className="h-auto w-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-b break-all">
            <div>
              <div className="font-semibold whitespace-pre-wrap">Total Supply</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo.max}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Minted</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo.supply}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Limit Per Mint</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo.lim}</div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Deployer</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">

                <Link className='link-style' href={`https://betanet-scan.artela.network/address/${tokenInfo.owner}`}>
                  {tokenInfo.owner}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Deployer Artcription</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1 truncate">
                <Link className='link-style'
                      href={`https://betanet-scan.artela.network/tx/${tokenInfo.artscriptionId}`}>
                  {tokenInfo.artscriptionId}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-semibold whitespace-pre-wrap">Holders</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1">{tokenInfo.holders}</div>
            </div>
          </div>

          <div className="h-auto w-auto px-4 py-8 flex flex-col md:flex-row justify-around">
            <div className="h-auto w-64 p-4 flex flex-col justify-around">
              <div className="pb-2">
                <div className="font-semibold whitespace-pre-wrap text-center ">Your Balance</div>
                <div className="text-gray-700 whitespace-pre-wrap mt-1 text-center">{balance} WAVE1</div>
              </div>
              <div className="pb-2">
                <div className="font-semibold whitespace-pre-wrap text-center">Your Wallet</div>
                <div
                    className="text-gray-700 whitespace-pre-wrap mt-1 text-center truncate hover:text-clip">{clientAddress} </div>
              </div>
            </div>

            <div className="h-auto p-4 flex flex-col justify-end">
              <div className="border-gray-200">
                <div className="my-2 font-bold">To</div>
                <input className="p-2 w-full md:w-64 border text-gray-700"
                       onChange={handleAddressChange}
                       placeholder="0x..."></input>
              </div>
              <div className="">
                <div className="my-2 font-bold">Amount</div>
                <input className="p-2 w-full border text-gray-700"
                       type="number"
                       onChange={handleAmountChange}
                       min="0"></input>
              </div>
              <button
                  className="mt-8 bg-blue-500 text-white cursor-pointer hover:bg-blue-700 duration-200 rounded-lg px-4 py-2"
                  onClick={() => {

                    if (!isConnected) {
                      showNewAlert("please connect your wallet.");
                      return;
                    }

                    if (!transferAmount || transferAmount <= 0) {
                      showNewAlert("error transfer amount!");
                      return;
                    }

                    console.log(toAddress)
                    if (!toAddress || !toAddress.trim().startsWith("0x") || toAddress.trim().length != 42) {
                      showNewAlert("error to address: " + toAddress);
                      console.log(toAddress)
                      return;
                    }

                    if (!transferTx.sendTransaction) {
                      showNewAlert("tx init fail");
                      return;
                    }

                    transferTx.sendTransaction?.()
                  }}>Transfer
              </button>
            </div>

            <div className="h-auto p-4 flex flex-col justify-end ">
              <div className="">
                <div className="my-2 font-bold text-gray-700">Amount</div>
                <input className="p-2 w-full border"
                       type="number"
                       disabled
                       min="0"
                ></input>
              </div>
              <button
                  className="mt-8 bg-gray-500 text-white cursor-pointer duration-200 rounded-lg px-4 py-2"
                  disabled>Mint
              </button>
            </div>
          </div>
        </div>

        <div className="h-auto w-full flex flex-col border border-gray-200 py-8 px-8 my-4 rounded-lg">
          <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center border-b mb-4">
            <p className="text-3xl font-bold">More ART20</p>
          </div>

          <div className="h-auto w-auto px-4 py-8">
            <div>
              <div className="font-semibold whitespace-pre-wrap text-center">The Indexer backend starts syncing
                artcription from block height 0 and parses all art-20 data.
              </div>
              <div className="font-semibold whitespace-pre-wrap text-center">However, the current version only displays
                the WAVE1 token, with other tokens to be shown in the next update.
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
