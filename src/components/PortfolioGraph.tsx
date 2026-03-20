import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { ethers } from 'ethers';

const data = [
  { name: 'Jan', value: 10.0 },
  { name: 'Feb', value: 10.2 },
  { name: 'Mar', value: 10.5 },
  { name: 'Apr', value: 11.1 },
  { name: 'May', value: 11.8 },
  { name: 'Jun', value: 12.6 },
  { name: 'Jul', value: 13.9 },
];

const VAULT_ADDRESS = "0x539...001"; // Placeholder

interface GraphProps {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  isSimulationMode: boolean;
}

export default function PortfolioGraph({ account, provider, isSimulationMode }: GraphProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<string>("0.1");

  const handleDeposit = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to deposit ${amount} MNT?\nMode: ${isSimulationMode ? "Simulation (Testnet)" : "LIVE"}`
    );
    if (!isConfirmed) return;

    try {
      setIsProcessing(true);

      if (isSimulationMode) {
        // --- SIMULATION MODE ---
        console.log("SIMULATION ON: Faking transaction payload...");
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        
        const fakeHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        alert(`[SIMULATION ON] Dashboard dynamically triggered Deposit successfully! \nVirtual TX: ${fakeHash}`);
      } else {
        // --- LIVE MODE ---
        if (!provider) throw new Error("Provider missing in Live mode.");
        const signer = await provider.getSigner();
        
        const amountToDeposit = ethers.parseEther(amount);
        const tx = await signer.sendTransaction({
          to: VAULT_ADDRESS,
          value: amountToDeposit
        });

        console.log("Transaction pending:", tx.hash);
        await tx.wait(); // Wait for confirmation
        alert(`Successfully deposited ${amount} MNT into Syn-A! TX: ${tx.hash}`);
      }

    } catch (err: any) {
      console.error(err);
      if (err.code !== "ACTION_REJECTED") {
        alert("Transaction failed on Live Network. Are you on Mantle Sepolia Testing Network with MNT funds?");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount to withdraw.");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to withdraw ${amount} MNT?\nMode: ${isSimulationMode ? "Simulation (Testnet)" : "LIVE"}`
    );
    if (!isConfirmed) return;
    
    if (isSimulationMode) {
      alert(`[SIMULATION ON] Withdrawal of ${amount} MNT signature requested successfully.`);
    } else {
      alert(`Withdrawal function initiated for ${amount} MNT. Make sure you have gas to sign the Smart Contract tx!`);
    }
  };

  return (
    <div className="glass-panel animate-slide-in" style={{ animationDelay: '0.3s', display: 'flex', flexDirection: 'column' }}>
      <div className="portfolio-header-top">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Wallet color="var(--mantle-green)" />
            <h2 className="brand-font" style={{ fontSize: '20px', margin: 0 }}>Your Portfolio</h2>
          </div>
          <div className="portfolio-actions">
            
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-main)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  width: '90px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                }}
              />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: 'var(--text-muted)' }}>MNT</span>
            </div>

            <button 
              onClick={handleDeposit}
              disabled={isProcessing}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--mantle-green)', color: 'var(--bg-dark)',
                border: 'none', padding: '8px 16px', borderRadius: '4px',
                cursor: isProcessing ? 'wait' : 'pointer', fontWeight: 'bold', fontSize: '13px',
                boxShadow: isSimulationMode ? '0 0 10px rgba(74, 144, 226, 0.4)' : 'none'
              }}
            >
              <ArrowDownCircle size={16} />
              {isProcessing ? 'Confirming...' : 'Deposit'}
            </button>
            <button 
              onClick={handleWithdraw}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'transparent', color: 'var(--text-main)',
                border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '4px',
                cursor: 'pointer', fontSize: '13px'
              }}
            >
              <ArrowUpCircle size={16} />
              Withdraw
            </button>
          </div>
        </div>

        <div className="portfolio-stats">
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Net Value ($mETH)</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <span>13.90</span>
            <span style={{ fontSize: '14px', color: 'var(--success)' }}>+39.0%</span>
          </div>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
        Your balance is growing in yield-bearing $mETH while Syn-A automatically shifts allocations to maximize APY.
      </p>

      <div style={{ flex: 1, minHeight: '300px', marginLeft: '-20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--mantle-green)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--mantle-green)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', borderRadius: '8px', color: 'var(--text-main)' }}
              itemStyle={{ color: 'var(--mantle-green)', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="value" stroke="var(--mantle-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
