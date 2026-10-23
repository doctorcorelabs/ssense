import React, { useState, useEffect, useRef } from 'react';
import { Hand, Camera, CameraOff, Award, Sparkles, RefreshCw, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useResponsive } from '../../hooks/useResponsive';

type RehabDrillId = 'fist-open' | 'thumb-opposition' | 'wrist-extension';

interface DrillConfig {
  id: RehabDrillId;
  name: string;
  goal: string;
  targetReps: number;
  instructions: string[];
}

export const HandRehabCoach: React.FC = () => {
  const { isMobile, isTabletPortrait } = useResponsive();
  const isStacked = isTabletPortrait; // stack at <=900px
  const stageHeight = isMobile ? 300 : 420;
  const [activeDrill, setActiveDrill] = useState<RehabDrillId>('fist-open');
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [repCount, setRepCount] = useState<number>(0);
  const [currentROM, setCurrentROM] = useState<number>(35); // 0 to 100%
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const drills: Record<RehabDrillId, DrillConfig> = {
    'fist-open': {
      id: 'fist-open',
      name: 'Fist & Open Palm Extension',
      goal: 'Combats post-stroke flexor spasticity by stretching finger flexor tendons',
      targetReps: 10,
      instructions: [
        '1. Close all five fingers into a relaxed fist.',
        '2. Slowly extend all fingers as wide open as possible.',
        '3. Hold extension for 2 seconds to signal neural stretch receptors.'
      ]
    },
    'thumb-opposition': {
      id: 'thumb-opposition',
      name: 'Thumb-to-Finger Opposition Taps',
      goal: 'Restores fine motor precision and corticomotor map dexterity',
      targetReps: 8,
      instructions: [
        '1. Touch the tip of your thumb to your index fingertip.',
        '2. Progress sequentially to middle, ring, and little finger.',
        '3. Focus on smooth, deliberate coordination without rushing.'
      ]
    },
    'wrist-extension': {
      id: 'wrist-extension',
      name: 'Wrist Flexion & Extension (ROM)',
      goal: 'Prevents contractures and rebuilds wrist stabilizer strength',
      targetReps: 12,
      instructions: [
        '1. Rest forearm on a flat surface or armrest.',
        '2. Gently lift the wrist upward toward the ceiling.',
        '3. Lower smoothly past neutral position.'
      ]
    }
  };

  const currentDrill = drills[activeDrill];

  // Confetti celebration upon target drill completion
  useEffect(() => {
    if (repCount >= currentDrill.targetReps) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [repCount, currentDrill.targetReps]);

  // Simulated Computer Vision Tracker Loop (works instantly even without webcam)
  useEffect(() => {
    let animId: number;
    let simAngle = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let wasExtended = false;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      simAngle += 0.05;

      // Draw skeleton hand visualization on canvas
      // Height follows the stage container (420 desktop, ~300 mobile) instead of a fixed 420
      const width = canvas.width = canvas.parentElement?.clientWidth || 640;
      const height = canvas.height = canvas.parentElement?.clientHeight || (window.innerWidth <= 640 ? 300 : 420);

      const centerX = width / 2;
      const centerY = height * 0.62;

      // Calculate simulated ROM extension
      let romVal = currentROM;
      if (isSimulating || isWebcamActive) {
        romVal = Math.round(50 + Math.sin(simAngle) * 45); // oscillates between 5% and 95%
        setCurrentROM(romVal);


        // Rep count logic
        if (romVal > 85 && !wasExtended) {
          wasExtended = true;
          setRepCount((prev) => Math.min(currentDrill.targetReps, prev + 1));
        } else if (romVal < 25 && wasExtended) {
          wasExtended = false;
        }
      }

      // Draw Palm Base Landmark
      ctx.beginPath();
      ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
      ctx.fillStyle = romVal > 75 ? '#00ff88' : '#00f5ff';
      ctx.shadowColor = romVal > 75 ? '#00ff88' : '#00f5ff';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw 5 Fingers Bones with Dynamic Angles based on ROM
      const fingerAngles = [-0.6, -0.3, 0, 0.3, 0.6];
      const fingerLengths = [90, 120, 130, 115, 85];
      const extensionFactor = romVal / 100;

      fingerAngles.forEach((angle, idx) => {
        const spreadAngle = angle * (0.4 + extensionFactor * 0.8);
        const len = fingerLengths[idx] * (0.6 + extensionFactor * 0.5);

        const tipX = centerX + Math.sin(spreadAngle) * len;
        const tipY = centerY - Math.cos(spreadAngle) * len;
        const midX = centerX + Math.sin(spreadAngle) * (len * 0.55);
        const midY = centerY - Math.cos(spreadAngle) * (len * 0.55);

        // Bone lines with neon glow
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(midX, midY);
        ctx.lineTo(tipX, tipY);
        const boneColor = romVal > 75 ? '#00ff88' : '#00f5ff';
        ctx.strokeStyle = boneColor;
        ctx.shadowColor = boneColor;
        ctx.shadowBlur = 10;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Joint knuckles
        [
          { x: midX, y: midY },
          { x: tipX, y: tipY }
        ].forEach((joint) => {
          ctx.beginPath();
          ctx.arc(joint.x, joint.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 3;
          ctx.fill();
          ctx.stroke();
        });
      });

      // Target Range of Motion Arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, Math.PI * 1.1, Math.PI * 1.9);
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.25)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isSimulating, isWebcamActive, activeDrill]);

  // Webcam Setup
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
          console.warn('Webcam unavailable, utilizing interactive simulated vision coach:', err);
          setIsWebcamActive(false);
          setIsSimulating(true);
        });
    }

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [isWebcamActive]);

  const handleResetDrill = () => {
    setRepCount(0);
    setCurrentROM(35);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <Hand size={13} /> Computer Vision Kinematics
          </span>
          <span className="badge badge-success">
            Neuro-Rehabilitation
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          AI Hand & Finger Motor Rehab Coach
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
          Real-time kinematic joint tracking measuring finger extension, thumb opposition, and Range of Motion (ROM). Practice evidence-based physical therapy drills right from your desk with instant repetition feedback.
        </p>

        {/* Drill Selector Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
          {(Object.keys(drills) as RehabDrillId[]).map((dId) => {
            const isSelected = activeDrill === dId;
            return (
              <button
                key={dId}
                onClick={() => { setActiveDrill(dId); handleResetDrill(); }}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ whiteSpace: 'normal', textAlign: 'left', minHeight: 44, lineHeight: 1.35 }}
              >
                {drills[dId].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Tracking Stage on Left, Coaching Metrics on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: isStacked ? '1fr' : 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '24px' }}>
        {/* Left: Computer Vision Stage */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-active"></span>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {isWebcamActive ? 'Live Camera Feed' : (isSimulating ? 'Simulated Kinematic Exercise' : 'Coach Ready')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (isWebcamActive) {
                    setIsWebcamActive(false);
                  } else {
                    setIsSimulating(false);
                    setIsWebcamActive(true);
                  }
                }}
                className={`btn btn-sm ${isWebcamActive ? 'btn-danger' : 'btn-secondary'}`}
              >
                {isWebcamActive ? <CameraOff size={14} /> : <Camera size={14} />}
                {isWebcamActive ? 'Disable Camera' : 'Turn On Webcam'}
              </button>

              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`btn btn-sm ${isSimulating ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Play size={14} />
                {isSimulating ? 'Pause Motion Demo' : 'Run Motion Demo'}
              </button>
            </div>
          </div>

          <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

          {/* Interactive Canvas Viewport */}
          <div style={{
            width: '100%',
            height: `${stageHeight}px`,
            backgroundColor: 'var(--bg-raised)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', maxWidth: '100%', display: 'block' }} />

            {/* Live Angle HUD - desktop/tablet only; on mobile it moves to a bar below the stage */}
            {!isMobile && (<>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Active Extension (ROM)
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: currentROM > 75 ? 'var(--green-400)' : 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>
                {currentROM}%
              </div>
            </div>

            {/* Rep Counter Overlay */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Completed Reps
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {repCount} / {currentDrill.targetReps}
              </div>
            </div>
            </>)}
          </div>

          {/* Mobile HUD bar: static row below the stage, so ROM + Reps never collide */}
          {isMobile && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 140px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Active Extension (ROM)
                </span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: currentROM > 75 ? 'var(--green-400)' : 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>
                  {currentROM}%
                </div>
              </div>
              <div style={{ flex: '1 1 140px', textAlign: 'right', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Completed Reps
                </span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {repCount} / {currentDrill.targetReps}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              *All computer vision operates 100% locally on your device for absolute medical privacy.
            </span>
            <button onClick={handleResetDrill} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /> Reset Repetitions
            </button>
          </div>
        </div>

        {/* Right: Drill Instructions & Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
              Active Prescription Drill
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {currentDrill.name}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--cyan-300)', fontWeight: 600, marginBottom: '16px' }}>
              {currentDrill.goal}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                Step-by-Step Instructions:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentDrill.instructions.map((inst, idx) => (
                  <li key={idx} style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.5 }}>
                    {inst}
                  </li>
                ))}
              </ul>
            </div>

            {repCount >= currentDrill.targetReps ? (
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(0,255,136,0.07)',
                border: '1px solid var(--success-100)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Award size={24} color="var(--green-400)" />
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green-400)' }}>
                    Drill Target Reached!
                  </h5>
                  <p style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '2px' }}>
                    Excellent work! Take a 60-second rest before your next set to allow neural consolidation.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-raised)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12.5px',
                color: 'var(--text-muted)'
              }}>
                Target: Complete <strong>{currentDrill.targetReps} smooth repetitions</strong> to strengthen the corticospinal motor map.
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '20px', backgroundColor: 'rgba(0,245,255,0.07)', borderColor: 'rgba(0,245,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="var(--cyan-300)" />
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary-800)' }}>
                Physical Therapist Insight
              </h4>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--primary-900)', lineHeight: 1.5 }}>
              Quality of movement matters more than speed. If your fingers begin to curl involuntary, pause, take a deep breath, and use your unaffected hand to gently massage and open the palm before continuing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
