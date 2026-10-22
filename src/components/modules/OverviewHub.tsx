import React from 'react';
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
  HeartPulse
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';

interface OverviewHubProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const OverviewHub: React.FC<OverviewHubProps> = ({ setActiveTab }) => {
  const featureCards = [
    {
      tab: 'golden-hour' as ActiveTab,
      title: 'Golden Hour Survival Clock',
      badge: 'Time is Brain',
      icon: Timer,
      color: 'var(--danger-500)',
      bg: 'var(--danger-50)',
      description: 'Explore the 0–6 hour cellular timeline. Calculate neurons lost per minute and visualize penumbral tissue rescue.'
    },
    {
      tab: 'vision-sim' as ActiveTab,
      title: 'Stroke Vision Simulator',
      badge: 'Sensory Empathy',
      icon: Eye,
      color: 'var(--primary-600)',
      bg: 'var(--primary-50)',
      description: 'Experience clinical hemianopia, diplopia, and hemi-neglect through your live webcam or scenario canvases.'
    },
    {
      tab: 'aphasia-lab' as ActiveTab,
      title: 'Aphasia Word-Struggle Lab',
      badge: 'Cognitive Lab',
      icon: Activity,
      color: 'var(--synapse-600)',
      bg: 'var(--synapse-50)',
      description: 'Breakthrough the language barrier: experience expressive motor speech blocks (Broca) and fluent receptive loss (Wernicke).'
    },
    {
      tab: 'brain-3d' as ActiveTab,
      title: '3D Brain Vessel Explorer',
      badge: 'Three.js WebGL',
      icon: Brain,
      color: 'var(--primary-600)',
      bg: 'var(--primary-50)',
      description: 'Rotate a 3D vascular brain in 360°. Lodge ischemic thrombi or arterial aneurysms in the Circle of Willis.'
    },
    {
      tab: 'neuroplasticity' as ActiveTab,
      title: 'Rewiring Playground',
      badge: 'Synaptogenesis',
      icon: Sparkles,
      color: 'var(--synapse-600)',
      bg: 'var(--synapse-50)',
      description: 'Witness axonal sprouting and synaptogenesis in real time as rehabilitation repetitions rebuild severed neural circuits.'
    },
    {
      tab: 'risk-calculator' as ActiveTab,
      title: 'Personalized Risk Index',
      badge: 'CHA₂DS₂-VASc',
      icon: ShieldAlert,
      color: 'var(--warning-600)',
      bg: 'var(--warning-50)',
      description: 'Calculate your clinical 10-year stroke probability and run AI What-If simulations on blood pressure reduction.'
    },
    {
      tab: 'hand-rehab' as ActiveTab,
      title: 'Hand Motor Rehab Coach',
      badge: 'Computer Vision',
      icon: Hand,
      color: 'var(--success-600)',
      bg: 'var(--success-50)',
      description: 'Computer vision tracking of hand flexion, finger extension, and range-of-motion repetitions right on your device.'
    },
    {
      tab: 'ai-neurologist' as ActiveTab,
      title: 'Multi-Persona AI Neurologist',
      badge: 'OpenRouter AI',
      icon: MessageSquareHeart,
      color: 'var(--primary-600)',
      bg: 'var(--primary-50)',
      description: 'Engage with Dr. Vance (Vascular Neurologist), Prof. Artie (Analogy Master), or Nurse Claire (Caregiver Ally).'
    },
    {
      tab: 'drug-guard' as ActiveTab,
      title: 'Drug & Supplement Guard',
      badge: 'Pharmacology Safety',
      icon: Pill,
      color: 'var(--danger-500)',
      bg: 'var(--danger-50)',
      description: 'Protect against lethal bleeding interactions between prescribed blood thinners and herbal supplements like Ginkgo.'
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{
        padding: '48px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 60%, #e0f2fe 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', fontSize: '12px', fontWeight: 700, marginBottom: '18px' }}>
            <HeartPulse size={16} color="var(--primary-600)" />
            Next-Gen Neurovascular Literacy Platform
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px' }}>
            Understanding Stroke Through <br />
            <span style={{ color: 'var(--primary-600)', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Simulation, 3D Anatomy & AI Empathy
            </span>
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '28px' }}>
            Stroke is the second leading cause of death worldwide, yet over 80% of occurrences are preventable. StrokeSense fuses clinical neuroscience, interactive 3D WebGL vessels, computer vision kinematics, and edge AI to make stroke understanding memorable and actionable.
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

      {/* BE-FAST Educational Quick Reference Bar */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '17px', fontWeight: 700 }}>
              The Essential BE-FAST Early Warning System
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
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-muted)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.letter}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {item.title}
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 9 Feature Cards Grid */}
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Explore the 9 Interactive Clinical Modules
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Select any module to dive into hands-on simulations, risk diagnostics, and physical therapy coaching.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.tab}
                onClick={() => setActiveTab(feat.tab)}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: feat.bg,
                      color: feat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={22} />
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '10.5px' }}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {feat.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
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
