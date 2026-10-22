import React, { useState } from 'react';
import { Hand, Sparkles, ArrowLeft } from 'lucide-react';
import { HandRehabCoach } from '../modules/HandRehabCoach';
import { NeuroplasticityPlay } from '../modules/NeuroplasticityPlay';

interface RehabStudioProps {
  onBackToOverview: () => void;
}

export const RehabStudio: React.FC<RehabStudioProps> = ({ onBackToOverview }) => {
  const [subView, setSubView] = useState<'hand-rehab' | 'neuroplasticity'>('hand-rehab');

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
              <span className="badge badge-success">Studio 3</span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Neuroplasticity &amp; Motor Rehab Arena
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Real-time computer vision joint tracking and Hebbian biological synaptogenesis kinetics
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
            onClick={() => setSubView('hand-rehab')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === 'hand-rehab' ? 700 : 500,
              backgroundColor: subView === 'hand-rehab' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'hand-rehab' ? 'var(--green-700)' : 'var(--text-muted)',
              boxShadow: subView === 'hand-rehab' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Hand size={14} />
            <span>Hand Motor CV Coach</span>
          </button>

          <button
            onClick={() => setSubView('neuroplasticity')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === 'neuroplasticity' ? 700 : 500,
              backgroundColor: subView === 'neuroplasticity' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'neuroplasticity' ? 'var(--green-700)' : 'var(--text-muted)',
              boxShadow: subView === 'neuroplasticity' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} />
            <span>Hebbian Synaptogenesis Engine</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      <div>
        {subView === 'hand-rehab' ? <HandRehabCoach /> : <NeuroplasticityPlay />}
      </div>
    </div>
  );
};
