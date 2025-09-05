import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainSidebar } from './MainSidebar';
import { PlatformHeader } from './PlatformHeader';
import { MurabahWizard } from './MurabahWizard';
import { AIAgentCollaboration } from './AIAgentCollaboration';
import { Toaster } from './ui/sonner';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';
import { APP_ROUTES } from '@/constants/navigation';
import { FlowType } from '@/types';

// Lazy load pages for better performance
const Landing = React.lazy(() => import('@/pages/Landing'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Assistant = React.lazy(() => import('@/pages/Assistant'));
const DocumentAnalysis = React.lazy(() => import('@/pages/DocumentAnalysis'));
const ShariahBoard = React.lazy(() => import('@/pages/ShariahBoard'));
const LegalPartners = React.lazy(() => import('@/pages/LegalPartners'));
const Vault = React.lazy(() => import('@/pages/Vault'));
const History = React.lazy(() => import('@/pages/History'));

/**
 * App Router Component
 * 
 * Main router component that handles navigation between pages
 * Features:
 * - Lazy loading for better performance
 * - Error boundaries for each route
 * - Loading states
 * - Responsive layout with sidebar and header
 */
const AppRouter: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeFlow, setActiveFlow] = useState<FlowType>('dashboard');
  const [showAICollaboration, setShowAICollaboration] = useState(false);
  const [showMurabahWizard, setShowMurabahWizard] = useState(false);

  const handleEnterPlatform = () => {
    setShowLanding(false);
  };

  const handleLogout = () => {
    setShowLanding(true);
    setActiveFlow('dashboard');
    setShowAICollaboration(false);
    setShowMurabahWizard(false);
  };

  const handleTriggerAIFlow = () => {
    setShowAICollaboration(true);
  };

  const handleAICollaborationComplete = () => {
    setShowAICollaboration(false);
    setActiveFlow('dashboard');
  };

  const handleMurabahWizardStart = () => {
    setShowMurabahWizard(true);
  };

  const handleMurabahWizardBack = () => {
    setShowMurabahWizard(false);
  };

  const handleMurabahWizardComplete = () => {
    setShowMurabahWizard(false);
    setActiveFlow('dashboard');
  };

  if (showLanding) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
          <Landing onEnterPlatform={handleEnterPlatform} />
          <Toaster />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (showMurabahWizard) {
    return (
      <ErrorBoundary>
        <MurabahWizard 
          onBack={handleMurabahWizardBack} 
          onComplete={handleMurabahWizardComplete} 
        />
        <Toaster />
      </ErrorBoundary>
    );
  }

  if (showAICollaboration) {
    return (
      <ErrorBoundary>
        <AIAgentCollaboration onComplete={handleAICollaborationComplete} />
        <Toaster />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex bg-background">
          <MainSidebar activeFlow={activeFlow} onFlowChange={setActiveFlow} />
          
          <div className="flex-1 flex flex-col">
            <PlatformHeader 
              activeFlow={activeFlow} 
              onLogout={handleLogout} 
            />
            
            <main className="flex-1 overflow-auto">
              <Suspense 
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" text="Loading page..." />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
                  <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
                  <Route 
                    path={APP_ROUTES.ASSISTANT} 
                    element={<Assistant onStartWizard={handleMurabahWizardStart} />} 
                  />
                  <Route 
                    path={APP_ROUTES.DOCUMENTS} 
                    element={<DocumentAnalysis onTriggerAIFlow={handleTriggerAIFlow} />} 
                  />
                  <Route path={APP_ROUTES.SHARIAH_BOARD} element={<ShariahBoard />} />
                  <Route path={APP_ROUTES.LEGAL_PARTNERS} element={<LegalPartners />} />
                  <Route path={APP_ROUTES.VAULT} element={<Vault />} />
                  <Route path={APP_ROUTES.HISTORY} element={<History />} />
                  <Route path="*" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
          
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRouter;