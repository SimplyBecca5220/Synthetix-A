
import { TrendingUp, Activity } from 'lucide-react';

const protocols = [
  { name: 'mETH', protocol: 'Mantle LSP', apr: '7.2%', type: 'LSD', trend: 'up' },
  { name: 'mETH/USDC', protocol: 'Merchant Moe', apr: '12.4%', type: 'LP', trend: 'up' },
  { name: 'cmETH/MNT', protocol: 'Agni Finance', apr: '18.9%', type: 'LP', trend: 'down' },
  { name: 'USDT', protocol: 'Lendle', apr: '5.1%', type: 'Lending', trend: 'up' },
];

export default function MantlePulse() {
  return (
    <div className="glass-panel animate-slide-in" style={{ animationDelay: '0.1s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Activity color="var(--accent-blue)" />
        <h2 className="brand-font" style={{ fontSize: '20px', margin: 0 }}>Mantle Pulse</h2>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
        Live feed of APRs across Mantle protocols. Syn-A continuously monitors for optimal yield opportunities.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {protocols.map((p, i) => (
          <div key={i} style={{
            background: 'var(--bg-dark)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'var(--border-glow)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.protocol} • {p.type}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                color: p.trend === 'up' ? 'var(--success)' : 'var(--danger)',
                fontWeight: 700,
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                justifyContent: 'flex-end'
              }}>
                {p.apr}
                {p.trend === 'up' ? <TrendingUp size={16} /> : <TrendingUp size={16} strokeWidth={2} style={{transform: 'scaleY(-1)'}}/>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
