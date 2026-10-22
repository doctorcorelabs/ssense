import * as THREE from 'three';

export type VesselId = 'mca-left' | 'mca-right' | 'aca' | 'pca' | 'basilar';
export type StrokeType = 'ischemic' | 'hemorrhagic';

export interface VesselSegment {
  id: string;
  name: string;
  parentVesselId: VesselId;
  points: THREE.Vector3[];
  radius: number;
  isTerminal?: boolean;
}

export interface VesselInfo {
  name: string;
  fullName: string;
  territory: string;
  velocity: number; // cm/s
  pi: number; // Pulsatility Index
  ticiScore: string;
  penumbraVolume: string;
  coreVolume: string;
  mismatchRatio: string;
  salvageWindow: string;
  pathologyCoords: THREE.Vector3;
  symptoms: string[];
  homunculus: string;
  brodmannAreas: string[];
}

export const CLINICAL_VESSEL_DATA: Record<VesselId, (type: StrokeType) => VesselInfo> = {
  'mca-left': (type) => ({
    name: 'Left MCA (Dominant)',
    fullName: 'Left Middle Cerebral Artery (M1 Trunk / M2 Opercular Bifurcation)',
    territory: 'Dominant lateral frontal, temporal, and parietal cortices (Broca & Wernicke areas)',
    velocity: type === 'ischemic' ? 12 : 78,
    pi: type === 'ischemic' ? 1.88 : 0.86,
    ticiScore: type === 'ischemic' ? 'TICI 0 (Complete LVO)' : 'TICI 3 (Patent Perfusion)',
    penumbraVolume: '84 mL at risk',
    coreVolume: '18 mL irreversible infarct',
    mismatchRatio: '4.6 : 1 (Highly Salvageable)',
    salvageWindow: 'Golden Window: 2h 45m remaining for EVT thrombectomy',
    pathologyCoords: new THREE.Vector3(-6.2, 0.5, 1.6),
    symptoms: [
      'Global or Broca / Wernicke Aphasia (severe language impairment)',
      'Dense right-sided hemiplegia and facial droop (arm/hand > leg)',
      'Right homonymous hemianopia with leftward conjugate eye gaze deviation',
      'Right hemi-sensory neglect and tactile extinction'
    ],
    homunculus: 'Face & Arm Primary Motor/Sensory Strip (Precentral & Postcentral Gyri)',
    brodmannAreas: ['Area 4 (Motor)', 'Area 44/45 (Broca)', 'Area 22 (Wernicke)', 'Area 3,1,2 (Sensory)']
  }),

  'mca-right': (type) => ({
    name: 'Right MCA (Non-Dominant)',
    fullName: 'Right Middle Cerebral Artery (M1 Sphenoidal / M2 Sylvian Divisions)',
    territory: 'Non-dominant fronto-temporo-parietal cortex & visuospatial mapping network',
    velocity: type === 'ischemic' ? 14 : 76,
    pi: type === 'ischemic' ? 1.76 : 0.84,
    ticiScore: type === 'ischemic' ? 'TICI 0 (Sphenoidal Occlusion)' : 'TICI 3 (Normal Flow)',
    penumbraVolume: '76 mL at risk',
    coreVolume: '16 mL irreversible infarct',
    mismatchRatio: '4.75 : 1 (Favorable Mismatch)',
    salvageWindow: 'Eligible for Mechanical Thrombectomy (DAWN / DEFUSE 3)',
    pathologyCoords: new THREE.Vector3(6.2, 0.5, 1.6),
    symptoms: [
      'Profound Left Hemi-Spatial Neglect (unawareness of left visual/physical space)',
      'Anosognosia (unawareness/denial of severe hemiplegic paralysis)',
      'Dense left-sided hemiplegia and facial paralysis (arm > leg)',
      'Constructional apraxia, aprosodia, and left visual field hemianopia'
    ],
    homunculus: 'Contralateral Face/Arm representation & parietal spatial coordinate matrix',
    brodmannAreas: ['Area 4 (Motor Strip)', 'Area 39/40 (Angular & Supramarginal Gyri)', 'Area 3,1,2']
  }),

  'aca': (type) => ({
    name: 'Anterior Cerebral Artery (ACA)',
    fullName: 'Anterior Cerebral Artery (A1 Trunk / A2 Pericallosal Curve)',
    territory: 'Medial surfaces of frontal and parietal lobes, anterior corpus callosum, paracentral lobule',
    velocity: type === 'ischemic' ? 10 : 64,
    pi: type === 'ischemic' ? 1.65 : 0.82,
    ticiScore: type === 'ischemic' ? 'TICI 0 (A1/A2 Thrombus)' : 'TICI 3 (Normal)',
    penumbraVolume: '44 mL at risk',
    coreVolume: '11 mL irreversible infarct',
    mismatchRatio: '4.0 : 1 (Salvageable)',
    salvageWindow: 'IV-rtPA thrombolysis indicated within 4.5 hours',
    pathologyCoords: new THREE.Vector3(-0.3, 4.2, 4.6),
    symptoms: [
      'Contralateral lower-limb hemiparesis (leg >> arm/face weakness)',
      'Abulia, profound apathy, psychomotor slowing, and transcortical motor mutism',
      'Loss of voluntary urinary sphincter control (frontal micturition center)',
      'Alien Hand Syndrome (uncontrolled purposeful contralateral arm behavior)'
    ],
    homunculus: 'Paracentral Lobule: Medial Homunculus Motor & Sensory representation of Leg, Foot, & Genitalia',
    brodmannAreas: ['Area 4 (Medial Leg Area)', 'Area 6 (Supplementary Motor)', 'Area 24 (Anterior Cingulate)']
  }),

  'pca': (type) => ({
    name: 'Posterior Cerebral Artery (PCA)',
    fullName: 'Posterior Cerebral Artery (P1 Pre-communicating / P2 Calcarine Segment)',
    territory: 'Occipital lobe, inferomedial temporal lobe, calcarine visual cortex, posterior thalamus',
    velocity: type === 'ischemic' ? 15 : 55,
    pi: type === 'ischemic' ? 1.55 : 0.80,
    ticiScore: type === 'ischemic' ? 'TICI 1 (Minimal Flow)' : 'TICI 3 (Normal)',
    penumbraVolume: '52 mL at risk',
    coreVolume: '14 mL irreversible infarct',
    mismatchRatio: '3.7 : 1 (Favorable)',
    salvageWindow: 'Targeted intra-arterial or systemic thrombolysis',
    pathologyCoords: new THREE.Vector3(-5.2, -1.0, -5.5),
    symptoms: [
      'Contralateral homonymous hemianopia (often with macular sparing)',
      'Alexia without agraphia (can write fluent language, but unable to read written words)',
      'Visual agnosia and prosopagnosia (inability to recognize familiar human faces)',
      'Dejerine-Roussy Syndrome (thalamic intractable chronic burning neuropathic pain)'
    ],
    homunculus: 'Primary Visual Cortex (Striate Cortex) & Thalamic sensory relay nuclei (VPL/VPM)',
    brodmannAreas: ['Area 17 (Primary Visual V1)', 'Area 18/19 (Visual Association)', 'Area 37 (Fusiform Gyrus)']
  }),

  'basilar': (type) => ({
    name: 'Basilar Artery Trunk',
    fullName: 'Vertebrobasilar Junction & Basilar Artery Apex',
    territory: 'Ventral pons, midbrain, medulla, cerebellum, ascending reticular activating system (ARAS)',
    velocity: type === 'ischemic' ? 8 : 58,
    pi: type === 'ischemic' ? 2.15 : 0.88,
    ticiScore: type === 'ischemic' ? 'TICI 0 (Catastrophic LVO)' : 'TICI 3 (Normal)',
    penumbraVolume: '96 mL (Brainstem Critical)',
    coreVolume: '22 mL brainstem infarct',
    mismatchRatio: '4.3 : 1 (Critical Emergency)',
    salvageWindow: 'Extended window up to 24h for emergent basilar artery recanalization',
    pathologyCoords: new THREE.Vector3(0, -4.2, -2.2),
    symptoms: [
      'Locked-In Syndrome (quadriplegia & anarthria with preserved vertical eye movements)',
      'The 4 D\'s: Dizziness (vertigo), Diplopia, Dysarthria, and Dysphagia',
      'Crossed neurological signs (ipsilateral cranial nerve palsy + contralateral body weakness)',
      'Coma, pinpoint pupils, decerebrate posturing, and sudden central respiratory arrest'
    ],
    homunculus: 'Bilateral descending corticospinal tracts & cranial nerve nuclei III through XII',
    brodmannAreas: ['Brainstem Tegmentum', 'Pontine Nuclei', 'Reticular Activating System']
  })
};

/**
 * Builds the complete anatomical 3D vascular network including the Circle of Willis,
 * bilateral Internal Carotid Arteries, Vertebrobasilar axis, and distal cortical arborizations.
 */
export function buildVascularNetwork(): VesselSegment[] {
  const segments: VesselSegment[] = [];

  // 1. Vertebrobasilar System
  // Left Vertebral (V4)
  segments.push({
    id: 'va-left',
    name: 'Left Vertebral Artery (V4)',
    parentVesselId: 'basilar',
    points: [
      new THREE.Vector3(-2.2, -12.0, -3.8),
      new THREE.Vector3(-1.6, -9.8, -3.2),
      new THREE.Vector3(-0.3, -7.5, -2.8),
    ],
    radius: 0.55
  });

  // Right Vertebral (V4)
  segments.push({
    id: 'va-right',
    name: 'Right Vertebral Artery (V4)',
    parentVesselId: 'basilar',
    points: [
      new THREE.Vector3(2.2, -12.0, -3.8),
      new THREE.Vector3(1.6, -9.8, -3.2),
      new THREE.Vector3(0.3, -7.5, -2.8),
    ],
    radius: 0.55
  });

  // Basilar Artery Trunk
  segments.push({
    id: 'ba-trunk',
    name: 'Basilar Artery Trunk',
    parentVesselId: 'basilar',
    points: [
      new THREE.Vector3(0, -7.5, -2.8),
      new THREE.Vector3(0, -5.5, -2.4),
      new THREE.Vector3(0, -3.6, -2.0),
      new THREE.Vector3(0, -1.8, -1.5),
    ],
    radius: 0.72
  });

  // Left PICA
  segments.push({
    id: 'pica-left',
    name: 'Left PICA',
    parentVesselId: 'basilar',
    points: [
      new THREE.Vector3(-1.6, -9.8, -3.2),
      new THREE.Vector3(-3.2, -9.2, -5.2),
      new THREE.Vector3(-4.5, -8.2, -8.0),
    ],
    radius: 0.32,
    isTerminal: true
  });

  // Right PICA
  segments.push({
    id: 'pica-right',
    name: 'Right PICA',
    parentVesselId: 'basilar',
    points: [
      new THREE.Vector3(1.6, -9.8, -3.2),
      new THREE.Vector3(3.2, -9.2, -5.2),
      new THREE.Vector3(4.5, -8.2, -8.0),
    ],
    radius: 0.32,
    isTerminal: true
  });

  // Left SCA
  segments.push({
    id: 'sca-left',
    name: 'Left Superior Cerebellar Artery',
    parentVesselId: 'basilar',
    points: [
      new THREE.Vector3(0, -2.2, -1.6),
      new THREE.Vector3(-3.2, -2.6, -3.6),
      new THREE.Vector3(-5.2, -3.6, -6.2),
    ],
    radius: 0.35,
    isTerminal: true
  });

  // Right SCA
  segments.push({
    id: 'sca-right',
    name: 'Right Superior Cerebellar Artery',
    parentVesselId: 'basilar',
    points: [
      new THREE.Vector3(0, -2.2, -1.6),
      new THREE.Vector3(3.2, -2.6, -3.6),
      new THREE.Vector3(5.2, -3.6, -6.2),
    ],
    radius: 0.35,
    isTerminal: true
  });

  // 2. Posterior Cerebral Arteries (PCA)
  // Left PCA P1 & P2
  segments.push({
    id: 'pca-left-p1',
    name: 'Left PCA (P1 & P2 Calcarine)',
    parentVesselId: 'pca',
    points: [
      new THREE.Vector3(0, -1.8, -1.5),
      new THREE.Vector3(-1.8, -1.6, -1.8),
      new THREE.Vector3(-3.4, -1.4, -2.8),
      new THREE.Vector3(-5.2, -1.0, -5.5),
      new THREE.Vector3(-6.5, -0.2, -8.2),
      new THREE.Vector3(-5.6, 1.8, -10.2),
    ],
    radius: 0.52
  });

  // Right PCA P1 & P2
  segments.push({
    id: 'pca-right-p1',
    name: 'Right PCA (P1 & P2 Calcarine)',
    parentVesselId: 'pca',
    points: [
      new THREE.Vector3(0, -1.8, -1.5),
      new THREE.Vector3(1.8, -1.6, -1.8),
      new THREE.Vector3(3.4, -1.4, -2.8),
      new THREE.Vector3(5.2, -1.0, -5.5),
      new THREE.Vector3(6.5, -0.2, -8.2),
      new THREE.Vector3(5.6, 1.8, -10.2),
    ],
    radius: 0.52
  });

  // 3. Internal Carotid Arteries (ICA) & Circle of Willis Communicating Arteries
  // Left ICA
  segments.push({
    id: 'ica-left',
    name: 'Left Internal Carotid Artery (Cervical / Cavernous Siphon)',
    parentVesselId: 'mca-left',
    points: [
      new THREE.Vector3(-2.8, -10.5, -0.5),
      new THREE.Vector3(-2.6, -6.0, 0.2),
      new THREE.Vector3(-2.6, -3.2, 0.8),
      new THREE.Vector3(-2.2, -1.8, 1.4),
      new THREE.Vector3(-2.4, -0.8, 1.1),
    ],
    radius: 0.68
  });

  // Right ICA
  segments.push({
    id: 'ica-right',
    name: 'Right Internal Carotid Artery (Cervical / Cavernous Siphon)',
    parentVesselId: 'mca-right',
    points: [
      new THREE.Vector3(2.8, -10.5, -0.5),
      new THREE.Vector3(2.6, -6.0, 0.2),
      new THREE.Vector3(2.6, -3.2, 0.8),
      new THREE.Vector3(2.2, -1.8, 1.4),
      new THREE.Vector3(2.4, -0.8, 1.1),
    ],
    radius: 0.68
  });

  // Left Posterior Communicating Artery (PCom) - Completes Circle of Willis
  segments.push({
    id: 'pcom-left',
    name: 'Left PCom Artery',
    parentVesselId: 'pca',
    points: [
      new THREE.Vector3(-2.4, -0.8, 1.1),
      new THREE.Vector3(-2.9, -1.2, -0.8),
      new THREE.Vector3(-3.4, -1.4, -2.8),
    ],
    radius: 0.32
  });

  // Right Posterior Communicating Artery (PCom)
  segments.push({
    id: 'pcom-right',
    name: 'Right PCom Artery',
    parentVesselId: 'pca',
    points: [
      new THREE.Vector3(2.4, -0.8, 1.1),
      new THREE.Vector3(2.9, -1.2, -0.8),
      new THREE.Vector3(3.4, -1.4, -2.8),
    ],
    radius: 0.32
  });

  // 4. Anterior Cerebral Arteries (ACA)
  // Left ACA A1
  segments.push({
    id: 'aca-left-a1',
    name: 'Left ACA (A1 Segment)',
    parentVesselId: 'aca',
    points: [
      new THREE.Vector3(-2.4, -0.8, 1.1),
      new THREE.Vector3(-1.2, 0.0, 2.5),
      new THREE.Vector3(-0.3, 0.6, 3.2),
    ],
    radius: 0.52
  });

  // Right ACA A1
  segments.push({
    id: 'aca-right-a1',
    name: 'Right ACA (A1 Segment)',
    parentVesselId: 'aca',
    points: [
      new THREE.Vector3(2.4, -0.8, 1.1),
      new THREE.Vector3(1.2, 0.0, 2.5),
      new THREE.Vector3(0.3, 0.6, 3.2),
    ],
    radius: 0.52
  });

  // Anterior Communicating Artery (ACom)
  segments.push({
    id: 'acom',
    name: 'Anterior Communicating Artery (ACom)',
    parentVesselId: 'aca',
    points: [
      new THREE.Vector3(-0.3, 0.6, 3.2),
      new THREE.Vector3(0.3, 0.6, 3.2),
    ],
    radius: 0.38
  });

  // Left ACA A2 Pericallosal Trunk
  segments.push({
    id: 'aca-left-a2',
    name: 'Left ACA (A2 Pericallosal Trunk)',
    parentVesselId: 'aca',
    points: [
      new THREE.Vector3(-0.3, 0.6, 3.2),
      new THREE.Vector3(-0.3, 2.8, 4.8),
      new THREE.Vector3(-0.3, 6.2, 4.5),
      new THREE.Vector3(-0.3, 8.5, 1.8),
      new THREE.Vector3(-0.3, 9.2, -2.5),
      new THREE.Vector3(-0.3, 7.8, -6.0),
    ],
    radius: 0.48
  });

  // Right ACA A2 Pericallosal Trunk
  segments.push({
    id: 'aca-right-a2',
    name: 'Right ACA (A2 Pericallosal Trunk)',
    parentVesselId: 'aca',
    points: [
      new THREE.Vector3(0.3, 0.6, 3.2),
      new THREE.Vector3(0.3, 2.8, 4.8),
      new THREE.Vector3(0.3, 6.2, 4.5),
      new THREE.Vector3(0.3, 8.5, 1.8),
      new THREE.Vector3(0.3, 9.2, -2.5),
      new THREE.Vector3(0.3, 7.8, -6.0),
    ],
    radius: 0.48
  });

  // ACA Callosomarginal / Paracentral branch (motor leg area)
  segments.push({
    id: 'aca-calloso-left',
    name: 'Left Callosomarginal Branch (Paracentral Leg)',
    parentVesselId: 'aca',
    points: [
      new THREE.Vector3(-0.3, 6.2, 4.5),
      new THREE.Vector3(-0.8, 8.8, 3.8),
      new THREE.Vector3(-1.2, 10.2, 0.5),
    ],
    radius: 0.32,
    isTerminal: true
  });

  // 5. Middle Cerebral Arteries (MCA) - Main Stroke Conduit
  // Left MCA M1 Trunk (Sphenoidal segment)
  segments.push({
    id: 'mca-left-m1',
    name: 'Left MCA (M1 Sphenoidal Trunk)',
    parentVesselId: 'mca-left',
    points: [
      new THREE.Vector3(-2.4, -0.8, 1.1),
      new THREE.Vector3(-4.5, -0.4, 1.5),
      new THREE.Vector3(-6.2, 0.5, 1.6),
    ],
    radius: 0.66
  });

  // Left MCA M2 Superior Division (Frontoparietal / Motor / Broca)
  segments.push({
    id: 'mca-left-m2-sup',
    name: 'Left MCA M2 Superior Division',
    parentVesselId: 'mca-left',
    points: [
      new THREE.Vector3(-6.2, 0.5, 1.6),
      new THREE.Vector3(-7.8, 2.4, 1.8),
      new THREE.Vector3(-8.8, 4.8, 1.2),
      new THREE.Vector3(-9.2, 7.0, -0.5),
    ],
    radius: 0.48
  });

  // Left MCA M2 Inferior Division (Temporal / Wernicke)
  segments.push({
    id: 'mca-left-m2-inf',
    name: 'Left MCA M2 Inferior Division',
    parentVesselId: 'mca-left',
    points: [
      new THREE.Vector3(-6.2, 0.5, 1.6),
      new THREE.Vector3(-8.0, -0.4, 0.8),
      new THREE.Vector3(-9.6, 0.6, -2.2),
      new THREE.Vector3(-8.8, 2.2, -5.5),
    ],
    radius: 0.46
  });

  // Left MCA M3 Broca's Opercular Branch
  segments.push({
    id: 'mca-left-broca',
    name: "Left MCA Broca's Branch (Area 44/45)",
    parentVesselId: 'mca-left',
    points: [
      new THREE.Vector3(-7.8, 2.4, 1.8),
      new THREE.Vector3(-8.5, 3.8, 3.2),
      new THREE.Vector3(-7.8, 5.0, 4.5),
    ],
    radius: 0.32,
    isTerminal: true
  });

  // Left MCA M3 Primary Motor Strip Branch (Face/Arm)
  segments.push({
    id: 'mca-left-motor',
    name: 'Left MCA Motor Strip Branch (Precentral Gyrus)',
    parentVesselId: 'mca-left',
    points: [
      new THREE.Vector3(-8.8, 4.8, 1.2),
      new THREE.Vector3(-8.4, 7.5, 2.2),
      new THREE.Vector3(-6.5, 9.6, 1.2),
    ],
    radius: 0.34,
    isTerminal: true
  });

  // Left MCA M3 Wernicke's Branch (Area 22)
  segments.push({
    id: 'mca-left-wernicke',
    name: "Left MCA Wernicke's Branch (Area 22)",
    parentVesselId: 'mca-left',
    points: [
      new THREE.Vector3(-9.6, 0.6, -2.2),
      new THREE.Vector3(-9.2, 2.5, -3.2),
      new THREE.Vector3(-7.5, 4.0, -4.8),
    ],
    radius: 0.32,
    isTerminal: true
  });

  // Right MCA M1 Trunk
  segments.push({
    id: 'mca-right-m1',
    name: 'Right MCA (M1 Sphenoidal Trunk)',
    parentVesselId: 'mca-right',
    points: [
      new THREE.Vector3(2.4, -0.8, 1.1),
      new THREE.Vector3(4.5, -0.4, 1.5),
      new THREE.Vector3(6.2, 0.5, 1.6),
    ],
    radius: 0.66
  });

  // Right MCA M2 Superior Division
  segments.push({
    id: 'mca-right-m2-sup',
    name: 'Right MCA M2 Superior Division',
    parentVesselId: 'mca-right',
    points: [
      new THREE.Vector3(6.2, 0.5, 1.6),
      new THREE.Vector3(7.8, 2.4, 1.8),
      new THREE.Vector3(8.8, 4.8, 1.2),
      new THREE.Vector3(9.2, 7.0, -0.5),
    ],
    radius: 0.48
  });

  // Right MCA M2 Inferior Division
  segments.push({
    id: 'mca-right-m2-inf',
    name: 'Right MCA M2 Inferior Division',
    parentVesselId: 'mca-right',
    points: [
      new THREE.Vector3(6.2, 0.5, 1.6),
      new THREE.Vector3(8.0, -0.4, 0.8),
      new THREE.Vector3(9.6, 0.6, -2.2),
      new THREE.Vector3(8.8, 2.2, -5.5),
    ],
    radius: 0.46
  });

  // Right MCA M3 Spatial Awareness Branch (Neglect territory)
  segments.push({
    id: 'mca-right-spatial',
    name: 'Right MCA Parietal Branch (Spatial Mapping)',
    parentVesselId: 'mca-right',
    points: [
      new THREE.Vector3(8.8, 4.8, 1.2),
      new THREE.Vector3(9.4, 6.2, 1.8),
      new THREE.Vector3(8.2, 8.5, 1.0),
    ],
    radius: 0.32,
    isTerminal: true
  });

  return segments;
}
