import { Bell, User, Settings, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface PlatformHeaderProps {
  activeFlow: string
  onLogout: () => void
}

export function PlatformHeader({ activeFlow, onLogout }: PlatformHeaderProps) {
  // Define contextual content based on active flow
  const getContextualContent = (flow: string) => {
    switch (flow) {
      case "assistant":
        return {
          title: "Islamic Finance Assistant",
          subtitle: "Guidance on Shariah-compliant structures, compliance requirements, and investments"
        }
      case "document-analysis":
        return {
          title: "Document Analysis",
          subtitle: "Upload and analyze documents for Shariah compliance requirements"
        }
      case "ai-collaboration":
        return {
          title: "AI Agent Collaboration",
          subtitle: "Watch our AI agents work together to provide comprehensive guidance"
        }
      case "dashboard":
        return {
          title: "Assessment Dashboard",
          subtitle: "Review and manage your Islamic finance assessment history"
        }
      case "shariah-board":
        return {
          title: "Shariah Board",
          subtitle: "Collaborate with Shariah board members for compliance review"
        }
      case "legal-partners":
        return {
          title: "Legal Partners",
          subtitle: "Connect with legal experts specializing in Islamic finance"
        }
      case "history":
        return {
          title: "History",
          subtitle: "Access your complete audit trail and historical records"
        }
      case "vault":
        return {
          title: "Vault",
          subtitle: "Organize, analyze, and collaborate on Islamic finance documents"
        }
      default:
        return {
          title: "Islamic Finance Assistant",
          subtitle: "Guidance on Shariah-compliant structures, compliance requirements, and investments"
        }
    }
  }

  const { title, subtitle } = getContextualContent(activeFlow)

  return (
    <header className="w-full bg-card border-b border-border h-20">
      <div className="px-6 h-full flex items-center justify-between">
        {/* Left side: Contextual title and subtitle */}
        <div className="flex-1 flex flex-col justify-center">
          <h4 className="mb-1">
            {title}
          </h4>
          <p 
            className="text-muted-foreground font-normal leading-4"
            style={{ fontSize: '13px' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Right side: User utilities */}
        <div className="flex items-center gap-4 h-full">
          {/* Notification bell with badge */}
          <Button variant="ghost" size="sm" className="relative h-auto p-2">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 h-auto p-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">AA</AvatarFallback>
                </Avatar>
                <span className="text-sm hidden md:inline">Ahmad Al-Hassan</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm">Ahmad Al-Hassan</p>
                <p className="text-xs text-muted-foreground">ahmad@example.com</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}