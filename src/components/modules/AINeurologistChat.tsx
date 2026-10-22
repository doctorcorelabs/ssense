import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareHeart, Send, User } from 'lucide-react';
import type { ChatMessage, PersonaConfig } from '../../types/stroke';
import { streamAIChat } from '../../services/openRouterService';

export const AINeurologistChat: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<'specialist' | 'analogy' | 'companion'>('specialist');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello, I'm Dr. Evelyn Vance, a vascular neurologist. I'm here to provide evidence-based insights into stroke prevention, acute pathophysiology, and recovery mechanisms. How can I assist your understanding today?`,
      timestamp: 'Just now',
      persona: 'specialist'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const personas: Record<'specialist' | 'analogy' | 'companion', PersonaConfig> = {
    specialist: {
      id: 'specialist',
      name: 'Dr. Evelyn Vance',
      role: 'Senior Vascular Neurologist',
      avatar: '🩺',
      description: 'Precise, evidence-based clinical neurology explained clearly.',
      badge: 'badge-primary'
    },
    analogy: {
      id: 'analogy',
      name: 'Professor Artie',
      role: 'Everyday Analogy Master',
      avatar: '💡',
      description: 'Explains complex neurovascular concepts through vivid daily metaphors.',
      badge: 'badge-synapse'
    },
    companion: {
      id: 'companion',
      name: 'Nurse Claire',
      role: 'Recovery & Caregiver Coach',
      avatar: '🌱',
      description: 'Warm, compassionate encouragement for patients and family caregivers.',
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
      greeting = `Dr. Evelyn Vance here. Ready to discuss clinical stroke pathophysiology, diagnostic scans, and pharmaceutical mechanisms.`;
    } else if (pId === 'analogy') {
      greeting = `Professor Artie at your service! Ask me anything about the brain—I love explaining cerebral plumbing and neural power grids using fun analogies!`;
    } else {
      greeting = `Hi there, I'm Nurse Claire. Remember that recovery happens one small breath at a time. What's on your mind today?`;
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
        role: m.sender === 'user' ? 'user' : 'assistant',
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

  const quickQuestions = [
    'Why did my doctor prescribe aspirin after an ischemic stroke?',
    'What is the difference between a TIA and a full stroke?',
    'How does high salt physically damage cerebral blood vessels?',
    'How can family caregivers prevent emotional burnout?'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <MessageSquareHeart size={13} /> Conversational Intelligence
          </span>
          <span className={`badge ${currentPersona.badge}`}>
            {currentPersona.name}
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Multi-Persona StrokeSense AI Neurologist
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
          Powered by OpenRouter with dynamic edge streaming. Select an expert persona tailored to your learning style, whether you prefer rigorous clinical science, memorable everyday analogies, or compassionate caregiver guidance.
        </p>

        {/* Persona Selector Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '24px' }}>
          {(Object.keys(personas) as ('specialist' | 'analogy' | 'companion')[]).map((pKey) => {
            const p = personas[pKey];
            const isSelected = selectedPersona === pKey;
            return (
              <div
                key={pKey}
                onClick={() => handleSwitchPersona(pKey)}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '16px',
                  backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                  borderColor: isSelected ? 'var(--primary-300)' : 'var(--border-light)',
                  boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '24px' }}>{p.avatar}</span>
                  <div>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--primary-700)', fontWeight: 600 }}>{p.role}</span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '620px', overflow: 'hidden' }}>
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
            <span style={{ fontSize: '28px' }}>{currentPersona.avatar}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {currentPersona.name}
                </h4>
                <span className="pulse-active"></span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {currentPersona.role} • OpenRouter Streaming
              </span>
            </div>
          </div>

          <span className="badge badge-primary" style={{ fontSize: '11px' }}>
            Evidence Based
          </span>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
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
                  gap: '10px',
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
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {personas[msg.persona || 'specialist']?.avatar || '🧠'}
                  </div>
                )}

                <div style={{
                  maxWidth: '78%',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isUser ? 'var(--primary-600)' : '#ffffff',
                  color: isUser ? '#ffffff' : 'var(--text-main)',
                  boxShadow: isUser ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'var(--shadow-xs)',
                  border: isUser ? 'none' : '1px solid var(--border-light)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content || (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                      <span className="pulse-active"></span> Formulating clinical explanation...
                    </span>
                  )}
                  <div style={{
                    fontSize: '10.5px',
                    color: isUser ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-subtle)',
                    marginTop: '6px',
                    textAlign: isUser ? 'right' : 'left'
                  }}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{
          padding: '10px 20px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="btn btn-secondary btn-sm"
              disabled={isStreaming}
              style={{
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                padding: '5px 12px',
                whiteSpace: 'nowrap',
                color: 'var(--primary-800)'
              }}
            >
              + {q}
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
            placeholder={`Ask ${currentPersona.name} any question regarding stroke...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isStreaming}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'var(--bg-muted)'
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            className="btn btn-primary"
            disabled={isStreaming || !inputPrompt.trim()}
            style={{ borderRadius: 'var(--radius-full)', padding: '12px 20px' }}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
