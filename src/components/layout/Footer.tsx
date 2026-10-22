import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border-light)',
      padding: '48px 0 24px',
      marginTop: 'auto'
    }}>
      <div className="container">
        {/* Medical Guardrail Notice Banner */}
        <div style={{
          backgroundColor: 'var(--danger-50)',
          border: '1px solid var(--danger-100)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: '36px',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={24} color="var(--danger-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: 'var(--danger-600)', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
              Important Clinical & Educational Notice
            </h4>
            <p style={{ color: 'var(--text-body)', fontSize: '13px', lineHeight: 1.6 }}>
              <strong>StrokeSense</strong> is an educational platform and simulation interface intended solely to foster neurovascular literacy, build empathy, and explore physical therapy rehabilitation. It does not provide medical diagnoses or replace emergency evaluation. If you suspect an acute stroke, <strong>immediately contact local emergency medical services (e.g. 911 / 112 / 119)</strong>. Never administer food, water, or aspirin prior to emergency CT verification.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '32px',
          marginBottom: '36px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HeartHandshake size={20} color="var(--primary-600)" />
              <h5 style={{ fontSize: '15px', fontWeight: 700 }}>About StrokeSense</h5>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Crafted with modern web technologies, 3D WebGL anatomical rendering, client-side computer vision, and OpenRouter AI to make stroke understanding intuitive, experiential, and universally accessible.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BookOpen size={20} color="var(--primary-600)" />
              <h5 style={{ fontSize: '15px', fontWeight: 700 }}>Clinical References</h5>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink size={13} color="var(--primary-600)" />
                <span>AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink size={13} color="var(--primary-600)" />
                <span>Lancet Neurology: Global Burden of Stroke & Neuroprotection</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink size={13} color="var(--primary-600)" />
                <span>MediaPipe Hands: On-Device Real-Time Hand Tracking Pipeline</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Architectural Stack</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge badge-primary">React 18</span>
              <span className="badge badge-primary">Three.js 3D</span>
              <span className="badge badge-primary">MediaPipe Vision</span>
              <span className="badge badge-primary">Cloudflare Worker</span>
              <span className="badge badge-primary">OpenRouter API</span>
              <span className="badge badge-success">Netlify CI/CD</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12.5px',
          color: 'var(--text-muted)'
        }}>
          <p>© {new Date().getFullYear()} StrokeSense Platform. All rights reserved.</p>
          <p>Designed for clinical literacy, rehabilitation encouragement & neurovascular empathy.</p>
        </div>
      </div>
    </footer>
  );
};
