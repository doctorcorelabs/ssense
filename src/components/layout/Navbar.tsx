import { 
  Brain, 
  Settings2,
  Wifi,
  ShieldAlert
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab: _activeTab, setActiveTab, onOpenSettings }) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 80,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        gap: '16px'
      }}>
        {/* Brand */}
        <div
          onClick={() => setActiveTab('overview')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--blue-50)',
            border: '1px solid var(--blue-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--blue-600)',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.12)'
          }}>
            <Brain size={20} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.15
            }}>
              Stroke<span style={{ color: 'var(--blue-600)' }}>Sense</span>
            </div>
            <p style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)', 
              fontWeight: 500,
              letterSpacing: '-0.01em' 
            }}>
              Clinical Neurovascular Dossier
            </p>
          </div>
        </div>

        {/* Center: Quick Acute Protocol Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--red-50)',
              border: '1px solid var(--red-200)',
              color: 'var(--red-700)',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
            title="Jump to Acute BE-FAST Evaluation"
          >
            <ShieldAlert size={13} color="var(--red-600)" />
            <span>Acute BE-FAST Protocol</span>
            <span className="pulse-active pulse-danger" style={{ width: '5px', height: '5px' }}></span>
          </button>
        </div>

        {/* Right Utility & Config */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cloudflare Edge status pill */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-surface-sub)',
            border: '1px solid var(--glass-border)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}
          className="md-flex"
          >
            <Wifi size={11} color="var(--green-600)" />
            <span>CF Edge Active</span>
          </div>

          {/* Config Settings Button */}
          <button
            onClick={onOpenSettings}
            className="btn btn-secondary btn-sm"
            title="Edge Telemetry & AI Model Settings"
          >
            <Settings2 size={14} color="var(--text-secondary)" />
            <span>Config</span>
          </button>
        </div>
      </div>
    </header>
  );
};
