import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Eye, 
  Sparkles, 
  Hand, 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  ChevronRight
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';
import { useResponsive } from '../../hooks/useResponsive';

interface OverviewHubProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const OverviewHub: React.FC<OverviewHubProps> = ({ setActiveTab }) => {
  const { isMobile, isTabletPortrait } = useResponsive();
  // Acute Stroke Time Elapsed Scrubber (minutes since symptom onset)
  const [minutesElapsed, setMinutesElapsed] = useState<number>(75);
  // Selected BE-FAST symptom trigger
  const [selectedBefast, setSelectedBefast] = useState<'B' | 'E' | 'F' | 'A' | 'S' | 'T'>('F');
  // Canvas for live physiological perfusion waveform
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  // Neuron loss formula: Saver JL. Stroke 2006 (1.9 million neurons per minute in untreated acute stroke)
  const neuronsLostMillions = ((minutesElapsed * 1.9)).toFixed(1);
  const synapsesLostBillions = ((minutesElapsed * 14.0)).toFixed(1);

  // Triage window logic
  let treatmentStatus = {
    badge: 'IV Thrombolysis (rTPA / TNK) Eligible',
    badgeClass: 'badge-success',
    color: 'var(--green-700)',
    bg: 'var(--green-50)',
    border: 'var(--green-200)',
    headline: 'Within 4.5-Hour Thrombolytic Window',
    recommendation: 'Door-to-needle goal < 60 mins. Administer IV Alteplase (0.9 mg/kg) or Tenecteplase if non-contrast CT excludes hemorrhage.'
  };

  if (minutesElapsed > 270 && minutesElapsed <= 1440) {
    treatmentStatus = {
      badge: 'Endovascular Thrombectomy (EVT) Window',
      badgeClass: 'badge-primary',
      color: 'var(--blue-700)',
      bg: 'var(--blue-50)',
      border: 'var(--blue-200)',
      headline: 'CT Perfusion / DAWN Trial Salvage Candidate',
      recommendation: 'Mechanical thrombectomy with stent retriever or aspiration catheter indicated if large vessel occlusion (LVO) present with clinical-core mismatch.'
    };
  } else if (minutesElapsed > 1440) {
    treatmentStatus = {
      badge: 'Late / Subacute Medical Management',
      badgeClass: 'badge-warning',
      color: 'var(--amber-700)',
      bg: 'var(--amber-50)',
      border: 'var(--amber-200)',
      headline: 'Penumbra Infarcted — Secondary Prevention Focus',
      recommendation: 'Focus shifts to antiplatelet therapy, blood pressure optimization, statins, and intensive neuro-rehabilitation.'
    };
  }

  // BE-FAST Anatomical Symptom Database
  const befastDetails = {
    B: {
      letter: 'B',
      title: 'Balance & Coordination',
      anatomy: 'Cerebellar Hemispheres & Vestibular Nuclei (PICA / AICA)',
      clinicalExam: 'Sudden truncal ataxia, dysmetria on finger-to-nose, vertigo, or inability to sit unassisted.',
      territory: 'Posterior Inferior Cerebellar Artery (PICA)'
    },
    E: {
      letter: 'E',
      title: 'Eyes & Visual Fields',
      anatomy: 'Occipital Cortex (Brodmann 17) & Cranial Nerves III/IV/VI',
      clinicalExam: 'Homonymous hemianopia, sudden binocular diplopia (double vision), or conjugate gaze deviation.',
      territory: 'Posterior Cerebral Artery (PCA)'
    },
    F: {
      letter: 'F',
      title: 'Facial Asymmetry',
      anatomy: 'Cranial Nerve VII (Facial Motor Nucleus / Corticobulbar Tract)',
      clinicalExam: 'Unilateral flattened nasolabial fold and downward mouth drooping. Forehead wrinkling typically spared in upper motor neuron lesions.',
      territory: 'Middle Cerebral Artery (MCA) Cortical Branches'
    },
    A: {
      letter: 'A',
      title: 'Arm & Limb Drift',
      anatomy: 'Primary Motor Cortex (Precentral Gyrus) & Internal Capsule',
      clinicalExam: 'Pronator drift test: patient holds arms outstretched palms up with eyes closed; weak arm drifts downward and pronates within 10 seconds.',
      territory: 'Contralateral Middle / Anterior Cerebral Artery'
    },
    S: {
      letter: 'S',
      title: 'Speech & Language',
      anatomy: 'Broca\'s Area (Inferior Frontal) & Wernicke\'s Area (Superior Temporal)',
      clinicalExam: 'Expressive dysphasia (broken telegraphic words), receptive sensory aphasia (fluent nonsense), or dysarthria (slurred articulation).',
      territory: 'Dominant (Left) MCA M2/M3 Segments'
    },
    T: {
      letter: 'T',
      title: 'Time to Treatment',
      anatomy: 'Ischemic Penumbra Collateral Circulation',
      clinicalExam: 'Every minute saved salvages 1.9 million neurons. Document exact "last known normal" (LKN) timestamp for emergency triage.',
      territory: 'Systemic Neurovascular Emergency'
    }
  };

  const activeBefast = befastDetails[selectedBefast];

  // Draw continuous physiological hemodynamic pulse
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    let animId: number;

    const draw = () => {
      // DPR-aware sizing: use CSS pixel size for drawing logic, scale the
      // backing store by devicePixelRatio so Retina/phone rendering is sharp
      // and the canvas never exceeds its parent width (overflow guard).
      const cssW = canvas.parentElement?.clientWidth || 400;
      const cssH = 48;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const targetW = Math.round(cssW * dpr);
      const targetH = Math.round(cssH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = cssW;
      const h = cssH;
      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();
      ctx.moveTo(0, h / 2);

      for (let x = 0; x < w; x++) {
        const freq = (x / w) * 6 + t;
        // Doppler pulsatility waveform
        const y = h / 2 - Math.sin(freq) * 14 - Math.sin(freq * 2.5) * 5;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2;
      ctx.stroke();

      t += 0.03;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '32px', paddingBottom: '70px' }}>

      {/* ── BENTO HERO: ACUTE PERFUSION DOSSIER ───────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: isTabletPortrait ? '1fr' : 'minmax(0, 1.4fr) minmax(340px, 1fr)', gap: '20px' }}>

        {/* Bento Tile 1 (Large 60%): Interactive Perfusion Scrubber */}
        <div className="bento-tile" style={{ padding: isMobile ? '20px 18px' : '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
                <span className="badge badge-primary">
                  <Activity size={12} /> Acute Neurovascular Dossier
                </span>
                <span className="badge badge-danger">
                  <Flame size={12} /> Time is Brain
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Saver JL Protocol (Stroke 2006)
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(26px, 3.2vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.18,
              color: 'var(--text-primary)',
              marginBottom: '12px'
            }}>
              Acute Ischemic Stroke:{isMobile ? ' ' : <br />}
              <span style={{ color: 'var(--blue-600)' }}>Every Minute Salvages 1.9 Million Neurons</span>
            </h1>

            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '580px', marginBottom: '24px' }}>
              When a cerebral artery is occluded by a thrombus, structurally viable tissue in the ischemic penumbra dies rapidly without reperfusion. Use the interactive time-slider below to simulate clinical loss and evaluate treatment eligibility windows.
            </p>
          </div>

          {/* Interactive Scrubber Console */}
          <div style={{
            backgroundColor: 'var(--bg-surface-sub)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)',
            padding: isMobile ? '16px' : '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minWidth: 0
          }}>
            {/* Header with values */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ minWidth: 0, flex: isMobile ? '1 1 100%' : undefined }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Time Since Symptom Onset (Last Known Normal)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px', flexWrap: 'wrap', minWidth: 0 }}>
                  <span style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: 1 }}>
                    {Math.floor(minutesElapsed / 60)}h {minutesElapsed % 60}m
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    ({minutesElapsed} total minutes)
                  </span>
                </div>
              </div>

              {/* Necrosis Counter */}
              <div style={{ textAlign: isMobile ? 'left' : 'right', minWidth: 0, flex: isMobile ? '1 1 100%' : undefined }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--red-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Estimated Neuronal Cell Necrosis
                </span>
                <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--red-600)', lineHeight: 1, marginTop: '2px' }}>
                  ~{neuronsLostMillions}M <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>neurons</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  (~{synapsesLostBillions}B synapses)
                </div>
              </div>
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min={10}
                max={360}
                step={5}
                value={minutesElapsed}
                onChange={(e) => setMinutesElapsed(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', height: '6px' }}
                aria-label="Minutes elapsed since stroke symptom onset"
              />
              <div style={isMobile ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' } : { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px 10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ minWidth: 0 }}>0m (Onset)</span>
                <span style={{ color: 'var(--green-700)', fontWeight: 600, minWidth: 0 }}>60m (Door-to-Needle)</span>
                <span style={{ color: 'var(--blue-700)', fontWeight: 600, minWidth: 0 }}>270m (4.5h tPA cutoff)</span>
                <span style={{ minWidth: 0 }}>360m (6h EVT Target)</span>
              </div>
            </div>

            {/* Treatment Decision Guidance Panel */}
            <div style={{
              backgroundColor: treatmentStatus.bg,
              border: `1px solid ${treatmentStatus.border}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px 12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: treatmentStatus.color, minWidth: 0, flex: '1 1 180px' }}>
                  {treatmentStatus.headline}
                </span>
                <span className={`badge ${treatmentStatus.badgeClass}`} style={{ flexShrink: 0 }}>
                  {treatmentStatus.badge}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {treatmentStatus.recommendation}
              </p>
            </div>

            {/* Waveform Canvas */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '4px 10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, flex: '1 1 auto' }}>
                  <HeartPulse size={12} color="var(--blue-600)" />
                  Middle Cerebral Artery (MCA) Doppler Flow Velocity
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', flexShrink: 0 }}>64 cm/s · PI 0.86</span>
              </div>
              <div style={{ height: '48px', overflow: 'hidden', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface)', maxWidth: '100%' }}>
                <canvas ref={waveformCanvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bento Tile 2 (Right 40%): BE-FAST Interactive Clinical Switchboard */}
        <div className="bento-tile" style={{ padding: isMobile ? '20px 18px' : '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: '1 1 200px' }}>
                <ShieldAlert size={18} color="var(--red-600)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>
                  BE-FAST Diagnostic Switchboard
                </h3>
              </div>
              <span className="badge badge-danger" style={{ flexShrink: 0 }}>AHA/ASA Protocol</span>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
              Select any cardinal symptom letter to inspect its anatomical localization, affected vessel territory, and bedside neurological test.
            </p>

            {/* Selector Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: isMobile ? '8px' : '6px', marginBottom: '18px' }}>
              {(['B', 'E', 'F', 'A', 'S', 'T'] as const).map((letter) => {
                const isSelected = selectedBefast === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedBefast(letter)}
                    style={{
                      padding: isMobile ? '12px 0' : '10px 0',
                      minHeight: isMobile ? '44px' : undefined,
                      minWidth: 0,
                      borderRadius: 'var(--radius-md)',
                      fontSize: '15px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-display)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                      backgroundColor: isSelected ? 'var(--blue-600)' : 'var(--bg-surface-sub)',
                      border: isSelected ? '1px solid var(--blue-700)' : '1px solid var(--glass-border)',
                      boxShadow: isSelected ? '0 2px 6px rgba(37,99,235,0.25)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Active Symptom Inspection Card */}
            <div style={{
              padding: isMobile ? '16px' : '18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-sub)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minWidth: 0
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Symptom Identifier
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeBefast.letter} — {activeBefast.title}
                </h4>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Anatomical Localization & Territory
                </span>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
                  {activeBefast.anatomy}
                </p>
                <span style={{ fontSize: '11px', color: 'var(--blue-600)', fontFamily: 'var(--font-mono)' }}>
                  Vessel: {activeBefast.territory}
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Bedside Clinical Examination
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
                  {activeBefast.clinicalExam}
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', minWidth: 0, flex: '1 1 160px' }}>
              Emergency dispatch: Immediate non-contrast CT
            </span>
            <button
              onClick={() => setActiveTab('studio-anatomy')}
              className="btn btn-primary btn-sm"
              style={{ flexShrink: 0 }}
            >
              <span>Explore 3D Vessels</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── THE 4 CONSOLIDATED CLINICAL STUDIOS GATEWAY ───────────────── */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: 'clamp(19px, 2.4vw, 22px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Clinical Studios & Simulation Suites
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Access our four specialized medical workspaces — from rotational 3D neurovascular angiography to sensory empathy chambers and edge AI neurology.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
          
          {/* Studio 1: Vascular 3D & Acute Clock */}
          <div 
            onClick={() => setActiveTab('studio-anatomy')}
            className="bento-tile glass-card-interactive"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--blue-50)',
                color: 'var(--blue-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Brain size={22} />
              </div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                Studio 1 · Three.js WebGL
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Acute Vascular & 3D Anatomy Suite
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Full 360° rotational Circle of Willis arterial model with DSA angiography contrast views, Doppler telemetry, and RAPID CT perfusion mismatch simulation.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12.5px', fontWeight: 700, color: 'var(--blue-600)' }}>
              <span>Enter Vascular Suite</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Studio 2: Sensory & Cognitive Empathy */}
          <div 
            onClick={() => setActiveTab('studio-empathy')}
            className="bento-tile glass-card-interactive"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--violet-50)',
                color: 'var(--violet-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Eye size={22} />
              </div>
              <span className="badge badge-synapse" style={{ marginBottom: '8px' }}>
                Studio 2 · Sensory Empathy
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Sensory & Cognitive Empathy Lab
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Real-time webcam homonymous hemianopia and diplopia optical filters paired with Broca's motor speech blocks and Wernicke's fluent receptive aphasia simulator.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12.5px', fontWeight: 700, color: 'var(--violet-600)' }}>
              <span>Enter Empathy Lab</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Studio 3: Neuroplasticity & Motor Rehab */}
          <div 
            onClick={() => setActiveTab('studio-rehab')}
            className="bento-tile glass-card-interactive"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--green-50)',
                color: 'var(--green-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Hand size={22} />
              </div>
              <span className="badge badge-success" style={{ marginBottom: '8px' }}>
                Studio 3 · Computer Vision
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Neuroplasticity & Motor Rehab Arena
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                MediaPipe client-side hand joint tracking with dynamic range-of-motion (ROM) arc detection and real-time Hebbian synaptogenesis rewiring engine.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12.5px', fontWeight: 700, color: 'var(--green-600)' }}>
              <span>Enter Rehab Arena</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Studio 4: AI Neurologist & Safety Guard */}
          <div 
            onClick={() => setActiveTab('studio-ai')}
            className="bento-tile glass-card-interactive"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--blue-50)',
                color: 'var(--blue-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Sparkles size={22} />
              </div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                Studio 4 · OpenRouter Edge
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Clinical Copilot & Safety Guard
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Edge-streamed AI consultation with 3 clinical personas, paired with a bleeding risk matrix (Warfarin + Ginkgo interactions) and CHA₂DS₂-VASc risk index.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12.5px', fontWeight: 700, color: 'var(--blue-600)' }}>
              <span>Enter AI Copilot</span>
              <ArrowRight size={14} />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
