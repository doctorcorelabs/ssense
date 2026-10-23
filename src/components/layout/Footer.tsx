import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink, Brain } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

export const Footer: React.FC = () => {
  const { isMobile, isTabletPortrait } = useResponsive();

  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border)',
      backgroundColor: 'var(--bg-surface)',
      padding: isMobile ? '32px 0 96px' : '48px 0 32px',
      marginTop: 'auto',
      boxShadow: '0 -1px 3px rgba(15, 23, 42, 0.02)'
    }}>
      <div className="container">
        {/* Warning Banner */}
        <div style={{
          backgroundColor: 'var(--red-50)',
          border: '1px solid var(--red-200)',
          borderRadius: 'var(--radius-lg)',
          padding: isMobile ? '14px 16px' : '20px 24px',
          marginBottom: isMobile ? '28px' : '36px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '8px' : '16px',
          alignItems: 'flex-start',
        }}>
          <ShieldAlert size={22} color="var(--red-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ minWidth: 0 }}>
            <h4 style={{ color: 'var(--red-700)', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
              Clinical &amp; Educational Notice
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>StrokeSense</strong> is an educational and simulation platform intended solely to foster neurovascular literacy and empathy. It does not provide medical diagnoses or replace emergency evaluation. If you suspect an acute stroke, immediately call emergency medical services. Never administer food, water, or aspirin before emergency CT verification.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : isTabletPortrait
              ? 'repeat(auto-fit, minmax(200px, 1fr))'
              : 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: isMobile ? '24px' : '32px',
          marginBottom: isMobile ? '28px' : '36px'
        }}>
          {/* Brand */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: 'var(--blue-50)',
                border: '1px solid var(--blue-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--blue-600)',
              }}>
                <Brain size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Stroke<span style={{ color: 'var(--blue-600)' }}>Sense</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Engineered with modern Three.js WebGL, client-side computer vision, and OpenRouter AI to make neurovascular education intuitive and clinically rigorous.
            </p>
          </div>

          {/* References */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BookOpen size={16} color="var(--blue-600)" />
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Clinical References</h5>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'AHA/ASA Guidelines — Acute Ischemic Stroke Management',
                'Saver JL. Stroke 2006 — Time is Brain Quantified',
                'DAWN & DEFUSE-3 Trials — Extended EVT Window Protocols',
                'MediaPipe Hands: On-Device Kinematic Hand Tracking',
              ].map((ref) => (
                <li key={ref} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <ExternalLink size={12} color="var(--blue-600)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span>{ref}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div style={{ minWidth: 0 }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Technical Architecture</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['React 18', 'TypeScript', 'Three.js WebGL', 'Vite', 'MediaPipe Hands', 'Cloudflare Worker', 'OpenRouter AI'].map((t) => (
                <span key={t} className="badge badge-primary" style={{ fontSize: '10.5px' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '20px',
          display: 'flex', flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          fontSize: '12px', color: 'var(--text-muted)', gap: '10px',
        }}>
          <p>© {new Date().getFullYear()} StrokeSense Dossier. All rights reserved.</p>
          <p>Clinical literacy · Neurovascular empathy · Recovery encouragement</p>
        </div>
      </div>
    </footer>
  );
};
