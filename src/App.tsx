import { useState } from "react"
import { MainSidebar } from "./components/MainSidebar"
import { PlatformHeader } from "./components/PlatformHeader"
import { Landing } from "./components/Landing"
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

interface Draft {
  id: string
  contractType: string
  createdDate: string
  lastEdited: string
  status: "draft"
  currentStep: number
  totalSteps: number
  stepName: string
  formData: any
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [activeFlow, setActiveFlow] = useState<Flow>("assistant")
  const [showAICollaboration, setShowAICollaboration] = useState(false)
  const [showMurabahWizard, setShowMurabahWizard] = useState(false)
  const [resumeDraft, setResumeDraft] = useState<Draft | null>(null)

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
    setResumeDraft(null) // Clear any resume draft when starting new
    setShowMurabahWizard(true)
  }

  const handleContinueEditing = (draft: Draft) => {
    setResumeDraft(draft)
    setShowMurabahWizard(true)
  }

  const handleMurabahWizardBack = () => {
    setShowMurabahWizard(false)
    setResumeDraft(null)
  }

  const handleMurabahWizardComplete = () => {
    setShowMurabahWizard(false)
    setResumeDraft(null)
    setActiveFlow("dashboard")
  }

  const handleLogout = () => {
    setShowLanding(true)
    setShowAICollaboration(false)
    setShowMurabahWizard(false)
    setResumeDraft(null)
    setActiveFlow("assistant")
  }

  const renderContent = () => {
    if (showMurabahWizard) {
      return <MurabahWizard onBack={handleMurabahWizardBack} onComplete={handleMurabahWizardComplete} resumeDraft={resumeDraft} />
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
        return <Dashboard onContinueEditing={handleContinueEditing} />
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
    <div className="min-h-screen flex bg-background relative">
      {!showMurabahWizard && <MainSidebar activeFlow={activeFlow} onFlowChange={handleFlowChange} />}
      <div className="flex-1 flex flex-col min-h-screen">
        {!showMurabahWizard && <PlatformHeader activeFlow={showAICollaboration ? "ai-collaboration" : activeFlow} onLogout={handleLogout} />}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  )
}