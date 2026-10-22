import React, { useState } from 'react';
import { X, RefreshCw, GitBranch } from 'lucide-react';

interface CircleOfWillisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OcclusionSite = 'none' | 'left-ica' | 'basilar' | 'left-mca' | 'right-ica';

export const CircleOfWillisModal: React.FC<CircleOfWillisModalProps> = ({ isOpen, onClose }) => {
  const [occlusion, setOcclusion] = useState<OcclusionSite>('left-ica');

  if (!isOpen) return null;

  const getCollateralStatus = () => {
    switch (occlusion) {
      case 'left-ica':
        return {
          title: 'Left Internal Carotid Artery (ICA) Occlusion',
          collateralRoute: 'Anterior Collateral Shunt via ACom & Posterior Shunt via PCom',
          compensation: 'Robust / High (92% flow maintained)',
          penumbraRisk: 'Mild transient oligemia. Right ICA pumps retrograde through ACom to supply Left ACA & MCA.',
          clinicalNote: 'Patient may remain asymptomatic or experience only brief TIA if circle is anatomically complete.'
        };
      case 'left-mca':
        return {
          title: 'Left M1 Middle Cerebral Artery (MCA) Occlusion',
          collateralRoute: 'Leptomeningeal Pial Anastomoses from ACA & PCA borders',
          compensation: 'Partial / Fragile (38% flow maintained)',
          penumbraRisk: 'Severe acute penumbral ischemia. Circle of Willis cannot directly bypass M1 trunk. High risk of cortical infarction without rapid reperfusion.',
          clinicalNote: 'Cardinal LVO presentation: Aphasia, right hemiplegia, conjugate eye deviation. Requires emergent EVT.'
        };
      case 'basilar':
        return {
          title: 'Basilar Artery Trunk Occlusion',
          collateralRoute: 'Bilateral Carotid-to-Vertebrobasilar Shunt via Posterior Communicating Arteries (PCom)',
          compensation: 'Moderate (65% flow maintained if bilateral PComs patent)',
          penumbraRisk: 'Top-of-the-basilar syndrome, midbrain & thalamic ischemia, locked-in risk if PComs are hypoplastic or fetal.',
          clinicalNote: 'Critical posterior circulation stroke. Up to 50% of humans have hypoplastic or absent PCom.'
        };
      case 'right-ica':
        return {
          title: 'Right Internal Carotid Artery (ICA) Occlusion',
          collateralRoute: 'Contralateral cross-filling from Left ICA across ACom',
          compensation: 'Robust / High (90% flow maintained)',
          penumbraRisk: 'Preserved left-to-right anterior circulation cross-filling prevents massive hemisphere death.',
          clinicalNote: 'Monitor for carotid siphon thrombus propagation and intracranial embolization.'
        };
      default:
        return {
          title: 'Intact Anatomical Circle of Willis (Baseline)',
          collateralRoute: 'Symmetric Hexagonal Autoregulation',
          compensation: '100% Full Equilibrium',
          penumbraRisk: 'No ischemia. Equal hydrostatic pressure distributed across anterior and posterior circulation.',
          clinicalNote: 'Only ~34% of the human population possesses an entirely classic, complete Circle of Willis.'
        };
    }
  };

  const status = getCollateralStatus();

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
        maxWidth: '860px',
        width: '100%',
        maxHeight: '92vh',
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
                <GitBranch size={13} /> Hemodynamic Anastomosis Engine
              </span>
              <span className={`badge ${occlusion === 'none' ? 'badge-success' : occlusion === 'left-mca' ? 'badge-danger' : 'badge-primary'}`}>
                {occlusion === 'none' ? 'Normal Flow' : 'Collateral Shunt Active'}
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Circle of Willis Collateral Flow &amp; Anastomosis Lab
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Simulate acute vessel occlusions and discover how the primary intracranial collateral ring reroutes cerebral perfusion.
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

        {/* Occlusion Selector Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-canvas)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '4px' }}>
            Occlusion Trigger:
          </span>
          <button
            onClick={() => setOcclusion('left-ica')}
            className={`btn btn-sm ${occlusion === 'left-ica' ? 'btn-danger' : 'btn-secondary'}`}
          >
            Left ICA Clot (ACom Cross-Flow)
          </button>
          <button
            onClick={() => setOcclusion('left-mca')}
            className={`btn btn-sm ${occlusion === 'left-mca' ? 'btn-danger' : 'btn-secondary'}`}
          >
            Left M1 MCA Clot (LVO Ischemia)
          </button>
          <button
            onClick={() => setOcclusion('basilar')}
            className={`btn btn-sm ${occlusion === 'basilar' ? 'btn-danger' : 'btn-secondary'}`}
          >
            Basilar Trunk (PCom Shunt)
          </button>
          <button
            onClick={() => setOcclusion('none')}
            className={`btn btn-sm ${occlusion === 'none' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <RefreshCw size={12} /> Reset to Intact Circle
          </button>
        </div>

        {/* Stage: Interactive SVG Diagram & Telemetry */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'center' }}>
          {/* Left: SVG Diagram of the Circle of Willis */}
          <div style={{
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <svg viewBox="0 0 360 380" style={{ width: '100%', maxWidth: '320px', height: 'auto' }}>
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Reference Grid Circle */}
              <circle cx="180" cy="180" r="130" fill="none" stroke="var(--border-subtle)" strokeDasharray="3 3" opacity="0.6" />

              {/* 1. Anterior Communicating Artery (ACom) */}
              <line
                x1="150" y1="70" x2="210" y2="70"
                stroke={occlusion === 'left-ica' ? '#f59e0b' : '#0284c7'}
                strokeWidth={occlusion === 'left-ica' ? '6' : '4'}
                filter={occlusion === 'left-ica' ? 'url(#glow-cyan)' : undefined}
              />
              <text x="180" y="58" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="700">ACom</text>

              {/* 2. Anterior Cerebral Arteries (ACA Left & Right) */}
              <line x1="150" y1="70" x2="135" y2="25" stroke="#0284c7" strokeWidth="4" />
              <line x1="210" y1="70" x2="225" y2="25" stroke="#0284c7" strokeWidth="4" />
              <text x="125" y="40" textAnchor="end" fill="var(--text-muted)" fontSize="9">R-ACA</text>
              <text x="235" y="40" textAnchor="start" fill="var(--text-muted)" fontSize="9">L-ACA</text>

              {/* ACA roots to ICA bifurcations */}
              <line x1="120" y1="130" x2="150" y2="70" stroke="#0284c7" strokeWidth="5" />
              <line
                x1="240" y1="130" x2="210" y2="70"
                stroke={occlusion === 'left-ica' ? '#e11d48' : '#0284c7'}
                strokeWidth="5"
              />

              {/* 3. Middle Cerebral Arteries (MCA M1 Segments) */}
              <line x1="120" y1="130" x2="40" y2="120" stroke="#0284c7" strokeWidth="6" />
              <text x="35" y="115" textAnchor="end" fill="var(--text-secondary)" fontSize="10" fontWeight="700">R-MCA</text>

              <line
                x1="240" y1="130" x2="320" y2="120"
                stroke={occlusion === 'left-mca' ? '#e11d48' : occlusion === 'left-ica' ? '#f59e0b' : '#0284c7'}
                strokeWidth="6"
                strokeDasharray={occlusion === 'left-mca' ? '4 2' : undefined}
              />
              <text x="325" y="115" textAnchor="start" fill={occlusion === 'left-mca' ? '#e11d48' : 'var(--text-secondary)'} fontSize="10" fontWeight="700">
                {occlusion === 'left-mca' ? 'L-MCA (ISCHEMIC)' : 'L-MCA'}
              </text>

              {/* 4. Internal Carotid Arteries (ICA Left & Right) */}
              <line x1="120" y1="130" x2="120" y2="200" stroke="#0284c7" strokeWidth="7" />
              <text x="105" y="170" textAnchor="end" fill="var(--text-muted)" fontSize="9">R-ICA</text>

              <line
                x1="240" y1="130" x2="240" y2="200"
                stroke={occlusion === 'left-ica' ? '#e11d48' : '#0284c7'}
                strokeWidth="7"
                strokeDasharray={occlusion === 'left-ica' ? '4 2' : undefined}
              />
              <text x="255" y="170" textAnchor="start" fill={occlusion === 'left-ica' ? '#e11d48' : 'var(--text-muted)'} fontSize="9">
                {occlusion === 'left-ica' ? 'L-ICA (CLOT)' : 'L-ICA'}
              </text>

              {/* 5. Posterior Communicating Arteries (PCom Left & Right) */}
              <line x1="120" y1="130" x2="145" y2="225" stroke="#0284c7" strokeWidth="3" />
              <text x="122" y="185" textAnchor="end" fill="var(--text-muted)" fontSize="8">R-PCom</text>

              <line
                x1="240" y1="130" x2="215" y2="225"
                stroke={occlusion === 'basilar' ? '#10b981' : '#0284c7'}
                strokeWidth={occlusion === 'basilar' ? '5' : '3'}
              />
              <text x="238" y="185" textAnchor="start" fill="var(--text-muted)" fontSize="8">L-PCom</text>

              {/* 6. Posterior Cerebral Arteries (PCA P1 & P2 Segments) */}
              <line x1="180" y1="240" x2="145" y2="225" stroke="#0284c7" strokeWidth="4" />
              <line x1="145" y1="225" x2="80" y2="260" stroke="#0284c7" strokeWidth="4" />
              <text x="75" y="275" textAnchor="end" fill="var(--text-muted)" fontSize="9">R-PCA</text>

              <line x1="180" y1="240" x2="215" y2="225" stroke="#0284c7" strokeWidth="4" />
              <line x1="215" y1="225" x2="280" y2="260" stroke="#0284c7" strokeWidth="4" />
              <text x="285" y="275" textAnchor="start" fill="var(--text-muted)" fontSize="9">L-PCA</text>

              {/* 7. Basilar Artery (BA) */}
              <line
                x1="180" y1="240" x2="180" y2="330"
                stroke={occlusion === 'basilar' ? '#e11d48' : '#0284c7'}
                strokeWidth="7"
                strokeDasharray={occlusion === 'basilar' ? '5 2' : undefined}
              />
              <text x="180" y="290" textAnchor="middle" fill={occlusion === 'basilar' ? '#e11d48' : 'var(--text-secondary)'} fontSize="10" fontWeight="700">
                {occlusion === 'basilar' ? 'BASILAR (CLOT)' : 'Basilar Artery'}
              </text>

              {/* 8. Vertebral Arteries (VA Left & Right) */}
              <line x1="150" y1="370" x2="180" y2="330" stroke="#0284c7" strokeWidth="5" />
              <line x1="210" y1="370" x2="180" y2="330" stroke="#0284c7" strokeWidth="5" />
              <text x="145" y="375" textAnchor="end" fill="var(--text-muted)" fontSize="8">R-VA</text>
              <text x="215" y="375" textAnchor="start" fill="var(--text-muted)" fontSize="8">L-VA</text>

              {/* Dynamic Blood Flow Pulsing Dots */}
              {occlusion === 'left-ica' && (
                <circle cx="180" cy="70" r="4" fill="#f59e0b" className="pulse-active pulse-warning" />
              )}
              {occlusion === 'basilar' && (
                <circle cx="215" cy="225" r="4" fill="#10b981" className="pulse-active pulse-success" />
              )}
            </svg>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Legend: Blue = Patent Flow • Red = Complete Occlusion • Amber/Green = Compensatory Collateral Shunt
            </span>
          </div>

          {/* Right: Hemodynamic Compensation Analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              padding: '16px 18px',
              backgroundColor: 'var(--bg-surface-sub)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Active Hemodynamic State
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', marginBottom: '8px' }}>
                {status.title}
              </h4>
              <div style={{ fontSize: '12.5px', color: '#0369a1', fontWeight: 600 }}>
                {status.collateralRoute}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 700 }}>Collateral Efficacy</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {status.compensation}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 700 }}>Tissue Penumbra Status</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: occlusion === 'left-mca' ? '#e11d48' : '#059669', marginTop: '2px' }}>
                  {occlusion === 'left-mca' ? 'Critical Ischemia' : 'Compensated'}
                </div>
              </div>
            </div>

            <div style={{
              padding: '14px',
              backgroundColor: occlusion === 'left-mca' ? 'rgba(225, 29, 72, 0.08)' : 'var(--bg-canvas)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${occlusion === 'left-mca' ? 'rgba(225, 29, 72, 0.25)' : 'var(--glass-border)'}`,
              fontSize: '12px',
              lineHeight: 1.55,
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Hemodynamic Insight: </strong>
              {status.penumbraRisk}
            </div>

            <div style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-sub)',
              borderRadius: 'var(--radius-md)',
              fontSize: '11.5px',
              color: 'var(--text-muted)',
              borderLeft: '3px solid #2563eb'
            }}>
              <strong>Clinical Correlate: </strong>
              {status.clinicalNote}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingTop: '20px',
          marginTop: '20px',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
