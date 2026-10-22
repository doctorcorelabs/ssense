import React, { useState } from 'react';
import type { ActiveTab } from './types/stroke';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ConfigModal } from './components/common/ConfigModal';

import { OverviewHub } from './components/modules/OverviewHub';
import { GoldenHourClock } from './components/modules/GoldenHourClock';
import { VisionSimulator } from './components/modules/VisionSimulator';
import { AphasiaLab } from './components/modules/AphasiaLab';
import { Brain3DExplorer } from './components/modules/Brain3DExplorer';
import { NeuroplasticityPlay } from './components/modules/NeuroplasticityPlay';
import { RiskCalculator } from './components/modules/RiskCalculator';
import { HandRehabCoach } from './components/modules/HandRehabCoach';
import { AINeurologistChat } from './components/modules/AINeurologistChat';
import { DrugInteractionGuard } from './components/modules/DrugInteractionGuard';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  return (
    <div className="app-wrapper">
      {/* Sticky Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsConfigOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '36px 0 64px' }}>
        <div className="container">
          {activeTab === 'overview' && <OverviewHub setActiveTab={setActiveTab} />}
          {activeTab === 'golden-hour' && <GoldenHourClock />}
          {activeTab === 'vision-sim' && <VisionSimulator />}
          {activeTab === 'aphasia-lab' && <AphasiaLab />}
          {activeTab === 'brain-3d' && <Brain3DExplorer />}
          {activeTab === 'neuroplasticity' && <NeuroplasticityPlay />}
          {activeTab === 'risk-calculator' && <RiskCalculator />}
          {activeTab === 'hand-rehab' && <HandRehabCoach />}
          {activeTab === 'ai-neurologist' && <AINeurologistChat />}
          {activeTab === 'drug-guard' && <DrugInteractionGuard />}
        </div>
      </main>

      {/* Global Comprehensive Clinical Footer */}
      <Footer />

      {/* Cloudflare Worker / OpenRouter Settings Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
};

export default App;
