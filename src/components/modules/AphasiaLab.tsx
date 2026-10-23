import React, { useState } from 'react';
import { Activity, Volume2, Brain, CheckCircle, RefreshCw } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

type AphasiaType = 'broca' | 'wernicke' | 'anomic';

export const AphasiaLab: React.FC = () => {
  const { isMobile, isTabletPortrait } = useResponsive();
  const [activeType, setActiveType] = useState<AphasiaType>('broca');

  // Broca's Simulator State
  const [brocaInput, setBrocaInput] = useState<string>('');
  const [brocaAttempt, setBrocaAttempt] = useState<string[]>([]);
  const allowedBrocaWords = ['Head', 'Pain', 'Bad', 'Water', 'Please', 'Need', 'Help', 'Pill', 'Bed'];

  // Wernicke's Simulator State
  const [wernickeSelectedOption, setWernickeSelectedOption] = useState<number | null>(null);

  // Anomic Simulator State
  const [anomicRevealed, setAnomicRevealed] = useState<boolean>(false);

  const resetAll = () => {
    setBrocaInput('');
    setBrocaAttempt([]);
    setWernickeSelectedOption(null);
    setAnomicRevealed(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <Activity size={13} /> Cognitive Empathy Lab
          </span>
          <span className="badge badge-synapse">
            Language Center
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Aphasia Word-Struggle Simulator
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
          Aphasia affects the brain's language networks without damaging intellect. Experience firsthand the frustration of expressive motor speech blocks (Broca's), fluent comprehension loss (Wernicke's), and lexical tip-of-the-tongue barriers (Anomic).
        </p>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
          <button
            onClick={() => { setActiveType('broca'); resetAll(); }}
            className={`btn ${activeType === 'broca' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Broca's Expressive Aphasia
          </button>
          <button
            onClick={() => { setActiveType('wernicke'); resetAll(); }}
            className={`btn ${activeType === 'wernicke' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Wernicke's Receptive Aphasia
          </button>
          <button
            onClick={() => { setActiveType('anomic'); resetAll(); }}
            className={`btn ${activeType === 'anomic' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Anomic Word-Finding Aphasia
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div style={{ display: 'grid', gridTemplateColumns: isTabletPortrait ? 'minmax(0, 1fr)' : 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '24px' }}>
        {/* Left: Interactive Experiment Console */}
        <div className="glass-card" style={{ padding: isMobile ? '20px' : '28px' }}>
          {activeType === 'broca' && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-danger">Expressive Motor Block</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '6px' }}>
                    Challenge: Formulate a Complete Sentence
                  </h3>
                </div>
                <button onClick={resetAll} className="btn btn-secondary btn-sm">
                  <RefreshCw size={14} /> Reset
                </button>
              </div>

              <div style={{
                backgroundColor: 'rgba(0,245,255,0.07)',
                border: '1px solid rgba(0,245,255,0.1)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-800)', textTransform: 'uppercase' }}>
                  Your Intended Thought:
                </span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                  "Doctor, I have a severe headache and I really need some water and pain medicine right away."
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Try Typing Your Sentence Below (Notice how functional grammar words are rejected):
                </label>
                <input
                  type="text"
                  placeholder="Start typing your sentence..."
                  value={brocaInput}
                  onChange={(e) => {
                    const text = e.target.value;
                    // In Broca's aphasia, grammar words like "I", "have", "a", "some", "and", "really" are lost
                    const filtered = text
                      .replace(/\b(i|have|a|the|and|really|some|right|now|away|to|is)\b/gi, '...')
                      .trim();
                    setBrocaInput(filtered);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--glass-border)',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: 'var(--bg-raised)'
                  }}
                />
                <span style={{ fontSize: '12px', color: 'var(--red-500)', marginTop: '6px', display: 'block' }}>
                  *Grammatical syntax and connectors disappear; only strenuous telegraphic effort succeeds.
                </span>
              </div>

              {/* Telegraphic Word Bank */}
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Or construct using preserved telegraphic words:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {allowedBrocaWords.map((word) => (
                    <button
                      key={word}
                      onClick={() => setBrocaAttempt([...brocaAttempt, word])}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}
                    >
                      + {word}
                    </button>
                  ))}
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-raised)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  minHeight: '60px'
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Produced Telegraphic Utterance:
                  </span>
                  <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
                    {brocaAttempt.length > 0 ? brocaAttempt.join(' ... ') : 'Click words above to speak...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeType === 'wernicke' && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-warning">Receptive Fluent Loss</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '6px' }}>
                    Challenge: Decipher Incoming Fluent Speech
                  </h3>
                </div>
                <button onClick={resetAll} className="btn btn-secondary btn-sm">
                  <RefreshCw size={14} /> Reset
                </button>
              </div>

              <div style={{
                backgroundColor: 'var(--warning-50)',
                border: '1px solid var(--warning-100)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Volume2 size={18} color="var(--warning-600)" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warning-600)', textTransform: 'uppercase' }}>
                    What You Hear (Neologistic & Paraphasic Speech):
                  </span>
                </div>
                <p style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "Please grasp the barking telescope resting upon the silver radiator so we may breakfast the clouds."
                </p>
              </div>

              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '12px' }}>
                  What did the speaker actually intend to ask you?
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { id: 0, text: 'Take your morning blood pressure medication with warm water' },
                    { id: 1, text: 'Hand over the television remote from the nightstand', correct: true },
                    { id: 2, text: 'Look out the window to check if it is raining outside' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setWernickeSelectedOption(opt.id)}
                      className="btn"
                      style={{
                        justifyContent: 'flex-start',
                        whiteSpace: 'normal',
                        width: '100%',
                        height: 'auto',
                        minHeight: 48,
                        lineHeight: 1.45,
                        textAlign: 'left',
                        padding: '14px 18px',
                        backgroundColor: wernickeSelectedOption === opt.id 
                          ? (opt.correct ? 'rgba(0,255,136,0.07)' : 'rgba(255,45,85,0.07)')
                          : 'var(--bg-raised)',
                        border: wernickeSelectedOption === opt.id
                          ? (opt.correct ? '1px solid var(--success-500)' : '1px solid var(--red-500)')
                          : '1px solid var(--glass-border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span>{opt.id + 1}. {opt.text}</span>
                    </button>
                  ))}
                </div>

                {wernickeSelectedOption !== null && (
                  <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {wernickeSelectedOption === 1 ? (
                      <span style={{ color: 'var(--green-400)', fontWeight: 600 }}>
                        ✓ Correct! "Barking telescope" was a neologistic paraphasia for "remote control".
                      </span>
                    ) : (
                      <span style={{ color: 'var(--red-400)', fontWeight: 600 }}>
                        ✕ Incorrect! Notice how fluent nonsense easily misleads both listener and speaker.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeType === 'anomic' && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-synapse">Lexical Retrieval Block</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '6px' }}>
                    Challenge: Name the Everyday Object
                  </h3>
                </div>
                <button onClick={resetAll} className="btn btn-secondary btn-sm">
                  <RefreshCw size={14} /> Reset
                </button>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '36px',
                backgroundColor: 'var(--bg-raised)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '12px' }}>⌚</div>
                <span className="badge badge-primary">Familiar Everyday Accessory</span>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  You recognize exactly what it is, what it does, and how to wear it, but the noun is severed from memory.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Circumlocution (How Anomic Patients Describe It):
                </span>
                <div style={{
                  padding: '14px',
                  backgroundColor: 'rgba(139,92,246,0.07)',
                  border: '1px solid var(--synapse-100)',
                  borderRadius: 'var(--radius-md)',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  color: 'var(--violet-400)'
                }}>
                  "The ticking circle with hands... you strap it around your wrist to see if it's lunch time..."
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setAnomicRevealed(true)}
                  className="btn btn-primary"
                  style={{ flex: 1, whiteSpace: 'normal', height: 'auto', minHeight: 48, lineHeight: 1.45 }}
                >
                  Retrieve the Word ("Wristwatch")
                </button>
              </div>

              {anomicRevealed && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(0,255,136,0.07)',
                  border: '1px solid var(--success-100)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle size={18} color="var(--green-400)" />
                  <span style={{ fontSize: '13.5px', color: 'var(--green-400)', fontWeight: 600 }}>
                    Target Word: "Wristwatch" — in Anomia, concepts remain sharp, but phonological lookup fails.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Anatomical Education & Caregiver Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Brain size={20} color="var(--cyan-400)" />
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Anatomical Localization</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeType === 'broca' ? 'rgba(0,245,255,0.1)' : 'var(--bg-raised)',
                border: activeType === 'broca' ? '1px solid var(--primary-300)' : '1px solid transparent'
              }}>
                <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-800)' }}>
                  Broca's Area (Brodmann 44 & 45)
                </h5>
                <p style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '2px' }}>
                  Located in the left posterior inferior frontal gyrus. Governs motor speech programming and syntactic assembly.
                </p>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeType === 'wernicke' ? 'var(--warning-100)' : 'var(--bg-raised)',
                border: activeType === 'wernicke' ? '1px solid var(--warning-500)' : '1px solid transparent'
              }}>
                <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--warning-600)' }}>
                  Wernicke's Area (Brodmann 22)
                </h5>
                <p style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '2px' }}>
                  Located in the left posterior superior temporal gyrus. Governs phonological decoding and lexical comprehension.
                </p>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeType === 'anomic' ? 'var(--synapse-100)' : 'var(--bg-raised)',
                border: activeType === 'anomic' ? '1px solid var(--synapse-500)' : '1px solid transparent'
              }}>
                <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--violet-400)' }}>
                  Angular Gyrus & Temporal-Parietal Junction
                </h5>
                <p style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '2px' }}>
                  Cross-modal hub linking auditory, visual, and semantic memory networks.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', backgroundColor: 'rgba(0,245,255,0.07)', borderColor: 'rgba(0,245,255,0.1)' }}>
            <h5 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '6px' }}>
              Communicating with Aphasia Patients
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '12.5px', color: 'var(--primary-900)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>• Speak in clear, natural tones (aphasia is NOT deafness).</li>
              <li>• Allow ample time for responses; never finish sentences for them.</li>
              <li>• Use yes/no questions and visual gesture boards.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
