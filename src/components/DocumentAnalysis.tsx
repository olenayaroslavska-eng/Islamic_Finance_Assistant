import { useState, useEffect } from "react"
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Download, Send, Eye, X, Clock, Shield, Lock, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { toast } from "sonner@2.0.3"

type AnalysisStage = "upload" | "uploading" | "analyzing" | "results"
type ComplianceStatus = "compliant" | "needs-review" | "non-compliant"

interface AnalysisResult {
  status: ComplianceStatus
  highlights: string[]
  flags: { issue: string; severity: "high" | "medium" | "low" }[]
  extractedFields: { field: string; value: string; verified: boolean }[]
}

interface HistoryItem {
  id: string
  filename: string
  status: ComplianceStatus
  date: string
  size: string
}

export function DocumentAnalysis({ onTriggerAIFlow }: { onTriggerAIFlow?: () => void }) {
  const [stage, setStage] = useState<AnalysisStage>("upload")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showFlags, setShowFlags] = useState(false)
  const [analysisSteps, setAnalysisSteps] = useState({
    received: false,
    extracted: false,
    analyzing: false,
    mapping: false
  })

  const mockAnalysisResult: AnalysisResult = {
    status: "needs-review",
    highlights: [
      "Contract structure follows Ijārah principles",
      "Ownership transfer mechanism is clearly defined",
      "Rental calculation methodology is transparent"
    ],
    flags: [
      { issue: "Late payment penalty clause may not be Shariah-compliant", severity: "high" },
      { issue: "Insurance provider needs Takaful verification", severity: "medium" },
      { issue: "Maintenance responsibility allocation requires clarification", severity: "low" }
    ],
    extractedFields: [
      { field: "Contract Type", value: "Equipment Lease (Ijārah)", verified: true },
      { field: "Asset Value", value: "RM 500,000", verified: true },
      { field: "Lease Period", value: "36 months", verified: true },
      { field: "Monthly Rental", value: "RM 15,500", verified: false }
    ]
  }

  const historyItems: HistoryItem[] = [
    {
      id: "1",
      filename: "Murabaha_Agreement_2024.pdf",
      status: "compliant",
      date: "2 hours ago",
      size: "2.4 MB"
    },
    {
      id: "2", 
      filename: "Equipment_Lease_Contract.docx",
      status: "needs-review",
      date: "Yesterday",
      size: "1.8 MB"
    },
    {
      id: "3",
      filename: "Sukuk_Prospectus_Draft.pdf", 
      status: "non-compliant",
      date: "3 days ago",
      size: "5.2 MB"
    }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      startAnalysis(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      startAnalysis(file)
    }
  }

  const startAnalysis = (file: File) => {
    setStage("uploading")
    setUploadProgress(0)

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          startAnalysisSteps()
          return 100
        }
        return prev + 8
      })
    }, 150)
  }

  const startAnalysisSteps = () => {
    setStage("analyzing")
    setAnalysisSteps({ received: false, extracted: false, analyzing: false, mapping: false })

    setTimeout(() => setAnalysisSteps(prev => ({ ...prev, received: true })), 500)
    setTimeout(() => setAnalysisSteps(prev => ({ ...prev, extracted: true })), 1500)
    setTimeout(() => setAnalysisSteps(prev => ({ ...prev, analyzing: true })), 2500)
    setTimeout(() => setAnalysisSteps(prev => ({ ...prev, mapping: true })), 4000)
    
    setTimeout(() => {
      if (onTriggerAIFlow) {
        onTriggerAIFlow()
      } else {
        setAnalysisResult(mockAnalysisResult)
        setStage("results")
      }
    }, 5500)
  }

  const cancelUpload = () => {
    setStage("upload")
    setSelectedFile(null)
    setUploadProgress(0)
    toast("Upload cancelled")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-chart-2" />
      case "needs-review":
        return <AlertTriangle className="h-4 w-4 text-chart-3" />
      case "non-compliant":
        return <XCircle className="h-4 w-4 text-destructive" />
    }
  }

  const getComplianceBadge = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-chart-2 text-white">Shariah Compliant</Badge>
      case "needs-review":
        return <Badge className="bg-chart-3 text-white">Needs Review</Badge>
      case "non-compliant":
        return <Badge className="bg-destructive text-destructive-foreground">Non-Compliant</Badge>
    }
  }

  const handleAction = (action: string) => {
    toast(`${action} initiated successfully`)
  }

  if (stage === "upload") {
    return (
      <div className="h-full flex">
        {/* Left side - Upload */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="mb-3">Drop your document here</h3>
              <p className="text-muted-foreground mb-6">Supports PDF, DOC, DOCX files up to 10MB</p>
              <Button size="lg" asChild>
                <label className="cursor-pointer">
                  Select file
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                </label>
              </Button>
            </div>
          </div>
        </div>

        {/* Right side - Security & History */}
        <div className="w-96 p-6 bg-card border-l border-border">
          <div className="space-y-8">
            {/* Security Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-chart-2" />
                <h4>Secure AI Processing</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-4 w-4 text-chart-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">End-to-end encryption</p>
                    <p className="text-xs text-muted-foreground">Your documents are protected during analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-chart-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Shariah-compliant models</p>
                    <p className="text-xs text-muted-foreground">AI trained on Islamic finance principles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trash2 className="h-4 w-4 text-chart-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Automatic deletion</p>
                    <p className="text-xs text-muted-foreground">Files removed after analysis unless saved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div>
              <h4 className="mb-4">Recent Documents</h4>
              <div className="space-y-3">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-border rounded-md hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => toast("Opening document in Dashboard...")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.filename}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(item.status)}
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">{item.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stage === "uploading") {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-base">Uploading Document</CardTitle>
                    <CardDescription>{selectedFile?.name}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={cancelUpload}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>{selectedFile && formatFileSize(selectedFile.size)}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <Button variant="outline" className="w-full" onClick={cancelUpload}>
                  Cancel Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (stage === "analyzing") {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Compliance Analysis</CardTitle>
              <CardDescription>AI agents are processing your document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Animated Checklist */}
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 transition-opacity duration-500 ${analysisSteps.received ? 'opacity-100' : 'opacity-50'}`}>
                    {analysisSteps.received ? (
                      <CheckCircle className="h-5 w-5 text-chart-2" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
                    )}
                    <span className="text-sm">Document received</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 transition-opacity duration-500 ${analysisSteps.extracted ? 'opacity-100' : 'opacity-50'}`}>
                    {analysisSteps.extracted ? (
                      <CheckCircle className="h-5 w-5 text-chart-2" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
                    )}
                    <span className="text-sm">Content extracted</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 transition-opacity duration-500 ${analysisSteps.analyzing ? 'opacity-100' : 'opacity-50'}`}>
                    {analysisSteps.analyzing ? (
                      <CheckCircle className="h-5 w-5 text-chart-2" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
                    )}
                    <span className="text-sm">Compliance analysis</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 transition-opacity duration-500 ${analysisSteps.mapping ? 'opacity-100' : 'opacity-50'}`}>
                    {analysisSteps.mapping ? (
                      <CheckCircle className="h-5 w-5 text-chart-2" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
                    )}
                    <span className="text-sm">Mapping to Shariah references</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Average processing time: 20–30 seconds</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Compliance Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analysis Complete</CardTitle>
              <CardDescription>{selectedFile?.name}</CardDescription>
            </div>
            {analysisResult && getComplianceBadge(analysisResult.status)}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Highlights Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-chart-2" />
                Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult?.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-chart-2/5 border border-chart-2/20 rounded-md">
                    <CheckCircle className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Flags Section */}
          <Card>
            <CardHeader>
              <Collapsible open={showFlags} onOpenChange={setShowFlags}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-chart-3" />
                      Flags ({analysisResult?.flags.length})
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {analysisResult?.flags.map((flag, index) => (
                        <div key={index} className={`flex items-start gap-3 p-3 border rounded-md ${
                          flag.severity === "high" ? "bg-destructive/5 border-destructive/20" :
                          flag.severity === "medium" ? "bg-chart-3/5 border-chart-3/20" :
                          "bg-muted/30 border-border"
                        }`}>
                          {flag.severity === "high" && <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
                          {flag.severity === "medium" && <AlertTriangle className="h-4 w-4 text-chart-3 mt-0.5 flex-shrink-0" />}
                          {flag.severity === "low" && <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm">{flag.issue}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {flag.severity} priority
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </CardHeader>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  className="justify-start" 
                  variant="outline"
                  onClick={() => handleAction("Forward to Shariah Board")}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Forward to Shariah Board
                </Button>
                <Button 
                  className="justify-start" 
                  variant="outline"
                  onClick={() => handleAction("Request Legal Review")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Request Legal Review
                </Button>
                <Button 
                  className="justify-start" 
                  variant="outline"
                  onClick={() => handleAction("Download Report")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button 
                  className="justify-start"
                  onClick={() => handleAction("View in Dashboard")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View in Dashboard
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Analysis saved to Dashboard – view anytime
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Extracted Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Extracted Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult?.extractedFields.map((field, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/30 rounded-md"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{field.field}</p>
                      {field.verified ? (
                        <CheckCircle className="h-4 w-4 text-chart-2" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-chart-3" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{field.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historyItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-border rounded-md hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => toast("Opening document in Dashboard...")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.filename}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(item.status)}
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}