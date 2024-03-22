import LeftMenu from '@/components/leftMenu';
import useConnect from '@/lib/hooks/useConnect';

import { truncateAddress } from '@/lib/utils';
import { ethers } from "ethers";


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isContext } from 'vm';


const Profile = () => {
  const { slug } = useParams();

  const navigate = useNavigate();
  const { connect, getSigner, contractAddress, balance, contractABI, address, isConnected} =
    useConnect();
  const [inputAmount, setInputAmount] = useState('');
  const [shareBuyPrice, setShareBuyPrice] = useState(0);
  const [keyBalance, setKeyBalance] = useState(0);

  useEffect(() => {
    fetchShareBalance(slug);
    fetchSharePrice(slug);
  }, [slug]);
  
    
  
  
  const fetchSharePrice = async (slug: any) => {
    const signer = await getSigner()
    const friend = new ethers.Contract(contractAddress, contractABI, signer ? signer : undefined)
    const result = await friend.getBuyPriceAfterFee(slug,1) 
    
    console.log('Result of fetch share price', result);
    setShareBuyPrice(parseInt(result)/1e12);
  };

  const fetchShareBalance = async (slug: any) => {
    const signer = await getSigner();
    const friend = new ethers.Contract(contractAddress, contractABI, signer ? signer : undefined);
    let result;
    try {
      result = await friend.sharesBalance(slug, address); 
    } catch(e) {
      return e; 
    }
    setKeyBalance(parseInt(result));
};


  const fetchBuySharePriceByAmount = async (
    amount: number
  ): Promise<string> => {
    const signer = await getSigner()
    const friend = new ethers.Contract(contractAddress, contractABI, signer ? signer : undefined)
    const result = await friend.getBuyPriceAfterFee(slug, amount)

    console.log('Result:', result);

    return result;
  };

  const fetchSellSharePriceByAmount = async (
    amount: number
  ): Promise<string> => {
    const signer = await getSigner()
    const friend = new ethers.Contract(contractAddress, contractABI, signer ? signer : undefined)
    const result = await friend.getSellPriceAfterFee(slug, amount)

    console.log('Result:', result);

    return result;
  };
  const handleBuyContractCall = async (amount: number) => {
    const signer = await getSigner()

    const price = await fetchBuySharePriceByAmount(amount);
    const friend = new ethers.Contract(contractAddress, contractABI, signer ? signer : undefined)
    const result = await friend.buyShares(slug, amount, {
        value: price
})

    console.log('Result:', result);
    
    
    }
   
  

  const handleSellContractCall = async (amount: number) => {
    const signer = await getSigner()
    const friend = new ethers.Contract(contractAddress, contractABI, signer ? signer : undefined)
    const result = await friend.sellShares(slug, amount)

    console.log('Result:', result);

  };

  return (
    <body className="relative bg-yellow-50 overflow-hidden h-screen w-screen">
      <LeftMenu />

      <main className="ml-60 pt-16 max-h-screen overflow-auto">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-10">
                {truncateAddress(slug!)}
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex items-stretch">
                  <div className="text-gray-400 text-xs">
                    Holders
                    <br />
                  </div>
                  <div className="h-100 border-l mx-4"></div>
                  <div className="flex flex-nowrap -space-x-3">
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-stretch">
                  <div className="text-gray-400 text-xs">
                    Holdings
                    <br />
                  </div>
                  <div className="h-100 border-l mx-4"></div>
                  <div className="flex flex-nowrap -space-x-3">
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-x-2 gap-y-2 w-[400px]">
                  <button
                    type="button"
                    className="w-[400px] inline-flex items-center justify-center h-9 px-5 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  >
                    buy price for 1 share: {shareBuyPrice / 1000000} ETH (inc.
                    all Fees)
                  </button>
                  <button
                    type="button"
                    className="w-[400px] inline-flex items-center justify-center h-9 px-5 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  >
                    you are holding : {keyBalance} keys
                  </button>
                </div>
              </div>

              <hr className="my-10" />

              <div className="grid grid-cols-2 gap-x-20">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Info</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <div className="p-4 bg-green-100 rounded-xl">
                        <div className="font-bold text-xl text-gray-800 leading-none">
                          hello!
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="p-4 bg-green-100 rounded-xl">
                        <div className=" flex flex-row font-bold text-xl text-gray-800 leading-none gap-10">
                          <h2>Your address: </h2>

                          <span className="text-md">
                            
                            {truncateAddress(address)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Trade Keys</h2>

                  <form className="flex flex-col justify-between " action="">
                    <div className="mb-6">
                      <label
                        htmlFor="large-input"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter Amount
                      </label>
                      <input
                        type="text"
                        id="large-input"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
                      />
                    </div>
                    <div className="flex flex-row justify-between">
                      <button
                        type="button"
                        onClick={async () =>
                          await handleBuyContractCall(parseInt(inputAmount))
                        }
                        className="inline-flex items-center justify-center h-9 px-[50px] rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                      >
                        BUY KEY
                      </button>

                      <button
                        type="button"
                        onClick={async () =>
                          await handleSellContractCall(parseInt(inputAmount))
                        }
                        className="inline-flex items-center justify-center h-9 px-[50px] rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                      >
                        SELL KEY
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default Profile;
