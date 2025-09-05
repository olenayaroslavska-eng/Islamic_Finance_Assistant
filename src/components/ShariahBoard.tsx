import { useState } from "react"
import { FileText, Download, Eye, Filter, Calendar, ChevronDown, Search, MessageSquare, Send, Check, AlertTriangle, X, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Separator } from "./ui/separator"
import { toast } from "sonner@2.0.3"

type RequestStatus = "pending" | "in-review" | "approved" | "rejected"
type ProductType = "Ijārah" | "Murabaha" | "Tawarruq" | "Mudarabah" | "Sukuk" | "Wakala"

interface ComplianceRequest {
  id: string
  productType: ProductType
  submittedBy: string
  dateSubmitted: string
  status: RequestStatus
  summary: string
  documents: { name: string; size: string }[]
  highlights: string[]
  flags: { issue: string; severity: "high" | "medium" | "low" }[]
  comments: { author: string; message: string; timestamp: string }[]
}

interface SheetStates {
  selectedRequest: ComplianceRequest | null
  showConfirmDialog: boolean
  confirmAction: "approve" | "request-changes" | "reject" | null
}

export function ShariahBoard() {
  const [requests, setRequests] = useState<ComplianceRequest[]>(mockRequests)
  const [filteredRequests, setFilteredRequests] = useState<ComplianceRequest[]>(mockRequests)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [productFilter, setProductFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [sheetStates, setSheetStates] = useState<SheetStates>({
    selectedRequest: null,
    showConfirmDialog: false,
    confirmAction: null
  })

  // Apply filters
  const applyFilters = () => {
    let filtered = requests

    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    if (productFilter !== "all") {
      filtered = filtered.filter(req => req.productType === productFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.productType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
  }

  // Handle filter changes
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    applyFilters()
  }

  const handleProductFilter = (value: string) => {
    setProductFilter(value)
    applyFilters()
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters()
  }

  // Handle row click
  const handleRowClick = (request: ComplianceRequest) => {
    setSheetStates({ ...sheetStates, selectedRequest: request })
    setSheetOpen(true)
  }

  // Handle action buttons
  const handleAction = (action: "approve" | "request-changes" | "reject") => {
    setSheetStates({
      ...sheetStates,
      showConfirmDialog: true,
      confirmAction: action
    })
  }

  // Confirm action
  const confirmAction = () => {
    if (!sheetStates.selectedRequest || !sheetStates.confirmAction) return

    const updatedRequests = requests.map(req => {
      if (req.id === sheetStates.selectedRequest!.id) {
        let newStatus: RequestStatus
        switch (sheetStates.confirmAction) {
          case "approve":
            newStatus = "approved"
            break
          case "request-changes":
            newStatus = "in-review"
            break
          case "reject":
            newStatus = "rejected"
            break
          default:
            newStatus = req.status
        }
        return { ...req, status: newStatus }
      }
      return req
    })

    setRequests(updatedRequests)
    setFilteredRequests(updatedRequests)
    
    const actionText = sheetStates.confirmAction === "request-changes" 
      ? "Changes requested" 
      : `Request ${sheetStates.confirmAction}d`
    
    toast(`${actionText} successfully`)
    
    setSheetStates({
      selectedRequest: null,
      showConfirmDialog: false,
      confirmAction: null
    })
    setSheetOpen(false)
  }

  // Add comment
  const addComment = () => {
    if (!newComment.trim() || !sheetStates.selectedRequest) return

    const comment = {
      author: "Shariah Board Member",
      message: newComment,
      timestamp: new Date().toLocaleString()
    }

    const updatedRequest = {
      ...sheetStates.selectedRequest,
      comments: [...sheetStates.selectedRequest.comments, comment]
    }

    setSheetStates({ ...sheetStates, selectedRequest: updatedRequest })
    setNewComment("")
    toast("Comment added successfully")
  }

  // Get status badge
  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-muted-foreground border-muted">Pending</Badge>
      case "in-review":
        return <Badge className="bg-chart-3 text-white">In Review</Badge>
      case "approved":
        return <Badge className="bg-chart-2 text-white">Approved</Badge>
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>
    }
  }

  // Get action dialog content
  const getDialogContent = () => {
    if (!sheetStates.confirmAction) return { title: "", description: "" }

    switch (sheetStates.confirmAction) {
      case "approve":
        return {
          title: "Approve Request",
          description: "Are you sure you want to approve this compliance request? This action will mark it as Shariah-compliant."
        }
      case "request-changes":
        return {
          title: "Request Changes",
          description: "Are you sure you want to request changes? The submitter will be notified to make revisions."
        }
      case "reject":
        return {
          title: "Reject Request", 
          description: "Are you sure you want to reject this compliance request? This action cannot be undone."
        }
    }
  }

  const dialogContent = getDialogContent()

  // Empty state
  if (filteredRequests.length === 0 && statusFilter === "all" && productFilter === "all" && !searchTerm) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div>
            <h1>Shariah Board</h1>
            <p className="text-muted-foreground mt-1">Submit, track, and review Islamic finance approval requests</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="mb-2">No requests pending review</h3>
              <p className="text-muted-foreground">
                New compliance requests will appear here for Shariah board review and approval.
              </p>
            </div>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              View History
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div>
          <h1>Shariah Board</h1>
          <p className="text-muted-foreground mt-1">Submit, track, and review Islamic finance approval requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, submitter, or product type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={productFilter} onValueChange={handleProductFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="Ijārah">Ijārah</SelectItem>
              <SelectItem value="Murabaha">Murabaha</SelectItem>
              <SelectItem value="Tawarruq">Tawarruq</SelectItem>
              <SelectItem value="Mudarabah">Mudarabah</SelectItem>
              <SelectItem value="Sukuk">Sukuk</SelectItem>
              <SelectItem value="Wakala">Wakala</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow 
                    key={request.id} 
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => handleRowClick(request)}
                  >
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.productType}</TableCell>
                    <TableCell>{request.submittedBy}</TableCell>
                    <TableCell>{request.dateSubmitted}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(request)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-auto">
          {sheetStates.selectedRequest && (
            <>
              <SheetHeader>
                <SheetTitle>Request Details</SheetTitle>
                <SheetDescription>
                  Review compliance request and take action
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Request Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Request Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Request ID</p>
                        <p className="text-sm text-muted-foreground">{sheetStates.selectedRequest.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Product Type</p>
                        <p className="text-sm text-muted-foreground">{sheetStates.selectedRequest.productType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Submitted By</p>
                        <p className="text-sm text-muted-foreground">{sheetStates.selectedRequest.submittedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Date</p>
                        <p className="text-sm text-muted-foreground">{sheetStates.selectedRequest.dateSubmitted}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium mb-1">Status</p>
                        {getStatusBadge(sheetStates.selectedRequest.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sheetStates.selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-md">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.size}</p>
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

                {/* AI Analysis Snapshot */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis Snapshot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Highlights */}
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Check className="h-4 w-4 text-chart-2" />
                          Highlights
                        </p>
                        <div className="space-y-2">
                          {sheetStates.selectedRequest.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-chart-2/5 border border-chart-2/20 rounded-md">
                              <Check className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Flags */}
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-chart-3" />
                          Flags
                        </p>
                        <div className="space-y-2">
                          {sheetStates.selectedRequest.flags.map((flag, index) => (
                            <div key={index} className={`flex items-start gap-2 p-2 border rounded-md ${
                              flag.severity === "high" ? "bg-destructive/5 border-destructive/20" :
                              flag.severity === "medium" ? "bg-chart-3/5 border-chart-3/20" :
                              "bg-muted/30 border-border"
                            }`}>
                              <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                flag.severity === "high" ? "text-destructive" :
                                flag.severity === "medium" ? "text-chart-3" :
                                "text-muted-foreground"
                              }`} />
                              <span className="text-sm">{flag.issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Thread */}
                <Card>
                  <CardHeader>
                    <CardTitle>Reviewer Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sheetStates.selectedRequest.comments.map((comment, index) => (
                        <div key={index} className="p-3 border border-border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">{comment.author}</p>
                            <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                          </div>
                          <p className="text-sm">{comment.message}</p>
                        </div>
                      ))}
                      
                      {/* Add Comment */}
                      <div className="space-y-3">
                        <Separator />
                        <div className="space-y-2">
                          <Textarea 
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button 
                    className="flex-1 bg-chart-2 hover:bg-chart-2/90 text-white"
                    onClick={() => handleAction("approve")}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    className="flex-1 bg-chart-3 hover:bg-chart-3/90 text-white"
                    onClick={() => handleAction("request-changes")}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button 
                    className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    onClick={() => handleAction("reject")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <Dialog open={sheetStates.showConfirmDialog} onOpenChange={(open) => 
        setSheetStates({ ...sheetStates, showConfirmDialog: open })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSheetStates({ ...sheetStates, showConfirmDialog: false })}
            >
              Cancel
            </Button>
            <Button onClick={confirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Mock data
const mockRequests: ComplianceRequest[] = [
  {
    id: "REQ-2024-001",
    productType: "Ijārah",
    submittedBy: "Ahmad Rahman",
    dateSubmitted: "Dec 15, 2024",
    status: "pending",
    summary: "Equipment lease agreement for manufacturing equipment",
    documents: [
      { name: "Equipment_Lease_Agreement.pdf", size: "2.4 MB" },
      { name: "Asset_Valuation_Report.docx", size: "1.8 MB" }
    ],
    highlights: [
      "Contract structure follows Ijārah principles",
      "Ownership transfer mechanism is clearly defined",
      "Rental calculation methodology is transparent"
    ],
    flags: [
      { issue: "Late payment penalty clause may not be Shariah-compliant", severity: "high" },
      { issue: "Insurance provider needs Takaful verification", severity: "medium" }
    ],
    comments: [
      {
        author: "Dr. Hassan Ali",
        message: "Initial review shows good compliance with Ijārah principles. Need to verify penalty structure.",
        timestamp: "Dec 16, 2024 10:30 AM"
      }
    ]
  },
  {
    id: "REQ-2024-002", 
    productType: "Murabaha",
    submittedBy: "Fatima Al-Zahra",
    dateSubmitted: "Dec 14, 2024",
    status: "in-review",
    summary: "Property purchase financing with deferred payment",
    documents: [
      { name: "Murabaha_Contract.pdf", size: "3.1 MB" },
      { name: "Property_Deed.pdf", size: "2.7 MB" }
    ],
    highlights: [
      "Clear asset ownership by financier",
      "Transparent profit margin disclosure",
      "Proper transfer of ownership to client"
    ],
    flags: [
      { issue: "Property valuation requires independent verification", severity: "medium" }
    ],
    comments: [
      {
        author: "Sheikh Mohammed",
        message: "Contract appears compliant. Requesting additional documentation on property valuation.",
        timestamp: "Dec 15, 2024 2:45 PM"
      }
    ]
  },
  {
    id: "REQ-2024-003",
    productType: "Sukuk",
    submittedBy: "Omar Khalil",
    dateSubmitted: "Dec 12, 2024", 
    status: "approved",
    summary: "Infrastructure development Sukuk issuance",
    documents: [
      { name: "Sukuk_Prospectus.pdf", size: "5.2 MB" },
      { name: "Asset_Portfolio.xlsx", size: "1.4 MB" }
    ],
    highlights: [
      "Asset-backed structure properly defined",
      "Shariah governance framework established",
      "Clear profit and loss sharing mechanism"
    ],
    flags: [],
    comments: [
      {
        author: "Dr. Hassan Ali",
        message: "Excellent structure. Fully compliant with AAOIFI standards.",
        timestamp: "Dec 13, 2024 4:20 PM"
      }
    ]
  },
  {
    id: "REQ-2024-004",
    productType: "Tawarruq",
    submittedBy: "Aisha Abdullah",
    dateSubmitted: "Dec 10, 2024",
    status: "rejected",
    summary: "Personal financing through commodity trading",
    documents: [
      { name: "Tawarruq_Agreement.pdf", size: "1.9 MB" }
    ],
    highlights: [
      "Commodity trading process documented"
    ],
    flags: [
      { issue: "Lacks proper commodity ownership transfer", severity: "high" },
      { issue: "Trading process appears to be organized Tawarruq", severity: "high" }
    ],
    comments: [
      {
        author: "Sheikh Mohammed",
        message: "Structure does not meet contemporary Shariah standards for Tawarruq. Rejection recommended.",
        timestamp: "Dec 11, 2024 11:15 AM"
      }
    ]
  }
]