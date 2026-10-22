import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Eye, 
  Brain, 
  Timer, 
  Sparkles, 
  ShieldAlert, 
  MessageSquareHeart, 
  Pill, 
  Settings2,
  Compass,
  Hand,
  HeartPulse,
  Cpu
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSettings }) => {
  // Live Simulated Cerebral Telemetry
  const [heartRate, setHeartRate] = useState(72);
  const [cpp, setCpp] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeartRate(70 + Math.floor(Math.random() * 5));
      setCpp(67 + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'brain-3d', label: '3D Vessel Explorer', icon: Brain },
    { id: 'golden-hour', label: 'Golden Hour Clock', icon: Timer },
    { id: 'vision-sim', label: 'Vision Simulator', icon: Eye },
    { id: 'aphasia-lab', label: 'Aphasia Lab', icon: Activity },
    { id: 'neuroplasticity', label: 'Rewiring Playground', icon: Sparkles },
    { id: 'risk-calculator', label: 'Risk Index', icon: ShieldAlert },
    { id: 'hand-rehab', label: 'Hand Rehab Coach', icon: Hand },
    { id: 'ai-neurologist', label: 'AI Neurologist', icon: MessageSquareHeart },
    { id: 'drug-guard', label: 'Drug Guard', icon: Pill },
  ] as const;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-tactile)'
    }}>
      {/* Top Clinical Telemetry Ticker */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        padding: '5px 0',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
              <HeartPulse size={12} color="#f43f5e" />
              <span>HR: {heartRate} BPM (Sinus)</span>
            </span>

            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a7f3d0' }}>
              <span className="pulse-active" style={{ width: '6px', height: '6px', backgroundColor: '#10b981' }}></span>
              <span>Cerebral Perfusion Pressure: {cpp} mmHg [Autoregulated]</span>
            </span>

            <span className="telemetry-mca" style={{ color: '#cbd5e1' }}>
              MCA Doppler: 62 cm/s (PI: 0.88)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#bae6fd' }}>
              <Cpu size={12} color="#38bdf8" />
              <span>Edge AI: openai/gpt-6-luna [Live]</span>
            </span>
            <span style={{ color: '#94a3b8' }}>Evidence-Based Protocol</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        gap: '20px'
      }}>
        {/* Brand Identity */}
        <div 
          onClick={() => setActiveTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0891b2 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(8, 145, 178, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Brain size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '21px',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.035em'
              }}>
                Stroke<span style={{ color: 'var(--primary-600)' }}>Sense</span>
              </span>
              <span className="badge badge-primary" style={{ fontSize: '9.5px', padding: '2px 7px' }}>
                Clinical AI
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.2, fontWeight: 500 }}>
              Neurovascular Intelligence & Simulation
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflowX: 'auto',
          padding: '6px 2px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
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
                  gap: '7px',
                  padding: '8px 13px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary-900)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--primary-100)' : 'transparent',
                  border: isActive ? '1px solid var(--primary-300)' : '1px solid transparent',
                  boxShadow: isActive ? '0 1px 4px rgba(8, 145, 178, 0.15)' : 'none',
                  transition: 'all var(--timing-tactile)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} color={isActive ? 'var(--primary-600)' : 'var(--text-subtle)'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenSettings}
            className="btn btn-secondary btn-sm"
            title="Configure Cloudflare Worker & AI Model"
            style={{ borderRadius: 'var(--radius-full)', padding: '7px 13px', fontSize: '12px' }}
          >
            <Settings2 size={15} />
            <span>AI Config</span>
          </button>
        </div>
      </div>
    </header>
  );
};
