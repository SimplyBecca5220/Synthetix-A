
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet } from 'lucide-react';

const data = [
  { name: 'Jan', value: 10.0 },
  { name: 'Feb', value: 10.2 },
  { name: 'Mar', value: 10.5 },
  { name: 'Apr', value: 11.1 },
  { name: 'May', value: 11.8 },
  { name: 'Jun', value: 12.6 },
  { name: 'Jul', value: 13.9 },
];

export default function PortfolioGraph() {
  return (
    <div className="glass-panel animate-slide-in" style={{ animationDelay: '0.3s', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wallet color="var(--mantle-green)" />
          <h2 className="brand-font" style={{ fontSize: '20px', margin: 0 }}>Your Portfolio</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Net Value ($mETH)</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', borderRadius: '8px', color: 'var(--text-main)', display: 'flex' }}
              itemStyle={{ color: 'var(--mantle-green)', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="value" stroke="var(--mantle-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
