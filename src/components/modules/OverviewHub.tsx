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
  Zap, 
  Gauge,
  Microscope
} from 'lucide-react';
import type { ActiveTab } from '../../types/stroke';

interface OverviewHubProps {
  setActiveTab: (tab: ActiveTab) => void;
}

type ModuleCategory = 'all' | 'sim' | 'clinical' | 'rehab';

export const OverviewHub: React.FC<OverviewHubProps> = ({ setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('all');
  
  // Interactive Cerebral Blood Flow (CBF) Simulation Slider (0 to 60 mL/100g/min)
  const [cbfValue, setCbfValue] = useState<number>(54);

  // CBF clinical thresholds
  let cbfStatus = {
    tier: 'Normal Perfusion (Homeostatic)',
    color: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    description: 'Neurons maintain normal ion homeostasis, ATP synthesis, and rhythmic electrical action potentials.',
    tissueState: 'Healthy Viable Parenchyma'
  };

  if (cbfValue <= 10) {
    cbfStatus = {
      tier: 'Infarction Core (Necrosis)',
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
      description: 'Complete failure of cellular energy (ATP depletion). Irreversible membrane depolarisation and cytotoxic cell death occurs within minutes.',
      tissueState: 'Irreversible Infarction Core'
    };
  } else if (cbfValue <= 22) {
    cbfStatus = {
      tier: 'Ischemic Penumbra (Critical Window)',
      color: '#ea580c',
      bg: '#fff7ed',
      border: '#fed7aa',
      description: 'Electrical silence: Neurons stop firing signals to conserve ATP. Structurally viable for hours if reperfusion therapy (tPA / Thrombectomy) is administered.',
      tissueState: 'Salvageable Penumbral Tissue'
    };
  } else if (cbfValue <= 45) {
    cbfStatus = {
      tier: 'Oligemia (Compensatory Dilation)',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      description: 'Compensatory autoregulatory cerebral vasodilation maintains basic oxidative metabolism, but oxygen extraction fraction is maximal.',
      tissueState: 'Compensated Oligemia'
    };
  }

  const featureCards = [
    {
      tab: 'brain-3d' as ActiveTab,
      category: 'sim',
      title: '3D Brain Vessel Explorer',
      badge: 'Three.js WebGL',
      thumbnail: '/assets/cerebral_vascular_brain.jpg',
      icon: Brain,
      color: '#0891b2',
      description: 'Interactive 360° Circle of Willis arterial model. Lodge virtual thrombi or aneurysms in the MCA, ACA, or PCA.'
    },
    {
      tab: 'golden-hour' as ActiveTab,
      category: 'clinical',
      title: 'Golden Hour Survival Clock',
      badge: 'Time is Brain',
      thumbnail: '/assets/ischemic_clot_vessel.jpg',
      icon: Timer,
      color: '#dc2626',
      description: 'Real-time cellular countdown (1.9M neurons & 14B synapses/min). Dynamic penumbra vs core expansion simulator.'
    },
    {
      tab: 'neuroplasticity' as ActiveTab,
      category: 'sim',
      title: 'Rewiring Playground',
      badge: 'Synaptogenesis',
      thumbnail: '/assets/synapse_rewiring_cortex.jpg',
      icon: Sparkles,
      color: '#6366f1',
      description: 'Witness peri-infarct collateral sprouting and synaptogenesis in real time as repetitive therapy consolidates new circuits.'
    },
    {
      tab: 'vision-sim' as ActiveTab,
      category: 'sim',
      title: 'Stroke Vision Simulator',
      badge: 'Sensory Empathy',
      icon: Eye,
      color: '#0891b2',
      description: 'Experience clinical hemianopia, diplopia, and hemi-neglect through your live webcam or interactive clinical scenes.'
    },
    {
      tab: 'aphasia-lab' as ActiveTab,
      category: 'sim',
      title: 'Aphasia Word-Struggle Lab',
      badge: 'Cognitive Lab',
      icon: Activity,
      color: '#8b5cf6',
      description: 'Simulate Broca expressive motor speech blocks, Wernicke fluent receptive comprehension, and anomic word retrieval barriers.'
    },
    {
      tab: 'risk-calculator' as ActiveTab,
      category: 'clinical',
      title: 'Personalized Risk Index',
      badge: 'CHA₂DS₂-VASc',
      icon: ShieldAlert,
      color: '#d97706',
      description: 'Clinical 10-year stroke probability calculator combining biometric markers with AI lifestyle modification modeling.'
    },
    {
      tab: 'hand-rehab' as ActiveTab,
      category: 'rehab',
      title: 'Hand Motor Rehab Coach',
      badge: 'Computer Vision',
      icon: Hand,
      color: '#059669',
      description: 'Client-side kinematic joint tracking measuring finger extension, thumb opposition, and Range of Motion (ROM).'
    },
    {
      tab: 'ai-neurologist' as ActiveTab,
      category: 'rehab',
      title: 'Multi-Persona AI Neurologist',
      badge: 'OpenRouter AI',
      icon: MessageSquareHeart,
      color: '#0891b2',
      description: 'Engage with Dr. Vance (Vascular Neurologist), Prof. Artie (Analogy Master), or Nurse Claire (Caregiver Ally).'
    },
    {
      tab: 'drug-guard' as ActiveTab,
      category: 'clinical',
      title: 'Drug & Supplement Guard',
      badge: 'Pharmacology Safety',
      icon: Pill,
      color: '#dc2626',
      description: 'Check critical bleeding risks between blood thinners (Warfarin, Eliquis, Plavix) and herbal supplements (Ginkgo, Garlic).'
    },
  ];

  const filteredCards = selectedCategory === 'all' 
    ? featureCards 
    : featureCards.filter((c) => c.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Hero: Realistic Scientific Cerebrovascular Cockpit */}
      <div className="glass-card" style={{
        padding: '0',
        overflow: 'hidden',
        border: '1px solid rgba(8, 145, 178, 0.25)',
        boxShadow: 'var(--shadow-elevated)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(360px, 1fr)',
          backgroundColor: '#ffffff'
        }}>
          {/* Left Column: Interactive Science Briefing */}
          <div style={{ padding: '42px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
              width: 'fit-content',
              border: '1px solid var(--primary-300)'
            }}>
              <Microscope size={15} color="var(--primary-600)" />
              Clinical Neurovascular Simulation Core
            </div>

            <h1 style={{
              fontSize: '40px',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.035em',
              lineHeight: 1.18,
              marginBottom: '16px'
            }}>
              Every Second Counts. <br />
              <span style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #0369a1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Master Stroke Pathophysiology & Recovery
              </span>
            </h1>

            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              When a cerebral artery is occluded, brain tissue undergoes rapid cellular decay. StrokeSense delivers medical-grade 3D vascular exploration, real-time sensory deficit simulators, and on-device computer vision rehabilitation.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
              <button
                onClick={() => setActiveTab('brain-3d')}
                className="btn btn-primary btn-lg"
              >
                <Brain size={18} />
                Explore 3D Brain Angiography
              </button>

              <button
                onClick={() => setActiveTab('golden-hour')}
                className="btn btn-secondary btn-lg"
              >
                <Timer size={18} />
                Golden Hour Survival Clock
              </button>
            </div>

            {/* Micro Physiological CBF Simulator */}
            <div style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: cbfStatus.bg,
              border: `1px solid ${cbfStatus.border}`,
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: cbfStatus.color }}>
                  <Gauge size={16} />
                  Live Perfusion: {cbfValue} mL/100g/min
                </span>
                <span className="badge" style={{ backgroundColor: cbfStatus.color, color: '#ffffff', fontSize: '10.5px' }}>
                  {cbfStatus.tier}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={60}
                value={cbfValue}
                onChange={(e) => setCbfValue(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', height: '6px' }}
              />

              <p style={{ fontSize: '12px', color: '#334155', marginTop: '6px', lineHeight: 1.45 }}>
                {cbfStatus.description}
              </p>
            </div>
          </div>

          {/* Right Column: High-Res Medical 3D Visual Asset */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #f0fdfa, #e0f2fe)',
            minHeight: '440px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid var(--border-light)'
          }}>
            <img
              src="/assets/cerebral_vascular_brain.jpg"
              alt="Cerebral Artery 3D Medical Visual"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Anatomical Tag Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '11.5px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>Middle Cerebral Artery (MCA)</span>
              <p style={{ margin: 0, color: '#cbd5e1' }}>Dominant stroke vascular occlusion territory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Biometric Telemetry Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--danger-50)',
            color: 'var(--danger-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(225, 29, 72, 0.15)'
          }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--danger-600)', fontFamily: 'var(--font-mono)' }}>
              1.9 Million
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Neurons lost per untreated minute</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--success-50)',
            color: 'var(--success-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success-600)', fontFamily: 'var(--font-mono)' }}>
              80% +
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preventable through hypertension control</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(8, 145, 178, 0.15)'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-600)', fontFamily: 'var(--font-mono)' }}>
              0 – 4.5 Hours
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>IV Thrombolysis (rTPA) therapeutic window</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--synapse-50)',
            color: 'var(--synapse-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--synapse-600)', fontFamily: 'var(--font-mono)' }}>
              Synaptogenesis
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Brain rewiring via motor repetitions</span>
          </div>
        </div>
      </div>

      {/* Realistic BE-FAST Neurological Emergency Triage Console */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--danger-50)',
              color: 'var(--danger-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 800 }}>
                BE-FAST Anatomical Early Warning Protocol
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Each symptom corresponds directly to a compromised anatomical vascular territory.
              </p>
            </div>
          </div>
          <span className="badge badge-danger">High Clinical Urgency</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {[
            { letter: 'B', title: 'Balance', anatomy: 'Cerebellar / Vestibular', desc: 'Sudden ataxia, stumbling, or loss of equilibrium.' },
            { letter: 'E', title: 'Eyes', anatomy: 'CN III/IV/VI or Occipital', desc: 'Diplopia (double vision) or sudden partial blindness.' },
            { letter: 'F', title: 'Face', anatomy: 'Cranial Nerve VII Nucleus', desc: 'Asymmetrical smile, drooping corner of the mouth.' },
            { letter: 'A', title: 'Arms', anatomy: 'Corticospinal Motor Tract', desc: 'Unilateral weakness; arm drifts downward when raised.' },
            { letter: 'S', title: 'Speech', anatomy: 'Broca / Wernicke Cortex', desc: 'Slurred, dysarthric speech or inability to formulate words.' },
            { letter: 'T', title: 'Time', anatomy: 'Penumbral Salvage Clock', desc: 'Every minute counts: immediately seek emergency evaluation.' }
          ].map((item) => (
            <div
              key={item.letter}
              style={{
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-muted)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(8, 145, 178, 0.3)'
                }}>
                  {item.letter}
                </span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '10.5px', color: 'var(--primary-700)', fontWeight: 600 }}>
                    {item.anatomy}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 9 Interactive Diagnostic Bays (Category Filters & Rich Cards) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              Clinical Simulation & Intelligence Bays
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Select a specialized module to launch interactive anatomical rendering, physical therapy tracking, or AI consultation.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Modules (9)' },
              { id: 'sim', label: 'Anatomy & Simulation (4)' },
              { id: 'clinical', label: 'Clinical Emergency & Risk (3)' },
              { id: 'rehab', label: 'AI & Neuro-Rehabilitation (2)' }
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ModuleCategory)}
                  className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', padding: '7px 16px', fontSize: '12.5px' }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Bays Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
          {filteredCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.tab}
                onClick={() => setActiveTab(feat.tab)}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Visual Thumbnail Banner if Available */}
                {feat.thumbnail && (
                  <div style={{
                    height: '140px',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid var(--border-light)'
                  }}>
                    <img
                      src={feat.thumbnail}
                      alt={feat.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px'
                    }}>
                      <span className="badge badge-primary" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', fontSize: '10px' }}>
                        {feat.badge}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ padding: '24px' }}>
                  {!feat.thumbnail && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-50)',
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
                  )}

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                    {feat.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: 'var(--primary-600)',
                    marginTop: '16px'
                  }}>
                    <span>Enter Clinical Bay</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
