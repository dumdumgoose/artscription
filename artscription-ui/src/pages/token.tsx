// pages/token.js
import '../app/globals.css';
import React, { useEffect, useState } from 'react';
import { useAccount, useSendTransaction, usePrepareSendTransaction, useWaitForTransaction } from 'wagmi'
import { ethers } from 'ethers';


import Alert from '../components/Alert';
import Link from "next/link";

export default function Token() {
  const initDetail: any = {
    "owner": "0x325082679c302d0a23f8d24f289ea29b03108197",
    "txHash": "0x2f6b4ce9a9c990956c02e579fa9af7371961b5318e330774300b4dcb987616b0",
    "artscriptionId": "0x2f6b4ce9a9c990956c02e579fa9af7371961b5318e330774300b4dcb987616b0",
    "max": "21000000",
    "lim": "1000",
    "tick": "wave1",
  }

  // 'data:,{"p": "art-20","op": "transfer","tick": "arts","amt": "1"}'
  const transferInscriptionJson: any = {
    "p": "art-20",
    "op": "transfer",
    "tick": "wave1",
    "amt": "0"
  }

  const mintInscriptionJson: any = {
    "p": "art-20",
    "op": "mint",
    "tick": "wave1",
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

  const showNewAlert = (msg: string) => {
    const newUniqueMessage = msg + "|" + new Date().toTimeString();
    setAlertMessage(newUniqueMessage);
  };

  const handleAddressChange = (event: any) => {
    const newAddress = event.target.value;
    setToAddress(newAddress);
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
  })

  const mintTxPre = usePrepareSendTransaction({
    to: address,
    value: ethers.utils.parseEther('0').toBigInt(),
    data: mintInscription as `0x${string}`
  })

  const transferTx =
    useSendTransaction(transferTxPre.config)

  const mintTx =
    useSendTransaction(mintTxPre.config)

  const waitForTranserTx = useWaitForTransaction({
    hash: transferTx.data?.hash,
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

      if (waitForTranserTx.data) {
        showNewAlert("transfer success:" + waitForTranserTx.data.transactionHash);
      }

      if (waitForMintTx.data) {
        showNewAlert("mint success:" + waitForMintTx.data.transactionHash);
      }
    }

  }, [address, isConnected, waitForTranserTx.data, waitForMintTx.data]);

  function stringToHex(str: string): string {
    let hexStr = '';
    for (let i = 0; i < str.length; i++) {
      hexStr += str.charCodeAt(i).toString(16);
    }
    return "0x" + hexStr;
  }

  return (
    <div className="flex flex-col w-full items-center p-0 md:w-[1200px] m-auto  px-8">

      <Alert message={alertMessage} />

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
              <Link className='link-style' href={`https://betanet-scan.artela.network/tx/${tokenInfo.artscriptionId}`}>
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
          <div className="h-auto w-64 p-4 flex flex-col justify-around" >
            <div className="pb-2">
              <div className="font-semibold whitespace-pre-wrap text-center ">Your Balance</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1 text-center">{balance} WAVE1</div>
            </div>
            <div className="pb-2">
              <div className="font-semibold whitespace-pre-wrap text-center">Your Wallet</div>
              <div className="text-gray-700 whitespace-pre-wrap mt-1 text-center truncate hover:text-clip">{clientAddress} </div>
            </div>
          </div>

          <div className="h-auto p-4 flex flex-col justify-end" >
            <div className="border-gray-200">
              <div className="my-2 font-bold">To</div>
              <input className="p-2 w-full md:w-64 border text-gray-700"
                onChange={handleAddressChange}
                placeholder="0x..." ></input>
            </div>
            <div className="">
              <div className="my-2 font-bold">Amount</div>
              <input className="p-2 w-full border text-gray-700"
                type="number"
                onChange={handleAmountChange}
                min="0"></input>
            </div>
            <button className="mt-8 bg-blue-500 text-white cursor-pointer hover:bg-blue-700 duration-200 rounded-lg px-4 py-2"
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
              }}>Transfer</button>
          </div>

          <div className="h-auto p-4 flex flex-col justify-end " >
            <div className="">
              <div className="my-2 font-bold text-gray-700">Amount</div>
              <input className="p-2 w-full border"
                type="number"
                onChange={handleMintAmountChange}
                min="0"
              ></input>
            </div>
            <button className="mt-8 bg-blue-500 text-white cursor-pointer hover:bg-blue-700 duration-200 rounded-lg px-4 py-2"
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
              }} >Mint</button>
          </div>
        </div>
      </div>

      <div className="h-auto w-full flex flex-col border border-gray-200 py-8 px-8 my-4 rounded-lg">
        <div className="h-20 w-full py-8 text-2xl flex flex-row justify-center border-b mb-4">
          <p className="text-3xl font-bold">More ART20</p>
        </div>

        <div className="h-auto w-auto px-4 py-8">
          <div>
            <div className="font-semibold whitespace-pre-wrap text-center">The Indexer backend starts syncing artcription from block height 0 and parses all art-20 data.
            </div>
            <div className="font-semibold whitespace-pre-wrap text-center">However, the current version only displays the WAVE1 token, with other tokens to be shown in the next update.
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
