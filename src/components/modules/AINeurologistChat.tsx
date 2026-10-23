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
import { useResponsive } from '../../hooks/useResponsive';

export const AINeurologistChat: React.FC = () => {
  const { isMobile, isTabletPortrait, isDesktop, isShortScreen } = useResponsive();
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

  // Patient Clinical Context HUD
  const [contextOnset, setContextOnset] = useState<string>('< 3h (Golden)');
  const [contextVessel, setContextVessel] = useState<string>('Left MCA (Dominant)');
  const [contextBP, setContextBP] = useState<string>('168/94 (Elevated)');
  const [contextNIHSS, setContextNIHSS] = useState<string>('NIHSS 14 (Moderate)');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const nodeCount = 14;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1.8 + Math.random() * 1.8
      });
    }

    const render = () => {
      animId = requestAnimationFrame(render);
      t += 0.035;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodeCount; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        if (n1.x < 0 || n1.x > w) n1.vx *= -1;
        if (n1.y < 0 || n1.y > h) n1.vy *= -1;

        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 48) {
            ctx.strokeStyle = isStreaming
              ? `rgba(16, 185, 129, ${0.4 * (1 - dist / 48)})`
              : `rgba(37, 99, 235, ${0.3 * (1 - dist / 48)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = isStreaming ? '#10b981' : '#2563eb';
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.strokeStyle = isStreaming ? 'rgba(5, 150, 105, 0.75)' : 'rgba(37, 99, 235, 0.45)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x += 3) {
        const wave = Math.sin(x * 0.06 + t * 4) * (isStreaming ? 7 : 3);
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
  // Markdown & Structured Formatting Renderer
  // -------------------------------------------------------------
  const formatInline = (str: string): React.ReactNode => {
    // Normalize spacing if < or > is directly adjacent to letters and numbers (e.g., findings<3 -> findings < 3)
    const normalized = str.replace(/([a-zA-Z])([<>])(\d)/g, '$1 $2 $3');
    const parts = normalized.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 700, color: 'inherit' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} style={{
            backgroundColor: 'rgba(0,0,0,0.06)',
            padding: '1px 5px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word'
          }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderMarkdownContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    const isTableRow = (l: string) => {
      const trimmed = l.trim();
      return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.split('|').length >= 3;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // 1. Table Detection
      if (isTableRow(line)) {
        const tableLines: string[] = [];
        while (i < lines.length && isTableRow(lines[i])) {
          tableLines.push(lines[i].trim());
          i++;
        }
        i--; // step back one since the for loop will i++

        if (tableLines.length >= 2) {
          const rawHeaders = tableLines[0].split('|').slice(1, -1).map(h => h.trim());
          const isSeparator = /^\|?(\s*:?-+:?\s*\|?)+$/.test(tableLines[1]);
          const dataRows = (isSeparator ? tableLines.slice(2) : tableLines.slice(1))
            .map(rowLine => rowLine.split('|').slice(1, -1).map(cell => cell.trim()));

          elements.push(
            <div key={`table-${i}`} style={{
              overflowX: 'auto',
              maxWidth: '100%',
              minWidth: 0,
              margin: '10px 0',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'var(--bg-canvas)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <table style={{ width: '100%', minWidth: '420px', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface-sub)', borderBottom: '2px solid var(--glass-border)' }}>
                    {rawHeaders.map((headerText, hIdx) => (
                      <th key={hIdx} style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: isMobile ? 'normal' : 'nowrap', overflowWrap: 'anywhere' }}>
                        {formatInline(headerText)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((rowCells, rIdx) => (
                    <tr key={rIdx} style={{
                      borderBottom: rIdx === dataRows.length - 1 ? 'none' : '1px solid var(--glass-border)',
                      backgroundColor: rIdx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-canvas)'
                    }}>
                      {rowCells.map((cellText, cIdx) => (
                        <td key={cIdx} style={{ padding: '8px 12px', color: 'var(--text-secondary)', verticalAlign: 'top', lineHeight: 1.5 }}>
                          {formatInline(cellText)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 2. Headings
      if (line.startsWith('#### ') || line.startsWith('### ')) {
        const headingText = line.replace(/^#{3,4}\s+/, '');
        elements.push(
          <div key={i} style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '10px', marginBottom: '4px' }}>
            {formatInline(headingText)}
          </div>
        );
        continue;
      }

      if (line.startsWith('# ') || line.startsWith('## ')) {
        const headingText = line.replace(/^#{1,2}\s+/, '');
        elements.push(
          <div key={i} style={{ fontSize: '14.5px', fontWeight: 800, color: '#0369a1', marginTop: '12px', marginBottom: '6px' }}>
            {formatInline(headingText)}
          </div>
        );
        continue;
      }

      // 3. Blockquotes / Alerts
      if (line.startsWith('> ')) {
        const quoteText = line.replace(/^>\s+/, '');
        elements.push(
          <div key={i} style={{
            padding: '8px 12px',
            backgroundColor: '#fff1f2',
            borderLeft: '3px solid #e11d48',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#9f1239',
            margin: '8px 0'
          }}>
            {formatInline(quoteText)}
          </div>
        );
        continue;
      }

      // 4. Checklist / Checkboxes (Supports '- [ ]', '* [ ]', and '[ ]' or '[x]')
      const checkboxMatch = line.match(/^[-*]?\s*\[([ xX])\]\s*(.*)$/);
      if (checkboxMatch) {
        const isChecked = checkboxMatch[1].toLowerCase() === 'x';
        const checkText = checkboxMatch[2];
        elements.push(
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', margin: '4px 0' }}>
            <input
              type="checkbox"
              checked={isChecked}
              readOnly
              style={{ accentColor: '#2563eb', marginTop: '2px', flexShrink: 0, cursor: 'default' }}
            />
            <span>{formatInline(checkText)}</span>
          </div>
        );
        continue;
      }

      // 5. Numbered Lists (e.g. "1. ", "2. ")
      const numListMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numListMatch) {
        elements.push(
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', margin: '3px 0' }}>
            <span style={{ color: 'var(--blue-600)', fontWeight: 700, fontFamily: 'var(--font-mono)', minWidth: '16px' }}>
              {numListMatch[1]}.
            </span>
            <span>{formatInline(numListMatch[2])}</span>
          </div>
        );
        continue;
      }

      // 6. Bullet Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.replace(/^[-*]\s+/, '');
        elements.push(
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', margin: '2px 0' }}>
            <span style={{ color: '#2563eb', fontWeight: 'bold' }}>•</span>
            <span>{formatInline(bulletText)}</span>
          </div>
        );
        continue;
      }

      // 7. Horizontal Divider
      if (trimmed === '---' || trimmed === '***') {
        elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '10px 0' }} />);
        continue;
      }

      // 8. Normal Paragraph
      if (trimmed !== '') {
        elements.push(
          <p key={i} style={{ margin: '3px 0', fontSize: isMobile ? '14px' : '13px', lineHeight: isMobile ? 1.6 : 1.55, overflowWrap: 'anywhere', minWidth: 0 }}>
            {formatInline(line)}
          </p>
        );
      } else {
        elements.push(<div key={i} style={{ height: '4px' }} />);
      }
    }

    return elements;
  };

  // -------------------------------------------------------------
  // File Upload Handlers
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
        onError: () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: `### Clinical Decision Support — Evidence Synthesis\n\n**Patient Context:** Onset: ${currentVitals.onset} | Vessel: ${currentVitals.vessel} | BP: ${currentVitals.bp} | Score: ${currentVitals.nihss}\n${sentFile ? `- Attached File: **${sentFile.name}**\n` : ''}\n---\n\n#### 1. Clinical Impression & Triage\nBased on symptom onset under 4.5 hours and permissive blood pressure threshold (< 185/110 mmHg), this patient qualifies for emergent consideration of intravenous thrombolysis (IV Tenecteplase 0.25 mg/kg or Alteplase 0.9 mg/kg).\n\n#### 2. Immediate Action Checklist\n- [ ] **Emergent Non-Contrast Head CT:** Immediately rule out intracranial hemorrhage (ICH) and quantify ASPECTS score.\n- [ ] **Fingerstick Glucose:** Exclude severe hypoglycemia (< 50 mg/dL) as a focal stroke mimic.\n- [ ] **CT Angiography (CTA):** Screen for Large Vessel Occlusion (LVO) in Left M1 for direct cath lab transfer.\n- [ ] **Blood Pressure Maintenance:** Keep BP strictly < 185/110 mmHg prior to thrombolysis.\n\n#### 3. Evidence Grade\n**Class I, Level A (AHA/ASA 2026):** IV thrombolysis administered within 4.5 hours of ischemic stroke onset significantly reduces functional disability.\n\n> ⚠️ **CONTRAINDICATION:** Strictly DO NOT administer Aspirin or anticoagulants until hemorrhage is definitively excluded on NCCT.`
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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopySOAP = (id: string, text: string) => {
    const soapFormatted = `--- CLINICAL STROKE SOAP NOTE ---
DATE: ${new Date().toLocaleDateString()} | TIME: ${new Date().toLocaleTimeString()}
SYSTEM: StrokeSense Neuro-Core AI (AHA/ASA 2026 Guidelines)

SUBJECTIVE:
- Acute neurological deficit reported. Onset: ${contextOnset}.
- Suspected Territory: ${contextVessel}.

OBJECTIVE:
- Blood Pressure: ${contextBP}
- Neurological Deficit Scale: ${contextNIHSS}
- Neuroimaging/Lab File: ${attachedFile ? attachedFile.name : 'Pending baseline NCCT'}

ASSESSMENT & PLAN:
${text}

--- END CLINICAL NOTE ---`;

    navigator.clipboard.writeText(soapFormatted);
    setSoapCopiedId(id);
    setTimeout(() => setSoapCopiedId(null), 2500);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: isShortScreen
        ? 'calc(100dvh - 120px)'
        : isMobile
          ? 'calc(100dvh - 190px)'
          : isTabletPortrait
            ? 'calc(100dvh - 200px)'
            : 'calc(100dvh - 220px)',
      minHeight: isMobile || isShortScreen ? 0 : 520,
      maxHeight: isDesktop && !isShortScreen ? 740 : undefined,
      borderRadius: 'var(--radius-xl)',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-subtle)',
      overflow: 'hidden'
    }}>
      {/* 1. Header: Synaptic Core & Clinical Identity Bar */}
      <div style={{
        padding: isMobile ? '12px 14px' : '14px 20px',
        borderBottom: '1px solid var(--glass-border)',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        flexShrink: 0,
        minWidth: 0
      }}>
        {/* Left: AI Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
          }}>
            <Cpu size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                StrokeSense Neuro-Core AI
              </span>
              <span className={`badge ${isStreaming ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                {isStreaming ? 'Streaming' : 'Online'}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              AHA/ASA &amp; ESO 2026 Unified Decision Support
            </span>
          </div>
        </div>

        {/* Center: Synaptic Waveform Visualizer */}
        <div style={{
          width: '140px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: isStreaming ? '#ecfdf5' : '#f0f9ff',
          border: `1px solid ${isStreaming ? '#a7f3d0' : '#bae6fd'}`,
          overflow: 'hidden',
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <canvas ref={canvasRef} width={140} height={32} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* 2. Patient Clinical Context HUD (Compact Ribbon) */}
      <div style={{
        padding: isMobile ? '8px 12px' : '8px 20px',
        backgroundColor: 'var(--bg-raised)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        flexShrink: 0,
        fontSize: '11.5px',
        minWidth: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-subtle)', fontWeight: 700, marginRight: '4px' }}>
          <Activity size={13} color="var(--blue-600)" />
          <span>Patient HUD:</span>
        </div>

        {/* Onset Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flex: isMobile ? '1 1 140px' : undefined, minWidth: 0, minHeight: isMobile ? 36 : undefined, boxSizing: 'border-box' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Onset:</span>
          <select
            value={contextOnset}
            onChange={(e) => setContextOnset(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '11.5px', fontWeight: 700, color: '#0369a1', outline: 'none', cursor: 'pointer', flex: '1 1 auto', minWidth: 0, maxWidth: '100%', minHeight: isMobile ? 36 : undefined, textOverflow: 'ellipsis' }}
          >
            <option value="< 3h (Golden)">&lt; 3h (Golden Window)</option>
            <option value="3 - 4.5h (Extended IV)">3 - 4.5h (Extended IV)</option>
            <option value="4.5 - 24h (EVT Window)">4.5 - 24h (EVT Window)</option>
            <option value="Wake-Up Stroke">Wake-Up Stroke (Unknown)</option>
          </select>
        </div>

        {/* Territory Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flex: isMobile ? '1 1 140px' : undefined, minWidth: 0, minHeight: isMobile ? 36 : undefined, boxSizing: 'border-box' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Vessel:</span>
          <select
            value={contextVessel}
            onChange={(e) => setContextVessel(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '11.5px', fontWeight: 700, color: '#0369a1', outline: 'none', cursor: 'pointer', flex: '1 1 auto', minWidth: 0, maxWidth: '100%', minHeight: isMobile ? 36 : undefined, textOverflow: 'ellipsis' }}
          >
            <option value="Left MCA (Dominant)">Left MCA (Aphasia)</option>
            <option value="Right MCA (Neglect)">Right MCA (Neglect)</option>
            <option value="Basilar Artery (Brainstem)">Basilar Artery (Brainstem)</option>
            <option value="ACA (Leg/Frontal)">ACA (Leg / Abulia)</option>
            <option value="PCA (Occipital)">PCA (Visual Cut)</option>
          </select>
        </div>

        {/* BP Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flex: isMobile ? '1 1 140px' : undefined, minWidth: 0, minHeight: isMobile ? 36 : undefined, boxSizing: 'border-box' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>BP:</span>
          <select
            value={contextBP}
            onChange={(e) => setContextBP(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '11.5px', fontWeight: 700, color: contextBP.includes('> 185') ? '#be123c' : '#0369a1', outline: 'none', cursor: 'pointer', flex: '1 1 auto', minWidth: 0, maxWidth: '100%', minHeight: isMobile ? 36 : undefined, textOverflow: 'ellipsis' }}
          >
            <option value="< 140/90 (Normal)">&lt; 140/90 mmHg</option>
            <option value="168/94 (Elevated)">168/94 mmHg (Permissive)</option>
            <option value="> 185/110 (Crisis)">&gt; 185/110 mmHg (Lytic Crisis)</option>
          </select>
        </div>

        {/* NIHSS Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', flex: isMobile ? '1 1 140px' : undefined, minWidth: 0, minHeight: isMobile ? 36 : undefined, boxSizing: 'border-box' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>NIHSS:</span>
          <select
            value={contextNIHSS}
            onChange={(e) => setContextNIHSS(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '11.5px', fontWeight: 700, color: '#0369a1', outline: 'none', cursor: 'pointer', flex: '1 1 auto', minWidth: 0, maxWidth: '100%', minHeight: isMobile ? 36 : undefined, textOverflow: 'ellipsis' }}
          >
            <option value="NIHSS 3 (Minor)">NIHSS 3 (Minor 1-4)</option>
            <option value="NIHSS 14 (Moderate)">NIHSS 14 (Moderate 5-15)</option>
            <option value="NIHSS 22 (Severe LVO)">NIHSS 22 (Severe 16-25)</option>
          </select>
        </div>
      </div>

      {/* 3. Messages Stream (Scrollable) */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0,
        minWidth: 0,
        padding: isMobile ? '14px 12px' : '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '12px' : '16px'
      }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: isMobile ? '8px' : '10px',
                maxWidth: '100%',
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              {/* Mini Avatar */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isUser ? 'var(--blue-600)' : '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                {isUser ? <User size={15} /> : <Cpu size={15} />}
              </div>

              {/* Bubble Card */}
              <div style={{
                maxWidth: isMobile ? '92%' : 'min(78%, 760px)',
                minWidth: 0,
                flex: '0 1 auto',
                overflowWrap: 'anywhere',
                backgroundColor: isUser ? 'var(--blue-600)' : 'var(--bg-surface)',
                color: isUser ? '#ffffff' : 'var(--text-primary)',
                borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                border: isUser ? 'none' : '1px solid var(--glass-border)',
                padding: isMobile ? '10px 12px' : '14px 18px',
                boxShadow: 'var(--shadow-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                boxSizing: 'border-box'
              }}>
                {/* Meta Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: isUser ? '#bfdbfe' : '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isUser ? 'Clinician Query' : 'StrokeSense Neuro-Core AI'}
                  </span>
                  <span style={{ fontSize: '10px', color: isUser ? '#bfdbfe' : 'var(--text-subtle)' }}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Attached File Card if present */}
                {msg.attachment && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    backgroundColor: isUser ? 'rgba(255, 255, 255, 0.15)' : 'var(--bg-raised)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    margin: '4px 0'
                  }}>
                    {msg.attachment.previewUrl ? (
                      <img
                        src={msg.attachment.previewUrl}
                        alt="Scan preview"
                        style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                    ) : (
                      <FileText size={18} color={isUser ? '#ffffff' : 'var(--blue-600)'} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, maxWidth: isMobile ? '140px' : '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.attachment.name}
                      </div>
                      <div style={{ fontSize: '10px', opacity: 0.85 }}>
                        {(msg.attachment.size / 1024).toFixed(0)} KB • Attached Scan
                      </div>
                    </div>
                  </div>
                )}

                {/* Formatted Content */}
                <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                  {isUser ? (
                    <div style={{ fontSize: '13px', lineHeight: 1.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', minWidth: 0 }}>
                      {msg.content}
                    </div>
                  ) : (
                    <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{renderMarkdownContent(msg.content)}</div>
                  )}
                </div>

                {/* Action Toolbar for AI responses */}
                {!isUser && msg.content && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '6px',
                    marginTop: '6px',
                    paddingTop: '6px',
                    borderTop: '1px solid var(--glass-border)'
                  }}>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: '10.5px', padding: isMobile ? '6px 10px' : '2px 8px', minHeight: isMobile ? 36 : undefined }}
                    >
                      {copiedId === msg.id ? <Check size={11} color="#15803d" /> : <Copy size={11} />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleCopySOAP(msg.id, msg.content)}
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: '10.5px', padding: isMobile ? '6px 10px' : '2px 8px', color: '#0369a1', minHeight: isMobile ? 36 : undefined }}
                      title="Copy structured SOAP note"
                    >
                      {soapCopiedId === msg.id ? <Check size={11} color="#15803d" /> : <FileCheck size={11} />}
                      <span>{soapCopiedId === msg.id ? 'SOAP Copied!' : 'Copy SOAP'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Pinned Bottom Input Dock (Always Visible!) */}
      <div style={{
        padding: isMobile ? '10px 12px' : '10px 18px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
        minWidth: 0,
        boxSizing: 'border-box'
      }}>
        {/* Attached File Preview Chip */}
        {attachedFile && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            backgroundColor: '#eff6ff',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #bfdbfe',
            width: 'fit-content',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}>
            {attachedFile.previewUrl ? (
              <img
                src={attachedFile.previewUrl}
                alt="Thumbnail"
                style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <FileText size={13} color="#2563eb" />
            )}
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1e40af', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '180px' : '320px' }}>
              {attachedFile.name} ({(attachedFile.size / 1024).toFixed(0)} KB)
            </span>
            <button
              onClick={handleRemoveFile}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd', display: 'flex' }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Quick Prompt Category Chips (Horizontal Scrollable) */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '8px' : '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none',
          maxWidth: '100%',
          minWidth: 0
        }}>
          <button
            onClick={() => handleSendMessage('Patient presents with BP 172/98 mmHg and symptom onset 80 minutes ago. Does this meet criteria for IV Alteplase / Tenecteplase thrombolysis?')}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: isMobile ? '12px' : '10.5px', padding: isMobile ? '6px 12px' : '3px 8px', whiteSpace: 'nowrap', flexShrink: 0, minHeight: isMobile ? 36 : undefined, display: 'inline-flex', alignItems: 'center' }}
          >
            🚨 BP 172/98 Onset 80m: tPA?
          </button>
          <button
            onClick={() => handleSendMessage('What are the primary clinical deficits distinguishing dominant left vs non-dominant right MCA occlusion?')}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: isMobile ? '12px' : '10.5px', padding: isMobile ? '6px 12px' : '3px 8px', whiteSpace: 'nowrap', flexShrink: 0, minHeight: isMobile ? 36 : undefined, display: 'inline-flex', alignItems: 'center' }}
          >
            🧠 Left vs Right MCA Deficit
          </button>
          <button
            onClick={() => handleSendMessage('Under DAWN and DEFUSE 3 trial criteria, which acute stroke patients qualify for Mechanical Thrombectomy (EVT) in the 6-24 hour extended window?')}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: isMobile ? '12px' : '10.5px', padding: isMobile ? '6px 12px' : '3px 8px', whiteSpace: 'nowrap', flexShrink: 0, minHeight: isMobile ? 36 : undefined, display: 'inline-flex', alignItems: 'center' }}
          >
            ⚡ Extended Window EVT Criteria
          </button>
          <button
            onClick={() => handleSendMessage('What is the optimal timing and safety protocol to initiate or resume DOAC anticoagulation following acute ischemic stroke in atrial fibrillation?')}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: isMobile ? '12px' : '10.5px', padding: isMobile ? '6px 12px' : '3px 8px', whiteSpace: 'nowrap', flexShrink: 0, minHeight: isMobile ? 36 : undefined, display: 'inline-flex', alignItems: 'center' }}
          >
            💊 DOAC Resumption Protocol
          </button>
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: isMobile ? 'wrap' : 'nowrap', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf,.txt,.dcm"
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary btn-sm"
            style={{
              padding: isMobile ? '8px' : '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: attachedFile ? '#2563eb' : 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              flexShrink: 0,
              minHeight: isMobile ? 36 : undefined,
              minWidth: isMobile ? 36 : undefined
            }}
            title="Attach CT/MRI Scan, Lab report, or PDF document"
            aria-label="Attach file"
          >
            <Paperclip size={15} />
            {!isMobile && <span style={{ fontSize: '11.5px' }}>Attach</span>}
          </button>

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
            placeholder="Ask about tPA/EVT protocols, scan interpretation, or drug interactions..."
            disabled={isStreaming}
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              padding: '9px 14px',
              fontSize: isMobile ? '16px' : '13px',
              minHeight: isMobile ? 36 : undefined,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'var(--bg-raised)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={(!inputPrompt.trim() && !attachedFile) || isStreaming}
            className="btn btn-primary btn-sm"
            style={{
              padding: isMobile ? '9px 12px' : '9px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              minHeight: isMobile ? 36 : undefined
            }}
          >
            <Send size={14} />
            <span>{isStreaming ? 'Thinking...' : 'Send'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
