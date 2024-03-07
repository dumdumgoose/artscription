"use client"
import './globals.css';
import React, { useEffect, useState } from 'react';

export default function Artscription() {

  const emptyData = [
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
  { "owner": "loading...", "inscription": "loading...", "artscriptionId": "loading..." },
];

  const [artscriptions, setArtscriptions] = useState(emptyData);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/proxy');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        if (isMounted) {
          setArtscriptions(result);
        }
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchData().catch(console.error);

    const intervalId = setInterval(fetchData, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex flex-col w-full items-center p-0 md:w-[1200px] m-auto px-8">
      <div className="w-full py-8 text-xl md:text-2xl">
        Latest inscriptions
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
        {artscriptions.map((item, index) => (
          <a key={index} className="h-auto p-1 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl" href={`/artscription/${item.artscriptionId}`}>
            <div className="h-60 p-10 text-black text-base whitespace-pre-wrap overflow-auto hover:text-lg">
              {JSON.stringify(item.inscription, null, 2)}
            </div>
            <div className="h-20 pl-4 md:pl-10 pr-4 md:pr-10  pt-2 bg-gray-200 rounded-lg border">
              <div className="text-gray-700 font-bold text-base truncate hover:text-clip">
                {item.artscriptionId}
              </div>
              <div className="pt-2 text-gray-800 text-base truncate hover:text-clip">
                Owner: {item.owner}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
