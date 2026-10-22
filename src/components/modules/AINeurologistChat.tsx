import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Stethoscope, 
  Sparkles, 
  HeartHandshake, 
  Cpu, 
  Copy, 
  Check, 
  Bot
} from 'lucide-react';
import type { ChatMessage } from '../../types/stroke';
import { streamAIChat } from '../../services/openRouterService';

export const AINeurologistChat: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<'specialist' | 'analogy' | 'companion'>('specialist');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello, I'm Dr. Evelyn Vance, attending vascular neurologist at the Stroke Center. I provide evidence-based clinical insights on acute stroke management (tPA/EVT), vascular pathophysiology, and secondary prevention guidelines. What clinical questions can I clarify for you today?`,
      timestamp: 'Just now',
      persona: 'specialist'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const personas = {
    specialist: {
      id: 'specialist' as const,
      name: 'Dr. Evelyn Vance, MD',
      role: 'Attending Vascular Neurologist',
      icon: Stethoscope,
      iconColor: '#0891b2',
      description: 'Rigorous, evidence-based neurovascular science, acute protocols & trial data.',
      badge: 'badge-primary'
    },
    analogy: {
      id: 'analogy' as const,
      name: 'Prof. Arthur Sterling',
      role: 'Neuro-Mechanics Educator',
      icon: Sparkles,
      iconColor: '#8b5cf6',
      description: 'Translates complex vascular fluid dynamics into intuitive everyday analogies.',
      badge: 'badge-synapse'
    },
    companion: {
      id: 'companion' as const,
      name: 'Claire Jenkins, RN',
      role: 'Post-Stroke Recovery Specialist',
      icon: HeartHandshake,
      iconColor: '#10b981',
      description: 'Empathetic caregiver coaching, daily emotional reassurance & rehab pacing.',
      badge: 'badge-success'
    }
  };

  const currentPersona = personas[selectedPersona];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Handle switching persona (adds greeting)
  const handleSwitchPersona = (pId: 'specialist' | 'analogy' | 'companion') => {
    setSelectedPersona(pId);
    let greeting = '';
    if (pId === 'specialist') {
      greeting = `Dr. Evelyn Vance here. Ready to discuss ischemic stroke pathophysiology, CT perfusion metrics, tPA/TNK pharmacodynamics, and AHA/ASA guidelines.`;
    } else if (pId === 'analogy') {
      greeting = `Professor Arthur Sterling here! Ask me anything about how the brain manages blood flow, clots, or rewiring—I love explaining complex neural mechanics through intuitive plumbing and electrical grid analogies!`;
    } else {
      greeting = `Hello, I'm Nurse Claire. Recovery is a journey measured in millimeter milestones and small daily victories. How are you or your loved one feeling today?`;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: pId
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt.trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputPrompt('');
    setIsStreaming(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantPlaceholder: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: selectedPersona
    };

    setMessages([...newMessages, assistantPlaceholder]);

    try {
      const history = newMessages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content
      }));

      await streamAIChat(history, selectedPersona, {
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: msg.content + token } : msg
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
          console.error('Streaming error:', err);
          setIsStreaming(false);
        }
      });
    } catch {
      setIsStreaming(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickQuestions = [
    'Explain ischemic penumbra vs infarct core in plain terms.',
    'What is the clinical difference between tPA and Tenecteplase?',
    'Why is aggressive blood pressure control critical after an acute stroke?',
    'How does mirror therapy trick the brain into motor cortex rewiring?'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">
                <Bot size={13} /> Edge Neurological Intelligence
              </span>
              <span className="badge badge-success">
                Model: openai/gpt-6-luna
              </span>
              <span className="badge badge-warning">
                Live SSE Stream
              </span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Multi-Persona AI Stroke Consultation Station
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '780px', fontSize: '15px', lineHeight: 1.6 }}>
              Consult our multi-persona neurovascular edge assistant powered by Cloudflare Workers and OpenRouter. Select an expert persona matching your preferred perspective: clinical neurology, intuitive mechanics analogies, or empathetic post-stroke rehab guidance.
            </p>
          </div>

          {/* Telemetry Badge */}
          <div style={{
            padding: '12px 18px',
            backgroundColor: 'var(--bg-muted)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
              <Cpu size={14} color="#0891b2" />
              <span>Inference Engine: Active</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              Cloudflare Worker Proxy • Zero Origin CORS
            </div>
          </div>
        </div>

        {/* Persona Selector Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '24px' }}>
          {(Object.keys(personas) as ('specialist' | 'analogy' | 'companion')[]).map((pKey) => {
            const p = personas[pKey];
            const isSelected = selectedPersona === pKey;
            const IconComponent = p.icon;
            return (
              <div
                key={pKey}
                onClick={() => handleSwitchPersona(pKey)}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '18px',
                  backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                  borderColor: isSelected ? 'var(--primary-400)' : 'var(--border-light)',
                  boxShadow: isSelected ? '0 4px 18px rgba(8, 145, 178, 0.18)' : 'var(--shadow-tactile)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? '#ffffff' : 'var(--bg-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-light)'
                  }}>
                    <IconComponent size={20} color={p.iconColor} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)' }}>{p.name}</h4>
                    <span style={{ fontSize: '11.5px', color: 'var(--primary-700)', fontWeight: 600 }}>{p.role}</span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Console */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden' }}>
        {/* Chat Header Status */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <currentPersona.icon size={20} color={currentPersona.iconColor} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {currentPersona.name}
                </h4>
                <span className="pulse-active"></span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {currentPersona.role} • Cloudflare Edge Streaming
              </span>
            </div>
          </div>

          <span className="badge badge-primary">
            AHA/ASA Evidence Protocols
          </span>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <currentPersona.icon size={16} color={currentPersona.iconColor} />
                  </div>
                )}

                <div style={{
                  maxWidth: '78%',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isUser ? 'var(--primary-600)' : '#ffffff',
                  color: isUser ? '#ffffff' : 'var(--text-main)',
                  boxShadow: isUser ? '0 2px 8px rgba(8, 145, 178, 0.25)' : 'var(--shadow-tactile)',
                  border: isUser ? 'none' : '1px solid var(--border-light)',
                  lineHeight: 1.6,
                  fontSize: '14px',
                  position: 'relative'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.content || (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                        <span className="pulse-active" style={{ width: '6px', height: '6px' }}></span>
                        Consulting clinical knowledge base...
                      </span>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '11px',
                    color: isUser ? 'rgba(255,255,255,0.8)' : 'var(--text-subtle)'
                  }}>
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.content && (
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: copiedId === msg.id ? '#10b981' : 'var(--text-subtle)',
                          fontSize: '11px',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === msg.id ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#ffffff',
                    marginTop: '2px'
                  }}>
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div style={{
          padding: '10px 20px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-subtle)' }}>
            QUICK PROMPTS:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isStreaming}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={`Ask ${currentPersona.name} about stroke symptoms, imaging, medications, or recovery...`}
            disabled={isStreaming}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              outline: 'none',
              fontSize: '14px',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-main)'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isStreaming}
            className="btn btn-primary"
            style={{ padding: '12px 20px', borderRadius: 'var(--radius-lg)' }}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
