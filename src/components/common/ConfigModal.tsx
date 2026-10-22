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
    }, 700);
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
        setTestResult(`Error ${res.status}: ${errText.slice(0, 65)}`);
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
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="bento-tile" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '32px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-float)',
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
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--blue-50)',
            border: '1px solid var(--blue-200)',
            color: 'var(--blue-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Server size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Edge Telemetry &amp; AI Configuration
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              OpenRouter Model &amp; Cloudflare Worker Proxy
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div style={{
          backgroundColor: 'var(--blue-50)',
          border: '1px solid var(--blue-200)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <ShieldCheck size={18} color="var(--blue-600)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: 'var(--blue-900)', lineHeight: 1.5 }}>
            <strong>Active Target:</strong> <code>{model}</code> streamed via Cloudflare Edge Worker.
          </p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Target Model */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Cpu size={14} color="var(--blue-600)" />
              Target AI Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="openai/gpt-6-luna"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                fontSize: '13px',
                backgroundColor: 'var(--bg-surface-sub)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          {/* Cloudflare Worker URL */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Globe size={14} color="var(--green-600)" />
              Cloudflare Worker Proxy Endpoint
            </label>
            <input
              type="url"
              placeholder="https://strokesense-proxy.daivanfebrijuansetiya.workers.dev"
              value={workerUrl}
              onChange={(e) => setWorkerUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                fontSize: '13px',
                backgroundColor: 'var(--bg-surface-sub)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Deployed edge proxy with open CORS * and SSE streaming.
            </span>
          </div>

          {/* OpenRouter API Key Override */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Key size={14} color="var(--violet-600)" />
              Direct OpenRouter API Key (Optional Client Override)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '13px',
                  backgroundColor: 'var(--bg-surface-sub)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <Key size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={handleTestConnection}
              className="btn btn-secondary btn-sm"
              disabled={testing}
            >
              <Sparkles size={13} color="var(--blue-600)" />
              <span>{testing ? 'Probing Edge...' : 'Test Connection'}</span>
            </button>

            {testResult && (
              <span style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: testResult.includes('Active') ? 'var(--green-700)' : 'var(--red-600)',
                fontFamily: 'var(--font-mono)'
              }}>
                {testResult}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              {saved ? (
                <>
                  <CheckCircle2 size={15} /> Saved!
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
