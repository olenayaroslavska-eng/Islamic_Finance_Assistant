import { 
  MessageCircle, 
  FileText, 
  FolderOpen, 
  History, 
  ArrowRight, 
  Shield, 
  Upload, 
  Search, 
  CheckCircle,
  Users,
  Building2,
  BookOpen,
  Linkedin,
  Twitter
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ZeroHWordmark } from "./ZeroHWordmark"

interface LandingProps {
  onEnterPlatform: (flow?: string) => void
}

export function Landing({ onEnterPlatform }: LandingProps) {
  const valuePropositions = [
    {
      icon: MessageCircle,
      title: "Shariah Guidance",
      description: "Get instant AI-powered guidance on Islamic finance principles, with expert validation from certified scholars."
    },
    {
      icon: Search,
      title: "AI Document Analysis",
      description: "Upload contracts and agreements for comprehensive Shariah compliance analysis against AAOIFI and BNM standards."
    },
    {
      icon: FolderOpen,
      title: "Vault Projects",
      description: "Organize documents by project, track compliance status, and collaborate with legal partners seamlessly."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with encrypted document storage and audit trails for regulatory compliance."
    }
  ]

  const workflowSteps = [
    {
      step: "01",
      title: "Upload your document",
      description: "Securely upload contracts, agreements, or any Islamic finance document for analysis.",
      icon: Upload
    },
    {
      step: "02", 
      title: "AI analyzes against Shariah standards",
      description: "Our AI agents review against AAOIFI standards, BNM guidelines, and established Islamic finance principles.",
      icon: Search
    },
    {
      step: "03",
      title: "Get results and send to experts",
      description: "Receive detailed compliance reports and route to Shariah Board or Legal Partners for final validation.",
      icon: CheckCircle
    }
  ]

  const trustStatements = [
    {
      text: "Trusted by Shariah scholars and legal experts",
      icon: Users
    },
    {
      text: "Aligned with AAOIFI and BNM standards", 
      icon: BookOpen
    },
    {
      text: "Built with enterprise-grade security",
      icon: Building2
    }
  ]

  const quickLinks = [
    {
      id: "assistant",
      title: "Assistant",
      description: "Ask questions and start workflows",
      icon: MessageCircle,
      buttonText: "Open Assistant"
    },
    {
      id: "document-analysis",
      title: "Document Analysis",
      description: "Upload a contract for Shariah review",
      icon: FileText,
      buttonText: "Open Analysis"
    },
    {
      id: "vault",
      title: "Vault",
      description: "Organize projects and documents",
      icon: FolderOpen,
      buttonText: "Open Vault"
    },
    {
      id: "history",
      title: "History",
      description: "Review past actions and approvals",
      icon: History,
      buttonText: "Open History"
    }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,159,227,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side - Content */}
            <div className="space-y-8 lg:space-y-10">
              <div className="space-y-6">
                <div className="flex justify-start">
                  <ZeroHWordmark className="text-primary w-56 lg:w-64 h-auto" />
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-foreground max-w-lg">
                    ZeroH Islamic Finance Assistant
                  </h1>
                  <p className="text-muted-foreground max-w-lg" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                    AI-powered guidance, Shariah compliance validation, and secure document analysis for Islamic finance professionals.
                  </p>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2">
                  <Button 
                    size="lg" 
                    className="button-large min-w-48 h-14"
                    onClick={() => onEnterPlatform("assistant")}
                  >
                    Enter Platform
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="button-large min-w-48 h-14"
                  onClick={() => onEnterPlatform("vault")}
                >
                  Explore Vault
                </Button>
              </div>
            </div>

            {/* Right side - Illustration/Animation area */}
            <div className="relative">
              <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Is this Mudarabah contract Shariah-compliant?</span>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-semibold">AI</span>
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-medium">Analyzing against AAOIFI standards...</p>
                      <div className="flex gap-2">
                        <div className="h-2 bg-primary/20 rounded-full flex-1">
                          <div className="h-full bg-primary rounded-full w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-card rounded-lg border text-center">
                      <CheckCircle className="h-5 w-5 text-chart-2 mx-auto mb-2" />
                      <p className="text-xs font-medium">Profit Sharing</p>
                      <p className="text-xs text-muted-foreground">Compliant</p>
                    </div>
                    <div className="p-3 bg-card rounded-lg border text-center">
                      <CheckCircle className="h-5 w-5 text-chart-2 mx-auto mb-2" />
                      <p className="text-xs font-medium">Risk Allocation</p>
                      <p className="text-xs text-muted-foreground">Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4">Comprehensive Islamic Finance Platform</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto" style={{ fontSize: '18px', lineHeight: '1.6' }}>
              From initial guidance to final compliance validation, ZeroH provides end-to-end support for Islamic finance professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuePropositions.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index}
                  className="cursor-pointer transition-all duration-300 hover:shadow-sm hover:-translate-y-2 hover:border-primary/60 group border-2"
                >
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4">How ZeroH Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '18px', lineHeight: '1.6' }}>
              Simple, secure, and compliant document analysis in three steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-foreground">{step.step}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground max-w-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connection line */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-12 border-t-2 border-dashed border-border"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="mb-8 text-xl font-semibold">Trusted by Islamic Finance Professionals</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustStatements.map((statement, index) => {
              const Icon = statement.icon
              return (
                <div key={index} className="flex items-center gap-4 p-6 bg-background rounded-xl border">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium text-sm leading-relaxed">{statement.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '18px', lineHeight: '1.6' }}>
              Jump directly into the platform features you need most
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Card 
                  key={link.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-1 hover:border-primary/60 group"
                  onClick={() => onEnterPlatform(link.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start p-0 h-auto font-medium text-primary hover:text-primary group-hover:translate-x-1 transition-transform"
                    >
                      {link.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company */}
            <div className="space-y-4">
              <div className="flex items-center">
                <ZeroHWordmark className="text-primary w-32 h-auto" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered Islamic finance assistant for Shariah-compliant guidance and document analysis.
              </p>
            </div>
            
            {/* Platform */}
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Access
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Integrations
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Status
                </a>
              </div>
            </div>
            
            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </div>
            </div>
            
            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Compliance
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Powered by */}
              <div className="text-sm text-muted-foreground">
                Powered by ZeroH Platform | Blade Labs
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}