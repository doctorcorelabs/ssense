import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Zap, Award, BookOpen, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NeuroplasticityPlay: React.FC = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokeOccurred, setStrokeOccurred] = useState<boolean>(false);
  const [rehabReps, setRehabReps] = useState<number>(0);
  const [isAutoTraining, setIsAutoTraining] = useState<boolean>(false);

  // Recovery percentage calculation
  const maxReps = 20;
  const recoveryPercent = strokeOccurred 
    ? Math.min(100, Math.round((rehabReps / maxReps) * 98))
    : 100;

  // Trigger Confetti upon full recovery milestone
  useEffect(() => {
    if (rehabReps === maxReps) {
      confetti({
        particleCount: 80,
        spread: 70,
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

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pulseOffset = 0;

    const width = canvas.width = canvas.parentElement?.clientWidth || 700;
    const height = canvas.height = 380;

    // Fixed Nodes Layout
    const startNode = { x: 70, y: height / 2, label: 'Motor Cortex (Command)', color: '#0284c7' };
    const endNode = { x: width - 80, y: height / 2, label: 'Hand Muscle (Effector)', color: '#10b981' };

    // Primary Damaged Pathway
    const primaryMid = { x: width / 2, y: height / 2 };

    // Bypass Interneurons (Upper & Lower Peri-infarct Arc)
    const bypassNodes = [
      { x: width * 0.32, y: height * 0.22, color: '#8b5cf6' },
      { x: width * 0.50, y: height * 0.16, color: '#8b5cf6' },
      { x: width * 0.68, y: height * 0.22, color: '#8b5cf6' },
      { x: width * 0.40, y: height * 0.80, color: '#8b5cf6' },
      { x: width * 0.60, y: height * 0.80, color: '#8b5cf6' },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseOffset += 0.04;

      // 1. Draw Primary Central Highway
      ctx.beginPath();
      ctx.moveTo(startNode.x, startNode.y);
      ctx.lineTo(endNode.x, endNode.y);
      if (!strokeOccurred) {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Pulsating electrical wave
        const waveX = startNode.x + ((pulseOffset * 180) % (endNode.x - startNode.x));
        ctx.beginPath();
        ctx.arc(waveX, height / 2, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Severed / Infarcted Pathway
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Infarct Necrotic Scar in the center
        ctx.beginPath();
        ctx.arc(primaryMid.x, primaryMid.y, 32, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ Infarct Zone', primaryMid.x, primaryMid.y + 4);
      }

      // 2. Draw Peri-infarct Bypass Pathways (Growing with rehab reps)
      if (strokeOccurred && rehabReps > 0) {
        const bypassGrowth = Math.min(1, rehabReps / maxReps);

        // Upper Bypass Arc
        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        ctx.quadraticCurveTo(bypassNodes[0].x, bypassNodes[0].y, bypassNodes[1].x, bypassNodes[1].y);
        ctx.quadraticCurveTo(bypassNodes[2].x, bypassNodes[2].y, endNode.x, endNode.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 + bypassGrowth * 0.8})`;
        ctx.lineWidth = 2 + bypassGrowth * 4;
        ctx.stroke();

        // Lower Secondary Sprout
        if (rehabReps >= 8) {
          ctx.beginPath();
          ctx.moveTo(startNode.x, startNode.y);
          ctx.quadraticCurveTo(bypassNodes[3].x, bypassNodes[3].y, bypassNodes[4].x, bypassNodes[4].y);
          ctx.lineTo(endNode.x, endNode.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${bypassGrowth * 0.6})`;
          ctx.lineWidth = 2 + bypassGrowth * 2;
          ctx.stroke();
        }

        // Active Electrical Impulses traveling along the bypass
        if (rehabReps >= 5) {
          const t = (pulseOffset * 1.5) % 1;
          // Approximate curve point for upper arc
          const pulseX = startNode.x + t * (endNode.x - startNode.x);
          const pulseY = (height / 2) - Math.sin(t * Math.PI) * (height * 0.38);

          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 3. Render Nodes
      const drawNode = (node: { x: number; y: number; label?: string; color: string }, radius = 14) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 4;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (node.label) {
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + (node.y > height / 2 ? 26 : -22));
        }
      };

      // Draw Bypass Interneuron Nodes
      bypassNodes.forEach((bn, idx) => {
        const isSprouted = strokeOccurred && rehabReps >= (idx + 1) * 3;
        drawNode({
          x: bn.x,
          y: bn.y,
          color: isSprouted ? '#8b5cf6' : '#cbd5e1'
        }, isSprouted ? 10 : 7);
      });

      // Draw Main Terminal Nodes
      drawNode(startNode, 18);
      drawNode(endNode, 18);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [strokeOccurred, rehabReps]);

  const handleTriggerStroke = () => {
    setStrokeOccurred(true);
    setRehabReps(0);
    setIsAutoTraining(false);
  };

  const handleReset = () => {
    setStrokeOccurred(false);
    setRehabReps(0);
    setIsAutoTraining(false);
  };

  const handleDoRepetition = () => {
    if (!strokeOccurred) return;
    setRehabReps((prev) => Math.min(maxReps, prev + 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <Sparkles size={13} /> Synaptic Rewiring Lab
          </span>
          <span className="badge badge-synapse">
            Neuroplasticity
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Neuroplasticity & Synaptic Rewiring Playground
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
          When a stroke severs the brain's primary motor superhighway, the brain doesn't surrender. Through intensive, high-repetition physical rehabilitation, dormant peri-infarct interneurons sprout new dendritic branches (*synaptogenesis*), creating an entirely new biological bypass circuit.
        </p>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
          {!strokeOccurred ? (
            <button onClick={handleTriggerStroke} className="btn btn-danger">
              <Zap size={16} /> Simulate Stroke Incident
            </button>
          ) : (
            <>
              <button 
                onClick={handleDoRepetition} 
                className="btn btn-primary btn-lg"
                disabled={rehabReps >= maxReps}
                style={{
                  transform: 'scale(1)',
                  boxShadow: '0 4px 18px rgba(139, 92, 246, 0.35)',
                  background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
                }}
              >
                <Sparkles size={18} /> Perform Rehab Repetition (+1)
              </button>

              <button 
                onClick={() => setIsAutoTraining(!isAutoTraining)} 
                className="btn btn-secondary"
                disabled={rehabReps >= maxReps}
              >
                <Play size={16} /> {isAutoTraining ? 'Pause Auto Training' : 'Auto-Train Series'}
              </button>

              <button onClick={handleReset} className="btn btn-secondary">
                <RefreshCw size={16} /> Reset Simulation
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '24px' }}>
        {/* Canvas Area */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                Circuit Connectivity:
              </span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: recoveryPercent > 70 ? 'var(--success-600)' : (recoveryPercent > 20 ? 'var(--synapse-600)' : 'var(--danger-500)'), fontFamily: 'var(--font-mono)' }}>
                {recoveryPercent}% Signal Transmission
              </div>
            </div>

            {strokeOccurred && (
              <div style={{
                backgroundColor: 'var(--synapse-50)',
                border: '1px solid var(--synapse-100)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles size={16} color="var(--synapse-600)" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--synapse-600)' }}>
                  Rehab Reps: {rehabReps} / {maxReps}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Canvas */}
          <div style={{
            width: '100%',
            height: '380px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>

          {/* Educational Stage Tracker */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            <div style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: strokeOccurred && rehabReps >= 1 ? 'var(--synapse-50)' : 'var(--bg-muted)',
              border: strokeOccurred && rehabReps >= 1 ? '1px solid var(--synapse-200)' : '1px solid transparent'
            }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stage 1</span>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Axonal Sprouting</div>
            </div>

            <div style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: strokeOccurred && rehabReps >= 6 ? 'var(--synapse-50)' : 'var(--bg-muted)',
              border: strokeOccurred && rehabReps >= 6 ? '1px solid var(--synapse-200)' : '1px solid transparent'
            }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stage 2</span>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Synaptogenesis</div>
            </div>

            <div style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: strokeOccurred && rehabReps >= 12 ? 'var(--synapse-50)' : 'var(--bg-muted)',
              border: strokeOccurred && rehabReps >= 12 ? '1px solid var(--synapse-200)' : '1px solid transparent'
            }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stage 3</span>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>Myelination</div>
            </div>

            <div style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: strokeOccurred && rehabReps >= 18 ? 'var(--success-50)' : 'var(--bg-muted)',
              border: strokeOccurred && rehabReps >= 18 ? '1px solid var(--success-200)' : '1px solid transparent'
            }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stage 4</span>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success-600)' }}>Full Consolidation</div>
            </div>
          </div>
        </div>

        {/* Right: Scientific Principles & Encouragement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BookOpen size={18} color="var(--primary-600)" />
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>The Science of Recovery</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6 }}>
              <p>
                <strong>Hebbian Plasticity:</strong> <em>"Neurons that fire together, wire together."</em> In the first 3 to 6 months post-stroke, the brain is in a hyper-plastic state where protein growth factors like BDNF (Brain-Derived Neurotrophic Factor) peak.
              </p>
              <p>
                <strong>The Power of High Repetitions:</strong> Clinical trials show that 300 to 400 task-specific repetitions per day are required to recruit and consolidate new cortical territory for hand and arm movement.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Award size={18} color="var(--primary-700)" />
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-800)' }}>
                Patience & Perseverance
              </h4>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--primary-900)', lineHeight: 1.5 }}>
              Synaptic rewiring is invisible on a day-to-day basis, but exponential over weeks. Even when a limb feels completely motionless, mental motor imagery and assisted passive movements signal the brain that the pathway is still needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
