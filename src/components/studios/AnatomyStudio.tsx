import React, { useState } from 'react';
import { Brain, Timer, ArrowLeft } from 'lucide-react';
import { Brain3DExplorer } from '../modules/Brain3DExplorer';
import { GoldenHourClock } from '../modules/GoldenHourClock';

interface AnatomyStudioProps {
  onBackToOverview: () => void;
}

export const AnatomyStudio: React.FC<AnatomyStudioProps> = ({ onBackToOverview }) => {
  const [subView, setSubView] = useState<'3d-brain' | 'golden-hour'>('3d-brain');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '70px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBackToOverview}
            className="btn btn-secondary btn-sm"
            title="Return to Overview"
          >
            <ArrowLeft size={14} />
            <span>Overview</span>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">Studio 1</span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Acute Vascular &amp; 3D Anatomy Suite
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Interactive Circle of Willis arterial hemodynamics &amp; RAPID CT perfusion salvage timing
            </p>
          </div>
        </div>

        {/* Segmented Sub-view Switcher */}
        <div style={{
          display: 'flex',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-surface-sub)',
          border: '1px solid var(--glass-border)'
        }}>
          <button
            onClick={() => setSubView('3d-brain')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === '3d-brain' ? 700 : 500,
              backgroundColor: subView === '3d-brain' ? 'var(--bg-surface)' : 'transparent',
              color: subView === '3d-brain' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === '3d-brain' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Brain size={14} />
            <span>3D Circle of Willis</span>
          </button>

          <button
            onClick={() => setSubView('golden-hour')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === 'golden-hour' ? 700 : 500,
              backgroundColor: subView === 'golden-hour' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'golden-hour' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === 'golden-hour' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Timer size={14} />
            <span>Golden Hour &amp; CT Mismatch</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      <div>
        {subView === '3d-brain' ? <Brain3DExplorer /> : <GoldenHourClock />}
      </div>
    </div>
  );
};
