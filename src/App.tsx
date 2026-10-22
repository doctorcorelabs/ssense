import React, { useState } from 'react';
import type { ActiveTab } from './types/stroke';
import { Navbar } from './components/layout/Navbar';
import { HemodynamicRibbon } from './components/layout/HemodynamicRibbon';
import { CommandDock } from './components/layout/CommandDock';
import { Footer } from './components/layout/Footer';
import { ConfigModal } from './components/common/ConfigModal';
import { AspectsCalculatorModal } from './components/common/AspectsCalculatorModal';
import { CircleOfWillisModal } from './components/common/CircleOfWillisModal';

import { OverviewHub } from './components/modules/OverviewHub';
import { AnatomyStudio } from './components/studios/AnatomyStudio';
import { EmpathyStudio } from './components/studios/EmpathyStudio';
import { RehabStudio } from './components/studios/RehabStudio';
import { AICopilotStudio } from './components/studios/AICopilotStudio';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isAspectsOpen, setIsAspectsOpen] = useState<boolean>(false);
  const [isCircleOfWillisOpen, setIsCircleOfWillisOpen] = useState<boolean>(false);

  return (
    <div className="app-wrapper">
      {/* Sticky Clean Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsConfigOpen(true)}
      />

      {/* Living Hemodynamic Telemetry, Saver JL Time-is-Brain & Cath Lab Switcher Ribbon */}
      <HemodynamicRibbon
        onOpenAspects={() => setIsAspectsOpen(true)}
        onOpenCircleOfWillis={() => setIsCircleOfWillisOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 0 64px' }}>
        <div className="container">
          {/* Overview Hub with Bento Hero Dossier */}
          {activeTab === 'overview' && (
            <OverviewHub setActiveTab={setActiveTab} />
          )}

          {/* Studio 1: Acute Vascular & 3D Anatomy Suite */}
          {(activeTab === 'studio-anatomy' || activeTab === 'brain-3d' || activeTab === 'golden-hour') && (
            <AnatomyStudio onBackToOverview={() => setActiveTab('overview')} />
          )}

          {/* Studio 2: Sensory & Cognitive Empathy Lab */}
          {(activeTab === 'studio-empathy' || activeTab === 'vision-sim' || activeTab === 'aphasia-lab') && (
            <EmpathyStudio onBackToOverview={() => setActiveTab('overview')} />
          )}

          {/* Studio 3: Neuroplasticity & Motor Rehab Arena */}
          {(activeTab === 'studio-rehab' || activeTab === 'hand-rehab' || activeTab === 'neuroplasticity') && (
            <RehabStudio onBackToOverview={() => setActiveTab('overview')} />
          )}

          {/* Studio 4: Clinical Copilot & Safety Guard */}
          {(activeTab === 'studio-ai' || activeTab === 'ai-neurologist' || activeTab === 'drug-guard' || activeTab === 'risk-calculator') && (
            <AICopilotStudio onBackToOverview={() => setActiveTab('overview')} />
          )}
        </div>
      </main>

      {/* Floating Studio Command Dock at Bottom */}
      <CommandDock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Clinical References & Standards Footer */}
      <Footer />

      {/* Edge Telemetry / AI Model Config Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

      {/* Alberta Stroke Program Early CT Score (ASPECTS) Modal */}
      <AspectsCalculatorModal
        isOpen={isAspectsOpen}
        onClose={() => setIsAspectsOpen(false)}
      />

      {/* Circle of Willis Collateral Flow Simulator Modal */}
      <CircleOfWillisModal
        isOpen={isCircleOfWillisOpen}
        onClose={() => setIsCircleOfWillisOpen(false)}
      />
    </div>
  );
};

export default App;
