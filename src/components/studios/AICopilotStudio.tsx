import React, { useState } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { Sparkles, Pill, ShieldAlert, ArrowLeft } from 'lucide-react';
import { AINeurologistChat } from '../modules/AINeurologistChat';
import { DrugInteractionGuard } from '../modules/DrugInteractionGuard';
import { RiskCalculator } from '../modules/RiskCalculator';

interface AICopilotStudioProps {
  onBackToOverview: () => void;
}

export const AICopilotStudio: React.FC<AICopilotStudioProps> = ({ onBackToOverview }) => {
  const [subView, setSubView] = useState<'chat' | 'drug-guard' | 'risk'>('chat');
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
              <span className="badge badge-primary" style={{ flexShrink: 0 }}>Studio 4</span>
              <h2 style={{ fontSize: 'clamp(17px, 4.5vw, 20px)', fontWeight: 800, color: 'var(--text-primary)' }}>
                Clinical Copilot &amp; Safety Guard
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Edge-streamed AI vascular neurology consultation, bleeding risk matrix, and epidemiological scoring
            </p>
          </div>
        </div>

        {/* Segmented Sub-view Switcher */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
          padding: '4px',
          borderRadius: isTabletPortrait ? '16px' : 'var(--radius-full)',
          backgroundColor: 'var(--bg-surface-sub)',
          maxWidth: '100%',
          minWidth: 0,
          border: '1px solid var(--glass-border)'
        }}>
          <button
            onClick={() => setSubView('chat')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 140px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === 'chat' ? 700 : 500,
              backgroundColor: subView === 'chat' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'chat' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === 'chat' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} />
            <span>AI Neurologist</span>
          </button>

          <button
            onClick={() => setSubView('drug-guard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 140px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === 'drug-guard' ? 700 : 500,
              backgroundColor: subView === 'drug-guard' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'drug-guard' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === 'drug-guard' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Pill size={14} />
            <span>Drug &amp; Herbal Guard</span>
          </button>

          <button
            onClick={() => setSubView('risk')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '8px 10px' : '6px 14px',
              minHeight: isMobile ? 40 : undefined,
              flex: isMobile ? '1 1 140px' : undefined,
              justifyContent: isMobile ? 'center' : undefined,
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: subView === 'risk' ? 700 : 500,
              backgroundColor: subView === 'risk' ? 'var(--bg-surface)' : 'transparent',
              color: subView === 'risk' ? 'var(--blue-700)' : 'var(--text-muted)',
              boxShadow: subView === 'risk' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <ShieldAlert size={14} />
            <span>Risk Index</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      <div style={{ width: '100%', minWidth: 0 }}>
        {subView === 'chat' && <AINeurologistChat />}
        {subView === 'drug-guard' && <DrugInteractionGuard />}
        {subView === 'risk' && <RiskCalculator />}
      </div>
    </div>
  );
};
