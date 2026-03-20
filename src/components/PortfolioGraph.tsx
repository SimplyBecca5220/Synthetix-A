import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, ArrowDownCircle, ArrowUpCircle, X } from 'lucide-react';
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

// Fixed the invalid mock address length to prevent ethers.js validation crashes in Live mode
const VAULT_ADDRESS = "0x5390000000000000000000000000000000000001";

interface GraphProps {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  isSimulationMode: boolean;
}

export default function PortfolioGraph({ account, provider, isSimulationMode }: GraphProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<string>("0.1");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit');

  const initiateTransaction = (type: 'deposit' | 'withdraw') => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setModalType(type);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    if (modalType === 'deposit') {
        await executeDeposit();
    } else {
        await executeWithdraw();
    }
  };

  const executeDeposit = async () => {
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
        alert("Transaction failed on Live Network. Error: " + (err.message || "Are you on Mantle Sepolia Testing Network with MNT funds?"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const executeWithdraw = async () => {
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
              onClick={() => initiateTransaction('deposit')}
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
              onClick={() => initiateTransaction('withdraw')}
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

      {/* Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel animate-slide-in" style={{
            background: 'var(--bg-card)', width: '100%', maxWidth: '400px',
            border: '1px solid var(--border-glow)', borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="brand-font" style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>
                 Confirm {modalType === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '24px', color: 'var(--text-main)' }}>
              <p style={{ marginBottom: '16px', fontSize: '15px' }}>
                You are about to {modalType} <strong style={{color: 'var(--mantle-green)'}}>{amount} MNT</strong>.
              </p>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                <strong>Network Mode:</strong> <span style={{ color: isSimulationMode ? 'var(--accent-blue)' : 'var(--danger)' }}>{isSimulationMode ? "Simulation (Testnet)" : "LIVE"}</span><br/><br/>
                {isSimulationMode ? "This is a simulated transaction and will not cost real gas." : "This will consume real gas on the network and execute a smart contract transaction."}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-main)', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm} 
                style={{ flex: 1, padding: '10px', background: 'var(--mantle-green)', border: 'none', color: 'var(--bg-dark)', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}
              >
                Confirm Submittal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
