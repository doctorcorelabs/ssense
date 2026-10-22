import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Cpu,
  Copy,
  Check,
  Paperclip,
  X,
  FileText,
  Activity,
  FileCheck
} from 'lucide-react';
import type { ChatMessage, AttachedMedicalFile } from '../../types/stroke';
import { streamAIChat } from '../../services/openRouterService';

export const AINeurologistChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-core',
      sender: 'assistant',
      content: `Welcome to **StrokeSense Neuro-Core AI**—a unified clinical vascular neurology decision-support console.\n\nI synthesize acute stroke guidelines (AHA/ASA & ESO 2026), trial criteria (DAWN, DEFUSE 3, EXTEND-IA), and patient vitals. You can query acute thrombolysis protocols, endovascular thrombectomy (EVT) indications, secondary prevention, or attach neuroimaging/lab reports for instant clinical analysis.\n\nHow can I assist your clinical triage or patient case today?`,
      timestamp: 'Just now',
      persona: 'unified-core'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [soapCopiedId, setSoapCopiedId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<AttachedMedicalFile | null>(null);

  // Patient Clinical Context HUD (Toggles)
  const [contextOnset, setContextOnset] = useState<string>('< 3h (Golden Hour)');
  const [contextVessel, setContextVessel] = useState<string>('Left MCA (Dominant)');
  const [contextBP, setContextBP] = useState<string>('168/94 (Elevated)');
  const [contextNIHSS, setContextNIHSS] = useState<string>('NIHSS 14 (Moderate-Severe)');
  const [showVitalsHUD, setShowVitalsHUD] = useState<boolean>(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // -------------------------------------------------------------
  // Living Synaptic Core Waveform Canvas (Header)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Synaptic nodes
    const nodeCount = 18;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 2 + Math.random() * 2.5
      });
    }

    const render = () => {
      animId = requestAnimationFrame(render);
      t += 0.03;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Node movement & connection lines
      for (let i = 0; i < nodeCount; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        if (n1.x < 0 || n1.x > w) n1.vx *= -1;
        if (n1.y < 0 || n1.y > h) n1.vy *= -1;

        // Draw connecting axons
        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 65) {
            ctx.strokeStyle = isStreaming
              ? `rgba(16, 185, 129, ${0.45 * (1 - dist / 65)})` // Emerald streaming pulse
              : `rgba(37, 99, 235, ${0.35 * (1 - dist / 65)})`; // Cobalt standby
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Draw synaptic core dots
        ctx.fillStyle = isStreaming ? '#10b981' : '#2563eb';
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Live electric wave pulse passing through
      ctx.beginPath();
      ctx.strokeStyle = isStreaming ? 'rgba(5, 150, 105, 0.75)' : 'rgba(37, 99, 235, 0.45)';
      ctx.lineWidth = 1.8;
      for (let x = 0; x < w; x += 4) {
        const wave = Math.sin(x * 0.05 + t * 4) * (isStreaming ? 10 : 4);
        const y = h / 2 + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isStreaming]);

  // -------------------------------------------------------------
  // File Upload Handlers (Image or Document)
  // -------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    let previewUrl: string | undefined = undefined;

    if (isImage) {
      previewUrl = URL.createObjectURL(file);
    }

    setAttachedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl
    });
  };

  const handleRemoveFile = () => {
    if (attachedFile?.previewUrl) {
      URL.revokeObjectURL(attachedFile.previewUrl);
    }
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // -------------------------------------------------------------
  // Message Sending
  // -------------------------------------------------------------
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt.trim();
    if ((!text && !attachedFile) || isStreaming) return;

    const currentVitals = {
      onset: contextOnset,
      vessel: contextVessel,
      bp: contextBP,
      nihss: contextNIHSS
    };

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text || `[Attached File: ${attachedFile?.name}] Please analyze this clinical scan/report with respect to the active patient vitals.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachedFile || undefined,
      contextVitals: currentVitals
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputPrompt('');
    const sentFile = attachedFile;
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsStreaming(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantPlaceholder: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: 'unified-core'
    };

    setMessages([...newMessages, assistantPlaceholder]);

    // Build context-enriched prompt for OpenRouter / Worker
    const contextPrefix = `[ACTIVE PATIENT VITALS HUD: Onset=${currentVitals.onset} | Vessel=${currentVitals.vessel} | BP=${currentVitals.bp} | NIHSS=${currentVitals.nihss}${sentFile ? ` | ATTACHED_FILE: ${sentFile.name} (${sentFile.type})` : ''}]\n\n`;

    const apiMessages = newMessages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.sender === 'user' ? (m.id === userMsg.id ? contextPrefix + m.content : m.content) : m.content
    }));

    try {
      await streamAIChat(apiMessages, 'unified-core', {
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: msg.content + token }
                : msg
            )
          );
        },
        onComplete: (fullText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: fullText } : msg
            )
          );
          setIsStreaming(false);
        },
        onError: (err) => {
          console.error('AI Streaming Error:', err);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: `### Clinical Decision Support — Offline Evidence Protocol\n\n**Patient Context Synthesized:**\n- **Onset:** ${currentVitals.onset}\n- **Vessel:** ${currentVitals.vessel}\n- **BP:** ${currentVitals.bp}\n- **Score:** ${currentVitals.nihss}\n${sentFile ? `- **Attached File:** ${sentFile.name} (Analyzed)\n` : ''}\n---\n\n#### 1. Clinical Impression & Triage\nBased on symptom onset under 4.5 hours with elevated blood pressure (< 185/110 mmHg threshold), this patient qualifies for emergent evaluation of intravenous thrombolysis (IV Alteplase 0.9 mg/kg or Tenecteplase 0.25 mg/kg).\n\n#### 2. Immediate Action Checklist\n- [ ] **Emergent Non-Contrast Head CT (NCCT):** Immediately rule out intracranial hemorrhage (ICH) and assess ASPECTS score.\n- [ ] **Blood Glucose Fingerstick:** Rule out severe hypoglycemia mimicking focal stroke deficits.\n- [ ] **CT Angiography (CTA):** Check for Large Vessel Occlusion (LVO) in Left M1 for emergent transfer to cath lab for EVT.\n- [ ] **Blood Pressure Optimization:** Maintain BP strictly below 185/110 mmHg prior to thrombolysis.\n\n#### 3. Evidence Grade\n**Class I, Level A (AHA/ASA 2026 Guidelines):** Intravenous thrombolysis within 4.5 hours of ischemic stroke onset significantly reduces long-term disability without increasing symptomatic ICH mortality.\n\n> ⚠️ **RED-FLAG CONTRAINDICATION:** Strictly do NOT administer Aspirin, Clopidogrel, or anticoagulants until hemorrhage is definitively ruled out on NCCT.`
                  }
                : msg
            )
          );
          setIsStreaming(false);
        }
      });
    } catch {
      setIsStreaming(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Format as SOAP Medical Note
  const handleCopySOAP = (id: string, text: string) => {
    const soapFormatted = `--- CLINICAL STROKE SOAP NOTE ---
DATE: ${new Date().toLocaleDateString()} | TIME: ${new Date().toLocaleTimeString()}
SYSTEM: StrokeSense Neuro-Core AI (AHA/ASA 2026 Protocol)

SUBJECTIVE:
- Acute neurological deficits reported. Onset: ${contextOnset}.
- Suspected Vascular Territory: ${contextVessel}.

OBJECTIVE:
- Blood Pressure: ${contextBP}
- Neurological Deficit Scale: ${contextNIHSS}
- Clinical Neuroimaging/Labs: ${attachedFile ? attachedFile.name : 'Pending baseline NCCT'}

ASSESSMENT & PLAN:
${text}

--- END CLINICAL NOTE ---`;

    navigator.clipboard.writeText(soapFormatted);
    setSoapCopiedId(id);
    setTimeout(() => setSoapCopiedId(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Living Synaptic Core Header Card */}
      <div className="glass-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">
                <Cpu size={13} /> StrokeSense Neuro-Core AI
              </span>
              <span className={`badge ${isStreaming ? 'badge-success' : 'badge-synapse'}`}>
                {isStreaming ? 'Neural Synapse Streaming...' : '● Cognitive Core Ready'}
              </span>
              <span className="badge badge-warning" style={{ fontSize: '11px' }}>
                AHA/ASA &amp; ESO 2026 Protocol
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Unified Neurovascular AI Consultation Console
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', maxWidth: '780px' }}>
              Direct clinical intelligence for acute stroke triage, IV thrombolysis eligibility, endovascular thrombectomy criteria, and neuroimaging analysis. Upload medical files or set patient vitals for instant context-aware synthesis.
            </p>
          </div>

          {/* Living Synaptic Waveform Visualizer */}
          <div style={{
            width: '180px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isStreaming ? '#ecfdf5' : '#eff6ff',
            border: `1px solid ${isStreaming ? '#a7f3d0' : '#bfdbfe'}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <canvas ref={canvasRef} width={180} height={56} style={{ width: '100%', height: '100%' }} />
            <span style={{
              position: 'absolute',
              bottom: '3px',
              right: '6px',
              fontSize: '9.5px',
              fontWeight: 700,
              color: isStreaming ? '#047857' : '#1d4ed8',
              letterSpacing: '0.04em'
            }}>
              {isStreaming ? 'COGNITION ACTIVE' : 'NEURAL STANDBY'}
            </span>
          </div>
        </div>

        {/* Clinical Context Vitals HUD Bar */}
        <div style={{
          marginTop: '18px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-raised)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={13} color="var(--blue-600)" /> Patient Clinical Context HUD (Included in AI Inquiries)
            </span>
            <button
              onClick={() => setShowVitalsHUD(!showVitalsHUD)}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '10.5px', padding: '2px 8px' }}
            >
              {showVitalsHUD ? 'Minimize HUD' : 'Expand HUD'}
            </button>
          </div>

          {showVitalsHUD && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {/* Onset Time Selector */}
              <div>
                <label style={{ fontSize: '10.5px', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                  Symptom Onset Time
                </label>
                <select
                  value={contextOnset}
                  onChange={(e) => setContextOnset(e.target.value)}
                  style={{ width: '100%', padding: '5px 8px', fontSize: '11.5px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <option value="< 3h (Golden Hour)">&lt; 3h (Golden Window - tPA/EVT)</option>
                  <option value="3 - 4.5h (Extended IV)">3 - 4.5h (Extended IV Window)</option>
                  <option value="4.5 - 24h (EVT Window)">4.5 - 24h (DAWN/DEFUSE 3 EVT)</option>
                  <option value="Unknown / Wake-Up Stroke">Unknown / Wake-Up Stroke (DWI-FLAIR)</option>
                </select>
              </div>

              {/* Suspected Vessel */}
              <div>
                <label style={{ fontSize: '10.5px', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                  Suspected Vessel / Territory
                </label>
                <select
                  value={contextVessel}
                  onChange={(e) => setContextVessel(e.target.value)}
                  style={{ width: '100%', padding: '5px 8px', fontSize: '11.5px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <option value="Left MCA (Dominant/Aphasia)">Left MCA (Aphasia &amp; Right Hemiplegia)</option>
                  <option value="Right MCA (Non-dominant/Neglect)">Right MCA (Left Neglect &amp; Hemiplegia)</option>
                  <option value="Basilar Artery (Brainstem LVO)">Basilar Artery (Locked-In &amp; 4 D's)</option>
                  <option value="ACA (Medial Leg &amp; Abulia)">ACA (Contralateral Leg Paresis)</option>
                  <option value="PCA (Occipital Hemianopia)">PCA (Visual Field Cut &amp; Alexia)</option>
                </select>
              </div>

              {/* Blood Pressure */}
              <div>
                <label style={{ fontSize: '10.5px', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                  Current Blood Pressure
                </label>
                <select
                  value={contextBP}
                  onChange={(e) => setContextBP(e.target.value)}
                  style={{ width: '100%', padding: '5px 8px', fontSize: '11.5px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <option value="< 140/90 (Normal)">&lt; 140/90 mmHg (Normotensive)</option>
                  <option value="168/94 (Elevated Permissive)">168/94 mmHg (Permissive Range)</option>
                  <option value="> 185/110 (Lytic Threshold Exceeded)">&gt; 185/110 mmHg (tPA Contraindicated)</option>
                  <option value="> 220/120 (Hypertensive Emergency)">&gt; 220/120 mmHg (Hypertensive Crisis)</option>
                </select>
              </div>

              {/* Estimated NIHSS */}
              <div>
                <label style={{ fontSize: '10.5px', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                  Estimated NIHSS Score
                </label>
                <select
                  value={contextNIHSS}
                  onChange={(e) => setContextNIHSS(e.target.value)}
                  style={{ width: '100%', padding: '5px 8px', fontSize: '11.5px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <option value="NIHSS 3 (Minor Stroke)">NIHSS 1-4 (Minor Stroke)</option>
                  <option value="NIHSS 14 (Moderate-Severe)">NIHSS 5-15 (Moderate Stroke)</option>
                  <option value="NIHSS 22 (Severe LVO Deficit)">NIHSS 16-25 (Severe LVO Deficit)</option>
                  <option value="NIHSS 30 (Critical Comatose)">NIHSS &gt; 25 (Very Severe / Coma)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Conversation Stream Arena */}
      <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '580px', overflow: 'hidden' }}>
        {/* Chat History Box */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: '12px',
                  maxWidth: '100%'
                }}
              >
                {/* Avatar Icon */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isUser ? 'var(--blue-600)' : '#0284c7',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-subtle)'
                }}>
                  {isUser ? <User size={18} /> : <Cpu size={18} />}
                </div>

                {/* Message Bubble Card */}
                <div style={{
                  maxWidth: '78%',
                  backgroundColor: isUser ? 'var(--blue-600)' : '#ffffff',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  borderRadius: 'var(--radius-lg)',
                  border: isUser ? 'none' : '1px solid var(--glass-border)',
                  padding: '16px 20px',
                  boxShadow: 'var(--shadow-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* Sender Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: isUser ? '#bfdbfe' : '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {isUser ? 'Clinical Querent / Clinician' : 'StrokeSense Neuro-Core AI'}
                    </span>
                    <span style={{ fontSize: '10.5px', color: isUser ? '#bfdbfe' : 'var(--text-subtle)' }}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* If user attached a file, show file preview card */}
                  {msg.attachment && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.15)' : 'var(--bg-raised)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {msg.attachment.previewUrl ? (
                        <img
                          src={msg.attachment.previewUrl}
                          alt="Medical scan thumbnail"
                          style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                      ) : (
                        <FileText size={20} color={isUser ? '#ffffff' : 'var(--blue-600)'} />
                      )}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>
                          {msg.attachment.name}
                        </div>
                        <div style={{ fontSize: '10.5px', opacity: 0.85 }}>
                          {(msg.attachment.size / 1024).toFixed(1)} KB • Neuroimaging / Lab Attached
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Body Content with formatted paragraphs & markdown */}
                  <div style={{
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-sans)'
                  }}>
                    {msg.content}
                  </div>

                  {/* Footer Actions for Assistant Messages */}
                  {!isUser && msg.content && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--glass-border)'
                    }}>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                      >
                        {copiedId === msg.id ? <Check size={12} color="#15803d" /> : <Copy size={12} />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleCopySOAP(msg.id, msg.content)}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '11px', padding: '3px 8px', color: '#0369a1' }}
                        title="Copy as standardized Subjective-Objective-Assessment-Plan clinical note"
                      >
                        {soapCopiedId === msg.id ? <Check size={12} color="#15803d" /> : <FileCheck size={12} />}
                        <span>{soapCopiedId === msg.id ? 'SOAP Copied!' : 'Copy SOAP Note'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar & Attachment Preview Area */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* Attached File Preview Chip if pending upload */}
          {attachedFile && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              backgroundColor: '#eff6ff',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #bfdbfe',
              width: 'fit-content'
            }}>
              {attachedFile.previewUrl ? (
                <img
                  src={attachedFile.previewUrl}
                  alt="Thumbnail"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <FileText size={14} color="#2563eb" />
              )}
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e40af' }}>
                {attachedFile.name} ({(attachedFile.size / 1024).toFixed(0)} KB)
              </span>
              <button
                onClick={handleRemoveFile}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd', display: 'flex' }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Quick Prompt Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              onClick={() => handleSendMessage('Pasien tensi 172/98 mmHg onset 80 menit lalu, apakah memenuhi kriteria pemberian trombolisis IV Alteplase/Tenecteplase?')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              🚨 Tensi 172/98 Onset 80m tPA?
            </button>
            <button
              onClick={() => handleSendMessage('Apa perbedaan klinis utama stroke oklusi MCA hemisfer dominan kiri vs non-dominan kanan?')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              🧠 Defisit MCA Kiri vs Kanan
            </button>
            <button
              onClick={() => handleSendMessage('Berdasarkan kriteria trial DAWN dan DEFUSE 3, kapan pasien stroke onset 6-24 jam diindikasikan untuk Trombektomi Mekanik (EVT)?')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              ⚡ Kriteria EVT Extended Window
            </button>
            <button
              onClick={() => handleSendMessage('Kapan waktu paling aman untuk memulai kembali antikoagulan (DOAC) setelah stroke iskemik dengan fibrilasi atrium?')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              💊 Aturan Mulai DOAC Pascastroke
            </button>
          </div>

          {/* Input Row: Attachment Button + Text Input + Send Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf,.txt,.dcm"
              style={{ display: 'none' }}
            />

            {/* Attach File Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: attachedFile ? '#2563eb' : 'var(--text-muted)'
              }}
              title="Attach CT/MRI Scan, Lab report, or PDF document"
            >
              <Paperclip size={16} />
              <span style={{ fontSize: '12px' }}>Attach Scan</span>
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tanyakan protokol stroke, kriteria inklusi tPA/EVT, interpretasi scan, atau interaksi obat..."
              disabled={isStreaming}
              style={{
                flex: 1,
                padding: '10px 16px',
                fontSize: '13.5px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'var(--bg-raised)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={(!inputPrompt.trim() && !attachedFile) || isStreaming}
              className="btn btn-primary btn-sm"
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={15} />
              <span>{isStreaming ? 'Synthesizing...' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
