import React, { useState, useRef, useEffect } from 'react';
import { Eye, Camera, CameraOff, Info, HelpCircle } from 'lucide-react';

type VisionDeficit = 'hemianopia-left' | 'hemianopia-right' | 'diplopia' | 'neglect-left' | 'scotoma';

export const VisionSimulator: React.FC = () => {
  const [selectedDeficit, setSelectedDeficit] = useState<VisionDeficit>('hemianopia-left');
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [sampleScene, setSampleScene] = useState<'reading' | 'meal' | 'room'>('meal');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Deficit Descriptions and Anatomical explanations
  const deficits: Record<VisionDeficit, { title: string; subtitle: string; anatomy: string; impact: string }> = {
    'hemianopia-left': {
      title: 'Left Homonymous Hemianopia',
      subtitle: 'Loss of the left half of the visual field in both eyes',
      anatomy: 'Right Occipital Lobe or Right Optic Radiation (PCA territory infarct)',
      impact: 'Patients bump into objects on their left, fail to notice people approaching from the left, and miss words on the left side of text lines.'
    },
    'hemianopia-right': {
      title: 'Right Homonymous Hemianopia',
      subtitle: 'Loss of the right half of the visual field in both eyes',
      anatomy: 'Left Occipital Lobe or Left Optic Radiation (PCA / MCA territory infarct)',
      impact: 'Severely impairs reading flow because the eyes cannot anticipate the upcoming words in left-to-right languages.'
    },
    'diplopia': {
      title: 'Binocular Diplopia (Double Vision)',
      subtitle: 'Superimposed ghosting and dual imaging',
      anatomy: 'Brainstem Ischemia affecting Oculomotor (CN III), Trochlear (CN IV), or Abducens (CN VI) nuclei',
      impact: 'Creates profound dizziness, spatial disorientation, nausea, and inability to judge distance or pour liquids safely.'
    },
    'neglect-left': {
      title: 'Visual Hemi-Spatial Neglect',
      subtitle: 'Cognitive unawareness and inattention to the left hemispace',
      anatomy: 'Right Parietal Lobe or Superior Temporal Gyrus (MCA cortical infarct)',
      impact: 'Unlike hemianopia where the patient knows they cannot see, neglect patients lack internal awareness that the left side even exists. They leave food on half their plate and dress only one side of their body.'
    },
    'scotoma': {
      title: 'Central Scotoma & Cortical Blur',
      subtitle: 'Central visual blind spot with peripheral preservation',
      anatomy: 'Occipital pole / Macular cortex micro-infarction',
      impact: 'Prevents face recognition, reading, and device usage while gross spatial navigation remains partially intact.'
    }
  };

  // Start / Stop Webcam
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
        .catch((err) => {
          console.warn('Webcam access was denied or is unavailable:', err);
          setIsWebcamActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isWebcamActive]);

  // Canvas Render Loop for Webcam Stream
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (isWebcamActive && canvas && video && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;

          // Render raw video frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Apply Selected Vision Deficit Filter
          applyDeficitFilter(ctx, canvas.width, canvas.height, selectedDeficit);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    if (isWebcamActive) {
      render();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWebcamActive, selectedDeficit]);

  // Reusable Canvas Deficit Filter Function
  const applyDeficitFilter = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    deficit: VisionDeficit
  ) => {
    if (deficit === 'hemianopia-left') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.fillRect(0, 0, width / 2, height);
      // Soft edge penumbra blur
      const gradient = ctx.createLinearGradient(width / 2 - 20, 0, width / 2 + 30, 0);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.94)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(width / 2 - 20, 0, 50, height);
    } else if (deficit === 'hemianopia-right') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.fillRect(width / 2, 0, width / 2, height);
      const gradient = ctx.createLinearGradient(width / 2 - 30, 0, width / 2 + 20, 0);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.94)');
      ctx.fillStyle = gradient;
      ctx.fillRect(width / 2 - 30, 0, 50, height);
    } else if (deficit === 'diplopia') {
      // Draw ghosted secondary image with opacity
      ctx.globalAlpha = 0.5;
      ctx.drawImage(ctx.canvas, 24, 14, width, height, 0, 0, width, height);
      ctx.globalAlpha = 1.0;
    } else if (deficit === 'neglect-left') {
      // Hemi-neglect is cognitive inattention: Washout left side with hazy fading
      const gradient = ctx.createLinearGradient(0, 0, width * 0.65, 0);
      gradient.addColorStop(0, 'rgba(241, 245, 249, 0.96)');
      gradient.addColorStop(0.5, 'rgba(241, 245, 249, 0.7)');
      gradient.addColorStop(1, 'rgba(241, 245, 249, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (deficit === 'scotoma') {
      // Central blurred blind spot
      const radGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 4);
      radGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      radGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.8)');
      radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <Eye size={13} /> Visual Pathology Simulator
          </span>
          <span className="badge badge-synapse">
            Sensory Empathy
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Stroke Vision Deficit Simulator
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
          Up to 65% of stroke survivors experience profound visual field defects that are frequently misunderstood by family members. Experience how hemianopia, diplopia, and hemi-neglect distort spatial awareness.
        </p>

        {/* Deficit Selection Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
          {(Object.keys(deficits) as VisionDeficit[]).map((key) => {
            const isSelected = selectedDeficit === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDeficit(key)}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                {deficits[key].title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewport & Interactive Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '24px' }}>
        {/* Left: Interactive Canvas Viewport */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-active"></span>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {isWebcamActive ? 'Live Webcam Stream' : 'Clinical Scenario Simulation'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsWebcamActive(!isWebcamActive)}
                className={`btn btn-sm ${isWebcamActive ? 'btn-danger' : 'btn-secondary'}`}
              >
                {isWebcamActive ? <CameraOff size={14} /> : <Camera size={14} />}
                {isWebcamActive ? 'Disable Camera' : 'Use My Webcam'}
              </button>
            </div>
          </div>

          {/* Hidden Video element for webcam capture */}
          <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

          {/* Viewport Frame */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/10',
            backgroundColor: '#0f172a',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isWebcamActive ? (
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)' // Mirror for natural webcam perception
                }}
              />
            ) : (
              /* Simulated Clinical Interactive Scenes */
              <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                {sampleScene === 'meal' && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, rgba(10, 13, 18, 0.95) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    position: 'relative'
                  }}>
                    {/* Simulated Table Scene */}
                    <div style={{
                      width: '260px',
                      height: '260px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '2px solid rgba(0, 245, 255, 0.3)',
                      boxShadow: '0 0 30px rgba(0, 245, 255, 0.1)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ position: 'absolute', left: '30px', top: '70px', textAlign: 'center' }}>
                        <span style={{ fontSize: '32px' }}>🥗</span>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>Fresh Salad</div>
                      </div>
                      <div style={{ position: 'absolute', right: '30px', top: '70px', textAlign: 'center' }}>
                        <span style={{ fontSize: '32px' }}>🍗</span>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>Roast Chicken</div>
                      </div>
                      <div style={{ position: 'absolute', bottom: '30px', textAlign: 'center' }}>
                        <span style={{ fontSize: '28px' }}>🍚</span>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>Steamed Rice</div>
                      </div>
                    </div>
                    {/* Fork & Knife */}
                    <div style={{ position: 'absolute', left: '40px', fontSize: '36px' }}>🍴</div>
                    <div style={{ position: 'absolute', right: '40px', fontSize: '36px' }}>🥛</div>
                  </div>
                )}

                {sampleScene === 'reading' && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(10, 13, 18, 0.95)',
                    padding: '36px 48px',
                    color: 'var(--text-primary)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    lineHeight: 1.8,
                    fontSize: '14.5px'
                  }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '14px', color: 'var(--cyan-neon)' }}>
                      The Recovery of Neural Function
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Neuroplasticity allows intact areas of the cerebral cortex to assume control of functions previously governed by damaged regions. Through repetitive motor and sensory exercises, dendrites sprout new synaptosomal junctions, bridging damaged neurovascular pathways.
                    </p>
                    <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                      Patients who undergo early mobilization within structured multi-disciplinary stroke units demonstrate significantly superior functional scores on the Modified Rankin Scale at 90 days.
                    </p>
                  </div>
                )}

                {sampleScene === 'room' && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, rgba(5, 7, 9, 0.95) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: '30px',
                    fontSize: '48px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <span>🚪</span>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Open Doorway</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span>🪑</span>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Chair Obstacle</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span>🛋️</span>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Sofa</p>
                    </div>
                  </div>
                )}

                {/* Overlay SVG / CSS Filter for Selected Deficit */}
                {selectedDeficit === 'hemianopia-left' && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '50%',
                    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.96) 80%, rgba(15, 23, 42, 0))',
                    pointerEvents: 'none'
                  }} />
                )}

                {selectedDeficit === 'hemianopia-right' && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: '50%',
                    background: 'linear-gradient(to left, rgba(15, 23, 42, 0.96) 80%, rgba(15, 23, 42, 0))',
                    pointerEvents: 'none'
                  }} />
                )}

                {selectedDeficit === 'diplopia' && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backdropFilter: 'blur(1px)',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)',
                    transform: 'translate(10px, 8px)',
                    opacity: 0.45,
                    pointerEvents: 'none'
                  }} />
                )}

                {selectedDeficit === 'neglect-left' && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '65%',
                    background: 'linear-gradient(to right, rgba(248, 250, 252, 0.98) 40%, rgba(248, 250, 252, 0))',
                    pointerEvents: 'none'
                  }} />
                )}

                {selectedDeficit === 'scotoma' && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '240px',
                    height: '240px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(15, 23, 42, 0.95) 40%, rgba(15, 23, 42, 0) 100%)',
                    pointerEvents: 'none'
                  }} />
                )}
              </div>
            )}
          </div>

          {/* Scenario Toggles (When camera is off) */}
          {!isWebcamActive && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                Test Scenarios:
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSampleScene('meal')}
                  className={`btn btn-sm ${sampleScene === 'meal' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Dinner Plate
                </button>
                <button
                  onClick={() => setSampleScene('reading')}
                  className={`btn btn-sm ${sampleScene === 'reading' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Reading Text
                </button>
                <button
                  onClick={() => setSampleScene('room')}
                  className={`btn btn-sm ${sampleScene === 'room' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Room Navigation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Anatomical Breakdown & Empathy Insight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Info size={18} color="var(--cyan-400)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                {deficits[selectedDeficit].title}
              </h3>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '12px' }}>
              {deficits[selectedDeficit].subtitle}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Neurological Anatomy
              </span>
              <p style={{ fontSize: '13px', color: 'var(--cyan-300)', fontWeight: 600, marginTop: '2px' }}>
                {deficits[selectedDeficit].anatomy}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Daily Life & Caregiver Impact
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6, marginTop: '4px' }}>
                {deficits[selectedDeficit].impact}
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', backgroundColor: 'rgba(0,245,255,0.07)', borderColor: 'rgba(0,245,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <HelpCircle size={16} color="var(--cyan-300)" />
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-800)' }}>
                Caregiver Tip for Visual Deficits
              </h4>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--primary-900)', lineHeight: 1.5 }}>
              Always approach the patient and place items on their <strong>unimpaired side</strong> first to avoid startling them. For dinner plates, gently rotate the plate 180 degrees halfway through meals so unnoticed food enters their remaining visual field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
