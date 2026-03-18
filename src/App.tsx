import { useState, useEffect } from 'react';
import Header from './components/Header';
import MantlePulse from './components/MantlePulse';
import AgentLogic from './components/AgentLogic';
import PortfolioGraph from './components/PortfolioGraph';
import { ethers } from 'ethers';

// Global declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error("Connection failed", err);
      }
    } else {
      alert("Please install MetaMask or a compatible Web3 wallet.");
    }
  };

  return (
    <>
      <Header account={account} connectWallet={connectWallet} />
      <main className="layout-grid">
        <MantlePulse />
        <AgentLogic />
        <PortfolioGraph account={account} provider={provider} />
      </main>
    </>
  );
}

export default App;
