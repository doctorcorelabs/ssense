import React, { useState } from 'react';
import { X, Key, Server, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const [workerUrl, setWorkerUrl] = useState(() => localStorage.getItem('strokesense_worker_url') || '');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('strokesense_openrouter_key') || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('strokesense_worker_url', workerUrl.trim());
    localStorage.setItem('strokesense_openrouter_key', apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
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
        maxWidth: '520px',
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
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Server size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>AI Connectivity Settings</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure Cloudflare Worker or OpenRouter API</p>
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
          alignItems: 'flex-start'
        }}>
          <ShieldCheck size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '12.5px', color: 'var(--primary-900)', lineHeight: 1.5 }}>
            <strong>Demo Ready:</strong> If left empty, StrokeSense automatically runs on its built-in high-fidelity clinical simulation engine.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Cloudflare Worker Proxy URL
            </label>
            <input
              type="url"
              placeholder="https://strokesense-proxy.yourname.workers.dev"
              value={workerUrl}
              onChange={(e) => setWorkerUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'var(--bg-muted)'
              }}
            />
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Your secure Cloudflare Edge Proxy with open CORS.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Or Direct OpenRouter API Key (Optional)
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
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'var(--bg-muted)'
                }}
              />
              <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Stored strictly in your local browser storage.
            </span>
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
                'Save Connection'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
