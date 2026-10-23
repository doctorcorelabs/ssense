import React, { useState } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { Brain, Timer, ArrowLeft, Zap, Dna, Clock } from 'lucide-react';
import { Brain3DExplorer } from '../modules/Brain3DExplorer';
import { GoldenHourClock } from '../modules/GoldenHourClock';
import { VirtualEVTSimulator } from '../modules/VirtualEVTSimulator';
import { AIBrainDigitalTwin } from '../modules/AIBrainDigitalTwin';
import { AIMultiverseTimeline } from '../modules/AIMultiverseTimeline';

type AnatomySubView = '3d-brain' | 'evt-sim' | 'digital-twin' | 'golden-hour' | 'multiverse';

interface AnatomyStudioProps {
  onBackToOverview: () => void;
}

export const AnatomyStudio: React.FC<AnatomyStudioProps> = ({ onBackToOverview }) => {
  const [subView, setSubView] = useState<AnatomySubView>('3d-brain');
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
              <span className="badge badge-primary" style={{ flexShrink: 0 }}>Studio 1</span>
              <h2 style={{ fontSize: 'clamp(17px, 4.5vw, 20px)', fontWeight: 800, color: 'var(--text-primary)' }}>
                Acute Vascular &amp; 3D Anatomy Suite
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Interactive 3D Circle of Willis, Virtual EVT Thrombectomy, AI Brain Digital Twin &amp; Multiverse Timeline
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
            onClick={() => setSubView('3d-brain')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 130px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: subView === '3d-brain' ? 700 : 500,
              backgroundColor: subView === '3d-brain' ? 'var(--bg-surface)' : 'transparent',
              color: subView === '3d-brain' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === '3d-brain' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Brain size={13} />
            <span>3D Neuroanatomy</span>
          </button>

          <button
            onClick={() => setSubView('evt-sim')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 130px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: subView === 'evt-sim' ? 700 : 500,
              backgroundColor: subView === 'evt-sim' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'evt-sim' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === 'evt-sim' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={13} />
            <span>Virtual EVT Simulator</span>
          </button>

          <button
            onClick={() => setSubView('digital-twin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 130px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: subView === 'digital-twin' ? 700 : 500,
              backgroundColor: subView === 'digital-twin' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'digital-twin' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === 'digital-twin' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Dna size={13} />
            <span>AI Brain Digital Twin</span>
          </button>

          <button
            onClick={() => setSubView('golden-hour')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 130px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: subView === 'golden-hour' ? 700 : 500,
              backgroundColor: subView === 'golden-hour' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'golden-hour' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === 'golden-hour' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Timer size={13} />
            <span>Golden Hour &amp; CT</span>
          </button>

          <button
            onClick={() => setSubView('multiverse')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 130px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: subView === 'multiverse' ? 700 : 500,
              backgroundColor: subView === 'multiverse' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'multiverse' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === 'multiverse' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Clock size={13} />
            <span>Multiverse Fate</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      <div style={{ width: '100%', minWidth: 0 }}>
        {subView === '3d-brain' && <Brain3DExplorer />}
        {subView === 'evt-sim' && <VirtualEVTSimulator />}
        {subView === 'digital-twin' && <AIBrainDigitalTwin />}
        {subView === 'golden-hour' && <GoldenHourClock />}
        {subView === 'multiverse' && <AIMultiverseTimeline />}
      </div>
    </div>
  );
};
