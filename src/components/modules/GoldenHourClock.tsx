import React, { useState } from 'react';
import { Timer, AlertTriangle, Zap, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const GoldenHourClock: React.FC = () => {
  // Time in minutes (0 to 360, default at 75 mins / 1.25 hours)
  const [minutes, setMinutes] = useState<number>(75);

  // Biological loss formulas based on Saver JL. (Stroke 2006)
  // 1.9M neurons/min, 14B synapses/min, 12km (7.5 miles) myelinated fibers/min
  const neuronsLost = Math.floor(minutes * 1.9 * 1_000_000);
  const synapsesLost = Math.floor(minutes * 14 * 1_000_000_000);
  const agingWeeks = Math.floor(minutes * 3.1);
  const fiberKm = (minutes * 12).toFixed(1);

  // Penumbra vs Infarct Core percentage
  // At 0 mins: Penumbra is 95%, Core is 5%
  // At 360 mins: Penumbra is 5%, Core is 95%
  const corePercent = Math.min(95, Math.max(5, Math.round((minutes / 360) * 90 + 5)));
  const penumbraPercent = 100 - corePercent;

  // Determining current therapeutic status
  let statusBadge = {
    title: 'Optimal Golden Window (IV Thrombolysis)',
    color: 'badge-success',
    description: 'Highest efficacy for IV tPA (Alteplase/Tenecteplase). Every 15 minutes saved significantly boosts full functional independence.',
  };

  if (minutes > 270) {
    statusBadge = {
      title: 'Extended EVT Thrombectomy Window (Perfusion Dependent)',
      color: 'badge-danger',
      description: 'Exceeds standard IV tPA window. Emergency Endovascular Mechanical Thrombectomy (EVT) remains viable up to 24h if perfusion CT demonstrates viable penumbra mismatch.',
    };
  } else if (minutes > 180) {
    statusBadge = {
      title: 'Extended IV Thrombolysis Window',
      color: 'badge-warning',
      description: 'Eligible for IV thrombolysis under specific criteria (age, stroke severity, prior anticoagulation status). Rapid transport is essential.',
    };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px', background: 'linear-gradient(135deg, #ffffff, #f0f9ff)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">
                <Timer size={13} /> Time is Brain
              </span>
              <span className={`badge ${statusBadge.color}`}>
                {minutes < 60 ? `${minutes} Mins Elapsed` : `${(minutes / 60).toFixed(1)} Hours Elapsed`}
              </span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Golden Hour & Neuron Survival Clock
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
              Every single minute during an acute untreated ischemic stroke destroys approximately 1.9 million neurons. Drag the interactive timeline to visualize the irreversible cellular clock and penumbral tissue rescue windows.
            </p>
          </div>

          <div style={{
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Accelerated Brain Aging
            </span>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--danger-500)', fontFamily: 'var(--font-mono)' }}>
              +{agingWeeks} Weeks
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>Equivalent cellular decay</span>
          </div>
        </div>

        {/* Interactive Timeline Slider */}
        <div style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
              Elapsed Time from "Last Known Well" (Onset)
            </span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'var(--font-mono)' }}>
              {Math.floor(minutes / 60)}h {minutes % 60}m ({minutes} minutes)
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            style={{
              width: '100%',
              height: '10px',
              borderRadius: '5px',
              background: `linear-gradient(to right, #10b981 0%, #0284c7 35%, #f59e0b 55%, #ef4444 85%, #b91c1c 100%)`,
              outline: 'none',
              cursor: 'pointer'
            }}
          />

          {/* Key Milestones Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>0h (Onset)</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>3.0h (Standard tPA)</span>
            <span style={{ color: '#d97706', fontWeight: 600 }}>4.5h (Extended IV Window)</span>
            <span style={{ color: '#dc2626', fontWeight: 600 }}>6.0h+ (EVT Thrombectomy)</span>
          </div>
        </div>
      </div>

      {/* Real-Time Biological Loss Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--danger-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Zap size={18} color="var(--danger-500)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>Neurons Destroyed</h4>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {(neuronsLost / 1_000_000).toFixed(1)} Million
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Loss rate: 1,900,000 neurons / min
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--synapse-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Clock size={18} color="var(--synapse-500)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>Synapses Severed</h4>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {(synapsesLost / 1_000_000_000).toFixed(1)} Billion
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Loss rate: 14,000,000,000 synapses / min
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--primary-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertTriangle size={18} color="var(--primary-500)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>Nerve Fibers Degraded</h4>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {fiberKm} km
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            7.5 miles of myelinated tracts / min
          </p>
        </div>
      </div>

      {/* Visual Penumbra vs Infarct Core Expansion Diagram */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
          Tissue Dynamics: The Penumbra vs. Infarct Core
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          The <strong>Ischemic Penumbra</strong> is the under-perfused brain tissue that is functionally dormant but structurally alive. As time passes, the non-viable <strong>Infarct Core</strong> engulfs the penumbra.
        </p>

        {/* Visual Progress Bar Ratio */}
        <div style={{
          height: '42px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '14px'
        }}>
          <div style={{
            width: `${corePercent}%`,
            backgroundColor: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            transition: 'width 0.2s ease',
            minWidth: '70px'
          }}>
            Core {corePercent}%
          </div>
          <div style={{
            width: `${penumbraPercent}%`,
            backgroundColor: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            transition: 'width 0.2s ease',
            minWidth: '90px'
          }}>
            Salvageable Penumbra {penumbraPercent}%
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
            <strong>Infarct Core:</strong> Irreversibly necrosed tissue with cellular energy failure.
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
            <strong>Ischemic Penumbra:</strong> Can be rescued if reperfusion occurs before collapse.
          </span>
        </div>
      </div>

      {/* Critical Clinical Action Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--success-50)', borderColor: 'var(--success-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <CheckCircle2 size={20} color="var(--success-600)" />
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--success-600)' }}>
              What MUST Be Done Immediately
            </h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-body)' }}>
            <li>✓ <strong>Note the Exact Time:</strong> Pinpoint the precise minute the person was last seen completely normal.</li>
            <li>✓ <strong>Call Emergency Dispatch:</strong> Paramedics pre-notify the stroke team and CT scanner while en route.</li>
            <li>✓ <strong>Keep Patient Flat & Resting:</strong> Sitting up abruptly can reduce gravitational blood flow to the ischemic penumbra.</li>
            <li>✓ <strong>Gather Medication List:</strong> Bring any blood thinners (Warfarin, Eliquis, Plavix) to the emergency bay.</li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'var(--danger-50)', borderColor: 'var(--danger-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <XCircle size={20} color="var(--danger-600)" />
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--danger-600)' }}>
              Dangerous Mistakes to Avoid
            </h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-body)' }}>
            <li>✕ <strong>NEVER Give Aspirin Before CT:</strong> If the stroke is hemorrhagic (bleeding), aspirin causes fatal hemorrhage expansion.</li>
            <li>✕ <strong>NEVER Give Water or Food:</strong> Stroke impairs the pharyngeal gag reflex; food or liquids enter the lungs (aspiration pneumonia).</li>
            <li>✕ <strong>NEVER Drive Yourself to Hospital:</strong> EMS crews can administer oxygen, manage airway, and divert to a certified Comprehensive Stroke Center.</li>
            <li>✕ <strong>NEVER Wait to See if It Gets Better:</strong> Transient Ischemic Attacks (TIAs) precede major strokes within 48 hours.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
