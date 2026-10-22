import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Zap,
  RotateCcw,
  Play,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

type EVTStep = 'approach' | 'cross' | 'deploy' | 'extract' | 'reperfusion';

export const VirtualEVTSimulator: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<EVTStep>('approach');
  const [catheterProgress, setCatheterProgress] = useState<number>(0.25); // 0 to 1 along arterial path
  const [isStentDeployed, setIsStentDeployed] = useState<boolean>(false);
  const [stentExpansion, setStentExpansion] = useState<number>(0); // 0 to 1
  const [isAspirating, setIsAspirating] = useState<boolean>(false);
  const [isClotCaptured, setIsClotCaptured] = useState<boolean>(false);
  const [ticiScore, setTiciScore] = useState<'TICI 0' | 'TICI 2b' | 'TICI 3'>('TICI 0');
  const [clotTimer, setClotTimer] = useState<number>(5);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const doorToPunctureMins = 38;

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const catheterMeshRef = useRef<THREE.Mesh | null>(null);
  const stentMeshRef = useRef<THREE.Mesh | null>(null);
  const clotMeshRef = useRef<THREE.Mesh | null>(null);
  const downstreamVesselsRef = useRef<THREE.Group | null>(null);

  // Arterial Path Spline for Endovascular Navigation (Left ICA -> M1 Bifurcation)
  const arterialPoints = [
    new THREE.Vector3(-2.8, -10.0, -0.5), // Cervical ICA (skull base)
    new THREE.Vector3(-2.6, -6.0, 0.2),   // Petrous ICA
    new THREE.Vector3(-2.6, -3.2, 0.8),   // Cavernous S-bend
    new THREE.Vector3(-2.2, -1.8, 1.4),   // Supraclinoid ICA
    new THREE.Vector3(-2.4, -0.8, 1.1),   // ICA T-Bifurcation
    new THREE.Vector3(-4.2, -0.4, 1.5),   // Proximal M1 Trunk
    new THREE.Vector3(-6.2, 0.5, 1.6),    // M1 Bifurcation (Clot Site!)
    new THREE.Vector3(-7.8, 2.4, 1.8),    // M2 Superior Trunk
    new THREE.Vector3(-9.2, 5.0, 0.5),    // Distal M3 Branch
  ];
  const arterialCurve = new THREE.CatmullRomCurve3(arterialPoints);
  const clotPosition = arterialCurve.getPointAt(0.68); // Clot wedged at M1 bifurcation

  // Confetti trigger upon successful TICI 3 recanalization
  useEffect(() => {
    if (ticiScore === 'TICI 3') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  }, [ticiScore]);

  // Clot integration timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && clotTimer > 0) {
      interval = setInterval(() => {
        setClotTimer((prev) => prev - 1);
      }, 1000);
    } else if (clotTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsClotCaptured(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, clotTimer]);

  // -------------------------------------------------------------
  // Step Actions
  // -------------------------------------------------------------
  const handleAdvanceCatheter = () => {
    setCurrentStep('cross');
    setCatheterProgress(0.70); // Crosses through the clot
  };

  const handleDeployStent = () => {
    setCurrentStep('deploy');
    setIsStentDeployed(true);
    setStentExpansion(1.0);
    setIsTimerRunning(true);
  };

  const handleExtractClot = () => {
    setCurrentStep('extract');
    setIsAspirating(true);
    // Animate retraction backwards
    setTimeout(() => {
      setCatheterProgress(0.35);
      setCurrentStep('reperfusion');
      setTiciScore('TICI 3');
    }, 1200);
  };

  const handleReset = () => {
    setCurrentStep('approach');
    setCatheterProgress(0.25);
    setIsStentDeployed(false);
    setStentExpansion(0);
    setIsAspirating(false);
    setIsClotCaptured(false);
    setTiciScore('TICI 0');
    setClotTimer(5);
    setIsTimerRunning(false);
  };

  // -------------------------------------------------------------
  // Three.js Fluoroscopy 3D Angiography Stage
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712'); // Darkroom Fluoroscopy background
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(-16, 4, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(-5, 0, 1.5); // Center on M1 clot site

    // Lighting
    const ambLight = new THREE.AmbientLight(0x0284c7, 0.4);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    keyLight.position.set(20, 30, 20);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 0.8);
    rimLight.position.set(-20, -10, -10);
    scene.add(rimLight);

    // Root Group
    const root = new THREE.Group();
    scene.add(root);

    // 1. Transparent Parent Artery Shell (Fluoroscopic Roadmap)
    const arteryGeo = new THREE.TubeGeometry(arterialCurve, 64, 0.72, 16, false);
    const arteryMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      emissive: 0x0f172a,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      transmission: 0.85,
      thickness: 1.5,
      transparent: true,
      opacity: 0.45,
      wireframe: false
    });
    const arteryMesh = new THREE.Mesh(arteryGeo, arteryMat);
    root.add(arteryMesh);

    // Wireframe contour overlay for catheter lab fluoroscopy aesthetic
    const arteryWireMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const arteryWire = new THREE.Mesh(arteryGeo, arteryWireMat);
    root.add(arteryWire);

    // 2. Fibrin Thrombus (Clot)
    const clotGeo = new THREE.DodecahedronGeometry(1.2, 2);
    const clotMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x312e81,
      emissiveIntensity: 0.6,
      roughness: 0.85,
      metalness: 0.1
    });
    const clotMesh = new THREE.Mesh(clotGeo, clotMat);
    clotMesh.position.copy(clotPosition);
    root.add(clotMesh);
    clotMeshRef.current = clotMesh;

    // 3. Microcatheter (Flexible Blue Tubing)
    const catheterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.3
    });

    // Helper to build catheter tube along path up to catheterProgress
    const updateCatheter = () => {
      if (catheterMeshRef.current) {
        root.remove(catheterMeshRef.current);
      }
      const cathCurvePts: THREE.Vector3[] = [];
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const u = (i / steps) * catheterProgress;
        cathCurvePts.push(arterialCurve.getPointAt(u));
      }
      const cathCurve = new THREE.CatmullRomCurve3(cathCurvePts);
      const cathGeo = new THREE.TubeGeometry(cathCurve, 32, 0.28, 12, false);
      const cathMesh = new THREE.Mesh(cathGeo, catheterMat);
      root.add(cathMesh);
      catheterMeshRef.current = cathMesh;
    };
    updateCatheter();

    // 4. Self-Expanding Nitinol Stent Retriever (Golden Wire Mesh)
    const stentRadius = 0.55 * Math.max(0.1, stentExpansion);
    const stentLength = 3.2;
    const stentGeo = new THREE.CylinderGeometry(stentRadius, stentRadius, stentLength, 18, 12, true);
    const stentMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: true,
      transparent: true,
      opacity: isStentDeployed ? 0.95 : 0
    });
    const stentMesh = new THREE.Mesh(stentGeo, stentMat);
    // Align stent along M1 direction
    stentMesh.position.copy(clotPosition);
    stentMesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-1, 0.4, 0.2).normalize()
    );
    root.add(stentMesh);
    stentMeshRef.current = stentMesh;

    // 5. Downstream M2 / M3 Vessels (Dark/Occluded vs Reperfused Glowing)
    const downstreamGroup = new THREE.Group();
    root.add(downstreamGroup);
    downstreamVesselsRef.current = downstreamGroup;

    const m2Points = [
      new THREE.Vector3(-6.2, 0.5, 1.6),
      new THREE.Vector3(-7.8, 2.4, 1.8),
      new THREE.Vector3(-9.2, 5.0, 0.5),
      new THREE.Vector3(-10.5, 7.2, -1.0),
    ];
    const m2Curve = new THREE.CatmullRomCurve3(m2Points);
    const m2Geo = new THREE.TubeGeometry(m2Curve, 32, 0.45, 12, false);

    const isReperfused = ticiScore === 'TICI 3';
    const downstreamMat = new THREE.MeshStandardMaterial({
      color: isReperfused ? 0xef4444 : 0x334155,
      emissive: isReperfused ? 0xb91c1c : 0x0f172a,
      emissiveIntensity: isReperfused ? 0.9 : 0.1,
      roughness: 0.3,
      transparent: true,
      opacity: isReperfused ? 0.95 : 0.45
    });
    const downstreamMesh = new THREE.Mesh(m2Geo, downstreamMat);
    downstreamGroup.add(downstreamMesh);

    // 6. Erythrocyte Reperfusion Particle Surge
    const pCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const pt = isReperfused ? m2Curve.getPointAt(Math.random()) : arterialCurve.getPointAt(Math.random() * 0.5);
      pPositions[i * 3] = pt.x;
      pPositions[i * 3 + 1] = pt.y;
      pPositions[i * 3 + 2] = pt.z;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: isReperfused ? 0xef4444 : 0x38bdf8,
      size: isReperfused ? 0.45 : 0.28,
      transparent: true,
      opacity: 0.85
    });
    const bloodParticles = new THREE.Points(pGeo, pMat);
    root.add(bloodParticles);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      controls.update();

      // Slow gentle rotation
      root.rotation.y += 0.0015;

      // Pulse stent when deployed
      if (isStentDeployed && stentMesh) {
        const pulse = 1.0 + Math.sin(t * 6.0) * 0.04;
        stentMesh.scale.set(pulse, 1.0, pulse);
      }

      // If clot is extracted, move clot backwards with catheter
      if (currentStep === 'extract' && clotMesh) {
        clotMesh.position.lerp(new THREE.Vector3(-4.0, -1.0, 1.0), 0.05);
        if (stentMesh) stentMesh.position.lerp(new THREE.Vector3(-4.0, -1.0, 1.0), 0.05);
      } else if (currentStep === 'reperfusion' && clotMesh) {
        clotMesh.scale.set(0, 0, 0); // Removed from lumen!
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
    };
  }, [currentStep, catheterProgress, isStentDeployed, stentExpansion, ticiScore]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* EVT Studio Banner */}
      <div className="glass-card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">
                <Zap size={13} /> Interventional Neuro-Radiology Suite
              </span>
              <span className={`badge ${ticiScore === 'TICI 3' ? 'badge-success' : 'badge-danger'}`}>
                Angiographic Status: {ticiScore}
              </span>
              <span className="badge badge-warning">
                Solitaire / Trevo Stent Retriever
              </span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Virtual Endovascular Thrombectomy (EVT) Simulator
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '840px', fontSize: '14.5px', lineHeight: 1.55 }}>
              Experience the definitive gold-standard procedure for acute large-vessel occlusions (LVO). Navigate microcatheters through the carotid siphon, deploy a nitinol stent retriever to capture the fibrin clot, and achieve immediate TICI 3 brain reperfusion.
            </p>
          </div>

          {/* Reset / Restart Simulation */}
          <button
            onClick={handleReset}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <RotateCcw size={14} /> Reset Procedure
          </button>
        </div>

        {/* Step-by-Step Clinical Procedure Stepper */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginTop: '24px'
        }}>
          {/* Step 1 */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: currentStep === 'approach' ? 'var(--blue-50)' : 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${currentStep === 'approach' ? 'var(--blue-500)' : 'var(--glass-border)'}`
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue-600)', textTransform: 'uppercase' }}>
              Phase 1
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Vascular Access
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Carotid siphon navigation
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: currentStep === 'cross' ? 'var(--blue-50)' : 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${currentStep === 'cross' ? 'var(--blue-500)' : 'var(--glass-border)'}`
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue-600)', textTransform: 'uppercase' }}>
              Phase 2
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Cross Clot
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              0.014" Guidewire crossing
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: currentStep === 'deploy' ? 'var(--amber-50)' : 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${currentStep === 'deploy' ? '#f59e0b' : 'var(--glass-border)'}`
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
              Phase 3
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Deploy Stent
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Nitinol mesh clot engagement
            </div>
          </div>

          {/* Step 4 */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: currentStep === 'reperfusion' ? '#ecfdf5' : 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${currentStep === 'reperfusion' ? '#10b981' : 'var(--glass-border)'}`
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
              Phase 4
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Re-perfusion
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              TICI 3 flow restoration
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D Viewport & Interventional Controls Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(460px, 1.5fr) minmax(340px, 1fr)',
        gap: '24px'
      }}>
        {/* 3D Angiography C-Arm Viewport Card */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '12px 20px',
            backgroundColor: '#090d16',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="pulse-active" style={{ backgroundColor: ticiScore === 'TICI 3' ? '#10b981' : '#f43f5e' }}></span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>
                Fluoroscopic Road-Map • Biplane C-Arm Angiography (LAO 30° / Cranial 15°)
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              DSA Cine: 7.5 fps
            </span>
          </div>

          {/* 3D Canvas */}
          <div
            ref={mountRef}
            style={{
              width: '100%',
              height: '520px',
              position: 'relative',
              cursor: 'grab',
              backgroundColor: '#030712'
            }}
          />

          {/* Bottom HUD Legend */}
          <div style={{
            padding: '12px 20px',
            backgroundColor: '#090d16',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#38bdf8' }}></span>
                Microcatheter
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                Nitinol Stent
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0f172a', border: '1px solid #64748b' }}></span>
                Fibrin Clot
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: ticiScore === 'TICI 3' ? '#ef4444' : '#334155' }}></span>
                {ticiScore === 'TICI 3' ? 'Patent MCA' : 'Ischemic M2/M3'}
              </span>
            </div>
            <span>Orbit with mouse • Zoom with wheel</span>
          </div>
        </div>

        {/* Interventional Surgeon Control Station Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Trigger Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Layers size={18} color="var(--blue-600)" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Catheter Lab Procedure Control
              </h3>
            </div>

            {/* Current Step Interactive Action Button */}
            {currentStep === 'approach' && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  The 6-French guide catheter is seated in the cervical ICA. Advance the 0.021" microcatheter and 0.014" microwire past the carotid siphon to reach the face of the Left M1 clot.
                </p>
                <button
                  onClick={handleAdvanceCatheter}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700 }}
                >
                  <ArrowRight size={16} /> Advance Microcatheter Across Clot
                </button>
              </div>
            )}

            {currentStep === 'cross' && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Microwire has successfully crossed the thrombus. Unsheath the self-expanding Nitinol Stent Retriever (Solitaire 4×20 mm) across the clot length.
                </p>
                <button
                  onClick={handleDeployStent}
                  className="btn btn-warning"
                  style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700, backgroundColor: '#f59e0b', color: '#ffffff' }}
                >
                  <Sparkles size={16} /> Deploy Nitinol Stent Retriever
                </button>
              </div>
            )}

            {currentStep === 'deploy' && (
              <div>
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fffbeb',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #fde68a',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
                    Clot Integration Incubation
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#92400e', fontFamily: 'var(--font-mono)' }}>
                    00:0{clotTimer}
                  </div>
                  <p style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
                    Allowing nitinol struts to incorporate into the fibrin thrombus matrix...
                  </p>
                </div>

                <button
                  onClick={handleExtractClot}
                  disabled={!isClotCaptured}
                  className={`btn ${isClotCaptured ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700 }}
                >
                  <Play size={16} /> {isClotCaptured ? 'Activate Aspiration & Extract Clot' : 'Waiting for Stent Grip...'}
                </button>
              </div>
            )}

            {currentStep === 'extract' && (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <span className="pulse-active" style={{ backgroundColor: '#f43f5e', margin: '0 auto 12px' }}></span>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Continuous Vacuum Aspiration Active {isAspirating ? '(Vacuum Engaged)' : ''}
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Withdrawing stent-clot complex under continuous negative aspiration pressure...
                </p>
              </div>
            )}

            {currentStep === 'reperfusion' && (
              <div style={{
                padding: '16px',
                backgroundColor: '#ecfdf5',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #a7f3d0',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#065f46' }}>
                  Recanalization Complete: TICI 3
                </h4>
                <p style={{ fontSize: '13px', color: '#047857', marginTop: '4px', lineHeight: 1.45 }}>
                  The thrombus has been completely extracted into the intermediate catheter! Full robust cortical perfusion restored to the dominant left hemisphere.
                </p>
              </div>
            )}
          </div>

          {/* Clinical Reperfusion Telemetry Card */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Activity size={16} color="var(--blue-600)" />
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Interventional Outcome Metrics
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-raised)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>TICI Perfusion Score</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: ticiScore === 'TICI 3' ? '#059669' : '#dc2626', fontFamily: 'var(--font-mono)' }}>
                  {ticiScore}
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  {ticiScore === 'TICI 3' ? '100% Full Territory' : '0% Complete Occlusion'}
                </span>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-raised)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Door-to-Puncture</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {doorToPunctureMins} mins
                </div>
                <span style={{ fontSize: '10.5px', color: '#15803d', fontWeight: 600 }}>
                  Optimal Target (&lt; 60m)
                </span>
              </div>
            </div>

            {/* Tissue Saved Banner */}
            <div style={{
              padding: '12px 14px',
              backgroundColor: ticiScore === 'TICI 3' ? '#eff6ff' : '#fff1f2',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${ticiScore === 'TICI 3' ? '#bfdbfe' : '#fecdd3'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: ticiScore === 'TICI 3' ? '#1e40af' : '#9f1239' }}>
                  Brain Tissue Salvaged
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {ticiScore === 'TICI 3' ? '84 mL Penumbra Saved' : '84 mL at Immediate Risk'}
                </div>
              </div>
              <ShieldCheck size={28} color={ticiScore === 'TICI 3' ? '#2563eb' : '#94a3b8'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
