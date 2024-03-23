import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { createWeb3Modal, defaultConfig, useDisconnect, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider} from '@web3modal/ethers/react';
import { Web3Modal } from '@web3modal/ethers/dist/types/src/client';



const useConnect = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState("0");

   // Web3Modal instance
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwcmx6bmV6aHh4d2dqYnR6b2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1Mjk3NjEsImV4cCI6MjAyNjEwNTc2MX0.DGQXFFdlCJxbJxRFpy3QULnWiaYMayPp5Cjy65GmDI4"
  const supabase = createClient("https://hprlznezhxxwgjbtzoby.supabase.co", supabaseAnonKey);

  const contractAddress = '0xD56e6F296352B03C3c3386543185E9B8c2e5Fd0b';
  const contractABI = [
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'event Trade(address indexed trader, address indexed subject, bool isBuy, uint256 shareAmount, uint256 ethAmount, uint256 protocolEthAmount, uint256 subjectEthAmount, uint256 supply)',
  'function buyShares(address sharesSubject, uint256 amount) payable',
  'function getBuyPrice(address sharesSubject, uint256 amount) external view returns (uint256)',
  'function getBuyPriceAfterFee(address sharesSubject, uint256 amount) external view returns (uint256)',
  'function getPrice(uint256 supply, uint256 amount) external pure returns (uint256)',
  'function getSellPrice(address sharesSubject, uint256 amount) external view returns (uint256)',
  'function getSellPriceAfterFee(address sharesSubject, uint256 amount) external view returns (uint256)',
  'function owner() external view returns (address)',
  'function protocolFeeDestination() external view returns (address)',
  'function protocolFeePercent() external view returns (uint256)',
  'function renounceOwnership() external',
  'function sellShares(address sharesSubject, uint256 amount) payable',
  'function setFeeDestination(address _feeDestination) external',
  'function setProtocolFeePercent(uint256 _feePercent) external',
  'function setSubjectFeePercent(uint256 _feePercent) external',
  'function sharesBalance(address, address) external view returns (uint256)',
  'function sharesSupply(address) external view returns (uint256)',
  'function subjectFeePercent() external view returns (uint256)',
  'function transferOwnership(address newOwner) external'
];  
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { disconnect } = useDisconnect()

useEffect(() => {
      fetchBalance()
    }, []);

  
  interface Window {
      ethereum: {
        request: (request: { method: string, params?: Array<any> }) => Promise<any>;
      };
    }
    


// 1. Get projectId
const projectId = 'd6873b1f678ae8f16024db137ef8fe26'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'anvil',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

// 3. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
})


  createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true
})
  
function connect() {
  const { open } = useWeb3Modal()
  return (
    open()
  )
}

async function getSigner() {
  if (!walletProvider) return
  const ethersProvider = new ethers.BrowserProvider(walletProvider)
  const signer = await ethersProvider.getSigner()
  return signer
}


const fetchBalance = async () =>  {
  try {
    if (!window.ethereum) return;
    if (typeof window.ethereum.request === "undefined") return; // Check if request method is undefined
    // @ts-ignore
    const balance = await window.ethereum.request({method: "eth_getBalance", params: [address, "latest"]});
    setBalance(balance);
    console.log('Fetched balance:', balance.toString());
  } catch (error) {
    console.error('Failed to fetch balance:', error);
  }
}


async function checkIsKeyHolder(subject: any, holder: any) {

  try {
    const friend = new ethers.Contract(contractAddress, contractABI, await getSigner())
    const result = await friend.sharesBalance(subject, holder)
    if (result > 0) {
      return true;
    } else {
      return false;
    }
  }
  catch (error){
      console.log(error)
  }
}

  // Additional functions such as checkIsKeyHolder can be implemented similarly,
  // utilizing the `provider` state for ethers operations.

  return { checkIsKeyHolder, connect, getSigner, balance, address, contractAddress, contractABI, supabase, fetchBalance, isConnected, disconnect};
};

export default useConnect;
