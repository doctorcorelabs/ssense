import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Eye, 
  Activity, 
  Brain, 
  Sparkles, 
  ShieldAlert, 
  Hand, 
  MessageSquareHeart, 
  Pill, 
  ShieldCheck, 
  HeartPulse, 
  Clock, 
  Zap, 
  Gauge,
  Microscope,
  ChevronRight,
  Cpu
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';

interface OverviewHubProps {
  setActiveTab: (tab: ActiveTab) => void;
}

type ModuleCategory = 'all' | 'sim' | 'clinical' | 'rehab';

export const OverviewHub: React.FC<OverviewHubProps> = ({ setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('all');
  const [cbfValue, setCbfValue] = useState<number>(54);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // CBF clinical thresholds
  let cbfStatus = {
    tier: 'Normal Perfusion',
    color: 'var(--green-neon)',
    borderColor: 'rgba(0,255,136,0.25)',
    bgColor: 'rgba(0,255,136,0.06)',
    description: 'ATP synthesis intact. Neurons maintain normal electrical rhythms and ion homeostasis.',
  };

  if (cbfValue <= 10) {
    cbfStatus = { tier: 'Infarct Core', color: 'var(--red-neon)', borderColor: 'rgba(255,45,85,0.3)', bgColor: 'rgba(255,45,85,0.06)', description: 'Irreversible necrosis. Complete ATP failure and cytotoxic cell swelling within minutes.' };
  } else if (cbfValue <= 22) {
    cbfStatus = { tier: 'Ischemic Penumbra', color: '#ff6b35', borderColor: 'rgba(255,107,53,0.3)', bgColor: 'rgba(255,107,53,0.06)', description: 'Salvageable! Structurally viable but electrically silent neurons. Urgent reperfusion required.' };
  } else if (cbfValue <= 45) {
    cbfStatus = { tier: 'Oligemia', color: 'var(--amber-400)', borderColor: 'rgba(251,191,36,0.3)', bgColor: 'rgba(251,191,36,0.06)', description: 'Compensatory vasodilation. Oxygen extraction near maximum. Vulnerable to further drops.' };
  }

  // Animated CBF waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;
    let animId: number;

    const draw = () => {
      const w = canvas.width = canvas.parentElement?.clientWidth || 500;
      const h = canvas.height = 64;
      ctx.clearRect(0, 0, w, h);

      // ECG-style wave
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      for (let x = 0; x < w; x++) {
        const phase = (x / w * 6 + t) % (Math.PI * 2);
        const amplitude = cbfValue / 60 * 20;
        const y = h / 2 - Math.sin(phase) * amplitude - Math.sin(phase * 3) * (amplitude * 0.3);
        ctx.lineTo(x, y);
      }

      const isNormal = cbfValue > 45;
      const lineColor = isNormal ? '#00ff88' : cbfValue > 22 ? '#ff6b35' : cbfValue > 10 ? '#ff9d4a' : '#ff2d55';
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = lineColor;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moving scan line
      const scanX = (t * 60) % w;
      const scanGrad = ctx.createLinearGradient(scanX - 40, 0, scanX + 5, 0);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(1, lineColor);
      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 40, 0, 45, h);

      t += 0.02;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [cbfValue]);

  const featureCards = [
    {
      tab: 'brain-3d' as ActiveTab,
      category: 'sim',
      title: '3D Brain Vessel Explorer',
      badge: 'Three.js WebGL',
      thumbnail: '/assets/cerebral_vascular_brain.jpg',
      icon: Brain,
      accentColor: 'rgba(0,245,255,0.3)',
      glowColor: 'rgba(0,245,255,0.12)',
      description: 'Interactive 360° Circle of Willis arterial model with DSA angiography contrast mode and Doppler telemetry.'
    },
    {
      tab: 'golden-hour' as ActiveTab,
      category: 'clinical',
      title: 'Golden Hour Survival Clock',
      badge: 'Time is Brain',
      thumbnail: '/assets/ischemic_clot_vessel.jpg',
      icon: Timer,
      accentColor: 'rgba(255,45,85,0.3)',
      glowColor: 'rgba(255,45,85,0.1)',
      description: 'Real-time RAPID CT perfusion mismatch simulator. 1.9M neurons/min loss counter and tPA/EVT decision console.'
    },
    {
      tab: 'neuroplasticity' as ActiveTab,
      category: 'sim',
      title: 'Neuroplasticity Rewiring Lab',
      badge: 'Synaptogenesis',
      thumbnail: '/assets/synapse_rewiring_cortex.jpg',
      icon: Sparkles,
      accentColor: 'rgba(191,95,255,0.3)',
      glowColor: 'rgba(191,95,255,0.1)',
      description: 'Witness peri-infarct collateral axonal sprouting and BDNF-mediated synaptogenesis in real time via interactive canvas.'
    },
    {
      tab: 'vision-sim' as ActiveTab,
      category: 'sim',
      title: 'Stroke Vision Simulator',
      badge: 'Sensory Empathy',
      icon: Eye,
      accentColor: 'rgba(0,245,255,0.25)',
      glowColor: 'rgba(0,245,255,0.08)',
      description: 'Live webcam hemianopia, diplopia, and hemi-neglect simulation via real-time canvas filter overlays.'
    },
    {
      tab: 'aphasia-lab' as ActiveTab,
      category: 'sim',
      title: 'Aphasia Word-Struggle Lab',
      badge: 'Cognitive Empathy',
      icon: Activity,
      accentColor: 'rgba(191,95,255,0.25)',
      glowColor: 'rgba(191,95,255,0.08)',
      description: "Simulate Broca's expressive motor blocks, Wernicke's fluent word salad, and anomic tip-of-the-tongue paralysis."
    },
    {
      tab: 'risk-calculator' as ActiveTab,
      category: 'clinical',
      title: 'Personalized Risk Index',
      badge: 'CHA₂DS₂-VASc',
      icon: ShieldAlert,
      accentColor: 'rgba(251,191,36,0.25)',
      glowColor: 'rgba(251,191,36,0.08)',
      description: 'Clinical 10-year stroke probability engine with AI-powered modifiable risk factor lifestyle intervention analysis.'
    },
    {
      tab: 'hand-rehab' as ActiveTab,
      category: 'rehab',
      title: 'Hand Motor Rehab Coach',
      badge: 'Computer Vision',
      icon: Hand,
      accentColor: 'rgba(0,255,136,0.25)',
      glowColor: 'rgba(0,255,136,0.08)',
      description: 'Client-side kinematic joint tracking for finger extension, thumb opposition ROM, and confetti celebration milestones.'
    },
    {
      tab: 'ai-neurologist' as ActiveTab,
      category: 'rehab',
      title: 'AI Neurologist Console',
      badge: 'OpenRouter Live',
      icon: MessageSquareHeart,
      accentColor: 'rgba(0,245,255,0.25)',
      glowColor: 'rgba(0,245,255,0.08)',
      description: 'Edge-streamed clinical AI with 3 expert personas: Vascular Neurologist, Analogy Educator, and Recovery Coach.'
    },
    {
      tab: 'drug-guard' as ActiveTab,
      category: 'clinical',
      title: 'Drug & Supplement Guard',
      badge: 'Pharmacology Safety',
      icon: Pill,
      accentColor: 'rgba(255,45,85,0.25)',
      glowColor: 'rgba(255,45,85,0.08)',
      description: 'Critical bleeding risk matrix: Warfarin + Ginkgo interactions, CYP450 enzyme induction, INR destabilization alerts.'
    },
  ];

  const filteredCards = selectedCategory === 'all'
    ? featureCards
    : featureCards.filter((c) => c.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingTop: '8px' }}>

      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.3fr) minmax(360px, 0.9fr)',
        gap: '0',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid rgba(0,245,255,0.12)',
        boxShadow: '0 0 0 1px rgba(0,245,255,0.06), 0 32px 80px -16px rgba(0,0,0,0.8), 0 0 80px -20px rgba(0,245,255,0.08)',
        background: 'rgba(5,7,9,0.6)',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Left: Content */}
        <div style={{
          padding: '52px 52px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background grid */}
          <div className="bg-grid" style={{
            position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none'
          }} />

          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: '-60px', left: '-60px',
            width: '280px', height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span className="badge badge-cyan">
                <Microscope size={11} /> Clinical Neurovascular AI
              </span>
              <span className="badge badge-red">
                <Zap size={11} /> 1.9M Neurons / Minute
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px, 4vw, 50px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              marginBottom: '18px',
              fontFamily: 'var(--font-display)',
            }}>
              Every Second Counts.{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--cyan-neon) 0%, var(--cyan-400) 60%, var(--violet-400) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Master Stroke.
              </span>
            </h1>

            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '32px', maxWidth: '520px' }}>
              When a cerebral artery occludes, <strong style={{ color: 'var(--text-primary)' }}>1.9 million neurons die every minute</strong>. StrokeSense delivers military-grade 3D vascular simulation, real-time sensory deficit empathy tools, and evidence-based AI consultation.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '36px' }}>
              <button onClick={() => setActiveTab('brain-3d')} className="btn btn-primary btn-lg">
                <Brain size={17} /> Explore 3D Vasculature
              </button>
              <button onClick={() => setActiveTab('golden-hour')} className="btn btn-secondary btn-lg">
                <Timer size={17} /> Golden Hour Clock
              </button>
            </div>

            {/* Live CBF Perfusion Panel */}
            <div style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: cbfStatus.bgColor,
              border: `1px solid ${cbfStatus.borderColor}`,
              transition: 'all 0.3s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', fontWeight: 700 }}>
                  <Gauge size={14} style={{ color: cbfStatus.color }} />
                  <span style={{ color: cbfStatus.color }}>CBF: {cbfValue} mL/100g/min</span>
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: cbfStatus.borderColor,
                  color: cbfStatus.color,
                  border: `1px solid ${cbfStatus.borderColor}`,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {cbfStatus.tier}
                </span>
              </div>

              {/* Animated ECG canvas */}
              <div style={{ overflow: 'hidden', borderRadius: '6px', marginBottom: '10px' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '64px', display: 'block' }} />
              </div>

              <input
                type="range"
                min={0} max={60} value={cbfValue}
                onChange={e => setCbfValue(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', height: '5px' }}
              />
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.45 }}>
                {cbfStatus.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: 3D Medical Visual */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '480px', borderLeft: '1px solid rgba(0,245,255,0.08)' }}>
          <img
            src="/assets/cerebral_vascular_brain.jpg"
            alt="3D Cerebral Vascular Brain Angiography"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Dark overlay for depth */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(5,7,9,0.3) 0%, rgba(5,7,9,0.1) 50%, rgba(5,7,9,0.6) 100%)',
          }} />
          {/* Bottom annotation chip */}
          <div style={{
            position: 'absolute', bottom: '20px', right: '20px', left: '20px',
            backgroundColor: 'rgba(5,7,9,0.82)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,245,255,0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span className="pulse-active" style={{ width: '6px', height: '6px' }} />
              <span style={{ color: 'var(--cyan-neon)', fontWeight: 700 }}>Middle Cerebral Artery (MCA)</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Dominant stroke LVO territory · Circle of Willis simulation active
            </p>
          </div>
        </div>
      </div>

      {/* ── VITAL STATS ROW ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {[
          { icon: Zap, label: 'Neurons / Minute', value: '1.9 Million', color: 'var(--red-neon)', bg: 'rgba(255,45,85,0.07)', border: 'rgba(255,45,85,0.18)', sub: 'Lost in untreated stroke' },
          { icon: Clock, label: 'IV tPA Window', value: '0 – 4.5 h', color: 'var(--cyan-neon)', bg: 'rgba(0,245,255,0.05)', border: 'rgba(0,245,255,0.15)', sub: 'Alteplase / Tenecteplase' },
          { icon: ShieldCheck, label: 'Preventable Strokes', value: '80%+', color: 'var(--green-neon)', bg: 'rgba(0,255,136,0.05)', border: 'rgba(0,255,136,0.15)', sub: 'Via BP/lifestyle control' },
          { icon: Sparkles, label: 'Neuroplasticity', value: 'BDNF-Driven', color: 'var(--violet-400)', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.18)', sub: 'Hebbian synaptogenesis' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card" style={{
              padding: '22px 24px',
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              backgroundColor: stat.bg,
              borderColor: stat.border,
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: stat.bg,
                border: `1px solid ${stat.border}`,
                color: stat.color,
                boxShadow: `0 0 16px ${stat.bg}`,
              }}>
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: stat.color, fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                  {stat.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── BE-FAST CONSOLE ──────────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: '36px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(255,45,85,0.12)', border: '1px solid rgba(255,45,85,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--red-400)',
              boxShadow: '0 0 18px rgba(255,45,85,0.12)',
            }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                BE-FAST Anatomical Warning Protocol
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Each symptom maps directly to a compromised vascular territory
              </p>
            </div>
          </div>
          <span className="badge badge-red">
            <span className="pulse-active pulse-danger" style={{ width: '6px', height: '6px' }} />
            High Clinical Urgency
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { letter: 'B', title: 'Balance', anatomy: 'Cerebellum / Vestibular', desc: 'Sudden ataxia, unsteady gait, or loss of equilibrium.', color: 'var(--cyan-neon)', bg: 'rgba(0,245,255,0.06)', border: 'rgba(0,245,255,0.14)' },
            { letter: 'E', title: 'Eyes', anatomy: 'CN III/IV/VI or Occipital', desc: 'Diplopia or sudden partial blindness in both eyes.', color: 'var(--violet-400)', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.16)' },
            { letter: 'F', title: 'Face', anatomy: 'Cranial Nerve VII Nucleus', desc: 'Asymmetric smile. Facial drooping on one side.', color: 'var(--amber-400)', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.16)' },
            { letter: 'A', title: 'Arms', anatomy: 'Corticospinal Motor Tract', desc: 'Unilateral arm weakness; drifts when raised.', color: '#fb7185', bg: 'rgba(251,113,133,0.06)', border: 'rgba(251,113,133,0.16)' },
            { letter: 'S', title: 'Speech', anatomy: "Broca's / Wernicke's Cortex", desc: 'Slurred or incomprehensible speech.', color: 'var(--green-neon)', bg: 'rgba(0,255,136,0.06)', border: 'rgba(0,255,136,0.14)' },
            { letter: 'T', title: 'Time', anatomy: 'Penumbra Salvage Clock', desc: 'Every minute = 1.9M neurons lost. Act now.', color: 'var(--red-neon)', bg: 'rgba(255,45,85,0.08)', border: 'rgba(255,45,85,0.22)' },
          ].map((item) => (
            <div key={item.letter} style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: item.bg,
              border: `1px solid ${item.border}`,
              transition: 'all var(--dur-base) var(--ease-out)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
                  backgroundColor: item.bg, border: `1px solid ${item.border}`,
                  color: item.color, fontWeight: 800, fontSize: '17px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  boxShadow: `0 0 14px ${item.bg}`,
                }}>
                  {item.letter}
                </span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '10px', color: item.color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {item.anatomy}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODULE BAYS ──────────────────────────────────────────────── */}
      <div>
        {/* Section Header + Filters */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.025em', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              Clinical Simulation{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--cyan-neon), var(--violet-400))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Intelligence Bays</span>
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              Launch specialized interactive modules — anatomy sim, cognitive lab, AI consultation, or physical rehab.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All 9' },
              { id: 'sim', label: 'Simulation' },
              { id: 'clinical', label: 'Clinical' },
              { id: 'rehab', label: 'Rehab & AI' },
            ].map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ModuleCategory)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.tab}
                onClick={() => setActiveTab(feat.tab)}
                className="glass-card glass-card-interactive"
                style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Thumbnail or Icon header */}
                {feat.thumbnail ? (
                  <div style={{ height: '148px', position: 'relative', overflow: 'hidden' }}>
                    <img src={feat.thumbnail} alt={feat.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(5,7,9,0.8) 0%, rgba(5,7,9,0) 60%)',
                    }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="badge badge-cyan" style={{ backdropFilter: 'blur(8px)' }}>
                        {feat.badge}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: '72px',
                    background: `linear-gradient(135deg, ${feat.glowColor} 0%, transparent 100%)`,
                    borderBottom: `1px solid ${feat.accentColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 22px',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: feat.glowColor, border: `1px solid ${feat.accentColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: feat.accentColor.replace('rgba(', '#').replace(/,0\.\d+\)/, ''),
                    }}>
                      <Icon size={20} color="white" style={{ opacity: 0.9 }} />
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {feat.badge}
                    </span>
                  </div>
                )}

                <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.015em' }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {feat.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginTop: '18px', fontSize: '13px', fontWeight: 700,
                    color: 'var(--cyan-400)',
                  }}>
                    <span>Enter Clinical Bay</span>
                    <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PLATFORM STACK FOOTER ─────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: '24px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={16} color="var(--cyan-400)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Powered by Edge AI
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['React 18', 'Three.js 3D', 'MediaPipe CV', 'Cloudflare Edge', 'OpenRouter AI', 'Netlify CI/CD'].map(t => (
            <span key={t} className="badge badge-cyan" style={{ fontSize: '10px' }}>{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
};
