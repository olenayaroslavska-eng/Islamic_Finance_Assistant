import { ChevronLeft, Wand2, CheckCircle2, Circle } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface WizardIntroProps {
  onBack: () => void
  onBegin: () => void
}

export function WizardIntro({ onBack, onBegin }: WizardIntroProps) {
  const steps = [
    { id: "setup", title: "Agreement Setup", description: "Define contract terms and parties" },
    { id: "financier", title: "Financier", description: "Bank or financial institution details" },
    { id: "customer", title: "Customer", description: "Client information and requirements" },
    { id: "facility", title: "Facility", description: "Financing terms and conditions" },
    { id: "transaction", title: "Transaction", description: "Trade and commodity details" },
    { id: "documents", title: "Documents", description: "Generate required documentation" }
  ]

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Wand2 className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold">Contract Wizard</h3>
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-muted flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{index + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h6 className="font-medium text-sm text-muted-foreground">
                  {step.title}
                </h6>
                <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-2">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <div className="text-xs text-muted-foreground mb-2">Estimated time</div>
          <div className="text-sm font-medium">15-20 minutes</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-8 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 rounded-full -ml-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Return to Assistant
          </Button>
          
          <h1 className="mb-2">Commodity Murabaha Wizard</h1>
          <p className="text-muted-foreground">
            This guided wizard will help you create a compliant Commodity Murabaha Financing Agreement. 
            We'll walk you through each step to ensure proper Shariah compliance and regulatory adherence.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  What you'll create
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Circle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Complete Murabaha Agreement</div>
                      <div className="text-sm text-muted-foreground">
                        Fully compliant contract with all required clauses and terms
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Circle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Supporting Documentation</div>
                      <div className="text-sm text-muted-foreground">
                        Purchase orders, commodity specifications, and delivery terms
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Circle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Compliance Report</div>
                      <div className="text-sm text-muted-foreground">
                        Automated Shariah compliance verification and audit trail
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Requirements Card */}
            <Card>
              <CardHeader>
                <CardTitle>Before you begin</CardTitle>
                <CardDescription>
                  Make sure you have the following information ready:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h6 className="font-medium mb-2">Party Information</h6>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Financier details</li>
                      <li>• Customer information</li>
                      <li>• Legal representatives</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-2">Transaction Details</h6>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Commodity specifications</li>
                      <li>• Purchase price and markup</li>
                      <li>• Delivery terms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="pt-4">
              <Button onClick={onBegin} size="lg" className="w-full rounded-full">
                <Wand2 className="h-4 w-4 mr-2" />
                Begin Wizard
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                You can save your progress and return at any time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}