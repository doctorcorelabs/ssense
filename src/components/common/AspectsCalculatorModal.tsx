import React, { useState } from 'react';
import { X, Layers, Info } from 'lucide-react';

interface AspectsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AspectRegion {
  id: string;
  name: string;
  category: 'subcortical' | 'ganglionic' | 'supraganglionic';
  description: string;
  normal: boolean;
}

export const AspectsCalculatorModal: React.FC<AspectsCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [regions, setRegions] = useState<AspectRegion[]>([
    { id: 'C', name: 'Caudate Head', category: 'subcortical', description: 'Head of caudate nucleus', normal: true },
    { id: 'L', name: 'Lentiform Nucleus', category: 'subcortical', description: 'Putamen and globus pallidus', normal: true },
    { id: 'IC', name: 'Internal Capsule', category: 'subcortical', description: 'Posterior limb of internal capsule', normal: true },
    { id: 'I', name: 'Insular Ribbon', category: 'subcortical', description: 'Insular cortex and extreme capsule', normal: true },
    { id: 'M1', name: 'M1 Cortex', category: 'ganglionic', description: 'Anterior MCA territory at ganglionic level', normal: true },
    { id: 'M2', name: 'M2 Cortex', category: 'ganglionic', description: 'MCA cortex lateral to insular ribbon', normal: true },
    { id: 'M3', name: 'M3 Cortex', category: 'ganglionic', description: 'Posterior MCA territory at ganglionic level', normal: true },
    { id: 'M4', name: 'M4 Cortex', category: 'supraganglionic', description: 'Anterior MCA territory 2cm above ganglionic cut', normal: true },
    { id: 'M5', name: 'M5 Cortex', category: 'supraganglionic', description: 'Lateral MCA territory immediately superior to M2', normal: true },
    { id: 'M6', name: 'M6 Cortex', category: 'supraganglionic', description: 'Posterior MCA territory immediately superior to M3', normal: true }
  ]);

  if (!isOpen) return null;

  const score = regions.filter((r) => r.normal).length;

  const toggleRegion = (id: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, normal: !r.normal } : r))
    );
  };

  const resetAll = (allNormal: boolean) => {
    setRegions((prev) => prev.map((r) => ({ ...r, normal: allNormal })));
  };

  const getClinicalInterpretation = () => {
    if (score >= 8) {
      return {
        badge: 'badge-success',
        title: 'Minimal / Early Focal Ischemia (ASPECTS 8 - 10)',
        desc: 'Favorable core volume (< 30 mL). Strongly indicated for IV thrombolysis and Endovascular Thrombectomy (EVT). High probability of functional independence (mRS 0-2).',
        recommendation: 'Immediate cath lab transfer; proceed with stent-retriever thrombectomy.'
      };
    } else if (score >= 6) {
      return {
        badge: 'badge-primary',
        title: 'Moderate Infarct Core (ASPECTS 6 - 7)',
        desc: 'Meets definitive DAWN & DEFUSE 3 trial inclusion criteria. Proven net clinical benefit for mechanical recanalization up to 24 hours with acceptable hemorrhagic risk.',
        recommendation: 'EVT indicated. Screen collateral robustness via CTA or CT Perfusion mismatch.'
      };
    } else {
      return {
        badge: 'badge-danger',
        title: 'Extensive Irreversible Core (ASPECTS 0 - 5)',
        desc: 'Large ischemic core (> 70-100 mL). Elevated hazard of malignant cerebral edema and secondary hemorrhagic transformation (sICH).',
        recommendation: 'Evaluate under extended SELECT-2 / RESCUE-JAPAN large-core trial criteria with intensive ICU monitoring.'
      };
    }
  };

  const interpretation = getClinicalInterpretation();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(7, 11, 20, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '820px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px 32px',
        borderRadius: 'var(--radius-xl)',
        position: 'relative',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-float)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">
                <Layers size={13} /> Alberta Stroke Program Early CT Score
              </span>
              <span className={`badge ${interpretation.badge}`}>
                ASPECTS {score} / 10
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Interactive ASPECTS 10-Point CT Slice Heatmap
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Click any anatomical zone to toggle early ischemic changes (hypodensity, sulcal effacement, loss of gray-white distinction).
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Score Telemetry Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '160px 1fr',
          gap: '20px',
          padding: '18px 22px',
          backgroundColor: 'var(--bg-surface-sub)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid var(--glass-border)', paddingRight: '16px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Computed Score
            </span>
            <div style={{
              fontSize: '44px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1,
              marginTop: '4px',
              color: score >= 8 ? '#059669' : score >= 6 ? '#2563eb' : '#e11d48'
            }}>
              {score}<span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>/10</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {score === 10 ? 'Normal NCCT' : `${10 - score} Zones Ischemic`}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {interpretation.title}
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
              {interpretation.desc}
            </p>
            <div style={{ fontSize: '11.5px', color: '#0369a1', fontWeight: 600 }}>
              Guideline Recommendation: {interpretation.recommendation}
            </div>
          </div>
        </div>

        {/* Interactive Zone Switchboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
          {/* Ganglionic Level (Axial Slice 1) */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Ganglionic Cut (Basal Ganglia Level)
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>7 Anatomical Zones</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {regions.slice(0, 7).map((r) => (
                <div
                  key={r.id}
                  onClick={() => toggleRegion(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: r.normal ? 'var(--bg-surface)' : 'rgba(225, 29, 72, 0.1)',
                    border: `1px solid ${r.normal ? 'var(--glass-border)' : 'var(--red-400)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '26px',
                      height: '22px',
                      lineHeight: '22px',
                      textAlign: 'center',
                      borderRadius: '4px',
                      backgroundColor: r.normal ? 'var(--blue-50)' : 'var(--red-600)',
                      color: r.normal ? 'var(--blue-700)' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {r.id}
                    </span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{r.name}</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{r.description}</div>
                    </div>
                  </div>

                  <span className={`badge ${r.normal ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '10px' }}>
                    {r.normal ? 'Patent (1 pt)' : 'Infarct (-1 pt)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Supraganglionic Level (Axial Slice 2) */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Supraganglionic Cut (Centrum Semiovale)
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>3 Cortical Zones (+2cm)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {regions.slice(7).map((r) => (
                <div
                  key={r.id}
                  onClick={() => toggleRegion(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: r.normal ? 'var(--bg-surface)' : 'rgba(225, 29, 72, 0.1)',
                    border: `1px solid ${r.normal ? 'var(--glass-border)' : 'var(--red-400)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '26px',
                      height: '22px',
                      lineHeight: '22px',
                      textAlign: 'center',
                      borderRadius: '4px',
                      backgroundColor: r.normal ? 'var(--blue-50)' : 'var(--red-600)',
                      color: r.normal ? 'var(--blue-700)' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {r.id}
                    </span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{r.name}</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{r.description}</div>
                    </div>
                  </div>

                  <span className={`badge ${r.normal ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '10px' }}>
                    {r.normal ? 'Patent (1 pt)' : 'Infarct (-1 pt)'}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Presets */}
            <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Preset Clinical Scenarios:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  onClick={() => resetAll(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Clear All (Score 10)
                </button>
                <button
                  onClick={() => {
                    setRegions((prev) =>
                      prev.map((r) => (['M1', 'M2', 'I', 'L'].includes(r.id) ? { ...r, normal: false } : { ...r, normal: true }))
                    );
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Proximal M1 (Score 6)
                </button>
                <button
                  onClick={() => {
                    setRegions((prev) =>
                      prev.map((r) => (['C', 'L', 'IC', 'I', 'M1', 'M2', 'M4'].includes(r.id) ? { ...r, normal: false } : { ...r, normal: true }))
                    );
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Malignant MCA (Score 3)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid var(--glass-border)',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} />
            <span>Pagonabarraga J et al. Stroke 2000; 31:1608-1615 (AHA/ASA Level I, Class A Validated)</span>
          </div>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
