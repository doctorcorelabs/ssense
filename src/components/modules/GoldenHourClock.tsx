import React, { useState } from 'react';
import { 
  Timer, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Syringe, 
  Stethoscope,
  Flame
} from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

export const GoldenHourClock: React.FC = () => {
  const { isMobile, isTabletPortrait } = useResponsive();
  // Time in minutes (0 to 360, default at 80 mins / 1.33 hours)
  const [minutes, setMinutes] = useState<number>(80);

  // Biological loss formulas based on Saver JL. (Stroke 2006; 37:263-266)
  // Acute untreated large vessel occlusion (LVO) MCA stroke:
  // 1.9 million neurons / minute
  // 14 billion synapses / minute
  // 12 km (7.5 miles) myelinated nerve fibers / minute
  // 3.1 weeks of accelerated brain aging per minute
  const neuronsLost = Math.floor(minutes * 1.9 * 1_000_000);
  const synapsesLost = Math.floor(minutes * 14 * 1_000_000_000);
  const agingWeeks = Math.floor(minutes * 3.1);
  const fiberKm = (minutes * 12).toFixed(1);

  // Infarct Core vs Penumbra dynamics:
  // Total at-risk territory: ~120 mL (typical MCA territory)
  // Core volume starts small (~10 mL) and expands up to ~110 mL at 6 hours
  // Penumbra starts large (~110 mL) and shrinks towards 0 mL
  const coreVolume = Math.min(115, Math.round(8 + (minutes / 360) * 105));
  const penumbraVolume = Math.max(0, 120 - coreVolume);
  const mismatchRatio = coreVolume > 0 ? (penumbraVolume / coreVolume).toFixed(1) : '9.9';

  // ASPECTS Score (Alberta Stroke Program Early CT Score: 10 is normal, 0 is total MCA infarct)
  const aspectsScore = Math.max(1, Math.round(10 - (minutes / 360) * 8.5));

  // Determine clinical triage window
  let windowCategory: 'golden' | 'extended-iv' | 'evt-only' | 'late-salvage';
  if (minutes <= 180) {
    windowCategory = 'golden';
  } else if (minutes <= 270) {
    windowCategory = 'extended-iv';
  } else if (minutes <= 360) {
    windowCategory = 'evt-only';
  } else {
    windowCategory = 'late-salvage';
  }

  const presets = [
    { label: '30m (EMS On-Scene)', mins: 30 },
    { label: '60m (Door-to-Needle Target)', mins: 60 },
    { label: '150m (CT Suite)', mins: 150 },
    { label: '240m (4h Window)', mins: 240 },
    { label: '360m (6h EVT Window)', mins: 360 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Visual Stroke Pathology Hero Banner with Real 3D Asset */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '0', 
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: isTabletPortrait ? '1fr' : 'minmax(320px, 1.2fr) minmax(280px, 0.8fr)',
        }}
      >
        <div style={{ padding: isMobile ? '24px 20px 20px' : '36px 36px 32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-danger">
              <Flame size={13} /> Time is Brain Protocol
            </span>
            <span className="badge badge-primary">
              <Timer size={13} /> Saver JL. Hemodynamic Model
            </span>
            <span className="badge badge-warning">
              {minutes <= 60 ? `${minutes} Mins Elapsed` : `${(minutes / 60).toFixed(1)}h Elapsed`}
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Golden Hour & Penumbra Survival Console
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
            During an acute large vessel occlusion (LVO), an untreated ischemic stroke eliminates <strong>1.9 million neurons every minute</strong>. Explore the cellular clock, witness the salvageable penumbra shrink into the necrotic core, and analyze real-world thrombolysis and mechanical thrombectomy windows.
          </p>

          {/* Quick Presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', marginRight: '6px' }}>
              CLINICAL PRESETS:
            </span>
            {presets.map((p) => (
              <button
                key={p.mins}
                onClick={() => setMinutes(p.mins)}
                className={`btn btn-sm ${minutes === p.mins ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px', padding: '5px 12px' }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photorealistic 3D Clot Asset Visual */}
        <div style={{ position: 'relative', minHeight: isMobile ? '180px' : '260px', overflow: 'hidden' }}>
          <img 
            src="/assets/ischemic_clot_vessel.jpg" 
            alt="Arterial Thrombus Obstructing Blood Flow in Cerebral Vessel" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              objectPosition: 'center'
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0) 100%)',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
              <span className="pulse-active" style={{ backgroundColor: '#ef4444' }}></span>
              Acute Thromboembolic Occlusion (MCA M1 Bifurcation)
            </div>
            <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
              Fibrin mesh & erythrocyte entrapment arresting cerebral perfusion
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Scrubbing Station */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cyan-300)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Interactive Elapsed Time Controller
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Time Elapsed from Last Known Well (LKW)
            </h3>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan-300)', fontFamily: 'var(--font-mono)' }}>
              {Math.floor(minutes / 60)}h {minutes % 60}m
            </span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
              ({minutes} minutes)
            </span>
          </div>
        </div>

        {/* High-Fidelity Custom Styled Range Slider */}
        <div style={{ position: 'relative', margin: '24px 0 16px' }}>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            style={{
              width: '100%',
              height: '14px',
              borderRadius: '7px',
              background: 'linear-gradient(to right, #10b981 0%, #06b6d4 40%, #f59e0b 65%, #f43f5e 85%, #be123c 100%)',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)'
            }}
          />

          {/* Time Milestone Pins */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(120px, 1fr))' : 'repeat(5, 1fr)',
            gap: isMobile ? '12px' : '0px',
            marginTop: '12px', 
            fontSize: '12px',
            textAlign: 'center'
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#059669' }}>0h (Onset)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>100% Penumbra</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0891b2' }}>3.0h (Standard IV)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>tPA / TNK Max</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#d97706' }}>4.5h (Extended IV)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>ECASS-3 Limit</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#e11d48' }}>6.0h (Standard EVT)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Stent Retriever</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: '#881337' }}>24.0h (DAWN/DEFUSE-3)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Perfusion Mismatch</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cellular Decay Live Metric Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Neurons Destroyed
            </span>
            <Zap size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {(neuronsLost / 1_000_000).toFixed(1)} M
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Loss velocity: 1.9 million neurons / min
          </p>
          <div style={{ 
            marginTop: '12px', 
            padding: '6px 10px', 
            backgroundColor: '#fff1f2', 
            borderRadius: 'var(--radius-sm)',
            fontSize: '11.5px',
            color: '#be123c',
            fontWeight: 600
          }}>
            {(neuronsLost).toLocaleString()} functional cortical cells lost
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Synapses Severed
            </span>
            <Activity size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {(synapsesLost / 1_000_000_000).toFixed(1)} Billion
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Loss velocity: 14 billion synapses / min
          </p>
          <div style={{ 
            marginTop: '12px', 
            padding: '6px 10px', 
            backgroundColor: '#f5f3ff', 
            borderRadius: 'var(--radius-sm)',
            fontSize: '11.5px',
            color: '#6d28d9',
            fontWeight: 600
          }}>
            {(synapsesLost / 1_000_000_000).toFixed(2)} trillion synaptic connections erased
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #0891b2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Myelinated Fibers
            </span>
            <Clock size={18} color="#0891b2" />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {fiberKm} km
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            12 km (7.5 miles) of white matter / min
          </p>
          <div style={{ 
            marginTop: '12px', 
            padding: '6px 10px', 
            backgroundColor: '#ecfeff', 
            borderRadius: 'var(--radius-sm)',
            fontSize: '11.5px',
            color: '#0e7490',
            fontWeight: 600
          }}>
            Accelerated brain decay: +{agingWeeks} weeks
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              ASPECTS Score
            </span>
            <ShieldAlert size={18} color={aspectsScore >= 7 ? '#10b981' : '#e11d48'} />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: aspectsScore >= 7 ? '#059669' : '#e11d48', fontFamily: 'var(--font-mono)' }}>
            {aspectsScore} / 10
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Alberta Stroke Program Early CT Score
          </p>
          <div style={{ 
            marginTop: '12px', 
            padding: '6px 10px', 
            backgroundColor: aspectsScore >= 7 ? '#f0fdf4' : '#fff1f2', 
            borderRadius: 'var(--radius-sm)',
            fontSize: '11.5px',
            color: aspectsScore >= 7 ? '#15803d' : '#be123c',
            fontWeight: 600
          }}>
            {aspectsScore >= 7 ? 'Favorable parenchyma for EVT' : 'Extensive early ischemic change'}
          </div>
        </div>
      </div>

      {/* Realistic CT Perfusion (CTP) Mismatch Visualization Console */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-primary">RAPID CTP Perfusion Software Simulation</span>
              <span className="badge badge-danger">LVO MCA Territory Mismatch</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Axial CT Perfusion Mismatch Map & Tissue Viability
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-time differentiation between irreversibly infarcted core (CBF &lt; 30%) and salvageable ischemic penumbra (Tmax &gt; 6.0s).
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{
              flex: '1 1 140px',
              padding: '12px 18px',
              backgroundColor: '#fff1f2',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fecdd3',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase' }}>Infarct Core</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#be123c', fontFamily: 'var(--font-mono)' }}>
                {coreVolume} mL
              </div>
              <span style={{ fontSize: '11px', color: '#9f1239' }}>CBF &lt; 30% (Necrotic)</span>
            </div>

            <div style={{
              flex: '1 1 140px',
              padding: '12px 18px',
              backgroundColor: '#ecfeff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #a5f3fc',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0891b2', textTransform: 'uppercase' }}>Penumbra</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0e7490', fontFamily: 'var(--font-mono)' }}>
                {penumbraVolume} mL
              </div>
              <span style={{ fontSize: '11px', color: '#155e75' }}>Tmax &gt; 6s (Salvageable)</span>
            </div>

            <div style={{
              flex: '1 1 140px',
              padding: '12px 18px',
              backgroundColor: Number(mismatchRatio) >= 1.8 ? '#f0fdf4' : '#fffbeb',
              borderRadius: 'var(--radius-md)',
              border: '1px solid ' + (Number(mismatchRatio) >= 1.8 ? '#bbf7d0' : '#fde68a'),
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: Number(mismatchRatio) >= 1.8 ? '#15803d' : '#b45309', textTransform: 'uppercase' }}>Mismatch Ratio</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: Number(mismatchRatio) >= 1.8 ? '#15803d' : '#b45309', fontFamily: 'var(--font-mono)' }}>
                {mismatchRatio}x
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: &ge; 1.8x</span>
            </div>
          </div>
        </div>

        {/* Anatomical Axial CT Slice Canvas Graphics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isTabletPortrait ? '1fr' : 'minmax(280px, 340px) 1fr',
          gap: isTabletPortrait ? '20px' : '32px',
          alignItems: 'center'
        }}>
          {/* Simulated CT Scan Slice Display */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            backgroundColor: '#090d16',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid #1e293b',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* SVG Axial CT Slice Graphic */}
            <svg viewBox="0 0 300 300" style={{ width: '92%', height: '92%' }}>
              <defs>
                {/* Glow filter for penumbra */}
                <filter id="penumbra-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="brain-tissue" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2a3342" />
                  <stop offset="85%" stopColor="#1f2937" />
                  <stop offset="100%" stopColor="#111827" />
                </radialGradient>
              </defs>

              {/* Skull contour */}
              <ellipse cx="150" cy="150" rx="130" ry="142" fill="#030712" stroke="#475569" strokeWidth="6" />

              {/* Brain Parenchyma Outline */}
              <ellipse cx="150" cy="150" rx="122" ry="134" fill="url(#brain-tissue)" />

              {/* Interhemispheric Falx Cerebri fissure */}
              <line x1="150" y1="20" x2="150" y2="280" stroke="#0f172a" strokeWidth="3" />

              {/* Lateral Ventricles (CSF spaces) */}
              <path d="M 144 110 C 138 130 138 160 144 185 C 146 170 146 130 144 110 Z" fill="#030712" />
              <path d="M 156 110 C 162 130 162 160 156 185 C 154 170 154 130 156 110 Z" fill="#030712" />

              {/* Right MCA Territory: Salvageable Penumbra (Luminous Cyan) */}
              <circle
                cx="90"
                cy="145"
                r={Math.min(62, 28 + (120 - coreVolume) * 0.35)}
                fill="#06b6d4"
                opacity={penumbraVolume > 5 ? "0.65" : "0.1"}
                filter="url(#penumbra-glow)"
              />

              {/* Right MCA Territory: Expanding Necrotic Infarct Core (Crimson Red) */}
              <circle
                cx="90"
                cy="145"
                r={Math.min(65, 12 + coreVolume * 0.45)}
                fill="#ef4444"
                opacity="0.88"
                filter="url(#penumbra-glow)"
              />

              {/* Clot obstruction marker */}
              <circle cx="120" cy="150" r="4.5" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
              <text x="126" y="146" fill="#f8fafc" fontSize="11" fontWeight="bold">M1 LVO</text>

              {/* Annotations */}
              <text x="35" y="45" fill="#94a3b8" fontSize="11" fontFamily="monospace">AXIAL CT PERFUSION</text>
              <text x="35" y="60" fill="#38bdf8" fontSize="11" fontFamily="monospace">RAPID-CTP AUTOMATED</text>
              <text x="220" y="45" fill="#f43f5e" fontSize="11" fontFamily="monospace">R-HEMISPHERE</text>
            </svg>

            {/* Scan Overlay Metadata Box */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              right: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(4px)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px 12px',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#cbd5e1',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{ color: '#38bdf8' }}>Cyan: Penumbra (Tmax &gt; 6s)</span>
              <span style={{ color: '#f87171' }}>Red: Core (rCBF &lt; 30%)</span>
            </div>
          </div>

          {/* Clinical Decision & Triage Pathway */}
          <div>
            <div style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: windowCategory === 'golden' ? '#f0fdf4' : windowCategory === 'extended-iv' ? '#fffbeb' : '#fff1f2',
              border: '1px solid ' + (windowCategory === 'golden' ? '#bbf7d0' : windowCategory === 'extended-iv' ? '#fde68a' : '#fecdd3'),
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {windowCategory === 'golden' && <CheckCircle2 size={24} color="#15803d" />}
                {windowCategory === 'extended-iv' && <Syringe size={24} color="#b45309" />}
                {windowCategory === 'evt-only' && <AlertTriangle size={24} color="#be123c" />}
                {windowCategory === 'late-salvage' && <XCircle size={24} color="#991b1b" />}

                <div>
                  <h4 style={{ 
                    fontSize: '17px', 
                    fontWeight: 800, 
                    color: windowCategory === 'golden' ? '#14532d' : windowCategory === 'extended-iv' ? '#78350f' : '#881337' 
                  }}>
                    {windowCategory === 'golden' && 'Optimal IV Thrombolysis Window (0 - 3.0 Hours)'}
                    {windowCategory === 'extended-iv' && 'Extended IV Thrombolysis Window (3.0 - 4.5 Hours)'}
                    {windowCategory === 'evt-only' && 'Mechanical Thrombectomy Primary Window (4.5 - 6.0 Hours)'}
                    {windowCategory === 'late-salvage' && 'Extended Window Perfusion Criteria (6.0 - 24.0 Hours)'}
                  </h4>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Evidence Level: Class I, Level A (AHA/ASA 2019 Acute Stroke Guidelines)
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.55, marginTop: '8px' }}>
                {windowCategory === 'golden' && 'Patient is within the prime therapeutic window. Administer IV Alteplase (0.9 mg/kg) or Tenecteplase (0.25 mg/kg) immediately if CT head excludes hemorrhage and no contraindications exist. Prepare concurrently for catheter angio if LVO confirmed.'}
                {windowCategory === 'extended-iv' && 'Eligible for IV tPA under ECASS-3 inclusion criteria (caution if age > 80, NIHSS > 25, or prior stroke + diabetes). Rapidly transfer to Neuro-Interventional Suite for potential bridging EVT.'}
                {windowCategory === 'evt-only' && 'Exceeds standard IV tPA time window. Patient is prime candidate for Endovascular Thrombectomy (EVT) using stent-retriever (Solitaire/Trevo) or contact aspiration if ASPECTS >= 6.'}
                {windowCategory === 'late-salvage' && `Standard time window expired. EVT remains strongly indicated under DAWN / DEFUSE-3 clinical trial criteria if CT Perfusion demonstrates target mismatch (Core < 70 mL, Mismatch Ratio >= 1.8x, Salvageable Penumbra >= 15 mL). Current mismatch: ${mismatchRatio}x.`}
              </p>
            </div>

            {/* Step-by-Step Triage Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-raised)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Stethoscope size={18} color="var(--cyan-400)" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>NIHSS Scoring</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Quantifies neurologic deficit (0-42)</div>
                </div>
              </div>

              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-raised)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Syringe size={18} color="var(--cyan-400)" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Door-to-Needle</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Target: &le; 45 minutes of arrival</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
