import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface TimelineMilestone {
  timeLabel: string;
  hourFromOnset: number;
  alphaTitle: string;
  alphaEvent: string;
  alphaCoreVol: number; // mL
  alphaNeuronsLost: number; // in millions
  betaTitle: string;
  betaEvent: string;
  betaCoreVol: number; // mL
  betaNeuronsLost: number; // in millions
}

export const AIMultiverseTimeline: React.FC = () => {
  const [selectedHour, setSelectedHour] = useState<number>(1); // 0.2, 1, 3, 6, 24, 8760 (1 Year)

  const milestones: TimelineMilestone[] = [
    {
      timeLabel: '07:15 AM (15 Mins Post-Onset)',
      hourFromOnset: 0.25,
      alphaTitle: 'The Fatal Delay: "Just Passing Fatigue"',
      alphaEvent: 'Family assumes patient Arthur (58M) is merely overworked and exhausted. They prepare sweet hot tea and wait for rest to resolve weakness, missing early stroke onset.',
      alphaCoreVol: 12,
      alphaNeuronsLost: 28,
      betaTitle: 'BE-FAST Protocol Activated',
      betaEvent: 'Wife spots facial droop and right arm drift. Dials 112 emergency stroke dispatch immediately without hesitation.',
      betaCoreVol: 8,
      betaNeuronsLost: 15
    },
    {
      timeLabel: '08:00 AM (1 Hour Post-Onset)',
      hourFromOnset: 1.0,
      alphaTitle: 'Symptoms Escalating Unchecked',
      alphaEvent: 'Patient vomits and slumps to the floor. Speech becomes dysarthric and globally confused. Family hesitates, hoping sleep will restore baseline function.',
      alphaCoreVol: 34,
      alphaNeuronsLost: 114,
      betaTitle: 'Door-to-Needle in Angio Suite',
      betaEvent: 'Ambulance pre-alerts hospital. CT angiogram shows Left M1 occlusion. IV Tenecteplase administered at minute 42.',
      betaCoreVol: 12,
      betaNeuronsLost: 32
    },
    {
      timeLabel: '10:00 AM (3 Hours Post-Onset)',
      hourFromOnset: 3.0,
      alphaTitle: 'Primary Clinic Misdirection',
      alphaEvent: 'Taken to small outpatient clinic without a CT scanner. Doctor suspects vestibular migraine. Valuable hours permanently lost.',
      alphaCoreVol: 68,
      alphaNeuronsLost: 342,
      betaTitle: 'TICI 3 Endovascular Recanalization',
      betaEvent: 'Catheter lab thrombectomy deployed. Fibrin clot extracted in one pass! Re-perfusion confirmed. 88 mL penumbra saved.',
      betaCoreVol: 14,
      betaNeuronsLost: 45
    },
    {
      timeLabel: '01:00 PM (6 Hours Post-Onset)',
      hourFromOnset: 6.0,
      alphaTitle: 'Arrives Past Therapeutic Windows',
      alphaEvent: 'Transferred to general hospital. Emergency CT shows massive 95 mL dark hypodensity and midline shift. Ineligible for tPA or EVT.',
      alphaCoreVol: 98,
      alphaNeuronsLost: 684,
      betaTitle: 'Neuro-ICU Stabilization',
      betaEvent: 'Speech center intact. Patient sitting up in bed drinking water. Extravasation ruled out. Minimal 7 mL residual scar.',
      betaCoreVol: 14,
      betaNeuronsLost: 45
    },
    {
      timeLabel: '1 Year Post-Stroke (Long-Term Outcome)',
      hourFromOnset: 8760,
      alphaTitle: 'Severe Permanent Disability (mRS 5)',
      alphaEvent: 'Bedridden and wheelchair-bound. Dense right hemiplegia and irreversible global aphasia. Dependent on full-time family caregiver.',
      alphaCoreVol: 104,
      alphaNeuronsLost: 720,
      betaTitle: 'Independent Life Restored (mRS 1)',
      betaEvent: 'Returned to accounting firm after 4 weeks of rehab. Walks freely, drives car, and enjoys grandchildren with full speech fluency.',
      betaCoreVol: 14,
      betaNeuronsLost: 45
    }
  ];

  // Find active milestone
  const activeMilestone = milestones.find((m) => m.hourFromOnset === selectedHour) || milestones[1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner */}
      <div className="glass-card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-danger">
                <Clock size={13} /> AI Multiverse Fate Engine
              </span>
              <span className="badge badge-primary">
                Side-by-Side Clinical Counterfactual
              </span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              The Multiverse of Stroke: The Cost of a Minute
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '840px', fontSize: '14.5px', lineHeight: 1.55 }}>
              Witness two parallel realities for the exact same patient (Arthur Pendelton, 58 yo male, Left M1 MCA Occlusion). One timeline experiences family denial and delayed hospital arrival; the other activates the Golden Hour protocol within minutes.
            </p>
          </div>
        </div>

        {/* Milestone Timeline Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
          {milestones.map((m) => (
            <button
              key={m.hourFromOnset}
              onClick={() => setSelectedHour(m.hourFromOnset)}
              className={`btn btn-sm ${selectedHour === m.hourFromOnset ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '12px', padding: '8px 14px' }}
            >
              {m.timeLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Split-Screen Comparative Reality Arena */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {/* Timeline Alpha: The Fatal Delay */}
        <div className="glass-card" style={{
          padding: '24px',
          borderTop: '4px solid #ef4444',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fffafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="badge badge-danger">Timeline Alpha: The Delay</span>
            <XCircle size={20} color="#e11d48" />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#9f1239', marginBottom: '8px' }}>
            {activeMilestone.alphaTitle}
          </h3>
          <p style={{ fontSize: '13.5px', color: '#881337', lineHeight: 1.55, marginBottom: '20px' }}>
            {activeMilestone.alphaEvent}
          </p>

          {/* Biological Damage Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px',
            marginTop: 'auto'
          }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: 700 }}>Infarct Core Volume</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#7f1d1d', fontFamily: 'var(--font-mono)' }}>
                {activeMilestone.alphaCoreVol} mL
              </div>
              <span style={{ fontSize: '10.5px', color: '#b91c1c' }}>Irreversible Tissue Death</span>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: 700 }}>Neurons Destroyed</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#7f1d1d', fontFamily: 'var(--font-mono)' }}>
                {activeMilestone.alphaNeuronsLost}M
              </div>
              <span style={{ fontSize: '10.5px', color: '#b91c1c' }}>Saver JL Loss Rate</span>
            </div>
          </div>

          {/* Clinical Consequence Card */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #fecdd3',
            fontSize: '12.5px',
            color: '#881337'
          }}>
            <strong>Neurological Prognosis:</strong> Severe dense hemiplegia, complete aphasia, mRS 5 disability. Lifetime care cost estimate: ~$650,000 (continuous assisted nursing).
          </div>
        </div>

        {/* Timeline Beta: The Golden Hour Protocol */}
        <div className="glass-card" style={{
          padding: '24px',
          borderTop: '4px solid #10b981',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f0fdf4'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="badge badge-success">Timeline Beta: Golden Hour Protocol</span>
            <CheckCircle2 size={20} color="#059669" />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', marginBottom: '8px' }}>
            {activeMilestone.betaTitle}
          </h3>
          <p style={{ fontSize: '13.5px', color: '#047857', lineHeight: 1.55, marginBottom: '20px' }}>
            {activeMilestone.betaEvent}
          </p>

          {/* Biological Salvage Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px',
            marginTop: 'auto'
          }}>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: '#14532d', fontWeight: 700 }}>Infarct Core Volume</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#166534', fontFamily: 'var(--font-mono)' }}>
                {activeMilestone.betaCoreVol} mL
              </div>
              <span style={{ fontSize: '10.5px', color: '#15803d' }}>Minimal Focal Scar</span>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: '#14532d', fontWeight: 700 }}>Neurons Destroyed</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#166534', fontFamily: 'var(--font-mono)' }}>
                {activeMilestone.betaNeuronsLost}M
              </div>
              <span style={{ fontSize: '10.5px', color: '#15803d' }}>~94% Brain Tissue Rescued</span>
            </div>
          </div>

          {/* Clinical Consequence Card */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #bbf7d0',
            fontSize: '12.5px',
            color: '#14532d'
          }}>
            <strong>Neurological Prognosis:</strong> Full autonomy, intact language, mRS 1 score. Patient walked out of hospital independently on Day 6.
          </div>
        </div>
      </div>
    </div>
  );
};
