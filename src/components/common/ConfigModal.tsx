import React, { useState } from 'react';
import { X, Key, Server, CheckCircle2, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import { DEFAULT_AI_MODEL, DEFAULT_API_KEY } from '../../services/openRouterService';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const [workerUrl, setWorkerUrl] = useState(() => localStorage.getItem('strokesense_worker_url') || 'http://127.0.0.1:8787');
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
    }, 900);
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
          messages: [{ role: 'user', content: 'Say "Connection Successful!" in 2 words.' }]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        setTestResult(`Error ${res.status}: ${errText.slice(0, 80)}`);
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
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: '#ffffff',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Server size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>AI & Cloudflare Connectivity</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configured with OpenRouter & Cloudflare Worker</p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--primary-50)',
          border: '1px solid var(--primary-100)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          margin: '16px 0 20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <ShieldCheck size={18} color="var(--primary-600)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '12.5px', color: 'var(--primary-900)', lineHeight: 1.4 }}>
            <strong>Active AI Model:</strong> <code>{model}</code> is configured and ready for live neurology streaming.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Active Model Selector */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              <Cpu size={14} color="var(--primary-600)" />
              Target AI Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="openai/gpt-6-luna"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                fontSize: '13.5px',
                outline: 'none',
                backgroundColor: 'var(--bg-muted)',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          {/* Cloudflare Worker URL */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Cloudflare Worker Proxy Endpoint
            </label>
            <input
              type="url"
              placeholder="http://127.0.0.1:8787 or https://strokesense-proxy.workers.dev"
              value={workerUrl}
              onChange={(e) => setWorkerUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                fontSize: '13.5px',
                outline: 'none',
                backgroundColor: 'var(--bg-muted)'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Your Cloudflare Edge Proxy with open CORS (`*`).
            </span>
          </div>

          {/* Direct OpenRouter API Key */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              OpenRouter API Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  fontSize: '13.5px',
                  outline: 'none',
                  backgroundColor: 'var(--bg-muted)',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
            <button
              onClick={handleTestConnection}
              className="btn btn-secondary btn-sm"
              disabled={testing}
            >
              <Sparkles size={14} color="var(--primary-600)" />
              {testing ? 'Testing...' : 'Test Model Connection'}
            </button>

            {testResult && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: testResult.includes('Active') ? 'var(--success-600)' : 'var(--danger-500)' }}>
                {testResult}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
