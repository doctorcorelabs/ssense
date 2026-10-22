import React, { useState } from 'react';
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
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Clock,
  Zap
} from 'lucide-react';

import type { ActiveTab } from '../../types/stroke';

interface OverviewHubProps {
  setActiveTab: (tab: ActiveTab) => void;
}

type ModuleCategory = 'all' | 'sim' | 'clinical' | 'rehab';

export const OverviewHub: React.FC<OverviewHubProps> = ({ setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('all');

  const featureCards = [
    {
      tab: 'golden-hour' as ActiveTab,
      category: 'clinical',
      title: 'Golden Hour Survival Clock',
      badge: 'Time is Brain',
      icon: Timer,
      color: 'var(--danger-600)',
      bg: 'var(--danger-50)',
      description: 'Explore the 0–6 hour cellular timeline. Calculate neurons lost per minute and visualize penumbral tissue rescue.'
    },
    {
      tab: 'vision-sim' as ActiveTab,
      category: 'sim',
      title: 'Stroke Vision Simulator',
      badge: 'Sensory Empathy',
      icon: Eye,
      color: 'var(--primary-600)',
      bg: 'var(--primary-50)',
      description: 'Experience clinical hemianopia, diplopia, and hemi-neglect through your live webcam or scenario canvases.'
    },
    {
      tab: 'aphasia-lab' as ActiveTab,
      category: 'sim',
      title: 'Aphasia Word-Struggle Lab',
      badge: 'Cognitive Lab',
      icon: Activity,
      color: 'var(--synapse-600)',
      bg: 'var(--synapse-50)',
      description: 'Breakthrough the language barrier: experience expressive motor speech blocks (Broca) and fluent receptive loss (Wernicke).'
    },
    {
      tab: 'brain-3d' as ActiveTab,
      category: 'sim',
      title: '3D Brain Vessel Explorer',
      badge: 'Three.js WebGL',
      icon: Brain,
      color: 'var(--primary-600)',
      bg: 'var(--primary-50)',
      description: 'Rotate a 3D vascular brain in 360°. Lodge ischemic thrombi or arterial aneurysms in the Circle of Willis.'
    },
    {
      tab: 'neuroplasticity' as ActiveTab,
      category: 'sim',
      title: 'Rewiring Playground',
      badge: 'Synaptogenesis',
      icon: Sparkles,
      color: 'var(--synapse-600)',
      bg: 'var(--synapse-50)',
      description: 'Witness axonal sprouting and synaptogenesis in real time as rehabilitation repetitions rebuild severed neural circuits.'
    },
    {
      tab: 'risk-calculator' as ActiveTab,
      category: 'clinical',
      title: 'Personalized Risk Index',
      badge: 'CHA₂DS₂-VASc',
      icon: ShieldAlert,
      color: 'var(--warning-600)',
      bg: 'var(--warning-50)',
      description: 'Calculate your clinical 10-year stroke probability and run AI What-If simulations on blood pressure reduction.'
    },
    {
      tab: 'hand-rehab' as ActiveTab,
      category: 'rehab',
      title: 'Hand Motor Rehab Coach',
      badge: 'Computer Vision',
      icon: Hand,
      color: 'var(--success-600)',
      bg: 'var(--success-50)',
      description: 'Computer vision tracking of hand flexion, finger extension, and range-of-motion repetitions right on your device.'
    },
    {
      tab: 'ai-neurologist' as ActiveTab,
      category: 'rehab',
      title: 'Multi-Persona AI Neurologist',
      badge: 'OpenRouter AI',
      icon: MessageSquareHeart,
      color: 'var(--primary-600)',
      bg: 'var(--primary-50)',
      description: 'Engage with Dr. Vance (Vascular Neurologist), Prof. Artie (Analogy Master), or Nurse Claire (Caregiver Ally).'
    },
    {
      tab: 'drug-guard' as ActiveTab,
      category: 'clinical',
      title: 'Drug & Supplement Guard',
      badge: 'Pharmacology Safety',
      icon: Pill,
      color: 'var(--danger-600)',
      bg: 'var(--danger-50)',
      description: 'Protect against lethal bleeding interactions between prescribed blood thinners and herbal supplements like Ginkgo.'
    },
  ];

  const filteredCards = selectedCategory === 'all' 
    ? featureCards 
    : featureCards.filter((c) => c.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{
        padding: '48px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 55%, #ecfeff 100%)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(8, 145, 178, 0.2)'
      }}>
        {/* Subtle decorative background pulse */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 145, 178, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '840px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-900)',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '18px',
            border: '1px solid var(--primary-200)'
          }}>
            <HeartPulse size={15} color="var(--primary-600)" />
            Neurovascular Intelligence & Simulation Platform
          </div>

          <h1 style={{
            fontSize: '44px',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            Understanding Stroke Through <br />
            <span style={{
              background: 'linear-gradient(135deg, #0891b2 0%, #0284c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Interactive Simulation, 3D Vessels & Edge AI
            </span>
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '28px' }}>
            Stroke claims a life every 3 minutes globally, yet over 80% are completely preventable. StrokeSense transforms complex neurological science into tactile 3D WebGL experiences, live sensory impairment simulators, and AI rehabilitation coaching.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <button
              onClick={() => setActiveTab('brain-3d')}
              className="btn btn-primary btn-lg"
            >
              <Brain size={18} />
              Launch 3D Brain Explorer
            </button>

            <button
              onClick={() => setActiveTab('golden-hour')}
              className="btn btn-secondary btn-lg"
            >
              <Timer size={18} />
              View Golden Hour Clock
            </button>
          </div>
        </div>
      </div>

      {/* Critical Biometric Stats Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--danger-50)',
            color: 'var(--danger-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--danger-600)', fontFamily: 'var(--font-mono)' }}>
              1.9 Million
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Neurons lost per minute untreated</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--success-50)',
            color: 'var(--success-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--success-600)', fontFamily: 'var(--font-mono)' }}>
              80% +
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preventable with BP control</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary-600)', fontFamily: 'var(--font-mono)' }}>
              0 – 4.5 Hours
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Golden tPA rescue window</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--synapse-50)',
            color: 'var(--synapse-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--synapse-600)', fontFamily: 'var(--font-mono)' }}>
              Neuroplastic
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active synaptic rewiring</span>
          </div>
        </div>
      </div>

      {/* BE-FAST Educational Quick Reference Bar */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
              The Essential BE-FAST Early Warning Protocol
            </h3>
          </div>
          <span className="badge badge-danger">Immediate Action Required</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
          {[
            { letter: 'B', title: 'Balance', desc: 'Sudden loss of balance, dizziness, or stumbling.' },
            { letter: 'E', title: 'Eyes', desc: 'Sudden loss of vision or double vision (diplopia).' },
            { letter: 'F', title: 'Face', desc: 'One side of face drooping, smile is noticeably uneven.' },
            { letter: 'A', title: 'Arms', desc: 'One arm is weak, numb, or drifts downwards when raised.' },
            { letter: 'S', title: 'Speech', desc: 'Slurred, garbled, or completely unable to speak.' },
            { letter: 'T', title: 'Time', desc: 'Time to call emergency services immediately.' }
          ].map((item) => (
            <div
              key={item.letter}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-muted)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(8, 145, 178, 0.3)'
                }}>
                  {item.letter}
                </span>
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {item.title}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 9 Feature Cards Section with Category Filters */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              Interactive Clinical & Simulation Modules
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Select any module to dive into hands-on simulations, risk diagnostics, and physical therapy coaching.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Modules (9)' },
              { id: 'sim', label: 'Anatomy & Simulation (4)' },
              { id: 'clinical', label: 'Clinical & Risk (3)' },
              { id: 'rehab', label: 'AI & Rehab (2)' }
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ModuleCategory)}
                  className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '12.5px' }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.tab}
                onClick={() => setActiveTab(feat.tab)}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: feat.bg,
                      color: feat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                      <Icon size={22} />
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '10.5px' }}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {feat.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: 'var(--primary-600)',
                  marginTop: '4px'
                }}>
                  <span>Open Interactive Module</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
