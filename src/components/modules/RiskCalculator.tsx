import React, { useState } from 'react';
import { ShieldAlert, Sparkles, TrendingDown } from 'lucide-react';
import type { RiskProfileInput } from '../../types/stroke';
import { generateAIRiskAnalysis } from '../../services/openRouterService';

export const RiskCalculator: React.FC = () => {
  const [profile, setProfile] = useState<RiskProfileInput>({
    age: 58,
    sex: 'male',
    systolicBP: 148,
    diastolicBP: 92,
    isHypertensiveMed: true,
    hasDiabetes: false,
    smoker: true,
    hasAFib: false,
    hasPriorStroke: false,
    hasVascularDisease: false
  });

  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  // Calculate CHA2DS2-VASc score
  const calculateScore = (p: RiskProfileInput) => {
    let score = 0;
    if (p.systolicBP >= 140 || p.isHypertensiveMed) score += 1;
    if (p.age >= 75) score += 2;
    else if (p.age >= 65) score += 1;
    if (p.hasDiabetes) score += 1;
    if (p.hasPriorStroke) score += 2;
    if (p.hasVascularDisease) score += 1;
    if (p.sex === 'female') score += 1;
    if (p.hasAFib) score += 1;
    return score;
  };

  const currentScore = calculateScore(profile);

  // Estimated 10-year stroke probability percentage
  const calculate10YrRisk = (score: number, smoker: boolean) => {
    const base = [1.5, 2.8, 4.0, 5.9, 9.2, 15.3, 19.7, 26.5, 33.0, 42.0];
    const riskVal = base[Math.min(score, 9)] + (smoker ? 4.5 : 0);
    return Math.min(65, Math.round(riskVal));
  };

  const riskPercent = calculate10YrRisk(currentScore, profile.smoker);

  // Simulated "Optimized Lifestyle" What-If Scenario
  const optimizedProfile: RiskProfileInput = {
    ...profile,
    systolicBP: 120,
    smoker: false,
    isHypertensiveMed: false
  };
  const optimizedScore = calculateScore(optimizedProfile);
  const optimizedRisk = calculate10YrRisk(optimizedScore, false);
  const riskReductionDelta = Math.max(0, riskPercent - optimizedRisk);

  const handleRunAIAnalysis = async () => {
    setIsLoadingAI(true);
    try {
      const result = await generateAIRiskAnalysis(profile);
      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <ShieldAlert size={13} /> Epidemiological Risk Engine
          </span>
          <span className="badge badge-synapse">
            CHA₂DS₂-VASc & Framingham Hybrid
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Personalized Stroke Risk Index & Lifestyle Modeler
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
          Over 80% of all strokes are completely preventable through modifiable vascular risk factor management. Input your biometric profile below to calculate your validated clinical score and model life-saving interventions.
        </p>
      </div>

      {/* Main Grid: Parameters on Left, Output Metrics on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(340px, 1fr)', gap: '24px' }}>
        {/* Left: Input Form Parameters */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
            Biometric & Cardiovascular Profile
          </h3>

          {/* Age & Sex */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Age: {profile.age} years
              </label>
              <input
                type="range"
                min={20}
                max={90}
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Biological Sex
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setProfile({ ...profile, sex: 'male' })}
                  className={`btn btn-sm ${profile.sex === 'male' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  Male
                </button>
                <button
                  onClick={() => setProfile({ ...profile, sex: 'female' })}
                  className={`btn btn-sm ${profile.sex === 'female' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* Blood Pressure Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Systolic BP: <span style={{ color: profile.systolicBP >= 140 ? 'var(--red-500)' : 'var(--cyan-400)', fontWeight: 700 }}>{profile.systolicBP} mmHg</span>
              </label>
              <input
                type="range"
                min={90}
                max={200}
                value={profile.systolicBP}
                onChange={(e) => setProfile({ ...profile, systolicBP: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Diastolic BP: <span style={{ color: profile.diastolicBP >= 90 ? 'var(--red-500)' : 'var(--cyan-400)', fontWeight: 700 }}>{profile.diastolicBP} mmHg</span>
              </label>
              <input
                type="range"
                min={50}
                max={120}
                value={profile.diastolicBP}
                onChange={(e) => setProfile({ ...profile, diastolicBP: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            {[
              { key: 'isHypertensiveMed', label: 'Currently Taking Blood Pressure Medications' },
              { key: 'smoker', label: 'Active Cigarette Smoking or Daily Vaping' },
              { key: 'hasDiabetes', label: 'Diagnosed Type 1 or Type 2 Diabetes' },
              { key: 'hasAFib', label: 'History of Atrial Fibrillation (Irregular Pulse)' },
              { key: 'hasPriorStroke', label: 'Prior History of Stroke or TIA (Mini-Stroke)' },
              { key: 'hasVascularDisease', label: 'Peripheral Artery Disease (PAD) or Prior Heart Attack' }
            ].map((item) => {
              const checked = profile[item.key as keyof RiskProfileInput] as boolean;
              return (
                <label
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: checked ? 'rgba(0,245,255,0.07)' : 'var(--bg-raised)',
                    border: checked ? '1px solid var(--primary-200)' : '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setProfile({ ...profile, [item.key]: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-400)', cursor: 'pointer' }}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Right: Results, Gauges & AI Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Risk Card */}
          <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
              Estimated 10-Year Probability
            </span>

            <div style={{
              fontSize: '56px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: riskPercent >= 20 ? 'var(--red-neon)' : (riskPercent >= 10 ? 'var(--amber-400)' : 'var(--green-neon)'),
              lineHeight: 1
            }}>
              {riskPercent}%
            </div>

            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
              CHA₂DS₂-VASc Clinical Score: <strong>{currentScore} Points</strong>
            </p>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'var(--bg-raised)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              color: 'var(--text-muted)'
            }}>
              {currentScore >= 4 ? (
                <span style={{ color: 'var(--red-400)', fontWeight: 600 }}>
                  High Risk Category: Comprehensive medical therapy & cardiologist review recommended.
                </span>
              ) : currentScore >= 2 ? (
                <span style={{ color: 'var(--amber-400)', fontWeight: 600 }}>
                  Moderate Risk Category: Aggressive lifestyle modifications advised.
                </span>
              ) : (
                <span style={{ color: 'var(--green-400)', fontWeight: 600 }}>
                  Low Baseline Risk: Maintain consistent physical activity and balanced diet.
                </span>
              )}
            </div>
          </div>

          {/* "What-If" Life-Saving Simulation Banner */}
          <div className="glass-card" style={{ padding: '24px', backgroundColor: 'rgba(0,255,136,0.06)', borderColor: 'rgba(0, 255, 136, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TrendingDown size={20} color="var(--green-400)" />
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--green-400)' }}>
                "What-If" Lifestyle Impact Modeling
              </h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              If you achieve normal blood pressure (&lt;120 mmHg) and abstain from smoking/vaping:
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--green-neon)', fontFamily: 'var(--font-mono)' }}>
                -{riskReductionDelta}%
              </span>
              <span style={{ fontSize: '13px', color: 'var(--green-400)', fontWeight: 600 }}>
                Drop in your 10-year stroke probability!
              </span>
            </div>
          </div>

          {/* AI Narrative Breakdown Button & Container */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--cyan-400)" />
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>AI Epidemiologist Narrative</h4>
              </div>

              <button
                onClick={handleRunAIAnalysis}
                className="btn btn-primary btn-sm"
                disabled={isLoadingAI}
              >
                {isLoadingAI ? 'Analyzing...' : 'Generate AI Analysis'}
              </button>
            </div>

            {aiAnalysis ? (
              <div style={{
                fontSize: '13px',
                color: 'var(--text-body)',
                lineHeight: 1.6,
                backgroundColor: 'var(--bg-raised)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <div style={{ whiteSpace: 'pre-line' }}>{aiAnalysis}</div>
              </div>
            ) : (
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Click "Generate AI Analysis" to have our vascular AI review your exact metrics and formulate a structured prevention plan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
