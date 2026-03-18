import { Activity, Shield, Cpu, ToggleLeft, ToggleRight } from 'lucide-react';

interface HeaderProps {
  account: string | null;
  connectWallet: () => void;
  isSimulationMode: boolean;
  setIsSimulationMode: (mode: boolean) => void;
}

export default function Header({ account, connectWallet, isSimulationMode, setIsSimulationMode }: HeaderProps) {
  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 40px',
      borderBottom: '1px solid var(--border-glow)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: 'var(--mantle-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--bg-dark)'
        }}>
          <Cpu size={24} />
        </div>
        <div>
          <h1 className="brand-font" style={{ fontSize: '24px', letterSpacing: '1px', margin: 0 }}>
            <span style={{ color: 'var(--mantle-green)' }}>Syn</span>-A
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mantle Autonomous Yield</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        
        {/* Toggle Mode Button */}
        <button 
          onClick={() => setIsSimulationMode(!isSimulationMode)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: isSimulationMode ? 'var(--accent-blue)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: isSimulationMode ? 'bold' : 'normal'
          }}
          title="Enable Simulation Mode to test features without spending real gas"
        >
          {isSimulationMode ? <ToggleRight color="var(--accent-blue)" /> : <ToggleLeft />}
          Simulation Mode {isSimulationMode ? 'ON' : 'OFF'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <Activity size={16} color="var(--mantle-green)" />
          <span>Status: <span style={{ color: 'var(--mantle-green)' }}>Active</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <Shield size={16} />
          <span>Risk: <span style={{ color: 'var(--success)' }}>Low</span></span>
        </div>
        
        <button className="glow-border brand-font" style={{
          background: 'transparent',
          color: 'var(--mantle-green)',
          border: '1px solid var(--mantle-green)',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '14px'
        }}
        onClick={connectWallet}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'var(--mantle-green)';
          e.currentTarget.style.color = 'var(--bg-dark)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--mantle-green)';
        }}>
          {account ? formatAddress(account) : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
