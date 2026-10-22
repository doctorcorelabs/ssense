import React, { useEffect } from 'react';
import { 
  Home, 
  Brain, 
  Eye, 
  Hand, 
  Sparkles
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';

interface CommandDockProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

interface DockItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  shortcut: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  activeColor: string;
}

export const CommandDock: React.FC<CommandDockProps> = ({ activeTab, setActiveTab }) => {
  const items: DockItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      shortLabel: 'Hub',
      shortcut: '1',
      icon: Home,
      activeColor: 'var(--blue-600)'
    },
    {
      id: 'studio-anatomy',
      label: 'Vascular 3D',
      shortLabel: 'Anatomy',
      shortcut: '2',
      icon: Brain,
      activeColor: 'var(--blue-600)'
    },
    {
      id: 'studio-empathy',
      label: 'Sensory Empathy',
      shortLabel: 'Empathy',
      shortcut: '3',
      icon: Eye,
      activeColor: 'var(--violet-600)'
    },
    {
      id: 'studio-rehab',
      label: 'Motor Rehab',
      shortLabel: 'Rehab',
      shortcut: '4',
      icon: Hand,
      activeColor: 'var(--green-600)'
    },
    {
      id: 'studio-ai',
      label: 'AI Neurologist',
      shortLabel: 'AI Consult',
      shortcut: '5',
      icon: Sparkles,
      activeColor: 'var(--blue-600)'
    }
  ];

  // Global keyboard shortcuts (1, 2, 3, 4, 5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === '1') setActiveTab('overview');
      else if (e.key === '2') setActiveTab('studio-anatomy');
      else if (e.key === '3') setActiveTab('studio-empathy');
      else if (e.key === '4') setActiveTab('studio-rehab');
      else if (e.key === '5') setActiveTab('studio-ai');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  const isCurrentActive = (item: DockItem) => {
    if (activeTab === item.id) return true;
    if (item.id === 'studio-anatomy' && ['brain-3d', 'golden-hour'].includes(activeTab)) return true;
    if (item.id === 'studio-empathy' && ['vision-sim', 'aphasia-lab'].includes(activeTab)) return true;
    if (item.id === 'studio-rehab' && ['hand-rehab', 'neuroplasticity'].includes(activeTab)) return true;
    if (item.id === 'studio-ai' && ['ai-neurologist', 'drug-guard', 'risk-calculator'].includes(activeTab)) return true;
    return false;
  };

  return (
    <nav 
      aria-label="Floating Studio Navigation"
      className="command-dock"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = isCurrentActive(item);

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: active ? 700 : 500,
              color: active ? '#FFFFFF' : 'var(--text-secondary)',
              backgroundColor: active ? item.activeColor : 'transparent',
              boxShadow: active ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
              transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative'
            }}
            title={`${item.label} (Press ${item.shortcut})`}
          >
            <Icon size={15} color={active ? '#FFFFFF' : 'currentColor'} />
            <span>{item.shortLabel}</span>
            <span style={{
              fontSize: '9.5px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 5px',
              borderRadius: '4px',
              backgroundColor: active ? 'rgba(255, 255, 255, 0.22)' : 'var(--bg-surface-sub)',
              color: active ? '#FFFFFF' : 'var(--text-muted)',
              marginLeft: '2px'
            }}>
              {item.shortcut}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
