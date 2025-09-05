import { useState, useEffect } from "react"
import { CheckCircle, Clock, Book, FileText, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ZeroHWordmark } from "./ZeroHWordmark"

interface Agent {
  id: string
  name: string
  task: string
  status: "pending" | "active" | "completed"
  sources?: string[]
}

interface KnowledgeSource {
  id: string
  icon: React.ReactNode
  name: string
  status: "idle" | "accessing" | "referenced"
}

export function AIAgentCollaboration({ onComplete }: { onComplete: () => void }) {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "shariah-lead",
      name: "Shariah-Muʿāmalāt Lead",
      task: "analyzing compliance",
      status: "pending"
    },
    {
      id: "usul-engine",
      name: "Usūl Engine",
      task: "validating methodology (Malaysian precedent)",
      status: "pending"
    },
    {
      id: "railkeeper",
      name: "Malaysia Railkeeper",
      task: "checking BNM/SC guidelines",
      status: "pending"
    },
    {
      id: "evidence",
      name: "Evidence Cartographer",
      task: "mapping sources to claims",
      status: "pending"
    },
    {
      id: "maqasid",
      name: "Maqāṣid Steward",
      task: "scoring against Islamic objectives",
      status: "pending"
    },
    {
      id: "fairness",
      name: "Consumer Fairness Agent",
      task: "reviewing fee transparency",
      status: "pending"
    },
    {
      id: "scribe",
      name: "Scribe",
      task: "finalizing recommendations",
      status: "pending"
    }
  ])

  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([
    {
      id: "shariah",
      icon: <div className="text-lg">🕌</div>,
      name: "Shariah Sources",
      status: "idle"
    },
    {
      id: "bnm",
      icon: <FileText className="h-4 w-4" />,
      name: "BNM Guidelines",
      status: "idle"
    },
    {
      id: "aaoifi",
      icon: <BarChart3 className="h-4 w-4" />,
      name: "AAOIFI Standards",
      status: "idle"
    }
  ])

  const [currentAgentIndex, setCurrentAgentIndex] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    const processAgents = async () => {
      for (let i = 0; i < agents.length; i++) {
        // Set current agent as active
        setCurrentAgentIndex(i)
        setAgents(prev => prev.map((agent, index) => ({
          ...agent,
          status: index === i ? "active" : index < i ? "completed" : "pending"
        })))

        // Simulate accessing knowledge sources for certain agents
        if (i === 0 || i === 2) {
          await simulateKnowledgeAccess()
        }

        // Wait for agent processing time
        await new Promise(resolve => setTimeout(resolve, 2500))

        // Mark agent as completed
        setAgents(prev => prev.map((agent, index) => ({
          ...agent,
          status: index <= i ? "completed" : "pending"
        })))

        // Update overall progress
        setOverallProgress(((i + 1) / agents.length) * 100)
      }

      // All agents completed, transition to results
      setTimeout(() => {
        onComplete()
      }, 1000)
    }

    processAgents()
  }, [agents.length, onComplete])

  const simulateKnowledgeAccess = async () => {
    // Set sources to accessing
    setKnowledgeSources(prev => prev.map(source => ({
      ...source,
      status: "accessing"
    })))

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Set sources to referenced
    setKnowledgeSources(prev => prev.map(source => ({
      ...source,
      status: "referenced"
    })))
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <ZeroHWordmark className="text-primary" />
            <span className="text-muted-foreground">Working...</span>
          </div>
          <Progress value={overallProgress} className="w-full" />
        </div>

        {/* Agents List */}
        <Card>
          <CardHeader>
            <CardTitle>AI Agent Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent, index) => (
                <div
                  key={agent.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                    agent.status === "active"
                      ? "bg-primary/10 border border-primary/20"
                      : agent.status === "completed"
                      ? "bg-chart-2/10"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {agent.status === "completed" && (
                      <CheckCircle className="h-5 w-5 text-chart-2" />
                    )}
                    {agent.status === "active" && (
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    {agent.status === "pending" && (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">{agent.task}</p>
                  </div>
                  {agent.status === "active" && (
                    <Badge variant="secondary">Processing</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {knowledgeSources.map((source) => (
                <div
                  key={source.id}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-500 ${
                    source.status === "referenced"
                      ? "bg-chart-2/10 border-chart-2/20"
                      : source.status === "accessing"
                      ? "bg-primary/10 border-primary/20"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8">
                    {source.icon}
                  </div>
                  <p className="text-sm text-center">{source.name}</p>
                  <div className="text-xs text-muted-foreground">
                    {source.status === "idle" && "Standby"}
                    {source.status === "accessing" && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 border border-primary border-t-transparent rounded-full animate-spin" />
                        Accessing...
                      </span>
                    )}
                    {source.status === "referenced" && "Referenced"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Message */}
        {overallProgress === 100 && (
          <div className="text-center animate-in fade-in duration-500">
            <CheckCircle className="h-12 w-12 text-chart-2 mx-auto mb-4" />
            <h3 className="mb-2">Analysis Complete</h3>
            <p className="text-muted-foreground mb-4">
              All agents have completed their analysis. Generating comprehensive report...
            </p>
            <Button onClick={onComplete}>
              View Reasoning Report in Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}