import React, { useState } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { Eye, Activity, ArrowLeft, Sparkles } from 'lucide-react';
import { VisionSimulator } from '../modules/VisionSimulator';
import { AphasiaLab } from '../modules/AphasiaLab';
import { AISensoryAgnosiaFilter } from '../modules/AISensoryAgnosiaFilter';

type EmpathySubView = 'vision' | 'sensory-agnosia' | 'aphasia';

interface EmpathyStudioProps {
  onBackToOverview: () => void;
}

export const EmpathyStudio: React.FC<EmpathyStudioProps> = ({ onBackToOverview }) => {
  const [subView, setSubView] = useState<EmpathySubView>('vision');
  const { isMobile, isTabletPortrait } = useResponsive();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '70px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Studio Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', minWidth: 0, flex: '1 1 auto' }}>
          <button
            onClick={onBackToOverview}
            className="btn btn-secondary btn-sm"
            title="Return to Overview"
            style={{ minHeight: isMobile ? 40 : undefined, minWidth: isMobile ? 40 : undefined, flexShrink: 0 }}
          >
            <ArrowLeft size={14} />
            <span>Overview</span>
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
              <span className="badge badge-synapse" style={{ flexShrink: 0 }}>Studio 2</span>
              <h2 style={{ fontSize: 'clamp(17px, 4.5vw, 20px)', fontWeight: 800, color: 'var(--text-primary)' }}>
                Sensory &amp; Cognitive Empathy Lab
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Experiential simulation of visual field cuts, AI sensory agnosia breakdown &amp; aphasia language barriers
            </p>
          </div>
        </div>

        {/* Segmented Sub-view Switcher */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          padding: '4px',
          borderRadius: isTabletPortrait ? '16px' : 'var(--radius-full)',
          backgroundColor: 'var(--bg-surface-sub)',
          maxWidth: '100%',
          minWidth: 0,
          border: '1px solid var(--glass-border)',
          gap: '2px'
        }}>
          <button
            onClick={() => setSubView('vision')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 150px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: subView === 'vision' ? 700 : 500,
              backgroundColor: subView === 'vision' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'vision' ? 'var(--violet-700)' : 'var(--text-muted)',
              boxShadow: subView === 'vision' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Eye size={13} />
            <span>Vision Field Deficits</span>
          </button>

          <button
            onClick={() => setSubView('sensory-agnosia')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 150px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: subView === 'sensory-agnosia' ? 700 : 500,
              backgroundColor: subView === 'sensory-agnosia' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'sensory-agnosia' ? 'var(--violet-700)' : 'var(--text-muted)',
              boxShadow: subView === 'sensory-agnosia' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={13} />
            <span>AI Sensory Agnosia Filter</span>
          </button>

          <button
            onClick={() => setSubView('aphasia')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 150px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: subView === 'aphasia' ? 700 : 500,
              backgroundColor: subView === 'aphasia' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'aphasia' ? 'var(--violet-700)' : 'var(--text-muted)',
              boxShadow: subView === 'aphasia' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={13} />
            <span>Aphasia Language Lab</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      <div style={{ width: '100%', minWidth: 0 }}>
        {subView === 'vision' && <VisionSimulator />}
        {subView === 'sensory-agnosia' && <AISensoryAgnosiaFilter />}
        {subView === 'aphasia' && <AphasiaLab />}
      </div>
    </div>
  );
};
