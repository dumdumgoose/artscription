// pages/artscription.js
import '../../app/globals.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';


export default function Artscription() {
  const router = useRouter();
  const { hash } = router.query;

  const initDetail: any = { "artscription": { "artscriptionId": "0x...", "creator": "0x...", "owner": "0x...", "mimeType": "...", "inscription": "...", "artscriptionNumber": 1 }, "execution": { "protocol": "...", "status": "...", "failReason": "..." } }
  const [detail, setDetail] = useState(initDetail);

  // const detail = { "artscription": { "artscriptionId": "0x4ab167ef48483904cec6452560484c22e1520f67f81dc5826c410fe68dabbba0", "creator": "0x325082679c302d0a23f8d24f289ea29b03108197", "owner": "0x325082679c302d0a23f8d24f289ea29b03108197", "mimeType": "text/plain", "inscription": { "p": "art-20", "op": "mint", "tick": "arts", "amt": "1000" }, "artscriptionNumber": 1 }, "execution": { "protocol": "art-20", "status": "execute success", "failReason": "-" } };

  useEffect(() => {
    if (hash) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/artscriptionDetail?id=${hash}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const result = await response.json();
          setDetail(result);
        } catch (error) {
          console.error("Failed to fetch data: ", error);
        }
      };

      fetchData();
    }
  }, [hash]);

  return (
    <div className="flex flex-col  items-center p-0 md:w-[1200px] m-auto px-8">
      <div className="h-20 w-full py-8 text-2xl text-gray-700 font-bold">
        Inscription Detail
      </div>
      <div className="h-auto w-full flex flex-col md:flex-row border border-gray-200 py-8 px-8 my-4 rounded-lg">
        <div className="md:h-80 md:w-80 border p-4 rounded-lg">
          <div className="md:h-60 p-10 text-black text-19 whitespace-pre-wrap overflow-auto">
            {JSON.stringify(detail.artscription.inscription, null, 2)}
          </div>
        </div>

        <div className="md:h-80 w-full md:w-auto ml-0 md:ml-4 mt-4 md:mt-0 px-0 md:px-4 rounded-lg flex flex-col justify-between break-all truncate">
          <div className="pb-2 md:pb-0">
            <div className="text-gray-500 whitespace-pre-wrap">Avascription id</div>
            <div className="text-gray-700 font-semibold whitespace-pre-wrap mt-1 TRU">{detail.artscription.artscriptionId}</div>
          </div>
          <div className="pb-2 md:pb-0">
            <div className="text-gray-500 whitespace-pre-wrap">Creator</div>
            <div className="text-gray-700 font-semibold whitespace-pre-wrap mt-1">{detail.artscription.creator}</div>
          </div>
          <div className="pb-2 md:pb-0">
            <div className="text-gray-500 whitespace-pre-wrap">Owner</div>
            <div className="text-gray-700 font-semibold whitespace-pre-wrap mt-1">{detail.artscription.owner}</div>
          </div>
          <div className="pb-2 md:pb-0">
            <div className="text-gray-500 whitespace-pre-wrap">Mime type</div>
            <div className="text-gray-700 font-semibold whitespace-pre-wrap mt-1">{detail.artscription.mimeType}</div>
          </div>
        </div>
      </div>

      <div className="h-20 w-full py-8 text-2xl text-gray-700 font-bold">
        Protocol Execution
      </div>
      <div className="h-auto w-full flex flex-row border border-gray-200 py-8 px-8 my-4 rounded-lg break-all">
        <div className="h-auto w-auto ml-4 rounded-lg flex flex-col justify-normal">
          <div className="my-2">
            <div className="text-gray-500 whitespace-pre-wrap">Protocol</div>
            <div className="text-gray-700 font-semibold whitespace-pre-wrap mt-1">{detail.execution.protocol}</div>
          </div>
          <div className="my-2">
            <div className="text-gray-500 whitespace-pre-wrap">Inscription</div>
            <div className="text-gray-700 font-semibold whitespace-pre-wrap mt-1">{JSON.stringify(detail.artscription.inscription)}</div>
          </div>
          <div className="my-2">
            <div className="text-gray-500 whitespace-pre-wrap">Status</div>
            <div className="text-gray-700 font-semibold whitespace-pre-wrap mt-1">{detail.execution.status}</div>
          </div>
          <div className="my-2">
            <div className="text-gray-500 whitespace-pre-wrap">Fail reason</div>
            <div className="text-gray-700 font-semibold whitespace-pre-wrap mt-1">{detail.execution.failReason}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
