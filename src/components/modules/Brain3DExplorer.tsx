import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Brain, 
  RotateCcw, 
  Activity, 
  Zap, 
  Layers,
  Flame
} from 'lucide-react';

type StrokeType = 'ischemic' | 'hemorrhagic';
type VesselId = 'mca-left' | 'mca-right' | 'aca' | 'pca' | 'basilar';

interface VesselInfo {
  name: string;
  fullName: string;
  territory: string;
  velocity: number; // cm/s
  pi: number; // Pulsatility Index
  ticiScore: string;
  symptoms: string[];
  homunculus: string;
  penumbraVolume: string;
}

export const Brain3DExplorer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [strokeType, setStrokeType] = useState<StrokeType>('ischemic');
  const [selectedVessel, setSelectedVessel] = useState<VesselId>('mca-left');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'clinical' | 'dsa'>('clinical'); // DSA = Digital Subtraction Angiography
  const [showBrainCortex, setShowBrainCortex] = useState<boolean>(true);

  // Vessel clinical descriptions & hemodynamic telemetry
  const vesselData: Record<VesselId, VesselInfo> = {
    'mca-left': {
      name: 'Left MCA (Dominant)',
      fullName: 'Left Middle Cerebral Artery (M1 Trunk / M2 Bifurcation)',
      territory: 'Dominant lateral frontal, temporal, and parietal cortices (Broca & Wernicke)',
      velocity: strokeType === 'ischemic' ? 12 : 78,
      pi: strokeType === 'ischemic' ? 1.85 : 0.88,
      ticiScore: strokeType === 'ischemic' ? 'TICI 0 (No Perfusion)' : 'TICI 3 (Complete Perfusion)',
      penumbraVolume: '84 mL at risk',
      symptoms: [
        'Right-sided facial droop and right upper-limb hemiplegia (arm > leg)',
        'Global or Broca / Wernicke Aphasia (severe language impairment)',
        'Right homonymous hemianopia with leftward conjugate eye deviation',
        'Right hemi-sensory loss across face and arm'
      ],
      homunculus: 'Face & Arm Primary Motor/Sensory Strip (Precentral/Postcentral Gyri)'
    },
    'mca-right': {
      name: 'Right MCA (Non-Dominant)',
      fullName: 'Right Middle Cerebral Artery (M1 Trunk / Sylvian Segments)',
      territory: 'Non-dominant fronto-parietal cortex & spatial orientation center',
      velocity: strokeType === 'ischemic' ? 14 : 76,
      pi: strokeType === 'ischemic' ? 1.78 : 0.86,
      ticiScore: strokeType === 'ischemic' ? 'TICI 0 (Occluded)' : 'TICI 3 (Normal)',
      penumbraVolume: '78 mL at risk',
      symptoms: [
        'Left-sided hemiplegia and left facial paralysis (arm > leg)',
        'Profound Left Hemi-Spatial Neglect (complete unawareness of left visual/physical space)',
        'Anosognosia (denial of illness or paralysis)',
        'Left homonymous hemianopia & constructional apraxia'
      ],
      homunculus: 'Contralateral Face/Arm motor representation & parietal spatial coordinate mapping'
    },
    'aca': {
      name: 'Anterior Cerebral Artery (ACA)',
      fullName: 'Anterior Cerebral Artery (A1 / A2 Pericallosal Trunk)',
      territory: 'Medial surfaces of frontal and parietal lobes, corpus callosum',
      velocity: strokeType === 'ischemic' ? 10 : 64,
      pi: strokeType === 'ischemic' ? 1.65 : 0.84,
      ticiScore: strokeType === 'ischemic' ? 'TICI 0 (Stenotic)' : 'TICI 3 (Normal)',
      penumbraVolume: '42 mL at risk',
      symptoms: [
        'Contralateral lower-limb paralysis (leg >> arm/face weakness)',
        'Abulia, psychomotor slowing, apathy, and transcortical motor mutism',
        'Loss of urinary sphincter control (frontal micturition center)',
        'Alien hand syndrome and primitive grasp reflexes'
      ],
      homunculus: 'Medial motor homunculus: Leg, Foot, and Genital somatosensory cortex'
    },
    'pca': {
      name: 'Posterior Cerebral Artery (PCA)',
      fullName: 'Posterior Cerebral Artery (P1 / P2 Calcarine Segments)',
      territory: 'Occipital lobe, inferomedial temporal lobe, posterior thalamus',
      velocity: strokeType === 'ischemic' ? 15 : 55,
      pi: strokeType === 'ischemic' ? 1.55 : 0.82,
      ticiScore: strokeType === 'ischemic' ? 'TICI 1 (Minimal)' : 'TICI 3 (Normal)',
      penumbraVolume: '56 mL at risk',
      symptoms: [
        'Contralateral homonymous hemianopia (with occasional macular sparing)',
        'Alexia without agraphia (can write, but unable to read written language)',
        'Visual agnosia and prosopagnosia (inability to recognize familiar faces)',
        'Thalamic syndrome (Dejerine-Roussy intractable chronic neuropathic pain)'
      ],
      homunculus: 'Primary Visual Cortex (Brodmann Area 17) & Sensory Thalamus (VPL/VPM)'
    },
    'basilar': {
      name: 'Basilar Artery Trunk',
      fullName: 'Vertebrobasilar Junction & Basilar Artery Apex',
      territory: 'Brainstem (pons, medulla), cerebellum, descending corticospinal tracts',
      velocity: strokeType === 'ischemic' ? 8 : 58,
      pi: strokeType === 'ischemic' ? 2.10 : 0.90,
      ticiScore: strokeType === 'ischemic' ? 'TICI 0 (Critical LVO)' : 'TICI 3 (Normal)',
      penumbraVolume: '96 mL (Brainstem Critical)',
      symptoms: [
        'Locked-In Syndrome (quadriplegia & aphonia with preserved vertical eye movement)',
        'Severe acute vertigo, diplopia, dysarthria, and dysphagia (The 4 D\'s)',
        'Crossed brainstem signs (ipsilateral cranial nerve palsy + contralateral hemiplegia)',
        'Coma, pin-point pupils, decerebrate posturing, and sudden respiratory arrest'
      ],
      homunculus: 'Bilateral descending motor tracts, reticular activating system & cranial nerves'
    }
  };

  const activeInfo = vesselData[selectedVessel];

  // Three.js 3D Vascular Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = 540;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(viewMode === 'dsa' ? '#050811' : '#ffffff');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 16, 44);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(
      viewMode === 'dsa' ? 0x38bdf8 : 0xffffff, 
      viewMode === 'dsa' ? 0.6 : 0.9
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x0891b2, 1.4);
    keyLight.position.set(30, 40, 30);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe11d48, 0.7);
    fillLight.position.set(-30, -20, -20);
    scene.add(fillLight);

    // Root Group for rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 3. Anatomical Brain Cortex Shell (Translucent)
    const cortexGroup = new THREE.Group();
    rootGroup.add(cortexGroup);

    const cortexMat = new THREE.MeshPhysicalMaterial({
      color: viewMode === 'dsa' ? 0x0f172a : 0xecfeff,
      roughness: 0.15,
      transmission: viewMode === 'dsa' ? 0.4 : 0.82,
      thickness: 1.6,
      transparent: true,
      opacity: showBrainCortex ? (viewMode === 'dsa' ? 0.35 : 0.45) : 0,
      wireframe: viewMode === 'dsa',
    });

    // Left Hemisphere
    const leftHemiGeo = new THREE.SphereGeometry(10, 36, 28);
    leftHemiGeo.scale(0.82, 1.05, 1.3);
    const leftHemi = new THREE.Mesh(leftHemiGeo, cortexMat);
    leftHemi.position.set(-5, 4, 0);
    cortexGroup.add(leftHemi);

    // Right Hemisphere
    const rightHemiGeo = new THREE.SphereGeometry(10, 36, 28);
    rightHemiGeo.scale(0.82, 1.05, 1.3);
    const rightHemi = new THREE.Mesh(rightHemiGeo, cortexMat);
    rightHemi.position.set(5, 4, 0);
    cortexGroup.add(rightHemi);

    // Cerebellum
    const cerebellumGeo = new THREE.SphereGeometry(6, 24, 20);
    cerebellumGeo.scale(1.35, 0.75, 0.9);
    const cerebellum = new THREE.Mesh(cerebellumGeo, cortexMat);
    cerebellum.position.set(0, -4.5, -6);
    cortexGroup.add(cerebellum);

    // Brainstem
    const stemGeo = new THREE.CylinderGeometry(2.0, 1.5, 9, 24);
    const stem = new THREE.Mesh(stemGeo, cortexMat);
    stem.position.set(0, -8, -2.5);
    cortexGroup.add(stem);

    // 4. Circle of Willis & Arterial Tree
    const vesselGroup = new THREE.Group();
    rootGroup.add(vesselGroup);

    // Dynamic Materials based on state
    const normalArteryMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0xbe123c,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.1
    });

    const occludedArteryMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      emissive: 0x0f172a,
      emissiveIntensity: 0.2,
      roughness: 0.6,
      transparent: true,
      opacity: 0.55
    });

    // Helper to generate smooth arterial tube
    const createArteryMesh = (points: THREE.Vector3[], radius: number, isOccluded: boolean) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const geom = new THREE.TubeGeometry(curve, 36, radius, 14, false);
      const mesh = new THREE.Mesh(geom, isOccluded ? occludedArteryMat : normalArteryMat);
      return mesh;
    };

    // Arterial Paths
    // Vertebral & Basilar Arteries
    const isBasilarOccluded = strokeType === 'ischemic' && selectedVessel === 'basilar';
    const basilarMesh = createArteryMesh([
      new THREE.Vector3(0, -12, -3),
      new THREE.Vector3(0, -8, -2.5),
      new THREE.Vector3(0, -4, -1.5),
      new THREE.Vector3(0, -1, 0),
    ], 0.75, isBasilarOccluded);
    vesselGroup.add(basilarMesh);

    // Left Internal Carotid Artery (ICA) -> Left MCA
    const isLeftMCAOccluded = strokeType === 'ischemic' && selectedVessel === 'mca-left';
    const leftMCAMesh = createArteryMesh([
      new THREE.Vector3(-1.8, -3, 0.5),
      new THREE.Vector3(-2.5, 0, 1),
      new THREE.Vector3(-5, 1, 2),
      new THREE.Vector3(-8.5, 3, 1),
      new THREE.Vector3(-11, 6, -1.5),
    ], 0.6, isLeftMCAOccluded);
    vesselGroup.add(leftMCAMesh);

    // Left MCA M2 Cortical Branches
    const leftMCABranch1 = createArteryMesh([
      new THREE.Vector3(-8.5, 3, 1),
      new THREE.Vector3(-9.5, 6, 2),
      new THREE.Vector3(-10, 8, 0.5),
    ], 0.35, isLeftMCAOccluded);
    vesselGroup.add(leftMCABranch1);

    // Right Internal Carotid Artery (ICA) -> Right MCA
    const isRightMCAOccluded = strokeType === 'ischemic' && selectedVessel === 'mca-right';
    const rightMCAMesh = createArteryMesh([
      new THREE.Vector3(1.8, -3, 0.5),
      new THREE.Vector3(2.5, 0, 1),
      new THREE.Vector3(5, 1, 2),
      new THREE.Vector3(8.5, 3, 1),
      new THREE.Vector3(11, 6, -1.5),
    ], 0.6, isRightMCAOccluded);
    vesselGroup.add(rightMCAMesh);

    const rightMCABranch1 = createArteryMesh([
      new THREE.Vector3(8.5, 3, 1),
      new THREE.Vector3(9.5, 6, 2),
      new THREE.Vector3(10, 8, 0.5),
    ], 0.35, isRightMCAOccluded);
    vesselGroup.add(rightMCABranch1);

    // ACA (Anterior Cerebral Arteries)
    const isACAOccluded = strokeType === 'ischemic' && selectedVessel === 'aca';
    const acaMesh = createArteryMesh([
      new THREE.Vector3(0, 0, 1.8),
      new THREE.Vector3(0, 4, 4),
      new THREE.Vector3(0, 8, 3.2),
      new THREE.Vector3(0, 10.5, -2),
    ], 0.5, isACAOccluded);
    vesselGroup.add(acaMesh);

    // PCA (Posterior Cerebral Arteries)
    const isPCAOccluded = strokeType === 'ischemic' && selectedVessel === 'pca';
    const pcaMesh = createArteryMesh([
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(-3.5, -1, -3),
      new THREE.Vector3(-6, -0.5, -7),
      new THREE.Vector3(-4, 1.5, -11),
    ], 0.5, isPCAOccluded);
    vesselGroup.add(pcaMesh);

    // 5. Pulsating Blood Flow Particle System (Erythrocyte stream)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 8;
      particlePositions[i * 3] = Math.cos(theta) * r;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = Math.sin(theta) * r;

      // Normal arterial red, or ischemic cyan highlight
      particleColors[i * 3] = 0.95;
      particleColors[i * 3 + 1] = 0.15;
      particleColors[i * 3 + 2] = 0.2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleSystem);

    // 6. Pathology Marker (Fibrin Clot in Ischemic vs Hematoma in Hemorrhagic)
    const markerGroup = new THREE.Group();
    rootGroup.add(markerGroup);

    let markerMesh: THREE.Mesh;
    if (strokeType === 'ischemic') {
      // Clot Thrombus Mesh (Irregular Fibrin Mass)
      const clotGeo = new THREE.DodecahedronGeometry(1.6, 2);
      const clotMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: 0x0f172a,
        emissiveIntensity: 0.8,
        roughness: 0.9
      });
      markerMesh = new THREE.Mesh(clotGeo, clotMat);
    } else {
      // Intracerebral Hematoma (Expanding Blood Mass with halo)
      const bleedGeo = new THREE.SphereGeometry(3.2, 32, 28);
      const bleedMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        emissive: 0xef4444,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
      });
      markerMesh = new THREE.Mesh(bleedGeo, bleedMat);
    }

    // Set position according to vessel
    if (selectedVessel === 'mca-left') markerMesh.position.set(-6, 2, 1.8);
    else if (selectedVessel === 'mca-right') markerMesh.position.set(6, 2, 1.8);
    else if (selectedVessel === 'aca') markerMesh.position.set(0, 6, 3.8);
    else if (selectedVessel === 'pca') markerMesh.position.set(-4.5, -0.5, -6);
    else if (selectedVessel === 'basilar') markerMesh.position.set(0, -6, -2.2);

    markerGroup.add(markerMesh);

    // Penumbra Hypoperfused Territory Sphere
    if (strokeType === 'ischemic') {
      const penumbraGeo = new THREE.SphereGeometry(5.5, 24, 20);
      const penumbraMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.22,
        wireframe: true
      });
      const penumbraMesh = new THREE.Mesh(penumbraGeo, penumbraMat);
      penumbraMesh.position.copy(markerMesh.position);
      markerGroup.add(penumbraMesh);
    }

    // 7. Interactive Drag to Orbit / Rotate
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow smooth auto-rotation if enabled and not being dragged
      if (isRotating && !isMouseDown) {
        rootGroup.rotation.y += 0.004;
      }

      // Cardiac pulse dynamics on vessels
      const pulse = 1 + Math.sin(elapsedTime * 6.5) * 0.035;
      vesselGroup.scale.set(pulse, pulse, pulse);

      // Erythrocyte particles flow
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.08;
        if (positions[i * 3 + 1] > 12) {
          positions[i * 3 + 1] = -12;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pathology marker pulse
      if (markerMesh) {
        const markerScale = 1 + Math.sin(elapsedTime * 4) * 0.08;
        markerMesh.scale.set(markerScale, markerScale, markerScale);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [selectedVessel, strokeType, isRotating, viewMode, showBrainCortex]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">
                <Brain size={13} /> 3D WebGL Angiography Engine
              </span>
              <span className={`badge ${strokeType === 'ischemic' ? 'badge-danger' : 'badge-warning'}`}>
                {strokeType === 'ischemic' ? 'Acute Ischemic Thromboembolism' : 'Intracranial Hemorrhage'}
              </span>
              <span className="badge badge-success">
                Circle of Willis Real-Time Perfusion
              </span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              3D Interactive Brain Vessel & Stroke Explorer
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '820px', fontSize: '15px', lineHeight: 1.6 }}>
              Inspect the cerebrovascular arterial network in high-precision 3D. Simulate acute large-vessel occlusions (LVO) across the Circle of Willis, observe downstream hypoperfusion penumbral zones, and map vascular territories directly to clinical neurologic deficits.
            </p>
          </div>

          {/* Stroke Pathology Selector */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-muted)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}>
            <button
              onClick={() => setStrokeType('ischemic')}
              className={`btn btn-sm ${strokeType === 'ischemic' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Zap size={14} /> Ischemic Stroke (87%)
            </button>
            <button
              onClick={() => setStrokeType('hemorrhagic')}
              className={`btn btn-sm ${strokeType === 'hemorrhagic' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Flame size={14} /> Hemorrhagic Bleed (13%)
            </button>
          </div>
        </div>

        {/* Vessel Territory Selection Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
          {(Object.keys(vesselData) as VesselId[]).map((vKey) => (
            <button
              key={vKey}
              onClick={() => setSelectedVessel(vKey)}
              className={`btn ${selectedVessel === vKey ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              {vesselData[vKey].name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Visualization Arena & Clinical Telemetry Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 1.45fr) minmax(320px, 0.95fr)',
        gap: '28px'
      }}>
        {/* 3D Viewport Station */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Viewport Floating HUD Controls */}
          <div style={{
            padding: '14px 20px',
            backgroundColor: viewMode === 'dsa' ? '#090d16' : '#ffffff',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="pulse-active" style={{ backgroundColor: strokeType === 'ischemic' ? '#0891b2' : '#e11d48' }}></span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: viewMode === 'dsa' ? '#38bdf8' : 'var(--text-main)' }}>
                {activeInfo.fullName}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setViewMode(viewMode === 'clinical' ? 'dsa' : 'clinical')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px' }}
                title="Toggle Digital Subtraction Angiography High-Contrast View"
              >
                <Layers size={13} /> {viewMode === 'clinical' ? 'DSA View' : 'Anatomy View'}
              </button>

              <button
                onClick={() => setShowBrainCortex(!showBrainCortex)}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                <Brain size={13} /> Cortex {showBrainCortex ? 'On' : 'Off'}
              </button>

              <button
                onClick={() => setIsRotating(!isRotating)}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                <RotateCcw size={13} /> {isRotating ? 'Pause' : 'Rotate'}
              </button>
            </div>
          </div>

          {/* Three.js Mount Canvas */}
          <div 
            ref={mountRef} 
            style={{ 
              width: '100%', 
              height: '540px', 
              position: 'relative',
              cursor: 'grab',
              backgroundColor: viewMode === 'dsa' ? '#050811' : '#ffffff'
            }} 
          />

          {/* Bottom Viewport Legend & Guidance */}
          <div style={{
            padding: '12px 20px',
            backgroundColor: viewMode === 'dsa' ? '#090d16' : 'var(--bg-muted)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                Patent Arteries
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#334155' }}></span>
                Ischemic Hypoperfusion
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#06b6d4' }}></span>
                At-Risk Penumbra
              </span>
            </div>
            <span>Drag mouse to orbit 360°</span>
          </div>
        </div>

        {/* Clinical Neurologic Telemetry & Territory Intel Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Hemodynamic Doppler & Perfusion Metrics */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                Transcranial Doppler & Angio Metrics
              </span>
              <Activity size={18} color="var(--primary-600)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                padding: '12px 14px',
                backgroundColor: 'var(--bg-muted)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Mean Flow Velocity</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {activeInfo.velocity} cm/s
                </div>
                <span style={{ fontSize: '11px', color: activeInfo.velocity < 20 ? '#be123c' : '#15803d', fontWeight: 600 }}>
                  {activeInfo.velocity < 20 ? 'Critical Stasis (< 20)' : 'Normal Perfusion'}
                </span>
              </div>

              <div style={{
                padding: '12px 14px',
                backgroundColor: 'var(--bg-muted)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Pulsatility Index (PI)</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {activeInfo.pi}
                </div>
                <span style={{ fontSize: '11px', color: activeInfo.pi > 1.2 ? '#b45309' : '#15803d', fontWeight: 600 }}>
                  {activeInfo.pi > 1.2 ? 'High Distal Resistance' : 'Normal Waveform'}
                </span>
              </div>
            </div>

            <div style={{
              padding: '10px 14px',
              backgroundColor: strokeType === 'ischemic' ? '#fff1f2' : '#fffbeb',
              borderRadius: 'var(--radius-md)',
              border: '1px solid ' + (strokeType === 'ischemic' ? '#fecdd3' : '#fde68a'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px'
            }}>
              <span style={{ fontWeight: 700, color: strokeType === 'ischemic' ? '#be123c' : '#b45309' }}>
                Angiographic Recanalization:
              </span>
              <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                {activeInfo.ticiScore}
              </span>
            </div>
          </div>

          {/* Neurologic Symptoms & Clinical Syndrome */}
          <div className="glass-card" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              Clinical Stroke Syndrome
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              <strong>Territory:</strong> {activeInfo.territory}
            </p>

            <div style={{
              padding: '10px 14px',
              backgroundColor: '#ecfeff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #a5f3fc',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0e7490', textTransform: 'uppercase' }}>
                Cortical Homunculus Localization
              </span>
              <p style={{ fontSize: '12.5px', color: '#155e75', fontWeight: 600, marginTop: '2px' }}>
                {activeInfo.homunculus}
              </p>
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              Cardinal Neurological Signs:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeInfo.symptoms.map((symptom, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px' }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e11d48', 
                    marginTop: '7px', 
                    flexShrink: 0 
                  }}></div>
                  <span style={{ color: 'var(--text-body)', lineHeight: 1.45 }}>{symptom}</span>
                </div>
              ))}
            </div>

            {/* Anatomical Reference Preview Box */}
            <div style={{
              marginTop: '20px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              position: 'relative'
            }}>
              <img 
                src="/assets/cerebral_vascular_brain.jpg" 
                alt="Cerebral Vascular Angiography 3D Map" 
                style={{ width: '100%', height: '110px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '6px 12px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                fontSize: '11px',
                color: '#ffffff',
                fontWeight: 600
              }}>
                Anatomical Angiography Reference: Circle of Willis & Sylvian Bifurcation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
