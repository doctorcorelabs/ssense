import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink, Brain } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(20px)',
      padding: '48px 0 24px',
      marginTop: 'auto',
    }}>
      <div className="container">
        {/* Warning Banner */}
        <div style={{
          backgroundColor: 'rgba(255,45,85,0.07)',
          border: '1px solid rgba(255,45,85,0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: '40px',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
        }}>
          <ShieldAlert size={22} color="var(--red-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: 'var(--red-400)', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
              Clinical & Educational Notice
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>StrokeSense</strong> is an educational and simulation platform intended solely to foster neurovascular literacy and empathy. It does not provide medical diagnoses or replace emergency evaluation. Never administer food, water, or aspirin before emergency CT verification.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(0,245,255,0.12)',
                border: '1px solid rgba(0,245,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--cyan-neon)',
              }}>
                <Brain size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Stroke<span style={{ color: 'var(--cyan-neon)' }}>Sense</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Built with modern WebGL, client-side computer vision, and OpenRouter AI to make stroke education intuitive and universally accessible.
            </p>
          </div>

          {/* References */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <BookOpen size={16} color="var(--cyan-400)" />
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Clinical References</h5>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'AHA/ASA Guidelines — Acute Ischemic Stroke 2019',
                'Lancet Neurology: Global Burden of Stroke',
                'Saver JL. Stroke 2006 — Time is Brain',
                'MediaPipe Hands: On-Device Real-Time Tracking',
              ].map((ref) => (
                <li key={ref} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <ExternalLink size={12} color="var(--cyan-600)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{ref}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Architectural Stack</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['React 18', 'Three.js', 'TypeScript', 'Vite', 'MediaPipe CV', 'Cloudflare Worker', 'OpenRouter API', 'Netlify CI/CD'].map((t) => (
                <span key={t} className="badge badge-cyan" style={{ fontSize: '10px' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '20px',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          fontSize: '12px', color: 'var(--text-muted)', gap: '10px',
        }}>
          <p>© {new Date().getFullYear()} StrokeSense Platform. All rights reserved.</p>
          <p>Clinical literacy · Rehabilitation encouragement · Neurovascular empathy</p>
        </div>
      </div>
    </footer>
  );
};
