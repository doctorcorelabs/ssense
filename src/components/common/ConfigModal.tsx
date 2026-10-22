import React, { useState } from 'react';
import { X, Key, Server, CheckCircle2, ShieldCheck, Sparkles, Cpu, Globe } from 'lucide-react';
import { DEFAULT_AI_MODEL, DEFAULT_API_KEY } from '../../services/openRouterService';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const [workerUrl, setWorkerUrl] = useState(() => localStorage.getItem('strokesense_worker_url') || 'https://strokesense-proxy.daivanfebrijuansetiya.workers.dev');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('strokesense_openrouter_key') || DEFAULT_API_KEY);
  const [model, setModel] = useState(() => localStorage.getItem('strokesense_model') || DEFAULT_AI_MODEL);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('strokesense_worker_url', workerUrl.trim());
    localStorage.setItem('strokesense_openrouter_key', apiKey.trim());
    localStorage.setItem('strokesense_model', model.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim() || DEFAULT_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'StrokeSense Web App',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model.trim() || DEFAULT_AI_MODEL,
          messages: [{ role: 'user', content: 'Say "Connection Verified" in 2 words.' }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        setTestResult(`Error ${res.status}: ${errText.slice(0, 70)}`);
      } else {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || 'Verified!';
        setTestResult(`Active: "${reply.trim()}"`);
      }
    } catch (err: any) {
      setTestResult(`Failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '32px',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(10, 13, 18, 0.92)',
        border: '1px solid rgba(0, 245, 255, 0.22)',
        boxShadow: '0 0 50px rgba(0, 245, 255, 0.08), 0 24px 60px rgba(0, 0, 0, 0.8)',
        position: 'relative',
        color: 'var(--text-primary)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 245, 255, 0.12)',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            color: 'var(--cyan-neon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 245, 255, 0.2)'
          }}>
            <Server size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Edge Telemetry & AI Config
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              OpenRouter Model & Cloudflare Worker Configuration
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div style={{
          backgroundColor: 'rgba(0, 245, 255, 0.05)',
          border: '1px solid rgba(0, 245, 255, 0.15)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '22px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <ShieldCheck size={18} color="var(--cyan-neon)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--cyan-neon)' }}>Active Model:</strong> <code>{model}</code> streaming via Cloudflare Edge Worker.
          </p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Target Model */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Cpu size={14} color="var(--cyan-neon)" />
              Target AI Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="openai/gpt-6-luna"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                fontSize: '13px',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          {/* Cloudflare Worker URL */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Globe size={14} color="var(--green-neon)" />
              Cloudflare Worker Endpoint
            </label>
            <input
              type="url"
              placeholder="https://strokesense-proxy.daivanfebrijuansetiya.workers.dev"
              value={workerUrl}
              onChange={(e) => setWorkerUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                fontSize: '13px',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Deployed edge proxy with CORS * and streaming buffer.
            </span>
          </div>

          {/* OpenRouter API Key */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Key size={14} color="var(--violet-neon)" />
              Direct OpenRouter API Key (Optional Override)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <Key size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={handleTestConnection}
              className="btn btn-secondary btn-sm"
              disabled={testing}
            >
              <Sparkles size={14} color="var(--cyan-neon)" />
              {testing ? 'Probing Edge...' : 'Test Model Connection'}
            </button>

            {testResult && (
              <span style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: testResult.includes('Active') ? 'var(--green-neon)' : 'var(--red-neon)',
                fontFamily: 'var(--font-mono)'
              }}>
                {testResult}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {saved ? (
                <>
                  <CheckCircle2 size={16} /> Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
