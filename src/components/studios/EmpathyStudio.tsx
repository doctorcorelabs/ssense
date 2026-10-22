import React, { useState } from 'react';
import { Eye, Activity, ArrowLeft } from 'lucide-react';
import { VisionSimulator } from '../modules/VisionSimulator';
import { AphasiaLab } from '../modules/AphasiaLab';

interface EmpathyStudioProps {
  onBackToOverview: () => void;
}

export const EmpathyStudio: React.FC<EmpathyStudioProps> = ({ onBackToOverview }) => {
  const [subView, setSubView] = useState<'vision' | 'aphasia'>('vision');

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
              <span className="badge badge-synapse">Studio 2</span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Sensory &amp; Cognitive Empathy Lab
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Firsthand experiential simulation of post-stroke visual field cuts and language barriers
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
            onClick={() => setSubView('vision')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === 'vision' ? 700 : 500,
              backgroundColor: subView === 'vision' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'vision' ? 'var(--violet-700)' : 'var(--text-muted)',
              boxShadow: subView === 'vision' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Eye size={14} />
            <span>Vision Deficits (Webcam / Scenes)</span>
          </button>

          <button
            onClick={() => setSubView('aphasia')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === 'aphasia' ? 700 : 500,
              backgroundColor: subView === 'aphasia' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'aphasia' ? 'var(--violet-700)' : 'var(--text-muted)',
              boxShadow: subView === 'aphasia' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={14} />
            <span>Aphasia Word-Struggle Lab</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      <div>
        {subView === 'vision' ? <VisionSimulator /> : <AphasiaLab />}
      </div>
    </div>
  );
};
