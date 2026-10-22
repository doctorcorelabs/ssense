import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Timer, 
  Eye, 
  Activity, 
  Sparkles, 
  ShieldAlert, 
  Hand, 
  MessageSquareHeart, 
  Pill, 
  Settings2,
  HeartPulse,
  Cpu,
  Wifi
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

const navItems = [
  { id: 'overview',         label: 'Overview',       icon: Brain },
  { id: 'brain-3d',         label: '3D Explorer',    icon: Brain },
  { id: 'golden-hour',      label: 'Golden Hour',    icon: Timer },
  { id: 'vision-sim',       label: 'Vision Sim',     icon: Eye },
  { id: 'aphasia-lab',      label: 'Aphasia Lab',    icon: Activity },
  { id: 'neuroplasticity',  label: 'Neuro Rewiring', icon: Sparkles },
  { id: 'risk-calculator',  label: 'Risk Index',     icon: ShieldAlert },
  { id: 'hand-rehab',       label: 'Hand Rehab',     icon: Hand },
  { id: 'ai-neurologist',   label: 'AI Consult',     icon: MessageSquareHeart },
  { id: 'drug-guard',       label: 'Drug Guard',     icon: Pill },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSettings }) => {
  const [heartRate, setHeartRate] = useState<number>(72);
  const [time, setTime] = useState<string>('');

  // Simulate fluctuating vitals
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(68 + Math.floor(Math.random() * 12));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backgroundColor: 'rgba(5,7,9,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      {/* ─── Top Telemetry Strip ─────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: '5px 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* HR Readout */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HeartPulse size={11} color="#ff2d55" />
              <span style={{ color: '#f87171' }}>HR:</span>
              <span style={{ color: '#fca5a5', fontWeight: 600 }}>{heartRate} BPM</span>
            </span>

            {/* CPP */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-active" style={{ width: '5px', height: '5px' }}></span>
              <span>CPP: <span style={{ color: 'var(--cyan-neon)', fontWeight: 600 }}>78 mmHg</span></span>
            </span>

            {/* MCA Doppler */}
            <span style={{ color: 'var(--text-muted)' }}>
              MCA: <span style={{ color: 'var(--text-secondary)' }}>62 cm/s · PI 0.88</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={11} color="var(--cyan-400)" />
              <span style={{ color: 'var(--cyan-400)' }}>openai/gpt-6-luna</span>
              <span className="pulse-active" style={{ width: '5px', height: '5px' }}></span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wifi size={11} color="var(--green-400)" />
              <span style={{ color: 'var(--green-400)' }}>CF Worker Live</span>
            </span>
            <span style={{ color: 'var(--text-subtle)' }}>{time}</span>
          </div>
        </div>
      </div>

      {/* ─── Brand Row ───────────────────────────────────────────── */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '62px',
        gap: '16px',
      }}>
        {/* Brand */}
        <div
          onClick={() => setActiveTab('overview')}
          style={{ display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,245,255,0.2) 0%, rgba(8,145,178,0.35) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0,245,255,0.3)',
            boxShadow: '0 0 20px rgba(0,245,255,0.2)',
            color: 'var(--cyan-neon)',
          }}>
            <Brain size={20} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}>
              Stroke<span style={{
                background: 'linear-gradient(135deg, var(--cyan-neon), var(--cyan-400))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Sense</span>
            </span>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>
              Neurovascular AI · v2.0
            </p>
          </div>
        </div>

        {/* Nav Tabs — scrollable */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          overflowX: 'auto',
          padding: '4px 0',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flex: 1,
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--cyan-neon)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'rgba(0,245,255,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(0,245,255,0.2)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 14px rgba(0,245,255,0.1)' : 'none',
                  transition: 'all var(--dur-base) var(--ease-out)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={13} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="btn btn-secondary btn-sm"
          title="Configure Cloudflare Worker & AI Model"
          style={{ flexShrink: 0 }}
        >
          <Settings2 size={14} />
          Config
        </button>
      </div>
    </header>
  );
};
