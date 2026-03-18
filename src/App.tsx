import { useState } from 'react';
import Header from './components/Header';
import MantlePulse from './components/MantlePulse';
import AgentLogic from './components/AgentLogic';
import PortfolioGraph from './components/PortfolioGraph';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const MANTLE_SEPOLIA_CHAIN_ID = '0x138b';

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  
  // Toggle for users without testnet funds to mock the UI interactions
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);

  const switchToMantleTestnet = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MANTLE_SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: MANTLE_SEPOLIA_CHAIN_ID,
                chainName: 'Mantle Sepolia Testnet',
                nativeCurrency: {
                  name: 'MNT',
                  symbol: 'MNT',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
                blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        
        const accounts = await web3Provider.send("eth_requestAccounts", []);
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }

        // Whenever they connect, ask them to switch to Mantle Testnet smoothly
        await switchToMantleTestnet();

      } catch (err: any) {
        console.error("Connection failed", err);
        alert(`Wallet connection failed: ${err.message || "User rejected request"}`);
      }
    } else {
      alert("No Web3 wallet detected! Please install MetaMask to use this app.");
    }
  };

  return (
    <>
      <Header 
        account={account} 
        connectWallet={connectWallet} 
        isSimulationMode={isSimulationMode}
        setIsSimulationMode={setIsSimulationMode}
      />
      <main className="layout-grid">
        <MantlePulse />
        <AgentLogic />
        <PortfolioGraph account={account} provider={provider} isSimulationMode={isSimulationMode} />
      </main>
    </>
  );
}

export default App;
