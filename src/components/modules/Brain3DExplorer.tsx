import React, { useEffect, useRef, useState, useId } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Brain, 
  RotateCcw, 
  Activity, 
  Zap, 
  Layers,
  Flame,
  Eye,
  Scissors,
  Compass,
  AlertCircle,
  Crosshair,
  Sparkles
} from 'lucide-react';
import {
  generateProceduralBrainTextures,
  createHemisphereGeometry,
  createCerebellumGeometry,
  createBrainstemGeometry,
  createVentriclesGeometry
} from '../../utils/brain3D/proceduralAnatomy';
import {
  type VesselId,
  type StrokeType,
  CLINICAL_VESSEL_DATA,
  buildVascularNetwork
} from '../../utils/brain3D/vascularData';
import { useResponsive, useMediaQuery } from '../../hooks/useResponsive';

type ViewMode = 'tissue' | 'dsa' | 'perfusion' | 'homunculus';
type CameraPreset = 'default' | 'circle-of-willis' | 'left-sylvian' | 'right-sylvian' | 'aca' | 'pca';

export const Brain3DExplorer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const tcdCanvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Diagnostic & Simulation States
  const [strokeType, setStrokeType] = useState<StrokeType>('ischemic');
  const [selectedVessel, setSelectedVessel] = useState<VesselId>('mca-left');
  const [viewMode, setViewMode] = useState<ViewMode>('tissue');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [cortexOpacity, setCortexOpacity] = useState<number>(0.42);
  const [sliceLevel, setSliceLevel] = useState<number>(14); // 14 = full brain, lower cuts down
  const [hoveredVesselName, setHoveredVesselName] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('default');

  const { isMobile, isTabletPortrait, isTablet } = useResponsive();
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  // Responsive canvas height: desktop 580, tablet ~460, mobile clamped in 320-380 range
  const canvasHeight = isMobile ? 340 : isTablet ? 460 : 580;
  const showTouchHint = isMobile || isCoarsePointer;

  const activeInfo = CLINICAL_VESSEL_DATA[selectedVessel](strokeType);

  // Generate unique accessible element IDs
  const cortexSliderId = useId();
  const sliceSliderId = useId();

  // -------------------------------------------------------------
  // Live Transcranial Doppler (TCD) Waveform Canvas
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = tcdCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const renderTCD = () => {
      animId = requestAnimationFrame(renderTCD);
      t += 0.05;

      const w = canvas.width;
      const h = canvas.height;

      // Clean clinical Doppler monitor background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Zero baseline
      const baseline = h - 22;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.beginPath();
      ctx.moveTo(0, baseline);
      ctx.lineTo(w, baseline);
      ctx.stroke();

      // Synthesize Doppler Envelope Waveform
      // Sharp systolic upstroke, dicrotic notch, end-diastolic decay
      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = strokeType === 'ischemic' && activeInfo.velocity < 20 ? '#f43f5e' : '#38bdf8';

      const isDampened = strokeType === 'ischemic' && activeInfo.velocity < 20;

      for (let x = 0; x < w; x++) {
        const phase = (x * 0.035 - t * 2.2) % (Math.PI * 2);
        const normPhase = (phase + Math.PI * 2) % (Math.PI * 2);

        let wave = 0;
        if (!isDampened) {
          // Normal triphasic cerebral Doppler waveform
          if (normPhase < 1.2) {
            wave = Math.sin(normPhase * (Math.PI / 1.2)) * 0.95; // Systolic peak
          } else if (normPhase < 2.0) {
            wave = 0.35 + Math.sin((normPhase - 1.2) * 3) * 0.15; // Dicrotic notch
          } else {
            wave = 0.38 * Math.exp(-(normPhase - 2.0) * 0.75); // Diastolic runoff
          }
        } else {
          // Occluded / High-Resistance dampened waveform (stump spike or low velocity)
          if (normPhase < 1.0) {
            wave = Math.sin(normPhase * (Math.PI / 1.0)) * 0.32;
          } else {
            wave = 0.08 * Math.exp(-(normPhase - 1.0));
          }
        }

        const y = baseline - wave * (h - 32);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Spectral fill
      ctx.lineTo(w, baseline);
      ctx.lineTo(0, baseline);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, 0, 0, baseline);
      fillGrad.addColorStop(0, isDampened ? 'rgba(244, 63, 94, 0.35)' : 'rgba(56, 189, 248, 0.35)');
      fillGrad.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Legend in top-left
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(`TCD Velocity: ${activeInfo.velocity} cm/s`, 10, 16);
      ctx.fillStyle = isDampened ? '#fb7185' : '#38bdf8';
      ctx.fillText(`PI: ${activeInfo.pi} (${isDampened ? 'High Resistance' : 'Normal Waveform'})`, 10, 30);
    };

    renderTCD();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedVessel, strokeType, activeInfo.velocity, activeInfo.pi]);

  // -------------------------------------------------------------
  // Camera Preset Navigation Handler
  // -------------------------------------------------------------
  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case 'circle-of-willis':
        // View from inferior skull base looking straight up at Circle of Willis
        camera.position.set(0, -28, 4);
        controls.target.set(0, -3, 0);
        break;
      case 'left-sylvian':
        // Dominant Left Lateral profile (M1/M2 bifurcation & Broca/Wernicke)
        camera.position.set(-36, 6, 8);
        controls.target.set(-3, 1, 0);
        break;
      case 'right-sylvian':
        // Non-dominant Right Lateral profile (Spatial neglect)
        camera.position.set(36, 6, 8);
        controls.target.set(3, 1, 0);
        break;
      case 'aca':
        // Anterior frontal view focusing on ACA Pericallosal arch
        camera.position.set(0, 8, 38);
        controls.target.set(0, 3, 2);
        break;
      case 'pca':
        // Posterior occipital view focusing on PCA and cerebellum
        camera.position.set(0, 4, -40);
        controls.target.set(0, -2, -3);
        break;
      case 'default':
      default:
        // Classical 3/4 anterolateral clinical perspective
        camera.position.set(-18, 16, 38);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // -------------------------------------------------------------
  // Master Three.js 3D Vascular & Neuroanatomy Scene Engine
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || canvasHeight;

    // 1. Scene & Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(viewMode === 'dsa' ? '#030712' : '#ffffff');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(-18, 16, 38);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Smooth OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 14;
    controls.maxDistance = 85;
    controls.target.set(0, 0, 0);
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // 3. Clipping Plane for Axial CT Cross-Section
    // Y normal pointing down clips any geometry with Y > sliceLevel
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), sliceLevel);

    // 4. Photorealistic Biological Lighting Setup
    const ambientLight = new THREE.AmbientLight(
      viewMode === 'dsa' ? 0x0284c7 : 0xffffff,
      viewMode === 'dsa' ? 0.35 : 0.82
    );
    scene.add(ambientLight);

    // Key Light: Cool surgical cyan-tinted directional light
    const keyLight = new THREE.DirectionalLight(0x0284c7, viewMode === 'dsa' ? 1.8 : 1.25);
    keyLight.position.set(35, 45, 30);
    scene.add(keyLight);

    // Fill Light: Warm crimson/rose biological rim light
    const rimLight = new THREE.DirectionalLight(0xe11d48, viewMode === 'dsa' ? 0.8 : 0.65);
    rimLight.position.set(-35, -25, -25);
    scene.add(rimLight);

    // Specular Highlight Light
    const specLight = new THREE.DirectionalLight(0xffffff, 0.55);
    specLight.position.set(0, 40, -35);
    scene.add(specLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 5. Procedural Anatomical Brain Shells
    const cortexGroup = new THREE.Group();
    rootGroup.add(cortexGroup);

    const { diffuse, bump } = generateProceduralBrainTextures();

    // Tissue / Perfusion / Homunculus Cortical Material
    let cortexColor = 0xf4ece7;
    let cortexTransmission = 0.30;
    let cortexRoughness = 0.35;
    let cortexWireframe = false;

    if (viewMode === 'dsa') {
      cortexColor = 0x0f172a;
      cortexTransmission = 0.1;
      cortexRoughness = 0.8;
      cortexWireframe = true;
    } else if (viewMode === 'perfusion') {
      // Warm ischemic perfusion gradient base
      cortexColor = 0xfef3c7;
      cortexTransmission = 0.15;
      cortexRoughness = 0.45;
    }

    const brainMaterial = new THREE.MeshPhysicalMaterial({
      color: cortexColor,
      map: viewMode === 'tissue' ? diffuse : null,
      bumpMap: viewMode === 'tissue' ? bump : null,
      bumpScale: 0.18,
      roughness: cortexRoughness,
      metalness: 0.04,
      clearcoat: viewMode === 'dsa' ? 0 : 0.32,
      clearcoatRoughness: 0.25,
      transmission: cortexTransmission,
      thickness: 2.2,
      ior: 1.38,
      sheen: viewMode === 'dsa' ? 0 : 0.65,
      sheenColor: new THREE.Color(0xfca5a5),
      transparent: true,
      opacity: cortexOpacity,
      wireframe: cortexWireframe,
      clippingPlanes: [clipPlane],
      clipShadows: true
    });

    // Left Hemisphere (Dominant: Language & Right Motor)
    const leftHemisphereGeo = createHemisphereGeometry(true);
    const leftHemisphere = new THREE.Mesh(leftHemisphereGeo, brainMaterial);
    cortexGroup.add(leftHemisphere);

    // Right Hemisphere (Non-dominant: Spatial & Left Motor)
    const rightHemisphereGeo = createHemisphereGeometry(false);
    const rightHemisphere = new THREE.Mesh(rightHemisphereGeo, brainMaterial);
    cortexGroup.add(rightHemisphere);

    // Cerebellum with horizontal folia banding
    const cerebellumGeo = createCerebellumGeometry();
    const cerebellum = new THREE.Mesh(cerebellumGeo, brainMaterial);
    cortexGroup.add(cerebellum);

    // Brainstem with bulbous pons & basilar groove
    const brainstemGeo = createBrainstemGeometry();
    const brainstem = new THREE.Mesh(brainstemGeo, brainMaterial);
    cortexGroup.add(brainstem);

    // Deep Ventricles (revealed when sliced or translucent)
    const ventriclesGeo = createVentriclesGeometry();
    const ventriclesMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      transparent: true,
      opacity: Math.min(0.85, (1.0 - cortexOpacity) + 0.35),
      clippingPlanes: [clipPlane]
    });
    const leftVentricle = new THREE.Mesh(ventriclesGeo, ventriclesMat);
    cortexGroup.add(leftVentricle);

    const rightVentricle = new THREE.Mesh(ventriclesGeo, ventriclesMat);
    rightVentricle.scale.set(-1, 1, 1);
    cortexGroup.add(rightVentricle);

    // 6. Complete Circle of Willis & Arterial Tree
    const vesselGroup = new THREE.Group();
    rootGroup.add(vesselGroup);

    // Normal patent artery material
    const patentMat = new THREE.MeshStandardMaterial({
      color: viewMode === 'dsa' ? 0x38bdf8 : 0xef4444,
      emissive: viewMode === 'dsa' ? 0x0284c7 : 0xb91c1c,
      emissiveIntensity: viewMode === 'dsa' ? 0.95 : 0.65,
      roughness: 0.22,
      metalness: 0.15
    });

    // Occluded / Hypoperfused ischemic artery material
    const occludedMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      emissive: 0x1e293b,
      emissiveIntensity: 0.2,
      roughness: 0.65,
      transparent: true,
      opacity: 0.55
    });

    // Highlighted selected vessel material
    const selectedMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      roughness: 0.15
    });

    const segments = buildVascularNetwork();
    const vesselMeshes: THREE.Mesh[] = [];

    // Pre-calculate spline curves for particle flow
    const patentCurves: THREE.CatmullRomCurve3[] = [];

    segments.forEach((seg) => {
      const curve = new THREE.CatmullRomCurve3(seg.points);
      const geom = new THREE.TubeGeometry(curve, 32, seg.radius, 12, false);

      const isParentOccluded = strokeType === 'ischemic' && seg.parentVesselId === selectedVessel;
      const isCurrentlySelected = seg.parentVesselId === selectedVessel;

      let meshMat: THREE.Material = patentMat;
      if (isParentOccluded) {
        meshMat = occludedMat;
      } else if (isCurrentlySelected && viewMode !== 'dsa') {
        meshMat = selectedMat;
      }

      const mesh = new THREE.Mesh(geom, meshMat);
      mesh.userData = {
        segmentId: seg.id,
        parentVesselId: seg.parentVesselId,
        name: seg.name
      };

      vesselGroup.add(mesh);
      vesselMeshes.push(mesh);

      if (!isParentOccluded) {
        patentCurves.push(curve);
      }
    });

    // 7. Physiological Erythrocyte Flow Particles
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleCurves: { curve: THREE.CatmullRomCurve3; progress: number; speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const assignedCurve = patentCurves[i % patentCurves.length];
      const initialProgress = Math.random();
      const pt = assignedCurve.getPointAt(initialProgress);

      particlePositions[i * 3] = pt.x;
      particlePositions[i * 3 + 1] = pt.y;
      particlePositions[i * 3 + 2] = pt.z;

      particleCurves.push({
        curve: assignedCurve,
        progress: initialProgress,
        speed: 0.0035 + Math.random() * 0.0055
      });

      // Erythrocyte crimson in tissue mode, bright iodine cyan in DSA
      if (viewMode === 'dsa') {
        particleColors[i * 3] = 0.5;
        particleColors[i * 3 + 1] = 0.85;
        particleColors[i * 3 + 2] = 1.0;
      } else {
        particleColors[i * 3] = 0.98;
        particleColors[i * 3 + 1] = 0.22;
        particleColors[i * 3 + 2] = 0.25;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: viewMode === 'dsa' ? 0.6 : 0.42,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });

    const bloodStream = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(bloodStream);

    // 8. Pathology Visualization (Thrombus vs Hematoma & Penumbra)
    const pathologyGroup = new THREE.Group();
    rootGroup.add(pathologyGroup);

    let pathologyMesh: THREE.Mesh | null = null;
    let penumbraMesh: THREE.Mesh | null = null;
    let coreMesh: THREE.Mesh | null = null;

    if (strokeType === 'ischemic') {
      // A. Fibrin Thrombus (Clot in vessel lumen)
      const clotGeo = new THREE.DodecahedronGeometry(1.5, 2);
      const clotMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x1e1b4b,
        emissiveIntensity: 0.75,
        roughness: 0.9,
        metalness: 0.3
      });
      pathologyMesh = new THREE.Mesh(clotGeo, clotMat);
      pathologyMesh.position.copy(activeInfo.pathologyCoords);
      pathologyGroup.add(pathologyMesh);

      // B. Ischemic Infarct Core (Necrotic zone: CBF < 30%)
      const coreGeo = new THREE.SphereGeometry(3.2, 28, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x6b21a8,
        emissive: 0x581c87,
        emissiveIntensity: 0.8,
        roughness: 0.5,
        transparent: true,
        opacity: 0.82
      });
      coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(activeInfo.pathologyCoords);
      pathologyGroup.add(coreMesh);

      // C. Salvageable Ischemic Penumbra (At risk: Tmax > 6s)
      const penumbraGeo = new THREE.SphereGeometry(6.5, 32, 28);
      const penumbraMat = new THREE.MeshStandardMaterial({
        color: viewMode === 'perfusion' ? 0xf59e0b : 0x06b6d4,
        emissive: viewMode === 'perfusion' ? 0xd97706 : 0x0891b2,
        emissiveIntensity: 0.65,
        roughness: 0.3,
        transparent: true,
        opacity: 0.35,
        wireframe: viewMode === 'dsa'
      });
      penumbraMesh = new THREE.Mesh(penumbraGeo, penumbraMat);
      penumbraMesh.position.copy(activeInfo.pathologyCoords);
      pathologyGroup.add(penumbraMesh);
    } else {
      // Intracerebral Hematoma (Expanding Blood Mass with active extravasation fringe)
      const bleedGeo = new THREE.DodecahedronGeometry(3.8, 3);
      const bleedMat = new THREE.MeshStandardMaterial({
        color: 0x881337,
        emissive: 0xdc2626,
        emissiveIntensity: 0.9,
        roughness: 0.25,
        transparent: true,
        opacity: 0.92
      });
      pathologyMesh = new THREE.Mesh(bleedGeo, bleedMat);
      pathologyMesh.position.copy(activeInfo.pathologyCoords);
      pathologyGroup.add(pathologyMesh);

      // Vasogenic Edema Ring
      const edemaGeo = new THREE.SphereGeometry(6.8, 24, 20);
      const edemaMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.4,
        transparent: true,
        opacity: 0.3
      });
      const edemaMesh = new THREE.Mesh(edemaGeo, edemaMat);
      edemaMesh.position.copy(activeInfo.pathologyCoords);
      pathologyGroup.add(edemaMesh);
    }

    // 9. Interactive Raycasting for 3D Vessel Inspection & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(vesselMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const vesselName = hit.userData?.name || null;
        setHoveredVesselName(vesselName);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredVesselName(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(vesselMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const parentId = hit.userData?.parentVesselId as VesselId;
        if (parentId && parentId !== selectedVessel) {
          setSelectedVessel(parentId);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousemove', onPointerMove);
    domEl.addEventListener('mousedown', onPointerDown);

    // 10. Master Animation Loop
    let animFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Controls update for damping and auto-rotation
      controls.autoRotate = isRotating;
      controls.update();

      // Cardiac Systolic Pulse Wave (68 bpm)
      const cardiacCycle = Math.sin(elapsedTime * 6.5);
      const systolicSpike = Math.pow(Math.max(0, cardiacCycle), 2.5);
      const vesselPulse = 1.0 + systolicSpike * 0.045;
      vesselGroup.scale.set(vesselPulse, vesselPulse, vesselPulse);

      // Erythrocyte particles flow along patent 3D curves
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const pData = particleCurves[i];
        pData.progress += pData.speed;
        if (pData.progress >= 1.0) {
          pData.progress = 0.0;
        }
        const pt = pData.curve.getPointAt(pData.progress);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pathology marker pulsating warning rhythm
      if (pathologyMesh) {
        const pPulse = 1.0 + Math.sin(elapsedTime * 4.0) * 0.06;
        pathologyMesh.scale.set(pPulse, pPulse, pPulse);
      }
      if (penumbraMesh) {
        const penPulse = 1.0 + Math.sin(elapsedTime * 2.5) * 0.04;
        penumbraMesh.scale.set(penPulse, penPulse, penPulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling: read actual container size so CSS-driven height stays in sync
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || canvasHeight;
      if (!newW || !newH) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => onResize());
      resizeObserver.observe(container);
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      domEl.removeEventListener('mousemove', onPointerMove);
      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, [selectedVessel, strokeType, viewMode, isRotating, cortexOpacity, sliceLevel]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Swiss Bio-Clinical Master Control Banner */}
      <div className="glass-card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">
                <Brain size={13} /> High-Precision Neuroanatomy Engine
              </span>
              <span className={`badge ${strokeType === 'ischemic' ? 'badge-danger' : 'badge-warning'}`}>
                {strokeType === 'ischemic' ? 'Acute Large Vessel Occlusion (LVO)' : 'Intracranial Hemorrhagic Mass'}
              </span>
              <span className="badge badge-success">
                Circle of Willis Real-Time Hemodynamics
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              3D Interactive Neurovascular &amp; Cortical Stroke Explorer
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '840px', fontSize: '14.5px', lineHeight: 1.55 }}>
              Explore the human brain in true 3D anatomical fidelity with biologically sculpted gyri and sulci, arborized arterial trees, and real-time hemodynamic flow. Slicing through the axial CT plane reveals the ventricles and deep occlusion sites.
            </p>
          </div>

          {/* Stroke Pathology Selector Toggle */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: 'var(--bg-raised)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)'
          }}>
            <button
              onClick={() => setStrokeType('ischemic')}
              className={`btn btn-sm ${strokeType === 'ischemic' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Zap size={14} /> Ischemic Thrombus (87%)
            </button>
            <button
              onClick={() => setStrokeType('hemorrhagic')}
              className={`btn btn-sm ${strokeType === 'hemorrhagic' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Flame size={14} /> Intracerebral Bleed (13%)
            </button>
          </div>
        </div>

        {/* Vessel Territory Selection Pill Switchboard */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
          {(Object.keys(CLINICAL_VESSEL_DATA) as VesselId[]).map((vKey) => (
            <button
              key={vKey}
              onClick={() => setSelectedVessel(vKey)}
              className={`btn ${selectedVessel === vKey ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '12.5px', padding: '8px 16px' }}
            >
              {CLINICAL_VESSEL_DATA[vKey](strokeType).name}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Viewport Station & Diagnostic Intelligence Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isTabletPortrait ? '1fr' : 'minmax(480px, 1.5fr) minmax(340px, 1fr)',
        gap: isTabletPortrait ? '16px' : '24px'
      }}>
        {/* 3D Viewport Station Card */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Viewport Top Header & Mode Switcher */}
          <div style={{
            padding: '12px 20px',
            backgroundColor: viewMode === 'dsa' ? '#090d16' : '#ffffff',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="pulse-active" style={{ backgroundColor: strokeType === 'ischemic' ? '#0891b2' : '#e11d48' }}></span>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: viewMode === 'dsa' ? '#38bdf8' : 'var(--text-primary)' }}>
                  {activeInfo.fullName}
                </span>
                {hoveredVesselName && (
                  <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
                    Hover: {hoveredVesselName} (Click to inspect)
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Mode Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setViewMode('tissue')}
                className={`btn btn-sm ${viewMode === 'tissue' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '5px 10px' }}
                title="Biological Tissue Mode with realistic gyri, sulci, and subsurface scattering"
              >
                <Brain size={13} /> Tissue
              </button>

              <button
                onClick={() => setViewMode('dsa')}
                className={`btn btn-sm ${viewMode === 'dsa' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '5px 10px' }}
                title="Digital Subtraction Angiography (Fluoroscopic high contrast)"
              >
                <Layers size={13} /> DSA Angio
              </button>

              <button
                onClick={() => setViewMode('perfusion')}
                className={`btn btn-sm ${viewMode === 'perfusion' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '5px 10px' }}
                title="CT Perfusion Mismatch (RAPID CT Core vs Penumbra heatmap)"
              >
                <Sparkles size={13} /> Perfusion
              </button>
            </div>
          </div>

          {/* Secondary Sub-Controls Bar: Camera Presets & Slicing */}
          <div style={{
            padding: '8px 20px',
            backgroundColor: viewMode === 'dsa' ? '#0d131f' : 'var(--bg-raised)',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '12px'
          }}>
            {/* Camera Presets Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Compass size={12} /> View:
              </span>
              <button
                onClick={() => applyCameraPreset('default')}
                className={`btn btn-sm ${cameraPreset === 'default' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '9px 10px', minHeight: '36px' }}
              >
                Default
              </button>
              <button
                onClick={() => applyCameraPreset('circle-of-willis')}
                className={`btn btn-sm ${cameraPreset === 'circle-of-willis' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '9px 10px', minHeight: '36px' }}
              >
                Circle of Willis
              </button>
              <button
                onClick={() => applyCameraPreset('left-sylvian')}
                className={`btn btn-sm ${cameraPreset === 'left-sylvian' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '9px 10px', minHeight: '36px' }}
              >
                Left MCA
              </button>
              <button
                onClick={() => applyCameraPreset('right-sylvian')}
                className={`btn btn-sm ${cameraPreset === 'right-sylvian' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '9px 10px', minHeight: '36px' }}
              >
                Right MCA
              </button>
              <button
                onClick={() => applyCameraPreset('aca')}
                className={`btn btn-sm ${cameraPreset === 'aca' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '9px 10px', minHeight: '36px' }}
              >
                ACA
              </button>
              <button
                onClick={() => applyCameraPreset('pca')}
                className={`btn btn-sm ${cameraPreset === 'pca' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '9px 10px', minHeight: '36px' }}
              >
                PCA
              </button>
            </div>

            {/* Orbit Auto-Rotation Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '11.5px', padding: '9px 10px', minHeight: '36px' }}
            >
              <RotateCcw size={12} /> {isRotating ? 'Pause Orbit' : 'Auto Rotate'}
            </button>
          </div>

          {/* Three.js 3D Canvas Mount */}
          <div
            ref={mountRef}
            style={{
              width: '100%',
              height: `${canvasHeight}px`,
              position: 'relative',
              cursor: 'grab',
              backgroundColor: viewMode === 'dsa' ? '#030712' : '#ffffff'
            }}
          />

          {/* Bottom Interactive Sliders: Cortex Opacity & Axial CT Slicing */}
          <div style={{
            padding: '14px 20px',
            backgroundColor: viewMode === 'dsa' ? '#090d16' : 'var(--bg-raised)',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Cortex Transparency Slider */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 160px' }}>
              <Eye size={14} color="var(--text-muted)" />
              <label htmlFor={cortexSliderId} style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-body)', whiteSpace: 'nowrap' }}>
                Cortex Shell: {Math.round(cortexOpacity * 100)}%
              </label>
              <input
                id={cortexSliderId}
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={cortexOpacity}
                onChange={(e) => setCortexOpacity(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--blue-600)', cursor: 'pointer' }}
              />
            </div>

            {/* Axial CT Slicing Plane Slider */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 160px' }}>
              <Scissors size={14} color="var(--text-muted)" />
              <label htmlFor={sliceSliderId} style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-body)', whiteSpace: 'nowrap' }}>
                Axial Slice: {sliceLevel < 14 ? `${sliceLevel.toFixed(1)} cm` : 'Full Brain'}
              </label>
              <input
                id={sliceSliderId}
                type="range"
                min="-6"
                max="14"
                step="0.5"
                value={sliceLevel}
                onChange={(e) => setSliceLevel(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--rose-600)', cursor: 'pointer' }}
              />
            </div>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {showTouchHint ? 'Drag to rotate - Pinch to zoom - Tap a vessel to inspect' : 'Drag mouse to orbit 360° • Scroll to zoom'}
            </span>
          </div>
        </div>

        {/* Clinical Neurologic Telemetry & Diagnostics Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Transcranial Doppler (TCD) Spectrogram Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="var(--blue-600)" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Transcranial Doppler Spectrogram (TCD)
                </span>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                Live 2.0 MHz Pulse Wave
              </span>
            </div>

            {/* Doppler Live Canvas */}
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #1e293b', marginBottom: '14px' }}>
              <canvas
                ref={tcdCanvasRef}
                width={360}
                height={110}
                style={{ width: '100%', height: '110px', display: 'block' }}
              />
            </div>

            {/* Doppler Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-raised)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Mean Flow Velocity</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {activeInfo.velocity} cm/s
                </div>
                <span style={{ fontSize: '11px', color: activeInfo.velocity < 20 ? '#be123c' : '#15803d', fontWeight: 600 }}>
                  {activeInfo.velocity < 20 ? 'Critical Stasis (< 20)' : 'Patent Flow (60-80)'}
                </span>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-raised)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Pulsatility Index (PI)</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {activeInfo.pi}
                </div>
                <span style={{ fontSize: '11px', color: activeInfo.pi > 1.2 ? '#b45309' : '#15803d', fontWeight: 600 }}>
                  {activeInfo.pi > 1.2 ? 'Elevated Resistance' : 'Normal Waveform'}
                </span>
              </div>
            </div>

            {/* Angiographic TICI Recanalization Status */}
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
                Angiographic Perfusion:
              </span>
              <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {activeInfo.ticiScore}
              </span>
            </div>
          </div>

          {/* Clinical Syndrome & Homunculus Localization Card */}
          <div className="glass-card" style={{ padding: '22px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Crosshair size={16} color="var(--rose-600)" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Clinical Deficit Correlation
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.45 }}>
              <strong>Territory:</strong> {activeInfo.territory}
            </p>

            {/* Homunculus Localization Box */}
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#ecfeff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #a5f3fc',
              marginBottom: '14px'
            }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0e7490', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Cortical Homunculus Mapping
              </span>
              <p style={{ fontSize: '12.5px', color: '#155e75', fontWeight: 600, marginTop: '2px', lineHeight: 1.4 }}>
                {activeInfo.homunculus}
              </p>
            </div>

            {/* RAPID CT Salvageable Penumbra Telemetry */}
            {strokeType === 'ischemic' && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#fef3c7',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #fde68a',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700 }}>
                  <span style={{ color: '#92400e' }}>Salvageable Penumbra:</span>
                  <span style={{ color: '#b45309', fontFamily: 'var(--font-mono)' }}>{activeInfo.penumbraVolume}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700 }}>
                  <span style={{ color: '#92400e' }}>Irreversible Infarct Core:</span>
                  <span style={{ color: '#6b21a8', fontFamily: 'var(--font-mono)' }}>{activeInfo.coreVolume}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#78350f', fontWeight: 600, marginTop: '2px' }}>
                  {activeInfo.salvageWindow}
                </div>
              </div>
            )}

            {/* Cardinal Neurological Signs Checklist */}
            <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Cardinal Neurological Signs:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {activeInfo.symptoms.map((symptom, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#e11d48',
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <span style={{ color: 'var(--text-body)', lineHeight: 1.45 }}>{symptom}</span>
                </div>
              ))}
            </div>

            {/* Brodmann Area Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
              {activeInfo.brodmannAreas.map((area, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-raised)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Anatomical Reference Angiography Banner */}
      <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <AlertCircle size={22} color="var(--blue-600)" />
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Saver JL "Time is Brain" Golden Hour Mandate
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              During acute large vessel occlusion, the ischemic brain loses <strong>1.9 million neurons</strong>, <strong>14 billion synapses</strong>, and <strong>12 km of myelinated axons</strong> every single minute without recanalization.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-danger" style={{ fontSize: '12px', padding: '6px 12px' }}>
            -1.9M Neurons / Min
          </span>
          <span className="badge badge-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
            AHA/ASA 2026 Guidelines
          </span>
        </div>
      </div>
    </div>
  );
};
