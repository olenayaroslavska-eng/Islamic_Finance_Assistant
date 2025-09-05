import { useState } from "react"
import { MainSidebar } from "./components/MainSidebar"
import { PlatformHeader } from "./components/PlatformHeader"
import { Landing } from "./pages/Landing"
import { Assistant } from "./components/Assistant"
import { DocumentAnalysis } from "./components/DocumentAnalysis"
import { AIAgentCollaboration } from "./components/AIAgentCollaboration"
import { Dashboard } from "./components/Dashboard"
import { ShariahBoard } from "./components/ShariahBoard"
import { LegalPartners } from "./components/LegalPartners"
import { History } from "./components/History"
import { Vault } from "./components/Vault"
import { MurabahWizard } from "./components/MurabahWizard"
import { Toaster } from "./components/ui/sonner"

type Flow = "assistant" | "document-analysis" | "ai-collaboration" | "shariah-board" | "legal-partners" | "history" | "dashboard" | "vault"

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [activeFlow, setActiveFlow] = useState<Flow>("assistant")
  const [showAICollaboration, setShowAICollaboration] = useState(false)
  const [showMurabahWizard, setShowMurabahWizard] = useState(false)

  const handleFlowChange = (flow: string) => {
    setActiveFlow(flow as Flow)
    setShowAICollaboration(false)
    setShowMurabahWizard(false)
  }

  const handleEnterPlatform = (flow?: string) => {
    setShowLanding(false)
    if (flow) {
      setActiveFlow(flow as Flow)
    }
    setShowAICollaboration(false)
    setShowMurabahWizard(false)
  }

  const handleTriggerAIFlow = () => {
    setShowAICollaboration(true)
  }

  const handleAICollaborationComplete = () => {
    setShowAICollaboration(false)
    setActiveFlow("dashboard")
  }

  const handleMurabahWizardStart = () => {
    setShowMurabahWizard(true)
  }

  const handleMurabahWizardBack = () => {
    setShowMurabahWizard(false)
  }

  const handleMurabahWizardComplete = () => {
    setShowMurabahWizard(false)
    setActiveFlow("dashboard")
  }

  const handleLogout = () => {
    setShowLanding(true)
    setShowAICollaboration(false)
    setShowMurabahWizard(false)
    setActiveFlow("assistant")
  }

  const renderContent = () => {
    if (showMurabahWizard) {
      return <MurabahWizard onBack={handleMurabahWizardBack} onComplete={handleMurabahWizardComplete} />
    }

    if (showAICollaboration) {
      return <AIAgentCollaboration onComplete={handleAICollaborationComplete} />
    }

    switch (activeFlow) {
      case "assistant":
        return <Assistant onStartWizard={handleMurabahWizardStart} />
      case "document-analysis":
        return <DocumentAnalysis onTriggerAIFlow={handleTriggerAIFlow} />
      case "dashboard":
        return <Dashboard />
      case "shariah-board":
        return <ShariahBoard />
      case "legal-partners":
        return <LegalPartners />
      case "history":
        return <History />
      case "vault":
        return <Vault />
      default:
        return <Assistant onStartWizard={handleMurabahWizardStart} />
    }
  }

  if (showLanding) {
    return (
      <>
        <Landing onEnterPlatform={handleEnterPlatform} />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen flex bg-background">
      {!showMurabahWizard && <MainSidebar activeFlow={activeFlow} onFlowChange={handleFlowChange} />}
      <div className="flex-1 flex flex-col">
        {!showMurabahWizard && <PlatformHeader activeFlow={showAICollaboration ? "ai-collaboration" : activeFlow} onLogout={handleLogout} />}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  )
}