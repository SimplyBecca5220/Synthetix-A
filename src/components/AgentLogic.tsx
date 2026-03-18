import { useState, useEffect } from 'react';
import { Terminal, Cpu } from 'lucide-react';

const mockLogs = [
  "[SYSTEM] Initializing Syn-A Autonomous Agent...",
  "[DATA] Fetching mETH & cmETH liquidity pools via Mantle DA...",
  "[ANALYSIS] Detected 2.5% APR spike in mETH/USDC pool on Merchant Moe.",
  "[ACTION] Initiating strategy: Rebalance to mETH/USDC.",
  "[EXECUTION] Swapping 10% of idle cmETH. Routing via EIP-3074 Account Abstraction...",
  "[SUCCESS] Transaction confirmed. Gas cost: 0.0001 MNT.",
  "[DATA] Decision hash stored securely on Mantle DA: 0x8f2a...9b1c",
  "[WAITING] Monitoring for next optimal yield jump..."
];

export default function AgentLogic() {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < mockLogs.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, mockLogs[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 1500 + Math.random() * 2000); // Random delay between 1.5s and 3.5s
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="glass-panel animate-slide-in" style={{ animationDelay: '0.2s', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Terminal color="var(--mantle-green)" />
          <h2 className="brand-font" style={{ fontSize: '20px', margin: 0 }}>Agent Logic</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mantle-green)', fontSize: '12px', background: 'rgba(101, 179, 46, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
          <Cpu size={14} />
          <span>SLM Online</span>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
        Live execution terminal. Syn-A uses a Small Language Model (SLM) to parse signals and execute multi-hop strategies.
      </p>

      <div style={{ 
        flex: 1,
        background: '#040608',
        borderRadius: '8px',
        padding: '20px',
        fontFamily: '"Fira Code", monospace, monospace',
        fontSize: '13px',
        color: '#a0aab5',
        overflowY: 'auto',
        border: '1px solid rgba(101, 179, 46, 0.2)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {logs.map((log, index) => {
          let color = '#a0aab5';
          if (log.includes('[SUCCESS]')) color = 'var(--success)';
          else if (log.includes('[WARNING]') || log.includes('[ACTION]')) color = 'var(--accent-blue)';
          else if (log.includes('[SYSTEM]')) color = 'var(--mantle-green)';
          
          return (
            <div key={index} style={{ color, animation: 'slideIn 0.3s ease-out forwards' }}>
              <span style={{ color: '#546372', marginRight: '8px' }}>{'>'}</span> 
              {log}
            </div>
          );
        })}
        {currentIndex < mockLogs.length && (
          <div>
            <span style={{ color: '#546372', marginRight: '8px' }}>{'>'}</span>
            Processing<span className="cursor-blink"></span>
          </div>
        )}
      </div>
    </div>
  );
}
