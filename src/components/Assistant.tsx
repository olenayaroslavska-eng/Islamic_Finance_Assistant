import { useState } from "react"
import { Send, Sparkles, Upload, MessageCircle, FileText, TrendingUp, Shield, DollarSign, Mic, Wand2, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { ContractSelector } from "./ContractSelector"
import { WizardIntro } from "./WizardIntro"
import { toast } from "sonner@2.0.3"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  cards?: AssistantCard[]
}

interface AssistantCard {
  id: string
  title: string
  benefit: string
  points: string[]
  details?: {
    timeline: string
    requirements: string[]
    compliance: string[]
  }
}

interface AssistantProps {
  onStartWizard?: () => void
}

export function Assistant({ onStartWizard }: AssistantProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [inputFocused, setInputFocused] = useState(false)
  const [showContractSelector, setShowContractSelector] = useState(false)
  const [preselectedContract, setPreselectedContract] = useState<string | undefined>()
  const [showWizardIntro, setShowWizardIntro] = useState(false)
  const [showInlineSuggestion, setShowInlineSuggestion] = useState(false)

  const starterPrompts = [
    {
      icon: FileText,
      title: "Equipment Financing",
      description: "Structure Ijārah deals for equipment purchases",
      prompt: "How can I structure an equipment financing deal?"
    },
    {
      icon: Shield,
      title: "Mudarabah Compliance",
      description: "Navigate profit-sharing requirements",
      prompt: "What are the compliance requirements for Mudarabah?"
    },
    {
      icon: TrendingUp,
      title: "Tawarruq Structures", 
      description: "Understand commodity trading frameworks",
      prompt: "Help me understand Tawarruq structures"
    },
    {
      icon: DollarSign,
      title: "Musharakah Partnerships",
      description: "Joint venture Islamic finance models",
      prompt: "How do I structure a Musharakah partnership?"
    },
    {
      icon: Shield,
      title: "Istisna Manufacturing",
      description: "Manufacturing finance compliance",
      prompt: "What are the requirements for Istisna contracts?"
    },
    {
      icon: FileText,
      title: "Salam Commodity",
      description: "Forward commodity sale structures",
      prompt: "Help me structure a Salam commodity deal"
    }
  ]

  const autocompleteChips = ["Ijārah", "Tawarruq", "Mudarabah", "Musharakah", "Istisna", "Salam"]

  const mockAssistantCards: AssistantCard[] = [
    {
      id: "equipment-finance",
      title: "Equipment Financing via Ijārah",
      benefit: "Shariah-compliant lease structure with flexible payment terms",
      points: [
        "Bank purchases equipment and leases to client",
        "Monthly rental payments with option to purchase",
        "Compliant with AAOIFI standards"
      ],
      details: {
        timeline: "2-3 weeks for structure approval",
        requirements: [
          "Equipment specifications and supplier details",
          "Client financial statements",
          "Shariah board pre-approval for equipment type"
        ],
        compliance: [
          "Bank must own equipment during lease period",
          "Rental payments cannot be linked to interest rates",
          "Insurance arrangements must be Shariah-compliant"
        ]
      }
    }
  ]

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: "I can help you with that. Here are some Shariah-compliant structures to consider:",
      cards: mockAssistantCards
    }

    setMessages([...messages, userMessage, assistantMessage])
    setInput("")
    setShowAutocomplete(false)
  }

  const handleChipClick = (chip: string) => {
    setInput(input + chip + " ")
    setShowAutocomplete(false)
  }

  const handleStarterPrompt = (prompt: string) => {
    toast("Generating your guidance…", {
      duration: 2000,
    })
    setTimeout(() => {
      handleSendMessage(prompt)
    }, 500)
  }

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      toast("Generating guidance…", {
        duration: 1500,
        position: "top-center"
      })
      setTimeout(() => {
        handleSendMessage(inputValue)
        setInputValue("")
      }, 500)
    }
  }

  const handleCardClick = (prompt: string) => {
    setInputValue(prompt)
    toast("Query loaded - press Enter to send", {
      duration: 2000,
      position: "top-center"
    })
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    // Show inline suggestion when user types "murabaha"
    setShowInlineSuggestion(value.toLowerCase().includes("murabaha"))
  }

  const handleContractStart = () => {
    setPreselectedContract(undefined)
    setShowContractSelector(true)
  }

  const handleBrowseTemplates = () => {
    setPreselectedContract(undefined)
    setShowContractSelector(true)
  }

  const handleQuickStartMurabaha = () => {
    setPreselectedContract("commodity-murabaha")
    setShowContractSelector(true)
  }

  const handleInlineSuggestionClick = () => {
    setPreselectedContract("commodity-murabaha")
    setShowContractSelector(true)
    setShowInlineSuggestion(false)
  }

  const handleContractSelect = (contractId: string) => {
    setShowContractSelector(false)
    if (contractId === "commodity-murabaha") {
      setShowWizardIntro(true)
    } else {
      toast("Contract wizard coming soon", {
        description: `The ${contractId} wizard will be available in the next update.`
      })
    }
  }

  const handleWizardBack = () => {
    setShowWizardIntro(false)
  }

  const handleWizardBegin = () => {
    if (onStartWizard) {
      onStartWizard()
    } else {
      toast("Wizard Step 2.1", {
        description: "Beginning Agreement Setup phase..."
      })
    }
  }

  // Show wizard intro if active
  if (showWizardIntro) {
    return <WizardIntro onBack={handleWizardBack} onBegin={handleWizardBegin} />
  }

  return (
    <div className="h-full flex flex-col">
      {/* Contract Selector Modal */}
      <ContractSelector
        open={showContractSelector}
        onClose={() => setShowContractSelector(false)}
        onSelect={handleContractSelect}
        preselectedId={preselectedContract}
      />

      {/* Welcome State */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6 relative">
          {/* Focus overlay */}
          {inputFocused && (
            <div className="absolute inset-0 bg-background/50 pointer-events-none z-10" />
          )}
          
          <div className="max-w-[960px] w-full text-center space-y-4 relative z-20">
            {/* Section heading block with inline icon */}
            <div className="animate-in fade-in duration-500 py-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="mb-0">How can I help you today?</h2>
              </div>
              <div className="max-w-[720px] mx-auto">
                <p className="text-muted-foreground">
                  Select a starting point or ask your own question about Shariah-compliant financing.
                </p>
              </div>
              
              {/* Primary CTA - Right aligned within content width */}
              <div className="max-w-[720px] mx-auto mt-6">
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBrowseTemplates}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Browse all templates
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  <Button onClick={handleContractStart} className="rounded-full">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Start a Contract
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Primary input */}
            <div className="animate-in fade-in duration-700 delay-100 py-3">
              <div className="relative max-w-[720px] mx-auto">
                <div className="relative flex items-center bg-input-background border border-border rounded-md h-11 px-4 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                  <Input
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputValue.trim()) {
                        handleInputSubmit()
                      }
                    }}
                    placeholder="Ask about Islamic finance, compliance, or upload a document…"
                    className="flex-1 border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                  />
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Press Enter to send
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-md"
                      onClick={() => {
                        // Handle upload click
                        toast("Document upload feature coming soon", {
                          description: "This will open the document analysis flow"
                        })
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 rounded-md"
                      disabled={!inputValue.trim()}
                      onClick={handleInputSubmit}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Inline suggestion for murabaha */}
                {showInlineSuggestion && (
                  <div className="mt-2 animate-in slide-in-from-top-1 duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleInlineSuggestionClick}
                      className="rounded-full text-xs h-7 px-3 border-primary/40 hover:bg-primary/5"
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      Start Commodity Murabaha wizard
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick-start surface */}
            <div className="animate-in fade-in duration-700 delay-150 py-2">
              <div className="max-w-[720px] mx-auto">
                <Card
                  className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/60 bg-gradient-to-r from-primary/5 to-accent/5"
                  onClick={handleQuickStartMurabaha}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Wand2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h6 className="font-semibold text-sm">Start Commodity Murabaha (demo)</h6>
                        <p className="text-xs text-muted-foreground">Launch the guided contract wizard</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Demo
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Quick start cards - dense 3x2 grid */}
            <div className="animate-in fade-in duration-700 delay-200 py-2">
              <div className="grid grid-cols-3 gap-4 max-w-[720px] mx-auto">
                {starterPrompts.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <Card
                      key={index}
                      className="cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 hover:border-primary/60 active:translate-y-0 active:shadow-sm group min-w-[200px] h-24 flex flex-col"
                      onClick={() => handleCardClick(item.prompt)}
                    >
                      <CardContent className="p-3 flex-1 flex flex-col justify-center">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0 mt-0.5">
                            <IconComponent className="h-3 w-3 text-primary" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <h6 
                              className="font-semibold text-foreground mb-1 line-clamp-2"
                              style={{ 
                                fontSize: '14px', 
                                lineHeight: '1.4',
                                wordBreak: 'break-word',
                                hyphens: 'auto'
                              }}
                            >
                              {item.title}
                            </h6>
                            <p 
                              className="text-muted-foreground line-clamp-1"
                              style={{ 
                                fontSize: '12px', 
                                lineHeight: '1.4',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Secondary helper row */}
            <div className="animate-in fade-in duration-700 delay-300 py-2">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs px-4 py-1 h-7 border-border/60 hover:border-primary/40 hover:bg-primary/5"
                  onClick={() => {
                    toast("Shariah Standards Reference", {
                      description: "Opening AAOIFI and BNM guidelines..."
                    })
                  }}
                >
                  Shariah standards (AAOIFI/BNM)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs px-4 py-1 h-7 border-border/60 hover:border-primary/40 hover:bg-primary/5"
                  onClick={() => {
                    toast("Document Upload", {
                      description: "Redirecting to document analysis..."
                    })
                  }}
                >
                  Upload documents
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs px-4 py-1 h-7 border-border/60 hover:border-primary/40 hover:bg-primary/5"
                  onClick={() => {
                    toast("Example Queries", {
                      description: "Showing Islamic finance examples..."
                    })
                  }}
                >
                  See examples
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-3xl ${message.type === "user" ? "bg-primary text-primary-foreground p-4 rounded-lg" : ""}`}>
                {message.type === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <div className="space-y-4">
                    <p>{message.content}</p>
                    {message.cards && (
                      <div className="grid gap-4">
                        {message.cards.map((card) => (
                          <Card key={card.id} className="border border-border">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                {card.title}
                                <Badge variant="secondary" className="ml-2">Recommended</Badge>
                              </CardTitle>
                              <CardDescription>{card.benefit}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 mb-4">
                                {card.points.map((point, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-sm">{point}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex gap-2">
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button variant="outline" size="sm">See Details</Button>
                                  </SheetTrigger>
                                  <SheetContent className="w-[500px] sm:w-[540px]">
                                    <SheetHeader>
                                      <SheetTitle>{card.title}</SheetTitle>
                                      <SheetDescription>{card.benefit}</SheetDescription>
                                    </SheetHeader>
                                    {card.details && (
                                      <div className="mt-6 space-y-6">
                                        <div>
                                          <h4 className="mb-2">Timeline Estimate</h4>
                                          <p className="text-sm text-muted-foreground">{card.details.timeline}</p>
                                        </div>
                                        <div>
                                          <h4 className="mb-2">Requirements</h4>
                                          <ul className="space-y-1">
                                            {card.details.requirements.map((req, index) => (
                                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                                {req}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div>
                                          <h4 className="mb-2">Compliance Notes</h4>
                                          <ul className="space-y-1">
                                            {card.details.compliance.map((note, index) => (
                                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                                {note}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <Button className="w-full">Start with this structure</Button>
                                      </div>
                                    )}
                                  </SheetContent>
                                </Sheet>
                                <Button size="sm">Upload Docs</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}


    </div>
  )
}