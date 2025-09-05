import { MessageCircle, FileText, Users, Scale, History, LayoutDashboard, FolderOpen } from "lucide-react"
import { ZeroHWordmark } from "./ZeroHWordmark"

interface MainSidebarProps {
  activeFlow: string
  onFlowChange: (flow: string) => void
}

export function MainSidebar({ activeFlow, onFlowChange }: MainSidebarProps) {
  const navigationItems = [
    { id: "assistant", label: "Assistant", icon: MessageCircle },
    { id: "document-analysis", label: "Document Analysis", icon: FileText },
    { id: "vault", label: "Vault", icon: FolderOpen },
    { id: "shariah-board", label: "Shariah Board", icon: Users },
    { id: "legal-partners", label: "Legal Partners", icon: Scale },
    { id: "history", label: "History", icon: History },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]

  return (
    <div className="h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header with ZeroH wordmark */}
      <div className="p-6 border-b border-sidebar-border">
        <ZeroHWordmark className="text-sidebar-primary" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeFlow === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onFlowChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}