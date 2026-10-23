import React, { useState, useEffect, useRef } from 'react';
import {
  GitBranch,
  Layers,
  Clock,
  Sun,
  Moon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

interface HemodynamicRibbonProps {
  onOpenAspects: () => void;
  onOpenCircleOfWillis: () => void;
}

export const HemodynamicRibbon: React.FC<HemodynamicRibbonProps> = ({
  onOpenAspects,
  onOpenCircleOfWillis
}) => {
  const { isMobile, isSmallPhone, isTabletPortrait, isTablet } = useResponsive();
  // Touch-friendly sizing below desktop; desktop (>1180px) keeps original values.
  const ribbonBtnMinHeight = isMobile ? 44 : isTablet ? 40 : undefined;
  const ribbonBtnPadding = isMobile ? '10px 6px' : isTablet ? '8px 10px' : '3px 8px';

  // Theme state
  const [isCathLabTheme, setIsCathLabTheme] = useState<boolean>(() => {
    return localStorage.getItem('strokesense_theme') === 'cath-lab';
  });

  // Hemodynamic mode
  const [hemoState, setHemoState] = useState<'normal' | 'acute-lvo' | 'post-evt'>('acute-lvo');

  // Saver JL Live Brain Degradation Counter (when acute-lvo is active)
  const [neuronsLost, setNeuronsLost] = useState<number>(1900000); // 1 min baseline
  const [synapsesLost, setSynapsesLost] = useState<number>(14000000000);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(60);

  // Audio Doppler pulse (muted by default)
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Apply Theme to DOM
  useEffect(() => {
    if (isCathLabTheme) {
      document.documentElement.setAttribute('data-theme', 'cath-lab');
      localStorage.setItem('strokesense_theme', 'cath-lab');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('strokesense_theme', 'light');
    }
  }, [isCathLabTheme]);

  // Live Saver JL equation counter (31,666 neurons/sec, 233,333,333 synapses/sec)
  useEffect(() => {
    if (hemoState !== 'acute-lvo') return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setNeuronsLost((prev) => prev + 31666);
      setSynapsesLost((prev) => prev + 233333333);
    }, 1000);

    return () => clearInterval(interval);
  }, [hemoState]);

  // Live Canvas Waveform Loop (Transcranial Doppler pulsatility)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      t += 0.05;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background subtle grid lines
      ctx.strokeStyle = isCathLabTheme ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.06)';
      ctx.lineWidth = 1;
      for (let y = 6; y < h; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Doppler waveform
      ctx.beginPath();
      ctx.lineWidth = 1.75;
      ctx.strokeStyle =
        hemoState === 'acute-lvo'
          ? '#e11d48' // Arterial crimson
          : hemoState === 'post-evt'
          ? '#10b981' // Post-recanalization emerald
          : '#0284c7'; // Normal cobalt

      for (let x = 0; x < w; x++) {
        // Waveform profile: Systolic sharp rise, dicrotic notch, diastolic decay
        const cycle = ((x * 0.08 - t * (hemoState === 'acute-lvo' ? 2.5 : 2.0)) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

        let shape = 0;
        if (cycle < 0.8) {
          shape = Math.sin(cycle * (Math.PI / 0.8)); // Systolic peak
        } else if (cycle < 1.4) {
          shape = Math.sin((cycle - 0.8) * Math.PI) * 0.35; // Dicrotic notch
        } else {
          shape = Math.exp(-(cycle - 1.4) * 1.5) * 0.15; // End-diastolic decay
        }

        const amplitude = hemoState === 'acute-lvo' ? 10 : 8;
        const y = h / 2 + 3 - shape * amplitude;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [hemoState, isCathLabTheme]);

  // Transcranial Doppler Synthesizer Sound via Web Audio API
  const toggleAudio = () => {
    if (isAudioMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Periodic pulsing whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        // Pulsatile LFO
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(1.1, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();

        setIsAudioMuted(false);
      } catch {
        setIsAudioMuted(true);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAudioMuted(true);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '6px 0',
      transition: 'background-color 0.25s ease, border-color 0.25s ease',
      fontSize: '12px'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: isTabletPortrait ? 'stretch' : 'center',
        justifyContent: 'space-between',
        flexDirection: isTabletPortrait ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: '12px',
        minWidth: 0
      }}>
        {/* Left: Perfusion Waveform & State Switcher */}
        <div style={{
          display: 'flex',
          alignItems: isMobile ? 'stretch' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '12px',
          flexWrap: 'wrap',
          minWidth: 0,
          maxWidth: '100%',
          width: isTabletPortrait ? '100%' : undefined,
          flex: isTablet ? '1 1 auto' : undefined
        }}>
          {/* Living Doppler Canvas Waveform */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-canvas)',
            padding: isMobile ? '6px 10px' : '3px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--glass-border)',
            maxWidth: '100%',
            alignSelf: isMobile ? 'flex-start' : undefined
          }}>
            <canvas ref={canvasRef} width={isSmallPhone ? 56 : 80} height={24} style={{ display: 'block' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                TCD Doppler
              </span>
              <span style={{ fontSize: '9.5px', color: hemoState === 'acute-lvo' ? '#e11d48' : '#059669', fontWeight: 600 }}>
                {hemoState === 'acute-lvo' ? 'Turbulent MCA' : 'Pulsatile 72 bpm'}
              </span>
            </div>

            {/* Doppler Audio Toggle */}
            <button
              onClick={toggleAudio}
              aria-label={isAudioMuted ? 'Unmute Transcranial Doppler Synthesizer' : 'Mute TCD Audio'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isAudioMuted ? 'var(--text-muted)' : '#0284c7',
                padding: isTablet ? '10px' : '2px',
                minWidth: isTablet ? '40px' : undefined,
                minHeight: isTablet ? '40px' : undefined,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              title={isAudioMuted ? 'Unmute Transcranial Doppler Synthesizer' : 'Mute TCD Audio'}
            >
              {isAudioMuted ? <VolumeX size={isMobile ? 16 : 13} /> : <Volume2 size={isMobile ? 16 : 13} />}
            </button>
          </div>

          {/* Hemodynamic State Pill Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-canvas)',
            padding: '2px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--glass-border)',
            gap: '2px',
            flexWrap: isTablet ? 'wrap' : undefined,
            width: isMobile ? '100%' : undefined,
            maxWidth: '100%',
            minWidth: 0
          }}>
            <button
              onClick={() => setHemoState('normal')}
              style={{
                padding: ribbonBtnPadding,
                minHeight: ribbonBtnMinHeight,
                flex: isMobile ? '1 1 0' : undefined,
                borderRadius: '4px',
                border: 'none',
                fontSize: '11px',
                fontWeight: hemoState === 'normal' ? 700 : 500,
                backgroundColor: hemoState === 'normal' ? '#10b981' : 'transparent',
                color: hemoState === 'normal' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {isMobile ? 'Normal' : 'Normal Perfusion'}
            </button>
            <button
              onClick={() => setHemoState('acute-lvo')}
              style={{
                padding: ribbonBtnPadding,
                minHeight: ribbonBtnMinHeight,
                flex: isMobile ? '1 1 0' : undefined,
                borderRadius: '4px',
                border: 'none',
                fontSize: '11px',
                fontWeight: hemoState === 'acute-lvo' ? 700 : 500,
                backgroundColor: hemoState === 'acute-lvo' ? '#e11d48' : 'transparent',
                color: hemoState === 'acute-lvo' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{isMobile ? 'Acute LVO' : 'Acute LVO Occlusion'}</span>
              {hemoState === 'acute-lvo' && (
                <span className="pulse-active pulse-danger" style={{ width: '4px', height: '4px' }}></span>
              )}
            </button>
            <button
              onClick={() => setHemoState('post-evt')}
              style={{
                padding: ribbonBtnPadding,
                minHeight: ribbonBtnMinHeight,
                flex: isMobile ? '1 1 0' : undefined,
                borderRadius: '4px',
                border: 'none',
                fontSize: '11px',
                fontWeight: hemoState === 'post-evt' ? 700 : 500,
                backgroundColor: hemoState === 'post-evt' ? '#0284c7' : 'transparent',
                color: hemoState === 'post-evt' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {isMobile ? 'TICI 3' : 'TICI 3 Reperfusion'}
            </button>
          </div>

          {/* Saver JL Ticker (When Acute LVO is active) */}
          {hemoState === 'acute-lvo' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '8px 10px' : '2px 10px',
              backgroundColor: 'rgba(225, 29, 72, 0.1)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(225, 29, 72, 0.25)',
              fontSize: '11.5px',
              color: '#e11d48',
              flexWrap: 'wrap',
              width: isMobile ? '100%' : undefined,
              maxWidth: '100%',
              minWidth: 0,
              fontVariantNumeric: 'tabular-nums'
            }}>
              <Clock size={12} style={{ flexShrink: 0 }} />
              {isMobile ? (
                <span><strong>Time is Brain:</strong> {(neuronsLost / 1000000).toFixed(2)}M neurons lost ({elapsedSeconds}s)</span>
              ) : (
                <span><strong>Time is Brain:</strong> {(neuronsLost / 1000000).toFixed(2)}M neurons &amp; {(synapsesLost / 1000000000).toFixed(1)}B synapses lost ({elapsedSeconds}s)</span>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Launch Interactive Modals & Cath Lab Theme Switch */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: isTablet ? 'wrap' : undefined,
          width: isTabletPortrait ? '100%' : undefined,
          maxWidth: '100%',
          minWidth: 0
        }}>
          {/* Circle of Willis Flow Modal Trigger */}
          <button
            onClick={onOpenCircleOfWillis}
            className="btn btn-secondary btn-sm"
            style={{
              fontSize: '11px',
              padding: isMobile ? '10px 8px' : isTablet ? '8px 12px' : '3px 9px',
              minHeight: isMobile ? 44 : isTablet ? 40 : undefined,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              flex: isMobile ? '1 1 0' : undefined,
              whiteSpace: 'nowrap'
            }}
            title="Open Interactive Circle of Willis Collateral Flow Simulator"
          >
            <GitBranch size={12} color="#0284c7" />
            <span>{isSmallPhone ? 'Willis' : 'Circle of Willis'}</span>
          </button>

          {/* ASPECTS CT Heatmap Trigger */}
          <button
            onClick={onOpenAspects}
            className="btn btn-secondary btn-sm"
            style={{
              fontSize: '11px',
              padding: isMobile ? '10px 8px' : isTablet ? '8px 12px' : '3px 9px',
              minHeight: isMobile ? 44 : isTablet ? 40 : undefined,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              flex: isMobile ? '1 1 0' : undefined,
              whiteSpace: 'nowrap'
            }}
            title="Open Alberta Stroke Program Early CT Score (ASPECTS) Calculator"
          >
            <Layers size={12} color="#e11d48" />
            <span>{isSmallPhone ? 'ASPECTS' : 'ASPECTS 10 CT'}</span>
          </button>

          {/* Cath Lab / Fluoroscopy Dark Mode Toggle */}
          <button
            onClick={() => setIsCathLabTheme(!isCathLabTheme)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: isMobile ? '10px 8px' : isTablet ? '8px 12px' : '3px 10px',
              minHeight: isMobile ? 44 : isTablet ? 40 : undefined,
              flex: isMobile ? '1 1 100%' : undefined,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isCathLabTheme ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-canvas)',
              border: `1px solid ${isCathLabTheme ? 'rgba(56, 189, 248, 0.4)' : 'var(--glass-border)'}`,
              color: isCathLabTheme ? '#38bdf8' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            title={isCathLabTheme ? 'Switch to Swiss Bio-Clinical Light Mode' : 'Switch to Cath Lab Fluoroscopy Dark Mode'}
          >
            {isCathLabTheme ? <Sun size={12} color="#38bdf8" /> : <Moon size={12} color="#64748b" />}
            <span>{isCathLabTheme ? 'Cath Lab Glow' : 'Light Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
