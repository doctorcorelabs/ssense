import React, { useState } from 'react';
import { Pill, AlertOctagon, AlertTriangle } from 'lucide-react';
import type { DrugInteractionResult } from '../../types/stroke';

export const DrugInteractionGuard: React.FC = () => {
  const [selectedDrug, setSelectedDrug] = useState<string>('Warfarin');
  const [selectedSupplement, setSelectedSupplement] = useState<string>('Ginkgo Biloba');

  const drugs = [
    { id: 'Warfarin', name: 'Warfarin (Coumadin)', type: 'Vitamin K Antagonist Anticoagulant' },
    { id: 'Clopidogrel', name: 'Clopidogrel (Plavix)', type: 'P2Y12 Antiplatelet' },
    { id: 'Aspirin', name: 'Aspirin (Aspilets)', type: 'COX-1 Inhibitor Antiplatelet' },
    { id: 'Apixaban', name: 'Apixaban (Eliquis)', type: 'Direct Factor Xa Inhibitor (DOAC)' },
    { id: 'Rivaroxaban', name: 'Rivaroxaban (Xarelto)', type: 'Direct Factor Xa Inhibitor (DOAC)' },
  ];

  const supplements = [
    { id: 'Ginkgo Biloba', name: 'Ginkgo Biloba', popularFor: 'Memory & Cognitive Enhancement' },
    { id: 'St. John\'s Wort', name: 'St. John\'s Wort', popularFor: 'Mild Depression & Mood Lift' },
    { id: 'Garlic Extract', name: 'High-Dose Garlic Extract', popularFor: 'Cholesterol & Blood Pressure' },
    { id: 'Fish Oil', name: 'High-Dose Omega-3 Fish Oil (>3g)', popularFor: 'Cardiovascular Support' },
    { id: 'Panax Ginseng', name: 'Panax Ginseng', popularFor: 'Vitality & Physical Energy' },
    { id: 'Vitamin E', name: 'High-Dose Vitamin E (>400 IU)', popularFor: 'Antioxidant & Skin Health' },
    { id: 'Turmeric', name: 'Turmeric / Curcumin Extract', popularFor: 'Joint & Inflammation Relief' },
  ];

  // Clinical Interaction Matrix Database
  const interactionDatabase: Record<string, DrugInteractionResult> = {
    'Warfarin-Ginkgo Biloba': {
      drug: 'Warfarin',
      supplement: 'Ginkgo Biloba',
      severity: 'severe',
      riskScore: 9,
      headline: 'Extreme Hazard: Subdural & Intracranial Hemorrhage Risk',
      mechanism: 'Ginkgo biloba contains potent ginkgolide B, which acts as a strong antagonist of Platelet-Activating Factor (PAF). Combined with Warfarin\'s suppression of Vitamin K-dependent clotting factors (II, VII, IX, X), it induces severe uninhibited bleeding with multiple documented cases of spontaneous brain hematomas.',
      recommendation: 'Strictly avoid concomitant use. Advise patient to discontinue Ginkgo immediately and notify their prescribing hematologist or stroke clinic.'
    },
    'Warfarin-St. John\'s Wort': {
      drug: 'Warfarin',
      supplement: 'St. John\'s Wort',
      severity: 'severe',
      riskScore: 9,
      headline: 'Severe Hazard: High Risk of Recurrent Ischemic Stroke',
      mechanism: 'Hyperforin in St. John\'s Wort is a potent inducer of hepatic cytochrome P450 enzymes (specifically CYP2C9 and CYP3A4). This drastically accelerates the metabolism of Warfarin, causing the International Normalized Ratio (INR) to plummet below therapeutic levels (subtherapeutic), precipitating acute recurrent embolic strokes.',
      recommendation: 'Discontinue St. John\'s Wort immediately. Frequent INR monitoring is required as enzyme induction takes up to 2 weeks to normalize.'
    },
    'Clopidogrel-Ginkgo Biloba': {
      drug: 'Clopidogrel',
      supplement: 'Ginkgo Biloba',
      severity: 'severe',
      riskScore: 8,
      headline: 'Severe Hazard: Compounded Antiplatelet Blockade',
      mechanism: 'Both agents block distinct platelet activation pathways simultaneously (P2Y12 adenosine receptor vs. PAF receptors). This causes synergistic primary hemostatic impairment, leading to prolonged bleeding times and mucosal hemorrhages.',
      recommendation: 'Do not combine. Consider non-pharmacological memory rehabilitation exercises instead.'
    },
    'Aspirin-Garlic Extract': {
      drug: 'Aspirin',
      supplement: 'Garlic Extract',
      severity: 'moderate',
      riskScore: 6,
      headline: 'Moderate Caution: Additive Antiplatelet Bleeding Tendency',
      mechanism: 'Allicin in concentrated garlic supplements inhibits thromboxane synthesis and alters platelet membrane fluidity. In combination with Aspirin\'s irreversible COX-1 inhibition, bruising, epistaxis (nosebleeds), and gastrointestinal micro-bleeding risk are amplified.',
      recommendation: 'Culinary garlic in normal food amounts is safe. However, high-dose therapeutic garlic capsules should be avoided prior to surgery or in patients with gastrointestinal ulcers.'
    },
    'Apixaban-Fish Oil': {
      drug: 'Apixaban',
      supplement: 'Fish Oil',
      severity: 'moderate',
      riskScore: 5,
      headline: 'Moderate Caution: High-Dose EPA/DHA Anti-Thrombotic Synergy',
      mechanism: 'Doses of Omega-3 above 3,000 mg/day displace arachidonic acid in platelet membranes, diminishing thromboxane A2 production. When paired with direct factor Xa inhibitors like Apixaban, bleeding times can be prolonged.',
      recommendation: 'Standard dietary fish consumption or low-dose omega-3 (<1,000 mg) is generally well tolerated, but high-dose concentrates require physician supervision.'
    },
    'Warfarin-Garlic Extract': {
      drug: 'Warfarin',
      supplement: 'Garlic Extract',
      severity: 'severe',
      riskScore: 8,
      headline: 'High Hazard: INR Destabilization & Micro-Vascular Bleeding',
      mechanism: 'Garlic constituents possess intrinsic antithrombotic and mild fibrinolytic properties, which can synergize dangerously with Warfarin and cause unpredictable INR fluctuations.',
      recommendation: 'Avoid high-dose garlic dietary pills. Monitor prothrombin time closely if recent intake occurred.'
    },
    'Aspirin-Vitamin E': {
      drug: 'Aspirin',
      supplement: 'Vitamin E',
      severity: 'moderate',
      riskScore: 6,
      headline: 'Moderate Caution: Vitamin K Antagonism at High Doses',
      mechanism: 'Alpha-tocopherol (Vitamin E) at doses exceeding 400 IU daily interferes with Vitamin K-dependent carboxylase activity and inhibits protein kinase C-mediated platelet aggregation, synergizing with Aspirin.',
      recommendation: 'Limit Vitamin E supplementation to dietary RDA levels unless specifically prescribed for deficiency.'
    }
  };

  const currentKey = `${selectedDrug}-${selectedSupplement}`;
  const currentResult = interactionDatabase[currentKey] || {
    drug: selectedDrug,
    supplement: selectedSupplement,
    severity: 'moderate',
    riskScore: 5,
    headline: 'Caution: Potential Pharmacokinetic / Enzyme Interaction',
    mechanism: `Concurrent administration of ${selectedDrug} with ${selectedSupplement} may influence hepatic clearance or possess additive antiplatelet properties. Stroke patients on therapeutic anticoagulation have a lower margin of safety for hemostatic balance.`,
    recommendation: 'Always report all over-the-counter herbal teas, powders, and nutritional supplements to your attending stroke specialist before starting.'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <Pill size={13} /> Pharmacological Safety Guard
          </span>
          <span className="badge badge-danger">
            Bleeding Hazard Checker
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Drug & Herbal Supplement Interaction Guard
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
          Many stroke survivors take life-saving blood thinners (antiplatelets or anticoagulants). However, popular "natural" herbal supplements like Ginkgo, St. John's Wort, or high-dose garlic can trigger catastrophic brain hemorrhages or inactivate your medications. Select your regimen below to check compatibility.
        </p>
      </div>

      {/* Selector Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Prescribed Blood Thinners Column */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
            Column A: Prescribed Blood Thinner
          </span>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
            Select Your Active Prescription:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {drugs.map((d) => {
              const isSelected = selectedDrug === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDrug(d.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--primary-100)' : 'var(--bg-muted)',
                    border: isSelected ? '1px solid var(--primary-400)' : '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? 'var(--primary-800)' : 'var(--text-main)' }}>
                    {d.name}
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {d.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Herbal Supplements Column */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <span className="badge badge-warning" style={{ marginBottom: '10px' }}>
            Column B: Herbal Supplement
          </span>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
            Select Supplement Being Considered:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
            {supplements.map((s) => {
              const isSelected = selectedSupplement === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSupplement(s.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--warning-100)' : 'var(--bg-muted)',
                    border: isSelected ? '1px solid var(--warning-500)' : '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? 'var(--warning-600)' : 'var(--text-main)' }}>
                    {s.name}
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Popular for: {s.popularFor}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety Diagnostic Output Panel */}
      <div className="glass-card" style={{
        padding: '32px',
        backgroundColor: currentResult.severity === 'severe' ? 'var(--danger-50)' : 'var(--warning-50)',
        borderColor: currentResult.severity === 'severe' ? 'var(--danger-100)' : 'var(--warning-100)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentResult.severity === 'severe' ? (
              <AlertOctagon size={32} color="var(--danger-600)" />
            ) : (
              <AlertTriangle size={32} color="var(--warning-600)" />
            )}
            <div>
              <span className={`badge ${currentResult.severity === 'severe' ? 'badge-danger' : 'badge-warning'}`}>
                {currentResult.severity === 'severe' ? 'Critical Contraindication' : 'Clinical Caution Required'}
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {currentResult.headline}
              </h3>
            </div>
          </div>

          <div style={{
            padding: '10px 20px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Hazard Severity Score
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: currentResult.severity === 'severe' ? 'var(--danger-500)' : 'var(--warning-500)', fontFamily: 'var(--font-mono)' }}>
              {currentResult.riskScore} / 10
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '12.5px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>
            Pharmacological & Molecular Mechanism:
          </h4>
          <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
            {currentResult.mechanism}
          </p>
        </div>

        <div style={{
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-700)', marginBottom: '4px' }}>
            Clinical Recommendation:
          </h4>
          <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {currentResult.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
