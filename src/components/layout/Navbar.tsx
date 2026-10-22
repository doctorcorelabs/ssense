import React from 'react';
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
  Hand
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSettings }) => {
  const navItems = [
    { id: 'overview', label: 'Hub Overview', icon: Compass },
    { id: 'golden-hour', label: 'Golden Hour Clock', icon: Timer },
    { id: 'vision-sim', label: 'Vision Simulator', icon: Eye },
    { id: 'aphasia-lab', label: 'Aphasia Lab', icon: Activity },
    { id: 'brain-3d', label: '3D Brain Explorer', icon: Brain },
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
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '20px'
      }}>
        {/* Brand Logo */}
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
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}>
            <Brain size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.03em'
              }}>
                Stroke<span style={{ color: 'var(--primary-600)' }}>Sense</span>
              </span>
              <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 8px' }}>
                AI Core
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Vascular Education & Interactive Simulation
            </p>
          </div>
        </div>

        {/* Desktop Navigation Scroll Container */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          padding: '6px 4px',
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
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary-700)' : 'var(--text-body)',
                  backgroundColor: isActive ? 'var(--primary-100)' : 'transparent',
                  border: isActive ? '1px solid var(--primary-200)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--primary-600)' : 'var(--text-muted)'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Connectivity Settings Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenSettings}
            className="btn btn-secondary btn-sm"
            title="Configure Cloudflare Worker or OpenRouter"
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 12px' }}
          >
            <Settings2 size={16} />
            <span style={{ fontSize: '12px' }}>AI Config</span>
          </button>
        </div>
      </div>
    </header>
  );
};
