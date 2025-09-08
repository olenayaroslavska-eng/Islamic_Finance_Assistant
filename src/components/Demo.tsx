import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Play, Video, FileText, MessageSquare, Zap } from "lucide-react"

export function Demo() {
  const demoFeatures = [
    {
      title: "Interactive Walkthrough",
      description: "Step-by-step guide through our Islamic finance platform features",
      icon: Play,
      action: "Start Tour"
    },
    {
      title: "Video Demonstrations",
      description: "Watch comprehensive video tutorials of key functionalities",
      icon: Video,
      action: "Watch Videos"
    },
    {
      title: "Sample Documents",
      description: "Explore pre-loaded Islamic finance contracts and analysis examples",
      icon: FileText,
      action: "View Samples"
    },
    {
      title: "AI Assistant Demo",
      description: "Test our AI-powered Shariah compliance assistant with sample queries",
      icon: MessageSquare,
      action: "Try Assistant"
    }
  ]

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Platform Demo</h1>
          <p className="text-muted-foreground text-lg">
            Explore the capabilities of our Islamic Finance Assistant through interactive demonstrations
          </p>
        </div>

        {/* Quick Start Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Ready to Get Started?</h3>
                <p className="text-muted-foreground">
                  Begin with our guided tour to understand how Islamic finance workflows are streamlined
                </p>
              </div>
              <Button className="shrink-0">
                <Play className="mr-2 h-4 w-4" />
                Start Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                  >
                    {feature.action}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Shariah compliance verification</li>
                <li>• Document analysis workflows</li>
                <li>• AI-powered contract review</li>
                <li>• Islamic finance principles</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demo Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Quick Tour</span>
                  <span className="text-sm font-medium">5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Full Demo</span>
                  <span className="text-sm font-medium">15 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Deep Dive</span>
                  <span className="text-sm font-medium">30 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is available to guide you through the demo experience.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}