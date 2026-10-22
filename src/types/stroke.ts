// StrokeSense Type Definitions

export type ActiveTab = 
  | 'overview'
  | 'studio-anatomy'
  | 'studio-empathy'
  | 'studio-rehab'
  | 'studio-ai'
  | 'golden-hour'
  | 'vision-sim'
  | 'aphasia-lab'
  | 'brain-3d'
  | 'neuroplasticity'
  | 'risk-calculator'
  | 'hand-rehab'
  | 'ai-neurologist'
  | 'drug-guard';

export interface PersonaConfig {
  id: 'specialist' | 'analogy' | 'companion';
  name: string;
  role: string;
  avatar: string;
  description: string;
  badge: string;
}

export interface AttachedMedicalFile {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: 'specialist' | 'analogy' | 'companion' | 'unified-core';
  attachment?: AttachedMedicalFile;
  contextVitals?: {
    onset?: string;
    vessel?: string;
    bp?: string;
    nihss?: string;
  };
}

export interface RiskProfileInput {
  age: number;
  sex: 'male' | 'female';
  systolicBP: number;
  diastolicBP: number;
  isHypertensiveMed: boolean;
  hasDiabetes: boolean;
  smoker: boolean;
  hasAFib: boolean;
  hasPriorStroke: boolean;
  hasVascularDisease: boolean;
}

export interface DrugInteractionResult {
  drug: string;
  supplement: string;
  severity: 'severe' | 'moderate' | 'safe';
  riskScore: number; // 1 to 10
  headline: string;
  mechanism: string;
  recommendation: string;
}

export interface ExerciseDrill {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  instructions: string[];
}
