import * as THREE from 'three';

/**
 * Procedural Human Neuroanatomy Generator
 * Generates biologically realistic cerebral hemispheres (with anatomical lobes,
 * Sylvian fissure, longitudinal fissure, and serpentine gyri/sulci convolutions),
 * horizontal-foliated cerebellum, and pontomedullary brainstem.
 */

export interface BrainTextures {
  diffuse: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

/**
 * Creates high-resolution procedural brain textures (diffuse & bump/normal)
 * with realistic gyri crevice shading and microvascular capillary reticulation.
 */
export function generateProceduralBrainTextures(): BrainTextures {
  const size = 1024;
  
  // 1. Diffuse Canvas (Biological cortical tissue)
  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = size;
  diffuseCanvas.height = size;
  const ctx = diffuseCanvas.getContext('2d');

  if (ctx) {
    // Base cerebral tissue tone: warm ivory/pearl with delicate vascular warmth
    const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.7);
    grad.addColorStop(0, '#fbf6f3');
    grad.addColorStop(0.5, '#f4ece7');
    grad.addColorStop(1, '#ebdcd5');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Microvascular capillary mesh (fine reddish/pinkish micro-arterioles)
    ctx.lineWidth = 1.0;
    for (let i = 0; i < 90; i++) {
      ctx.strokeStyle = `rgba(225, 29, 72, ${0.04 + Math.random() * 0.08})`;
      ctx.beginPath();
      let cx = Math.random() * size;
      let cy = Math.random() * size;
      ctx.moveTo(cx, cy);
      for (let s = 0; s < 6; s++) {
        cx += (Math.random() - 0.5) * 80;
        cy += (Math.random() - 0.5) * 80;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Sulcal crevice soft shading (depth in folding fissures)
    for (let i = 0; i < 60; i++) {
      ctx.strokeStyle = `rgba(148, 120, 110, ${0.05 + Math.random() * 0.09})`;
      ctx.lineWidth = 2 + Math.random() * 4;
      ctx.beginPath();
      let sx = Math.random() * size;
      let sy = Math.random() * size;
      ctx.moveTo(sx, sy);
      for (let s = 0; s < 8; s++) {
        sx += Math.sin(s * 0.8) * 35 + (Math.random() - 0.5) * 20;
        sy += Math.cos(s * 0.8) * 35 + (Math.random() - 0.5) * 20;
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
  }

  // 2. Bump / Height Canvas (Micro-ridges for light reflection)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  if (bCtx) {
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    for (let i = 0; i < 140; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 20 + Math.random() * 60;
      const bGrad = bCtx.createRadialGradient(x, y, 0, x, y, r);
      bGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      bGrad.addColorStop(0.5, 'rgba(180, 180, 180, 0.10)');
      bGrad.addColorStop(1, 'rgba(128, 128, 128, 0)');
      bCtx.fillStyle = bGrad;
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.fill();
    }
  }

  const diffuse = new THREE.CanvasTexture(diffuseCanvas);
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;

  return { diffuse, bump };
}

/**
 * Creates an anatomically deformed cerebral hemisphere with:
 * - Longitudinal fissure medial wall flattening
 * - Frontal, Temporal, Parietal, and Occipital lobe shaping
 * - Sylvian fissure (lateral sulcus) deep cleft
 * - Harmonic gyri & sulci serpentine convolutions
 */
export function createHemisphereGeometry(isLeft = true): THREE.BufferGeometry {
  const widthSegments = 96;
  const heightSegments = 72;
  const geo = new THREE.SphereGeometry(1, widthSegments, heightSegments);
  const posAttr = geo.attributes.position;
  const vertex = new THREE.Vector3();
  const normal = new THREE.Vector3();

  // True anatomical proportions of human adult cerebral hemisphere
  const scaleX = 4.8;
  const scaleY = 7.2;
  const scaleZ = 10.5;

  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);
    normal.copy(vertex).normalize();

    let x = vertex.x;
    let y = vertex.y;
    let z = vertex.z;

    // 1. Hemispheric Medial Flattening (Longitudinal Fissure / Falx Cerebri)
    const medialSign = isLeft ? 1 : -1;
    const medialCoord = x * medialSign;
    if (medialCoord > 0.05) {
      const flattenFactor = Math.pow(Math.min(1.0, (medialCoord - 0.05) / 0.4), 1.5);
      x -= medialSign * flattenFactor * (medialCoord - 0.05) * 0.75;
    }

    // 2. Lobar Morphogenesis
    // Frontal Pole (z > 0.3): rounded anterior dome with inferior subfrontal slope
    if (z > 0.3) {
      const fTaper = (z - 0.3) / 0.7;
      x *= (1.0 - fTaper * 0.15);
      if (y < -0.1) {
        y += fTaper * (-0.1 - y) * 0.45;
      }
    }

    // Temporal Lobe & Temporal Pole (y < 0, z between -0.25 and 0.45, lateral side)
    const lateralCoord = isLeft ? -x : x;
    if (y < 0.1 && z > -0.25 && z < 0.45 && lateralCoord > 0.1) {
      const tWeight = Math.exp(-Math.pow((y + 0.3) / 0.35, 2)) * Math.exp(-Math.pow((z - 0.1) / 0.35, 2));
      y -= tWeight * 0.22;
      x += (isLeft ? -1 : 1) * tWeight * 0.25;
      z += tWeight * 0.15;
    }

    // Sylvian Fissure (Lateral Sulcus): deep anatomical cleft
    if (lateralCoord > 0.15 && z > -0.4 && z < 0.35) {
      const sylvianY = 0.02 - z * 0.15;
      const sylvianDist = Math.abs(y - sylvianY);
      const sylvianWeight = Math.exp(-Math.pow(sylvianDist / 0.14, 2)) * Math.exp(-Math.pow(z / 0.45, 2));
      x += (isLeft ? 1 : -1) * sylvianWeight * 0.28 * Math.min(1.0, lateralCoord * 1.5);
      y += (y > sylvianY ? -1 : 1) * sylvianWeight * 0.08;
    }

    // Occipital Pole (z < -0.2): posterior narrowing toward tentorium cerebelli
    if (z < -0.2) {
      const oTaper = (-0.2 - z) / 0.8;
      x *= (1.0 - oTaper * 0.32);
      y -= oTaper * 0.22;
    }

    // Parietal & Vertex Dome (y > 0.2): superior convexity
    if (y > 0.2) {
      const pDome = Math.exp(-Math.pow((y - 0.7) / 0.5, 2)) * Math.exp(-Math.pow(z / 0.5, 2));
      y += pDome * 0.12;
    }

    // 3. Anatomical Gyri & Sulci (Serpentine Cortical Convolutions)
    const sx = x * 2.8 + Math.sin(y * 3.2) * 0.6;
    const sy = y * 2.8 + Math.cos(z * 3.0) * 0.6;
    const sz = z * 2.8 + Math.sin(x * 3.1) * 0.6;

    // Harmonic gyral ridges
    const g1 = Math.sin(sx * 2.6 + Math.cos(sy * 2.2) * 1.8);
    const g2 = Math.cos(sz * 2.5 + Math.sin(sx * 2.0) * 1.7);
    const g3 = Math.sin(sy * 3.0 + Math.cos(sz * 2.8) * 1.6);
    const primaryGyri = (g1 * g2 + g3 * 0.45) * 0.085;

    // Secondary sulcal crevices
    const s1 = Math.sin(x * 8.5 + Math.sin(y * 7.5)) * Math.cos(z * 8.0);
    const secondarySulci = s1 * 0.025;

    // Dampen convolutions on the medial wall (falx cerebri)
    const isMedial = medialCoord > 0.1;
    const medialDamp = isMedial ? Math.max(0.08, 1.0 - (medialCoord - 0.1) * 3.0) : 1.0;
    const totalGyrus = (primaryGyri + secondarySulci) * medialDamp;

    // Displace vertex along surface normal
    x += normal.x * totalGyrus;
    y += normal.y * totalGyrus;
    z += normal.z * totalGyrus;

    // Scale and position in anatomical space
    vertex.set(
      x * scaleX + (isLeft ? -2.4 : 2.4),
      y * scaleY + 3.0,
      z * scaleZ
    );

    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

/**
 * Creates cerebellar hemispheres with horizontal transverse folia banding
 * and midline vermis cleft.
 */
export function createCerebellumGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 64, 48);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    let x = v.x;
    let y = v.y;
    let z = v.z;

    // Bilateral cerebellar lobes with midline vermis indention
    const vermisDepth = Math.exp(-Math.pow(x / 0.25, 2)) * 0.25;
    z -= vermisDepth;

    // Flatten superior tentorial surface
    if (y > 0.2) {
      y = 0.2 + (y - 0.2) * 0.4;
    }

    // Cerebellar Folia (horizontal laminations)
    const folia = Math.sin(y * 22.0 + Math.cos(x * 4.0) * 0.5) * 0.045;
    const microFolia = Math.sin(y * 44.0) * 0.015;
    const disp = folia + microFolia;

    x += v.x * disp;
    y += v.y * disp;
    z += v.z * disp;

    // Scale and position below occipital lobes
    v.set(
      x * 5.8,
      y * 3.2 - 5.4,
      z * 4.2 - 6.5
    );
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

/**
 * Creates pontomedullary brainstem with bulbous pons, median basilar sulcus,
 * and tapering medulla oblongata.
 */
export function createBrainstemGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(1.4, 0.95, 10, 36, 48);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    let x = v.x;
    let y = v.y;
    let z = v.z;

    // Bulbous Pons protrusion with median basilar sulcus
    if (y > -1.5 && y < 2.0) {
      const ponsWeight = Math.exp(-Math.pow((y - 0.2) / 1.1, 2));
      if (z > 0) {
        z += ponsWeight * 1.15;
        // Ventral median sulcus for the basilar artery
        const sulcus = Math.exp(-Math.pow(x / 0.35, 2)) * 0.38;
        z -= ponsWeight * sulcus;
      }
      x += (x > 0 ? 1 : -1) * ponsWeight * 0.35;
    }

    // Medulla tapering down to foramen magnum
    if (y < -1.5) {
      const mWeight = (-1.5 - y) / 3.5;
      x *= (1.0 - mWeight * 0.2);
      z *= (1.0 - mWeight * 0.2);
    }

    v.set(x * 1.3, y * 1.1 - 7.2, z * 1.3 - 2.8);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

/**
 * Creates deep internal C-shaped lateral ventricles
 * visible during cross-section slicing or translucent exploration.
 */
export function createVentriclesGeometry(): THREE.BufferGeometry {
  // C-shaped curved tube representing lateral ventricles
  const points: THREE.Vector3[] = [
    new THREE.Vector3(-1.2, 1.5, 4.0),   // Anterior frontal horn
    new THREE.Vector3(-1.4, 3.5, 1.5),   // Body of lateral ventricle
    new THREE.Vector3(-1.6, 3.0, -2.5),  // Atrium / trigone
    new THREE.Vector3(-1.8, 2.0, -5.5),  // Posterior occipital horn
    new THREE.Vector3(-2.8, -0.5, -2.0), // Inferior temporal horn
    new THREE.Vector3(-2.2, -1.2, 1.2),  // Amygdaloid tip
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, 48, 0.65, 12, false);
}
