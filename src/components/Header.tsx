import { Activity, Shield, Cpu } from 'lucide-react';

interface HeaderProps {
  account: string | null;
  connectWallet: () => void;
}

export default function Header({ account, connectWallet }: HeaderProps) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <Activity size={16} color="var(--mantle-green)" />
          <span>Status: <span style={{ color: 'var(--mantle-green)' }}>Active</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <Shield size={16} />
          <span>Risk: <span style={{ color: 'var(--success)' }}>Low</span></span>
        </div>
        <button className="glow-border brand-font" style={{
          background: account ? 'rgba(101, 179, 46, 0.1)' : 'transparent',
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
          if (!account) {
            e.currentTarget.style.background = 'var(--mantle-green)';
            e.currentTarget.style.color = 'var(--bg-dark)';
          }
        }}
        onMouseOut={(e) => {
          if (!account) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--mantle-green)';
          }
        }}>
          {account ? formatAddress(account) : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
