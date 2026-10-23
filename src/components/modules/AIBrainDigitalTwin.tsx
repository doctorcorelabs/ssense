import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Brain,
  Sliders,
  ShieldCheck,
  Moon,
  Cigarette
} from 'lucide-react';
import {
  createHemisphereGeometry,
  createCerebellumGeometry,
  createBrainstemGeometry
} from '../../utils/brain3D/proceduralAnatomy';
import { useMediaQuery, useResponsive } from '../../hooks/useResponsive';

export const AIBrainDigitalTwin: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isStacked = useMediaQuery('(max-width: 1024px)');
  const { isMobile } = useResponsive();
  const viewportHeight = isMobile ? 300 : 420;

  // Patient Profile Biometrics
  const [age, setAge] = useState<number>(52);
  const [systolicBP, setSystolicBP] = useState<number>(154); // mmHg
  const [isSmoker, setIsSmoker] = useState<boolean>(true);
  const [sleepApnea, setSleepApnea] = useState<'none' | 'mild' | 'severe'>('severe');
  const [ldlCholesterol, setLdlCholesterol] = useState<number>(165); // mg/dL
  const [hba1c, setHba1c] = useState<number>(7.2); // %

  // Neuroprotective Counter-Measure Toggles
  const [enableBPControl, setEnableBPControl] = useState<boolean>(false); // SBP < 120
  const [enableStatin, setEnableStatin] = useState<boolean>(false); // High-dose statin
  const [enableCPAP, setEnableCPAP] = useState<boolean>(false); // Sleep apnea treatment
  const [enableAerobic, setEnableAerobic] = useState<boolean>(false); // 150m exercise/wk

  // Calculated Vascular Metrics
  // Base age
  let vascularAge = age;
  if (systolicBP > 140) vascularAge += (systolicBP - 140) * 0.35;
  if (isSmoker) vascularAge += 8;
  if (sleepApnea === 'severe') vascularAge += 6;
  if (ldlCholesterol > 130) vascularAge += (ldlCholesterol - 130) * 0.08;
  if (hba1c > 6.5) vascularAge += (hba1c - 6.5) * 4;

  // Interventions discount
  let yearsReclaimed = 0;
  if (enableBPControl && systolicBP > 130) yearsReclaimed += 6.5;
  if (enableStatin && ldlCholesterol > 100) yearsReclaimed += 4.2;
  if (enableCPAP && sleepApnea !== 'none') yearsReclaimed += 4.0;
  if (enableAerobic) yearsReclaimed += 3.8;

  const adjustedVascularAge = Math.max(25, Math.round(vascularAge - yearsReclaimed));
  const ageDelta = adjustedVascularAge - age;

  // 10-Year Stroke Probability (Framingham Stroke Risk Profile approximation)
  const baselineRisk = Math.min(68, Math.max(2, Math.round(Math.pow(adjustedVascularAge / 18, 2.3))));
  const strokeRiskPercent = baselineRisk;

  // White matter hyperintensities (WMH) count representation
  const wmhCount = Math.max(0, Math.round((adjustedVascularAge - 45) * 1.8));

  // Three.js References
  const cortexGroupRef = useRef<THREE.Group | null>(null);
  const wmhGroupRef = useRef<THREE.Group | null>(null);

  // -------------------------------------------------------------
  // 3D Digital Twin Brain Engine
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 420;
    const height = container.clientHeight || (window.innerWidth <= 640 ? 300 : 420);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(-16, 14, 34);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(amb);

    const key = new THREE.DirectionalLight(0x0284c7, 1.2);
    key.position.set(30, 40, 30);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xf43f5e, 0.6);
    rim.position.set(-30, -20, -20);
    scene.add(rim);

    // Root Group
    const root = new THREE.Group();
    scene.add(root);

    // Brain Morphological Mesh
    // As vascular age increases: color shifts from vibrant pearlescent ivory to slightly atrophic mottled beige
    const isAccelerated = ageDelta > 5;
    const brainMat = new THREE.MeshPhysicalMaterial({
      color: isAccelerated ? 0xeae0d5 : 0xfbf6f0,
      roughness: 0.38 + (ageDelta > 0 ? 0.15 : 0),
      transmission: 0.25,
      thickness: 2.0,
      clearcoat: isAccelerated ? 0.15 : 0.4,
      transparent: true,
      opacity: 0.65
    });

    const cortexGroup = new THREE.Group();
    root.add(cortexGroup);
    cortexGroupRef.current = cortexGroup;

    // Hemispheres
    const leftHemi = new THREE.Mesh(createHemisphereGeometry(true), brainMat);
    const rightHemi = new THREE.Mesh(createHemisphereGeometry(false), brainMat);
    const cereb = new THREE.Mesh(createCerebellumGeometry(), brainMat);
    const stem = new THREE.Mesh(createBrainstemGeometry(), brainMat);
    cortexGroup.add(leftHemi, rightHemi, cereb, stem);

    // Scale cortex slightly to simulate cortical volume loss / atrophy with severe vascular aging
    const atrophyScale = Math.max(0.88, 1.0 - Math.max(0, ageDelta) * 0.007);
    cortexGroup.scale.set(atrophyScale, atrophyScale, atrophyScale);

    // Deep White Matter Hyperintensities (WMH) / Leukoaraiosis Dots
    const wmhGroup = new THREE.Group();
    root.add(wmhGroup);
    wmhGroupRef.current = wmhGroup;

    const wmhGeo = new THREE.SphereGeometry(0.55, 12, 12);
    const wmhMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9
    });

    // Spawn dots based on wmhCount
    const countToSpawn = Math.min(32, wmhCount);
    for (let i = 0; i < countToSpawn; i++) {
      const dot = new THREE.Mesh(wmhGeo, wmhMat);
      const theta = (i / countToSpawn) * Math.PI * 2;
      const radius = 2.5 + (i % 3) * 1.5;
      dot.position.set(
        Math.cos(theta) * radius * (i % 2 === 0 ? 1 : -1),
        1 + (i % 5) * 1.2,
        Math.sin(theta) * radius * 0.8
      );
      wmhGroup.add(dot);
    }

    // Basic resize handling: keep renderer + camera in sync with container
    const handleResize = () => {
      const nextWidth = container.clientWidth || width;
      const nextHeight = container.clientHeight || height;
      if (nextWidth <= 0 || nextHeight <= 0) return;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, [ageDelta, wmhCount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner */}
      <div className="glass-card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">
                <Brain size={13} /> AI Generative 4D Brain Twin
              </span>
              <span className={`badge ${ageDelta > 0 ? 'badge-danger' : 'badge-success'}`}>
                {ageDelta > 0 ? `Accelerated Aging: +${ageDelta} Years` : 'Optimally Protected Vascular Age'}
              </span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Personalized Cerebral Vascular Digital Twin
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '840px', fontSize: '14.5px', lineHeight: 1.55 }}>
              Enter your physiological and lifestyle biomarkers to generate a dynamic 4D predictive model of your cerebral vessels. Witness silent white matter lesions, micro-vascular stiffening, and test how medical interventions can reverse premature brain aging.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Biometric Sliders & 3D Morphing Model */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isStacked ? '1fr' : 'minmax(340px, 1fr) minmax(420px, 1.4fr)',
        gap: '24px'
      }}>
        {/* Left Column: Biometric Inputs & Lifestyle Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          {/* Biomarkers Sliders Card */}
          <div className="glass-card" style={{ padding: '22px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sliders size={16} color="var(--blue-600)" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Patient Biometric Profile
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Chronological Age */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-body)' }}>Chronological Age:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{age} years</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--blue-600)' }}
                />
              </div>

              {/* Systolic BP */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-body)' }}>Systolic Blood Pressure:</span>
                  <span style={{ fontWeight: 800, color: systolicBP > 140 ? '#be123c' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {systolicBP} mmHg {systolicBP > 140 ? '(Hypertension)' : '(Optimal)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="110"
                  max="190"
                  value={systolicBP}
                  onChange={(e) => setSystolicBP(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: systolicBP > 140 ? '#e11d48' : 'var(--blue-600)' }}
                />
              </div>

              {/* LDL-C */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-body)' }}>LDL-Cholesterol:</span>
                  <span style={{ fontWeight: 800, color: ldlCholesterol > 130 ? '#b45309' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {ldlCholesterol} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="220"
                  value={ldlCholesterol}
                  onChange={(e) => setLdlCholesterol(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--blue-600)' }}
                />
              </div>

              {/* HbA1c Glycemic Index */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-body)' }}>HbA1c (Glycemic Index):</span>
                  <span style={{ fontWeight: 800, color: hba1c > 6.5 ? '#b45309' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {hba1c}% {hba1c > 6.5 ? '(Diabetic Micro-angiopathy)' : '(Normal)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.1"
                  value={hba1c}
                  onChange={(e) => setHba1c(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: hba1c > 6.5 ? '#f59e0b' : 'var(--blue-600)' }}
                />
              </div>

              {/* Smoking & Sleep Apnea Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px' }}>
                <button
                  onClick={() => setIsSmoker(!isSmoker)}
                  className={`btn btn-sm ${isSmoker ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ fontSize: '11.5px', padding: '8px', whiteSpace: 'normal', height: 'auto', lineHeight: 1.3 }}
                >
                  <Cigarette size={13} /> {isSmoker ? 'Active Smoker (+8y)' : 'Non-Smoker'}
                </button>

                <button
                  onClick={() => setSleepApnea(sleepApnea === 'severe' ? 'none' : 'severe')}
                  className={`btn btn-sm ${sleepApnea === 'severe' ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ fontSize: '11.5px', padding: '8px', whiteSpace: 'normal', height: 'auto', lineHeight: 1.3 }}
                >
                  <Moon size={13} /> {sleepApnea === 'severe' ? 'Sleep Apnea (+6y)' : 'Normal Sleep'}
                </button>
              </div>
            </div>
          </div>

          {/* Neuroprotection Reversal Interventions Card */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <ShieldCheck size={16} color="var(--emerald-600)" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Neuroprotective Counter-Measures
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Activate clinical interventions to observe real-time biological age reversal on your digital twin:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableBPControl}
                  onChange={(e) => setEnableBPControl(e.target.checked)}
                  style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                />
                <span style={{ fontWeight: 600 }}>Intensive BP Control (Target &lt; 120 mmHg) [-6.5y]</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableStatin}
                  onChange={(e) => setEnableStatin(e.target.checked)}
                  style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                />
                <span style={{ fontWeight: 600 }}>High-Intensity Statin Therapy (Atorvastatin) [-4.2y]</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableCPAP}
                  onChange={(e) => setEnableCPAP(e.target.checked)}
                  style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                />
                <span style={{ fontWeight: 600 }}>CPAP Therapy for Nocturnal Hypoxia [-4.0y]</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableAerobic}
                  onChange={(e) => setEnableAerobic(e.target.checked)}
                  style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                />
                <span style={{ fontWeight: 600 }}>150 min/wk Aerobic &amp; Mediterranean Diet [-3.8y]</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Brain Twin Viewport & Predictive Verdict */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Comparative Metrics Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
            <div className="glass-card" style={{ padding: isMobile ? '12px' : '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Biological Vascular Age</span>
              <div style={{ fontSize: isMobile ? 'clamp(20px, 6vw, 26px)' : '26px', fontWeight: 800, color: ageDelta > 0 ? '#e11d48' : '#059669', fontFamily: 'var(--font-mono)' }}>
                {adjustedVascularAge} yrs
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {ageDelta > 0 ? `+${ageDelta} yrs premature` : `${Math.abs(ageDelta)} yrs younger!`}
              </span>
            </div>

            <div className="glass-card" style={{ padding: isMobile ? '12px' : '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>10-Yr Stroke Hazard</span>
              <div style={{ fontSize: isMobile ? 'clamp(20px, 6vw, 26px)' : '26px', fontWeight: 800, color: strokeRiskPercent > 20 ? '#be123c' : '#0284c7', fontFamily: 'var(--font-mono)' }}>
                {strokeRiskPercent}%
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {strokeRiskPercent > 20 ? 'High Cerebrovascular Risk' : 'Low Baseline Risk'}
              </span>
            </div>

            <div className="glass-card" style={{ padding: isMobile ? '12px' : '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Reclaimed Brain Years</span>
              <div style={{ fontSize: isMobile ? 'clamp(20px, 6vw, 26px)' : '26px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                -{yearsReclaimed.toFixed(1)} yrs
              </div>
              <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                Via Interventions
              </span>
            </div>
          </div>

          {/* 3D Brain Mount Card */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '12px 20px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                4D Morphological Projection • Real-Time Cortical Volume &amp; White Matter Lesions
              </span>
              <span className="badge badge-warning" style={{ fontSize: '10.5px' }}>
                Yellow Dots: Silent Micro-Infarcts ({wmhCount})
              </span>
            </div>

            <div
              ref={mountRef}
              style={{
                width: '100%',
                height: `${viewportHeight}px`,
                maxWidth: '100%',
                position: 'relative',
                cursor: 'grab',
                backgroundColor: '#ffffff'
              }}
            />

            <div style={{
              padding: '12px 20px',
              backgroundColor: 'var(--bg-raised)',
              borderTop: '1px solid var(--glass-border)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'space-between'
            }}>
              <span>Drag to orbit 360° • Yellow dots represent subclinical leukoaraiosis</span>
              <span>AI Generative Projection Engine v2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
