import { useState } from "react"
import { MessageCircle, Upload, CheckCircle, XCircle, Download, Calendar, Filter, FileText, Eye, RefreshCw, Send, AlertTriangle, Clock, User, Shield } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { Separator } from "./ui/separator"
import { toast } from "sonner@2.0.3"

type EventType = "query" | "document-upload" | "analysis" | "approval" | "rejection" | "report-download" | "legal-request" | "board-review"
type EventStatus = "completed" | "in-progress" | "error" | "pending"

interface HistoryEvent {
  id: string
  type: EventType
  title: string
  description: string
  timestamp: string
  status: EventStatus
  user: string
  relatedFiles?: { name: string; size: string }[]
  complianceResult?: {
    status: "compliant" | "needs-review" | "non-compliant"
    highlights: string[]
    flags: string[]
  }
  shariahBoardDecision?: {
    decision: "approved" | "rejected" | "changes-requested"
    reviewer: string
    comments: string
  }
  metadata?: Record<string, any>
}

export function History() {
  const [events] = useState<HistoryEvent[]>(mockEvents)
  const [filteredEvents, setFilteredEvents] = useState<HistoryEvent[]>(mockEvents)
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")
  
  // Sheet state
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Apply filters
  const applyFilters = () => {
    let filtered = events

    if (eventTypeFilter !== "all") {
      filtered = filtered.filter(event => event.type === eventTypeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    if (dateRange !== "all") {
      // For demo purposes, we'll filter by time periods
      const now = new Date()
      const filterDate = new Date()

      switch (dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
      }

      // Since our mock data uses relative timestamps, we'll simulate filtering
      if (dateRange === "today") {
        filtered = filtered.filter(event => event.timestamp.includes("hour") || event.timestamp.includes("minute"))
      } else if (dateRange === "week") {
        filtered = filtered.filter(event => !event.timestamp.includes("month"))
      }
    }

    setFilteredEvents(filtered)
  }

  // Handle filter changes
  const handleEventTypeFilter = (value: string) => {
    setEventTypeFilter(value)
    applyFilters()
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    applyFilters()
  }

  const handleDateRangeFilter = (value: string) => {
    setDateRange(value)
    applyFilters()
  }

  // Handle event interactions
  const handleEventClick = (event: HistoryEvent) => {
    setSelectedEvent(event)
    setSheetOpen(true)
  }

  const handleExportHistory = () => {
    toast("Export ready – downloading now")
    // Simulate file download
    setTimeout(() => {
      const dataStr = JSON.stringify(filteredEvents, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `zeroh-history-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    }, 1000)
  }

  const handleViewReport = () => {
    toast("Opening detailed report...")
  }

  const handleRerunAnalysis = () => {
    toast("Re-running analysis with latest models...")
  }

  // Get event icon
  const getEventIcon = (type: EventType, status: EventStatus) => {
    const iconProps = "h-5 w-5"
    
    if (status === "error") {
      return <XCircle className={`${iconProps} text-destructive`} />
    }
    
    if (status === "in-progress") {
      return <Clock className={`${iconProps} text-chart-3`} />
    }

    switch (type) {
      case "query":
        return <MessageCircle className={`${iconProps} text-primary`} />
      case "document-upload":
        return <Upload className={`${iconProps} text-chart-2`} />
      case "analysis":
        return <FileText className={`${iconProps} text-chart-3`} />
      case "approval":
        return <CheckCircle className={`${iconProps} text-chart-2`} />
      case "rejection":
        return <XCircle className={`${iconProps} text-destructive`} />
      case "report-download":
        return <Download className={`${iconProps} text-muted-foreground`} />
      case "legal-request":
        return <Send className={`${iconProps} text-primary`} />
      case "board-review":
        return <Shield className={`${iconProps} text-chart-3`} />
      default:
        return <FileText className={`${iconProps} text-muted-foreground`} />
    }
  }

  // Get status badge
  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-chart-2 text-white">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-chart-3 text-white">In Progress</Badge>
      case "error":
        return <Badge className="bg-destructive text-destructive-foreground">Error</Badge>
      case "pending":
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
    }
  }

  // Get compliance badge
  const getComplianceBadge = (status: "compliant" | "needs-review" | "non-compliant") => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-chart-2 text-white">Shariah Compliant</Badge>
      case "needs-review":
        return <Badge className="bg-chart-3 text-white">Needs Review</Badge>
      case "non-compliant":
        return <Badge className="bg-destructive text-destructive-foreground">Non-Compliant</Badge>
    }
  }

  // Get Shariah Board decision badge
  const getShariahDecisionBadge = (decision: "approved" | "rejected" | "changes-requested") => {
    switch (decision) {
      case "approved":
        return <Badge className="bg-chart-2 text-white">Approved</Badge>
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>
      case "changes-requested":
        return <Badge className="bg-chart-3 text-white">Changes Requested</Badge>
    }
  }

  // Empty state
  if (filteredEvents.length === 0 && eventTypeFilter === "all" && statusFilter === "all" && dateRange === "all") {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1>History</h1>
              <p className="text-muted-foreground mt-1">Review past queries, analyses, and compliance actions</p>
            </div>
            <Button variant="outline" onClick={handleExportHistory}>
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="mb-2">No activity recorded yet</h3>
              <p className="text-muted-foreground">
                Start by uploading a document or asking a question. Your activity will appear here for easy review and audit.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1>History</h1>
            <p className="text-muted-foreground mt-1">Review past queries, analyses, and compliance actions</p>
          </div>
          <Button variant="outline" onClick={handleExportHistory}>
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-wrap gap-4">
          <Select value={dateRange} onValueChange={handleDateRangeFilter}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={eventTypeFilter} onValueChange={handleEventTypeFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="query">Queries</SelectItem>
              <SelectItem value="document-upload">Document Uploads</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="approval">Approvals</SelectItem>
              <SelectItem value="rejection">Rejections</SelectItem>
              <SelectItem value="report-download">Report Downloads</SelectItem>
              <SelectItem value="legal-request">Legal Requests</SelectItem>
              <SelectItem value="board-review">Board Reviews</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="flex-1 overflow-auto p-6">
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Clock className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="mb-2">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your filter criteria</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-primary/60"
                onClick={() => handleEventClick(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type, event.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium mb-1">{event.title}</h5>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{event.user}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{event.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Event Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-auto">
          {selectedEvent && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  {getEventIcon(selectedEvent.type, selectedEvent.status)}
                  <div>
                    <SheetTitle>{selectedEvent.title}</SheetTitle>
                    <SheetDescription>{selectedEvent.timestamp}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Event Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Status</p>
                          {getStatusBadge(selectedEvent.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">User</p>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedEvent.user}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Description</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Files */}
                {selectedEvent.relatedFiles && selectedEvent.relatedFiles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Related Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedEvent.relatedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-border rounded-md">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Compliance Result */}
                {selectedEvent.complianceResult && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Compliance Result</CardTitle>
                        {getComplianceBadge(selectedEvent.complianceResult.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedEvent.complianceResult.highlights.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-chart-2" />
                              Highlights
                            </p>
                            <div className="space-y-2">
                              {selectedEvent.complianceResult.highlights.map((highlight, index) => (
                                <div key={index} className="flex items-start gap-2 p-2 bg-chart-2/5 border border-chart-2/20 rounded-md">
                                  <CheckCircle className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedEvent.complianceResult.flags.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-chart-3" />
                              Flags
                            </p>
                            <div className="space-y-2">
                              {selectedEvent.complianceResult.flags.map((flag, index) => (
                                <div key={index} className="flex items-start gap-2 p-2 bg-chart-3/5 border border-chart-3/20 rounded-md">
                                  <AlertTriangle className="h-4 w-4 text-chart-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{flag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Shariah Board Decision */}
                {selectedEvent.shariahBoardDecision && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Shariah Board Decision</CardTitle>
                        {getShariahDecisionBadge(selectedEvent.shariahBoardDecision.decision)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Reviewer</p>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedEvent.shariahBoardDecision.reviewer}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Comments</p>
                          <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">
                            {selectedEvent.shariahBoardDecision.comments}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button variant="outline" className="flex-1" onClick={handleViewReport}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  {(selectedEvent.type === "analysis" || selectedEvent.type === "document-upload") && (
                    <Button variant="outline" className="flex-1" onClick={handleRerunAnalysis}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Re-run Analysis
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Mock data
const mockEvents: HistoryEvent[] = [
  {
    id: "1",
    type: "document-upload",
    title: "Equipment Lease Agreement Uploaded",
    description: "Uploaded Ijārah equipment lease contract for compliance analysis",
    timestamp: "2 hours ago",
    status: "completed",
    user: "Ahmad Rahman",
    relatedFiles: [
      { name: "Equipment_Lease_Agreement.pdf", size: "2.4 MB" }
    ],
    complianceResult: {
      status: "needs-review",
      highlights: [
        "Contract structure follows Ijārah principles",
        "Ownership transfer mechanism is clearly defined"
      ],
      flags: [
        "Late payment penalty clause may not be Shariah-compliant",
        "Insurance provider needs Takaful verification"
      ]
    }
  },
  {
    id: "2",
    type: "query",
    title: "Murabaha Profit Calculation Query",
    description: "Asked about permissible profit margins in property Murabaha transactions",
    timestamp: "4 hours ago",
    status: "completed",
    user: "Fatima Al-Zahra"
  },
  {
    id: "3",
    type: "board-review",
    title: "Sukuk Structure Review Approved",
    description: "Infrastructure development Sukuk structure approved by Shariah Board",
    timestamp: "Yesterday",
    status: "completed",
    user: "Omar Khalil",
    relatedFiles: [
      { name: "Sukuk_Prospectus.pdf", size: "5.2 MB" },
      { name: "Asset_Portfolio.xlsx", size: "1.4 MB" }
    ],
    complianceResult: {
      status: "compliant",
      highlights: [
        "Asset-backed structure properly defined",
        "Shariah governance framework established",
        "Clear profit and loss sharing mechanism"
      ],
      flags: []
    },
    shariahBoardDecision: {
      decision: "approved",
      reviewer: "Dr. Hassan Ali",
      comments: "Excellent structure. Fully compliant with AAOIFI standards and contemporary Shariah requirements."
    }
  },
  {
    id: "4",
    type: "legal-request",
    title: "Legal Review Request Sent",
    description: "Requested contract review from Rahman & Associates for Murabaha agreement",
    timestamp: "Yesterday",
    status: "in-progress",
    user: "Ahmad Rahman",
    relatedFiles: [
      { name: "Murabaha_Contract_Draft.pdf", size: "1.8 MB" }
    ]
  },
  {
    id: "5",
    type: "rejection",
    title: "Tawarruq Structure Rejected",
    description: "Personal financing structure rejected due to organized Tawarruq concerns",
    timestamp: "2 days ago",
    status: "completed",
    user: "Aisha Abdullah",
    relatedFiles: [
      { name: "Tawarruq_Agreement.pdf", size: "1.9 MB" }
    ],
    complianceResult: {
      status: "non-compliant",
      highlights: [
        "Commodity trading process documented"
      ],
      flags: [
        "Lacks proper commodity ownership transfer",
        "Trading process appears to be organized Tawarruq"
      ]
    },
    shariahBoardDecision: {
      decision: "rejected",
      reviewer: "Sheikh Mohammed",
      comments: "Structure does not meet contemporary Shariah standards for Tawarruq. Recommend restructuring with genuine commodity transactions."
    }
  },
  {
    id: "6",
    type: "report-download",
    title: "Compliance Report Downloaded",
    description: "Downloaded detailed compliance analysis report for Equipment Lease Agreement",
    timestamp: "2 days ago",
    status: "completed",
    user: "Ahmad Rahman",
    relatedFiles: [
      { name: "Compliance_Report_REQ-2024-001.pdf", size: "892 KB" }
    ]
  },
  {
    id: "7",
    type: "analysis",
    title: "Wakala Investment Analysis",
    description: "AI analysis completed for Wakala-based investment fund structure",
    timestamp: "3 days ago",
    status: "completed",
    user: "Dr. Sarah Ibrahim",
    relatedFiles: [
      { name: "Wakala_Fund_Proposal.pdf", size: "3.7 MB" }
    ],
    complianceResult: {
      status: "compliant",
      highlights: [
        "Clear Wakala agency relationship established",
        "Fee structure aligns with Shariah principles",
        "Risk-sharing mechanism properly defined"
      ],
      flags: []
    }
  },
  {
    id: "8",
    type: "query",
    title: "Ijārah vs Hire Purchase Query",
    description: "Consultation on structural differences between Islamic Ijārah and conventional hire purchase",
    timestamp: "4 days ago",
    status: "completed",
    user: "Mohammed Hassan"
  },
  {
    id: "9",
    type: "approval",
    title: "Mudarabah Partnership Approved",
    description: "Profit-sharing partnership structure approved for technology startup funding",
    timestamp: "1 week ago",
    status: "completed",
    user: "Khalid Al-Mansouri",
    complianceResult: {
      status: "compliant",
      highlights: [
        "Clear profit-sharing ratio defined",
        "Risk allocation follows Mudarabah principles",
        "Management responsibilities properly segregated"
      ],
      flags: []
    },
    shariahBoardDecision: {
      decision: "approved",
      reviewer: "Dr. Hassan Ali",
      comments: "Well-structured Mudarabah arrangement with clear terms and compliant profit-sharing mechanism."
    }
  },
  {
    id: "10",
    type: "document-upload",
    title: "Corporate Sukuk Prospectus Uploaded",
    description: "Uploaded draft prospectus for corporate Sukuk issuance worth RM 500 million",
    timestamp: "1 week ago",
    status: "error",
    user: "Investment Team",
    relatedFiles: [
      { name: "Corporate_Sukuk_Draft.pdf", size: "8.9 MB" }
    ]
  }
]