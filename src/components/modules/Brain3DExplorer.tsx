import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Brain, AlertCircle, RotateCcw, ShieldCheck } from 'lucide-react';

type StrokeType = 'ischemic' | 'hemorrhagic';
type VesselId = 'mca-left' | 'mca-right' | 'aca' | 'pca' | 'basilar';

interface VesselInfo {
  name: string;
  fullName: string;
  territory: string;
  symptoms: string[];
  homunculus: string;
}

export const Brain3DExplorer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [strokeType, setStrokeType] = useState<StrokeType>('ischemic');
  const [selectedVessel, setSelectedVessel] = useState<VesselId>('mca-left');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Vessel clinical descriptions
  const vesselData: Record<VesselId, VesselInfo> = {
    'mca-left': {
      name: 'Left MCA',
      fullName: 'Left Middle Cerebral Artery (M1/M2 Segments)',
      territory: 'Lateral frontal, parietal, and superior temporal lobes',
      symptoms: [
        'Right-sided facial droop and right arm hemiplegia (arm > leg)',
        'Global or Broca / Wernicke Aphasia (Dominant hemisphere speech loss)',
        'Right homonymous hemianopia and gaze preference toward the left',
        'Right-sided sensory hemi-hypesthesia'
      ],
      homunculus: 'Face & Upper Extremity primary motor and sensory strip'
    },
    'mca-right': {
      name: 'Right MCA',
      fullName: 'Right Middle Cerebral Artery (M1/M2 Segments)',
      territory: 'Lateral right hemisphere convexity',
      symptoms: [
        'Left-sided hemiplegia and facial drooping',
        'Severe left visual and spatial hemi-neglect (ignoring left world)',
        'Anosognosia (denial of paralysis)',
        'Left homonymous hemianopia'
      ],
      homunculus: 'Face & Arm motor control (Non-dominant spatial integration)'
    },
    'aca': {
      name: 'ACA',
      fullName: 'Anterior Cerebral Artery (A1/A2 Pericallosal)',
      territory: 'Medial surface of frontal and parietal lobes, corpus callosum',
      symptoms: [
        'Contralateral leg paralysis and weakness (leg >> arm/face)',
        'Abulia, profound apathy, and mutism (frontal lobe syndrome)',
        'Urinary incontinence (loss of micturition inhibition)',
        'Primitive grasp reflexes and alien hand syndrome'
      ],
      homunculus: 'Lower Extremity (Leg & Foot) cortical representation'
    },
    'pca': {
      name: 'PCA',
      fullName: 'Posterior Cerebral Artery (P1/P2 Occipital)',
      territory: 'Occipital lobe, inferomedial temporal lobe, and thalamus',
      symptoms: [
        'Contralateral homonymous hemianopia with macular sparing',
        'Alexia without agraphia (can write, but cannot read written words)',
        'Visual agnosia and prosopagnosia (inability to recognize faces)',
        'Thalamic pain syndrome (Dejerine-Roussy severe chronic burning)'
      ],
      homunculus: 'Primary Visual Cortex (Calcarine fissure) & Sensory Thalamus'
    },
    'basilar': {
      name: 'Basilar Artery',
      fullName: 'Basilar Artery Trunk & Vertebral Junction',
      territory: 'Brainstem (pons, medulla), cerebellum, and corticospinal tracts',
      symptoms: [
        'Locked-In Syndrome (quadriplegia & aphonia with preserved vertical eye gaze)',
        'Severe vertigo, diplopia, dysarthria, and dysphagia (4 D\'s)',
        'Crossed sensory signs (ipsilateral facial numbness, contralateral body numbness)',
        'Cerebellar ataxia, coma, and respiratory arrest'
      ],
      homunculus: 'Bilateral descending corticospinal motor tracts & Cranial Nerves'
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth;
    const height = container.clientHeight || 520;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 38);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0284c7, 1.2);
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    dirLight2.position.set(-20, -20, -20);
    scene.add(dirLight2);

    // 3. Brain Geometric Scaffold (Left & Right Hemispheres + Cerebellum)
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Translucent Brain Cortex Material
    const cortexMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xebf8ff,
      roughness: 0.2,
      transmission: 0.75,
      thickness: 1.2,
      transparent: true,
      opacity: 0.55,
      wireframe: false,
    });

    // Left Hemisphere
    const leftHemiGeo = new THREE.SphereGeometry(9, 32, 24);
    leftHemiGeo.scale(0.85, 1.0, 1.25);
    const leftHemi = new THREE.Mesh(leftHemiGeo, cortexMaterial);
    leftHemi.position.set(-4.5, 3, 0);
    brainGroup.add(leftHemi);

    // Right Hemisphere
    const rightHemiGeo = new THREE.SphereGeometry(9, 32, 24);
    rightHemiGeo.scale(0.85, 1.0, 1.25);
    const rightHemi = new THREE.Mesh(rightHemiGeo, cortexMaterial.clone());
    rightHemi.position.set(4.5, 3, 0);
    brainGroup.add(rightHemi);

    // Cerebellum & Brainstem
    const cerebellumGeo = new THREE.SphereGeometry(5.5, 24, 18);
    cerebellumGeo.scale(1.3, 0.7, 0.9);
    const cerebellum = new THREE.Mesh(cerebellumGeo, cortexMaterial.clone());
    cerebellum.position.set(0, -4.5, -5);
    brainGroup.add(cerebellum);

    const stemGeo = new THREE.CylinderGeometry(1.8, 1.4, 8, 20);
    const stem = new THREE.Mesh(stemGeo, cortexMaterial.clone());
    stem.position.set(0, -7.5, -2);
    brainGroup.add(stem);

    // 4. Vascular Tree Arteries (TubeGeometries for Circle of Willis)
    const vesselsGroup = new THREE.Group();
    brainGroup.add(vesselsGroup);

    const arteryMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });


    // Helper to create artery tubes
    const createArtery = (points: THREE.Vector3[], radius = 0.4) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const geom = new THREE.TubeGeometry(curve, 32, radius, 12, false);
      return new THREE.Mesh(geom, arteryMaterial);
    };

    // Basilar Artery
    const basilarArtery = createArtery([
      new THREE.Vector3(0, -11, -2),
      new THREE.Vector3(0, -7, -2),
      new THREE.Vector3(0, -3, -1),
      new THREE.Vector3(0, -1, 0),
    ], 0.6);
    vesselsGroup.add(basilarArtery);

    // Left MCA
    const leftMCA = createArtery([
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(-4, 0.5, 2),
      new THREE.Vector3(-8, 2, 1),
      new THREE.Vector3(-10, 5, -1),
    ], 0.5);
    vesselsGroup.add(leftMCA);

    // Right MCA
    const rightMCA = createArtery([
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(4, 0.5, 2),
      new THREE.Vector3(8, 2, 1),
      new THREE.Vector3(10, 5, -1),
    ], 0.5);
    vesselsGroup.add(rightMCA);

    // ACA (Anterior Cerebral Arteries)
    const acaVessel = createArtery([
      new THREE.Vector3(0, 0, 2),
      new THREE.Vector3(0, 4, 4),
      new THREE.Vector3(0, 8, 3),
      new THREE.Vector3(0, 9.5, -2),
    ], 0.45);
    vesselsGroup.add(acaVessel);

    // PCA (Posterior Cerebral Arteries)
    const pcaVessel = createArtery([
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(-3, -1, -3),
      new THREE.Vector3(-5, -0.5, -7),
      new THREE.Vector3(-3, 1, -10),
    ], 0.45);
    vesselsGroup.add(pcaVessel);

    // 5. Clot / Bleed Sphere Indicator
    const markerGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const markerMat = new THREE.MeshStandardMaterial({
      color: strokeType === 'ischemic' ? 0x1e293b : 0xdc2626,
      emissive: strokeType === 'ischemic' ? 0x0f172a : 0xef4444,
      emissiveIntensity: 1.0,
      roughness: 0.2,
    });
    const pathologyMarker = new THREE.Mesh(markerGeo, markerMat);
    brainGroup.add(pathologyMarker);

    // Update marker location based on selected vessel
    const updateMarkerPosition = () => {
      if (selectedVessel === 'mca-left') pathologyMarker.position.set(-6, 1.5, 1.5);
      else if (selectedVessel === 'mca-right') pathologyMarker.position.set(6, 1.5, 1.5);
      else if (selectedVessel === 'aca') pathologyMarker.position.set(0, 6, 3.5);
      else if (selectedVessel === 'pca') pathologyMarker.position.set(-4, -0.5, -5);
      else if (selectedVessel === 'basilar') pathologyMarker.position.set(0, -5, -1.8);

      markerMat.color.set(strokeType === 'ischemic' ? 0x1e293b : 0xdc2626);
      markerMat.emissive.set(strokeType === 'ischemic' ? 0x0f172a : 0xef4444);
    };
    updateMarkerPosition();

    // 6. Mouse Drag Interaction for Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      brainGroup.rotation.y += deltaX * 0.008;
      brainGroup.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 7. Animation Loop
    let animId: number;
    let pulseTime = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      pulseTime += 0.05;

      if (isRotating && !isDragging) {
        brainGroup.rotation.y += 0.004;
      }

      // Marker pulse animation
      const scale = 1 + Math.sin(pulseTime * 3) * 0.15;
      pathologyMarker.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [selectedVessel, strokeType, isRotating]);

  const currentInfo = vesselData[selectedVessel];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <Brain size={13} /> Three.js 3D Vascular Engine
          </span>
          <span className={`badge ${strokeType === 'ischemic' ? 'badge-primary' : 'badge-danger'}`}>
            {strokeType === 'ischemic' ? 'Ischemic Thromboembolism' : 'Hemorrhagic Aneurysm Rupture'}
          </span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          3D Interactive Brain Vessel Explorer
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '15px' }}>
          Interact with the Circle of Willis and major cerebral arterial branches. Select any artery to lodge a virtual ischemic thrombus or trigger an arterial aneurysm bleed, and explore the neurological consequences in real time.
        </p>

        {/* Pathology Mode Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={() => setStrokeType('ischemic')}
            className={`btn ${strokeType === 'ischemic' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Ischemic Stroke (Blood Clot / Thrombus)
          </button>
          <button
            onClick={() => setStrokeType('hemorrhagic')}
            className={`btn ${strokeType === 'hemorrhagic' ? 'btn-danger' : 'btn-secondary'}`}
          >
            Hemorrhagic Stroke (Rupture / Aneurysm)
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & Symptom Diagnostics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '24px' }}>
        {/* 3D Canvas Container */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(Object.keys(vesselData) as VesselId[]).map((vId) => (
                <button
                  key={vId}
                  onClick={() => setSelectedVessel(vId)}
                  className={`btn btn-sm ${selectedVessel === vId ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {vesselData[vId].name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className="btn btn-secondary btn-sm"
              title="Toggle Auto Rotation"
            >
              <RotateCcw size={14} />
              {isRotating ? 'Pause Spin' : 'Resume Spin'}
            </button>
          </div>

          {/* Three.js Canvas Mount */}
          <div
            ref={mountRef}
            style={{
              width: '100%',
              height: '500px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              overflow: 'hidden',
              cursor: 'grab',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>*Click & drag on the 3D model to freely rotate in 360° space</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: strokeType === 'ischemic' ? '#0f172a' : '#ef4444' }}></span>
              Pulsating marker = Active occlusion site
            </span>
          </div>
        </div>

        {/* Right: Clinical Diagnostic Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
              Vascular Territory Selected
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              {currentInfo.fullName}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: 600, marginBottom: '16px' }}>
              {currentInfo.territory}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                Neurological Deficits & Clinical Signs:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentInfo.symptoms.map((symptom, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.5 }}>
                    <AlertCircle size={16} color="var(--danger-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              backgroundColor: 'var(--primary-50)',
              border: '1px solid var(--primary-100)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px'
            }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--primary-700)', fontWeight: 700 }}>
                Cortical Homunculus Representation:
              </span>
              <p style={{ fontSize: '13px', color: 'var(--primary-900)', fontWeight: 600, marginTop: '2px' }}>
                {currentInfo.homunculus}
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={18} color="var(--success-600)" />
              <h4 style={{ fontSize: '14px', fontWeight: 700 }}>
                Emergency Revascularization Option
              </h4>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {strokeType === 'ischemic' 
                ? 'Eligible for Endovascular Mechanical Thrombectomy (stent retriever / aspiration catheter) if presentation is within 24 hours with confirmed Large Vessel Occlusion (LVO).'
                : 'Emergency neurosurgical intervention: Aneurysmal clipping or endovascular coiling to prevent fatal re-rupture, accompanied by intracranial pressure (ICP) monitoring.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
