import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Zap, 
  Award, 
  Play, 
  Dna, 
  Activity, 
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NeuroplasticityPlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokeOccurred, setStrokeOccurred] = useState<boolean>(true);
  const [rehabReps, setRehabReps] = useState<number>(4);
  const [isAutoTraining, setIsAutoTraining] = useState<boolean>(false);
  const [activeStrategy, setActiveStrategy] = useState<'cimt' | 'aerobic' | 'mirror'>('cimt');

  const maxReps = 25;
  const recoveryPercent = strokeOccurred 
    ? Math.min(100, Math.round((rehabReps / maxReps) * 96))
    : 100;

  // Biological metrics
  const bdnfLevel = (18 + (rehabReps / maxReps) * 48).toFixed(1); // ng/mL (Brain-Derived Neurotrophic Factor)
  const synapticDensity = Math.round(35 + (rehabReps / maxReps) * 65); // %
  const functionalScore = (1.5 + (rehabReps / maxReps) * 4.2).toFixed(1); // Fugl-Meyer Motor Scale increment

  // Trigger Confetti upon full recovery milestone
  useEffect(() => {
    if (rehabReps === maxReps) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [rehabReps]);

  // Auto-training interval
  useEffect(() => {
    let interval: any;
    if (isAutoTraining && strokeOccurred && rehabReps < maxReps) {
      interval = setInterval(() => {
        setRehabReps((prev) => {
          if (prev >= maxReps) {
            setIsAutoTraining(false);
            return maxReps;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isAutoTraining, strokeOccurred, rehabReps]);

  // Biological Synaptogenesis Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pulseOffset = 0;

    const width = canvas.width = canvas.parentElement?.clientWidth || 750;
    const height = canvas.height = 400;

    // Biological Node Positions
    const motorSoma = { x: 80, y: height / 2, label: 'Motor Cortex (Soma)' };
    const targetMuscle = { x: width - 90, y: height / 2, label: 'Hand Effector Muscle' };
    const lesionCenter = { x: width / 2, y: height / 2, radius: 45 };

    // Peri-infarct collateral relay neurons
    const relayNodes = [
      { x: width * 0.32, y: height * 0.22, label: 'Premotor Cortex' },
      { x: width * 0.50, y: height * 0.14, label: 'Supplementary Motor' },
      { x: width * 0.68, y: height * 0.22, label: 'Contralateral Cortex' },
      { x: width * 0.35, y: height * 0.80, label: 'Cerebellar Loop' },
      { x: width * 0.65, y: height * 0.80, label: 'Sensory Re-map' },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseOffset += 0.05;

      // 1. Draw Inactive / Severed Original Corticospinal Tract
      ctx.beginPath();
      ctx.moveTo(motorSoma.x, motorSoma.y);
      ctx.lineTo(lesionCenter.x - 35, lesionCenter.y);
      ctx.strokeStyle = strokeOccurred ? '#cbd5e1' : '#0891b2';
      ctx.lineWidth = strokeOccurred ? 3 : 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lesionCenter.x + 35, lesionCenter.y);
      ctx.lineTo(targetMuscle.x, targetMuscle.y);
      ctx.strokeStyle = strokeOccurred ? '#cbd5e1' : '#0891b2';
      ctx.lineWidth = strokeOccurred ? 3 : 6;
      ctx.stroke();

      // If no stroke, animate direct central highway pulse
      if (!strokeOccurred) {
        const waveX = motorSoma.x + ((pulseOffset * 220) % (targetMuscle.x - motorSoma.x));
        ctx.beginPath();
        ctx.arc(waveX, height / 2, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#0891b2';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Infarct Lesion Cavity
      if (strokeOccurred) {
        // Necrotic Cavity Shadow
        const grad = ctx.createRadialGradient(lesionCenter.x, lesionCenter.y, 5, lesionCenter.x, lesionCenter.y, lesionCenter.radius);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
        grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.15)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lesionCenter.x, lesionCenter.y, lesionCenter.radius, 0, Math.PI * 2);
        ctx.fill();

        // Stroke Wall Marker
        ctx.beginPath();
        ctx.arc(lesionCenter.x, lesionCenter.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#fee2e2';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('INFARCT', lesionCenter.x, lesionCenter.y - 2);
        ctx.fillText('CORE', lesionCenter.x, lesionCenter.y + 10);
      }

      // 3. Sprouting Peri-Infarct Collateral Pathways (Synaptogenesis)
      const sproutAlpha = Math.min(1, rehabReps / maxReps);
      const sproutCount = Math.min(relayNodes.length, Math.ceil((rehabReps / maxReps) * relayNodes.length));

      // Draw connection lines to active relay nodes
      for (let i = 0; i < sproutCount; i++) {
        const node = relayNodes[i];

        // Connection from Motor Soma to Relay Node
        ctx.beginPath();
        ctx.moveTo(motorSoma.x, motorSoma.y);
        ctx.quadraticCurveTo((motorSoma.x + node.x) / 2, node.y, node.x, node.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 + sproutAlpha * 0.6})`;
        ctx.lineWidth = 2 + sproutAlpha * 3;
        ctx.stroke();

        // Connection from Relay Node to Muscle Effector
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.quadraticCurveTo((node.x + targetMuscle.x) / 2, node.y, targetMuscle.x, targetMuscle.y);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.4 + sproutAlpha * 0.6})`;
        ctx.lineWidth = 2 + sproutAlpha * 3;
        ctx.stroke();

        // Animate Traveling Action Potentials across the rewiring circuits
        if (rehabReps > 2) {
          const t = ((pulseOffset * 1.5 + i * 0.7) % 3) / 3;
          const px = motorSoma.x + (node.x - motorSoma.x) * t;
          const py = motorSoma.y + (node.y - motorSoma.y) * t;

          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#8b5cf6';
          ctx.shadowColor = '#a78bfa';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Downstream pulse from relay to target
          const px2 = node.x + (targetMuscle.x - node.x) * t;
          const py2 = node.y + (targetMuscle.y - node.y) * t;
          ctx.beginPath();
          ctx.arc(px2, py2, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Relay Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#a8b8c8';
        ctx.font = '600 11px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - 14);
      }

      // 4. Draw Terminal Nodes (Motor Cortex & Target Muscle)
      // Motor Cortex Node
      ctx.beginPath();
      ctx.arc(motorSoma.x, motorSoma.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#0891b2';
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f0f4f8';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Motor Cortex', motorSoma.x, motorSoma.y + 32);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#00f5ff';
      ctx.fillText('(Action Command)', motorSoma.x, motorSoma.y + 45);

      // Target Muscle Node
      ctx.beginPath();
      ctx.arc(targetMuscle.x, targetMuscle.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = recoveryPercent >= 70 ? '#10b981' : '#f59e0b';
      ctx.strokeStyle = recoveryPercent >= 70 ? '#00ff88' : '#fbbf24';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f0f4f8';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Hand Muscle', targetMuscle.x, targetMuscle.y + 32);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#00ff88';
      ctx.fillText(`(${recoveryPercent}% Synced)`, targetMuscle.x, targetMuscle.y + 45);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [strokeOccurred, rehabReps, maxReps, recoveryPercent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Visual Header with Real Biological Asset */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '0', 
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.25fr) minmax(280px, 0.75fr)',
          backgroundColor: 'var(--bg-raised)'
        }}
      >
        <div style={{ padding: '36px 36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span className="badge badge-primary">
              <Dna size={13} /> Synaptogenesis Simulator
            </span>
            <span className="badge badge-synapse">
              <Sparkles size={13} /> Hebbian Plasticity
            </span>
            <span className="badge badge-success">
              {recoveryPercent}% Circuit Re-established
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Neuroplasticity & Synaptic Rewiring Lab
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
            When a stroke destroys primary motor pathways, the brain does not grow new cerebral lobes. Instead, through <strong>Hebbian learning</strong> ("neurons that fire together, wire together"), surviving peri-infarct cortical zones sprout new dendritic collateral spines to bridge around the dead tissue.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => {
                setRehabReps((r) => Math.min(maxReps, r + 1));
              }}
              className="btn btn-primary"
            >
              <Zap size={16} /> Execute Motor Rehab Rep (+1)
            </button>

            <button
              onClick={() => setIsAutoTraining(!isAutoTraining)}
              className={`btn ${isAutoTraining ? 'btn-danger' : 'btn-secondary'}`}
            >
              <Play size={16} /> {isAutoTraining ? 'Pause Auto-Rehab' : 'Start Intensive Training'}
            </button>

            <button
              onClick={() => {
                setStrokeOccurred(true);
                setRehabReps(0);
                setIsAutoTraining(false);
              }}
              className="btn btn-secondary"
            >
              <RefreshCw size={15} /> Reset Lesion
            </button>
          </div>
        </div>

        {/* Photorealistic 3D Biological Synapse Sprouting Asset Visual */}
        <div style={{ position: 'relative', minHeight: '260px', overflow: 'hidden' }}>
          <img 
            src="/assets/synapse_rewiring_cortex.jpg" 
            alt="Biological Synapse Sprouting and Dendritic Axonal Rewiring" 
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
              <span className="pulse-active" style={{ backgroundColor: '#8b5cf6' }}></span>
              Collateral Axonal Sprouting & Synaptic Remodeling
            </div>
            <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
              BDNF-mediated structural plasticity bridging around ischemic core
            </p>
          </div>
        </div>
      </div>

      {/* Biological Metrics HUD Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              BDNF Plasma Level
            </span>
            <Activity size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {bdnfLevel} ng/mL
          </div>
          <span style={{ fontSize: '11.5px', color: '#6d28d9', fontWeight: 600 }}>
            Brain-Derived Neurotrophic Factor
          </span>
        </div>

        <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Synaptic Density
            </span>
            <TrendingUp size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
            {synapticDensity}%
          </div>
          <span style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600 }}>
            Dendritic spine regeneration
          </span>
        </div>

        <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #0891b2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Fugl-Meyer Motor
            </span>
            <Award size={18} color="#0891b2" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0e7490', fontFamily: 'var(--font-mono)' }}>
            +{functionalScore} pts
          </div>
          <span style={{ fontSize: '11.5px', color: '#0e7490', fontWeight: 600 }}>
            Upper extremity kinematic gain
          </span>
        </div>

        <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Rehab Repetitions
            </span>
            <Zap size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {rehabReps} / {maxReps}
          </div>
          <span style={{ fontSize: '11.5px', color: '#b45309', fontWeight: 600 }}>
            Daily target threshold
          </span>
        </div>
      </div>

      {/* Main Interactive Synaptogenesis Rewiring Canvas */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Interactive Peri-Infarct Axonal Sprouting Stage
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              Watch fine collateral axon branches physically bypass the infarcted necrotic core as training repetitions accumulate.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveStrategy('cimt')}
              className={`btn btn-sm ${activeStrategy === 'cimt' ? 'btn-primary' : 'btn-secondary'}`}
            >
              CIMT (Forced-Use)
            </button>
            <button
              onClick={() => setActiveStrategy('mirror')}
              className={`btn btn-sm ${activeStrategy === 'mirror' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Mirror Therapy
            </button>
            <button
              onClick={() => setActiveStrategy('aerobic')}
              className={`btn btn-sm ${activeStrategy === 'aerobic' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Aerobic Priming
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div style={{
          width: '100%',
          backgroundColor: 'var(--bg-raised)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Evidence-Based Neuroplasticity Guidelines */}
        <div style={{
          marginTop: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid #8b5cf6'
          }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              1. High-Dose Repetitive Practice
            </h5>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Animal and clinical trials show motor reorganization requires hundreds of goal-directed reach-and-grasp repetitions daily to stabilize new synaptogenesis.
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid #0891b2'
          }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              2. Salience & Task Meaningfulness
            </h5>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Mindless movement produces minimal cortical shift. Tasks must be motivating, functional (e.g. drinking, eating, writing), and progressively challenging.
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid #10b981'
          }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              3. Overcoming "Learned Non-Use"
            </h5>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Constraint-Induced Movement Therapy (CIMT) restrains the intact limb to force activation of the weakened stroke limb, re-awakening silent synapses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
