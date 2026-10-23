import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  Sparkles,
  Activity
} from 'lucide-react';
import { useMediaQuery, useResponsive } from '../../hooks/useResponsive';

type AgnosiaMode = 'prosopagnosia' | 'object-agnosia' | 'charles-bonnet' | 'line-bisection';
type SampleSceneId = 'family-face' | 'breakfast-table' | 'living-room';

export const AISensoryAgnosiaFilter: React.FC = () => {
  const isStacked = useMediaQuery('(max-width: 1024px)');
  const { isMobile } = useResponsive();
  const [activeMode, setActiveMode] = useState<AgnosiaMode>('prosopagnosia');
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [sampleScene, setSampleScene] = useState<SampleSceneId>('family-face');

  // Line Bisection Test States
  const [bisectionPoints, setBisectionPoints] = useState<number[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample Scene Images
  const sampleImages: Record<SampleSceneId, { title: string; desc: string; url: string }> = {
    'family-face': {
      title: "Loved One's Face",
      desc: 'Close portrait showing emotional facial features and eyes',
      url: '/assets/synapse_rewiring_cortex.jpg' // High-res clinical aesthetic baseline
    },
    'breakfast-table': {
      title: 'Breakfast Table (Utensils & Mug)',
      desc: 'Everyday household objects requiring semantic object recognition',
      url: '/assets/cerebral_vascular_brain.jpg'
    },
    'living-room': {
      title: 'Living Room Navigation',
      desc: 'Spatial scene with furniture, doorways, and family members',
      url: '/assets/ischemic_clot_vessel.jpg'
    }
  };

  // Webcam stream management
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isWebcamActive) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch(() => setIsWebcamActive(false));
    }
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [isWebcamActive]);

  // Master Canvas Distortion & Neural Shader Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      t += 0.04;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw source frame (Webcam or procedural clinical canvas)
      if (isWebcamActive && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, w, h);
      } else {
        // High quality simulated background scene
        const grad = ctx.createLinearGradient(0, 0, w, h);
        if (sampleScene === 'family-face') {
          grad.addColorStop(0, '#fde68a');
          grad.addColorStop(0.5, '#fed7aa');
          grad.addColorStop(1, '#fecdd3');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Draw stylized human face silhouette
          ctx.fillStyle = '#f87171';
          ctx.beginPath();
          ctx.ellipse(w / 2, h / 2, 110, 150, 0, 0, Math.PI * 2);
          ctx.fill();

          // Normal eyes and mouth before distortion
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(w / 2 - 40, h / 2 - 25, 12, 0, Math.PI * 2);
          ctx.arc(w / 2 + 40, h / 2 - 25, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(w / 2, h / 2 + 45, 30, 0, Math.PI);
          ctx.lineWidth = 4;
          ctx.stroke();
        } else {
          grad.addColorStop(0, '#e2e8f0');
          grad.addColorStop(1, '#cbd5e1');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Draw table objects (mug, keys, glasses)
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(120, 220, 80, 100); // Coffee mug
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(380, 260, 45, 0, Math.PI * 2); // Plate
          ctx.fill();
        }
      }

      // 2. Apply Mode-Specific Neural Cortical Distortions
      if (activeMode === 'prosopagnosia') {
        // PROSOPAGNOSIA: The face center is scrambled, features swapped/sliding off
        const cx = w / 2;
        const cy = h / 2;
        const radius = 125;

        // Scramble pixel patches in the face zone
        for (let i = 0; i < 8; i++) {
          const ox = (Math.sin(t * 1.5 + i) * 35);
          const oy = (Math.cos(t * 1.2 + i) * 35);
          const patchX = cx + (i % 3 - 1) * 45;
          const patchY = cy + (Math.floor(i / 3) - 1) * 45;

          ctx.save();
          ctx.beginPath();
          ctx.arc(patchX + ox, patchY + oy, 32, 0, Math.PI * 2);
          ctx.clip();
          ctx.filter = 'blur(10px) contrast(140%)';
          ctx.fillStyle = `rgba(244, 114, 182, 0.45)`;
          ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
          ctx.restore();
        }

        // Overlay uncanny jumbled feature riddle caption
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(20, h - 52, w - 40, 36);
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 12.5px Inter, sans-serif';
        ctx.fillText("AI Prosopagnosia Filter: Face geometry is perceived, but fusiform gyrus cannot bind identity.", 34, h - 29);
      } else if (activeMode === 'object-agnosia') {
        // VISUAL OBJECT AGNOSIA: Objects fragment into abstract cubist contour lines
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;

        for (let i = 0; i < 16; i++) {
          const x1 = (i * 45 + Math.sin(t + i) * 25) % w;
          const y1 = (i * 35 + Math.cos(t + i) * 25) % h;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x1 + 60, y1 + (i % 2 === 0 ? 40 : -40));
          ctx.stroke();

          // Glitching semantic tags
          if (i % 4 === 0) {
            ctx.fillStyle = '#dc2626';
            ctx.font = '700 11px JetBrains Mono, monospace';
            const labels = ['[UNKNOWN OBJECT]', '[ANIMAL?]', '[TOOL?]', '[THREAT?]', '[UNRECOGNIZED SHAPE]'];
            ctx.fillText(labels[i % labels.length], x1, y1 - 8);
          }
        }
      } else if (activeMode === 'charles-bonnet') {
        // CHARLES BONNET SYNDROME: Vivid phantom geometric silhouettes floating over scene
        ctx.save();
        for (let i = 0; i < 6; i++) {
          const px = (w * 0.3 + Math.sin(t * 0.8 + i) * 140);
          const py = (h * 0.3 + Math.cos(t * 0.7 + i) * 100);

          ctx.fillStyle = `rgba(168, 85, 247, ${0.25 + Math.sin(t + i) * 0.15})`;
          ctx.beginPath();
          ctx.arc(px, py, 45 + Math.sin(t * 2 + i) * 15, 0, Math.PI * 2);
          ctx.fill();

          // Kaleidoscopic repeating lines
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 60, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(20, h - 52, w - 40, 36);
        ctx.fillStyle = '#e9d5ff';
        ctx.font = '600 12.5px Inter, sans-serif';
        ctx.fillText("Charles Bonnet Syndrome: Deafferented visual cortex generates phantom hallucinatory tapestries.", 34, h - 29);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeMode, isWebcamActive, sampleScene]);

  // Line Bisection Click Handler
  // Hit area is enlarged (>=32px) via a wrapper, but the ratio must still be
  // measured against the visual bar itself so scores do not shift.
  const handleLineBisectionClick = (lineIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    const barEl = e.currentTarget.querySelector<HTMLElement>('[data-bisection-bar]');
    const rect = (barEl ?? e.currentTarget).getBoundingClientRect();
    const clickRatio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)); // 0 (left) to 1 (right)

    setBisectionPoints((prev) => {
      const updated = [...prev];
      updated[lineIndex] = clickRatio;
      return updated;
    });
  };

  const resetBisectionTest = () => {
    setBisectionPoints([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner */}
      <div className="glass-card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-synapse">
                <Sparkles size={13} /> AI Neural Sensory Distortion Filter
              </span>
              <span className="badge badge-primary">
                Cognitive Empathy Engine
              </span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Post-Stroke Agnosia &amp; Sensory Breakdown Simulator
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '840px', fontSize: '14.5px', lineHeight: 1.55 }}>
              Stroke does not just impair physical movement; it can shatter sensory perception. Experience the profound disorientations of Prosopagnosia (inability to recognize familiar faces), Visual Object Agnosia (semantic disconnection), and Charles Bonnet phantom hallucinations.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => setActiveMode('prosopagnosia')}
              className={`btn btn-sm ${activeMode === 'prosopagnosia' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Prosopagnosia (Face-Blindness)
            </button>
            <button
              onClick={() => setActiveMode('object-agnosia')}
              className={`btn btn-sm ${activeMode === 'object-agnosia' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Visual Object Agnosia
            </button>
            <button
              onClick={() => setActiveMode('charles-bonnet')}
              className={`btn btn-sm ${activeMode === 'charles-bonnet' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Charles Bonnet Hallucinations
            </button>
            <button
              onClick={() => setActiveMode('line-bisection')}
              className={`btn btn-sm ${activeMode === 'line-bisection' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Line Bisection (Neglect Test)
            </button>
          </div>
        </div>
      </div>

      {/* Main Sensory Stage */}
      {activeMode !== 'line-bisection' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isStacked ? '1fr' : 'minmax(480px, 1.5fr) minmax(320px, 1fr)',
          gap: '24px'
        }}>
          {/* Canvas Viewport Station */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '12px 20px',
              backgroundColor: '#090d16',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>
                Perceptual Distortion Filter Viewport
              </span>
              <button
                onClick={() => setIsWebcamActive(!isWebcamActive)}
                className={`btn btn-sm ${isWebcamActive ? 'btn-danger' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {isWebcamActive ? <CameraOff size={13} /> : <Camera size={13} />}
                {isWebcamActive ? 'Stop Webcam' : 'Use My Webcam'}
              </button>
            </div>

            {/* Video hidden element for canvas sampling */}
            <video ref={videoRef} style={{ display: 'none' }} playsInline muted />

            {/* Distortion Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              style={{ width: '100%', height: 'auto', aspectRatio: '4 / 3', maxWidth: '100%', display: 'block', backgroundColor: '#0f172a' }}
            />

            {/* Scene Selector Footer */}
            <div style={{
              padding: '12px 20px',
              backgroundColor: 'var(--bg-raised)',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Curated Clinical Scene:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(Object.keys(sampleImages) as SampleSceneId[]).map((sId) => (
                  <button
                    key={sId}
                    onClick={() => { setSampleScene(sId); setIsWebcamActive(false); }}
                    className={`btn btn-sm ${sampleScene === sId && !isWebcamActive ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    {sampleImages[sId].title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Neurological Pathology Intel Card */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--blue-600)" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeMode === 'prosopagnosia' && 'Fusiform Gyrus & Prosopagnosia'}
                {activeMode === 'object-agnosia' && 'Ventral "What" Stream Object Agnosia'}
                {activeMode === 'charles-bonnet' && 'Deafferentation & Charles Bonnet Syndrome'}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.55 }}>
              {activeMode === 'prosopagnosia' && (
                <>
                  Infarction of the right fusiform gyrus (Brodmann Area 37) impairs facial feature synthesis without affecting general intellect or vision. Patients can describe a nose, eyes, or hair color individually, but the holistic gestalt of identity is completely lost.
                </>
              )}
              {activeMode === 'object-agnosia' && (
                <>
                  Damage to the inferior temporal cortex disrupts associative pathways linking visual forms with semantic memory. Made famous by Oliver Sacks, patients perceive individual shapes and colors accurately, but cannot determine what the object is or what it is used for.
                </>
              )}
              {activeMode === 'charles-bonnet' && (
                <>
                  Following occipital lobe stroke with severe hemianopic vision loss, the visual cortex experiences sensory deprivation. Starved of real visual signals, disinhibited cortical neurons spontaneously fire, projecting vivid phantom tapestries, silhouettes, or geometric hallucinations.
                </>
              )}
            </p>

            <div style={{
              padding: '12px 14px',
              backgroundColor: '#ecfeff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #a5f3fc',
              fontSize: '12px',
              color: '#155e75'
            }}>
              <strong>Caregiver Insight:</strong> Patients experiencing sensory agnosia are not demented, confused, or psychotic. Recognizing people by voice, perfume, or clothing patterns helps restore comfort and dignity.
            </div>
          </div>
        </div>
      ) : (
        /* Line Bisection Neglect Test */
        <div className="glass-card" style={{ padding: isMobile ? '20px' : '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Albert's Line Bisection Test (Hemi-Spatial Neglect)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Click where you believe the exact center of each horizontal bar is located:
              </p>
            </div>
            <button onClick={resetBisectionTest} className="btn btn-secondary btn-sm">
              Reset Test
            </button>
          </div>

          {/* 4 Test Horizontal Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', margin: '30px 0' }}>
            {[0, 1, 2, 3].map((idx) => {
              const clickedRatio = bisectionPoints[idx];
              return (
                <div key={idx} style={{ position: 'relative' }}>
                  {/* Enlarged hit area (>=32px tall); visual bar stays 14px and
                      carries data-bisection-bar so click ratio is measured on it */}
                  <div
                    onClick={(e) => handleLineBisectionClick(idx, e)}
                    style={{
                      minHeight: '36px',
                      padding: '11px 0',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'crosshair'
                    }}
                  >
                    <div
                      data-bisection-bar=""
                      style={{
                        height: '14px',
                        flex: 1,
                        backgroundColor: '#e2e8f0',
                        borderRadius: '8px',
                        position: 'relative',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                    {/* True Center Marker */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '-6px',
                      bottom: '-6px',
                      width: '2px',
                      backgroundColor: '#0284c7'
                    }} title="True 50% Center" />

                    {/* Patient's Placed Marker */}
                    {clickedRatio !== undefined && (
                      <div style={{
                        position: 'absolute',
                        left: `${clickedRatio * 100}%`,
                        top: '-8px',
                        bottom: '-8px',
                        width: '4px',
                        backgroundColor: '#ef4444',
                        borderRadius: '2px',
                        boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
                      }} />
                    )}
                    </div>
                  </div>
                  {clickedRatio !== undefined && (
                    <div style={{ fontSize: '11px', color: clickedRatio > 0.6 ? '#dc2626' : '#15803d', fontWeight: 600, marginTop: '4px' }}>
                      Marked at {(clickedRatio * 100).toFixed(0)}% • Error: {((clickedRatio - 0.5) * 100).toFixed(0)}% rightward bias
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            padding: '14px',
            backgroundColor: '#fff1f2',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #fecdd3',
            fontSize: '12.5px',
            color: '#9f1239'
          }}>
            <strong>Diagnostic Interpretation:</strong> Patients with right MCA stroke and left hemi-spatial neglect consistently place their bisection marks far to the right (70%–85%), because their brain has completely erased the existence of the left half of the bar.
          </div>
        </div>
      )}
    </div>
  );
};
