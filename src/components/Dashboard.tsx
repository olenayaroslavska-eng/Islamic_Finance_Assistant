import { useState, useEffect } from "react"
import { Eye, Send, Download, ChevronRight, Edit3, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { toast } from "sonner@2.0.3"

interface Assessment {
  id: string
  name: string
  uploadedDate: string
  complianceStatus: "compliant" | "needs-review" | "non-compliant"
  nextAction: string
  documentType: string
  highlights: string[]
  flags: { issue: string; severity: "high" | "medium" | "low" }[]
  shariahBoardStatus: "pending" | "approved" | "revision-required"
  legalPartnerNotes?: string
}

interface Draft {
  id: string
  contractType: string
  createdDate: string
  lastEdited: string
  status: "draft"
  currentStep: number
  totalSteps: number
  stepName: string
  formData: any
}

interface DashboardProps {
  onContinueEditing?: (draft: Draft) => void
}

export function Dashboard({ onContinueEditing }: DashboardProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null)

  const assessments: Assessment[] = [
    {
      id: "1",
      name: "Equipment Finance.pdf",
      uploadedDate: "Sep 4, 2025",
      complianceStatus: "needs-review",
      nextAction: "Forward to Shariah Board",
      documentType: "Equipment Lease Agreement",
      highlights: [
        "Contract structure follows Ijārah principles",
        "Ownership transfer mechanism is clearly defined",
        "Rental calculation methodology is transparent"
      ],
      flags: [
        { issue: "Late payment penalty clause may not be Shariah-compliant", severity: "high" },
        { issue: "Insurance provider needs Takaful verification", severity: "medium" }
      ],
      shariahBoardStatus: "pending"
    },
    {
      id: "2",
      name: "Trade Finance Murabaha.pdf",
      uploadedDate: "Sep 3, 2025",
      complianceStatus: "compliant",
      nextAction: "Generate Final Documentation",
      documentType: "Murabaha Agreement",
      highlights: [
        "Cost-plus structure properly documented",
        "Asset identification is clear and specific",
        "Profit disclosure meets transparency requirements"
      ],
      flags: [],
      shariahBoardStatus: "approved",
      legalPartnerNotes: "Minor formatting adjustments recommended for clause 4.2"
    },
    {
      id: "3",
      name: "Working Capital Facility.pdf",
      uploadedDate: "Sep 2, 2025",
      complianceStatus: "non-compliant",
      nextAction: "Restructure Agreement",
      documentType: "Tawarruq Facility",
      highlights: [
        "Underlying commodity trades documented",
        "Settlement procedures are clear"
      ],
      flags: [
        { issue: "Commodity ownership transfer not properly evidenced", severity: "high" },
        { issue: "Pricing mechanism lacks market benchmark", severity: "high" },
        { issue: "Exit terms need refinement", severity: "medium" }
      ],
      shariahBoardStatus: "revision-required"
    }
  ]

  // Load drafts from localStorage
  const [drafts, setDrafts] = useState<Draft[]>([])

  // Load drafts on component mount
  useEffect(() => {
    try {
      const savedDrafts = localStorage.getItem('murabah_drafts')
      if (savedDrafts) {
        const parsedDrafts = JSON.parse(savedDrafts)
        setDrafts(parsedDrafts)
      }
    } catch (error) {
      console.error('Failed to load drafts:', error)
      toast.error("Failed to load saved drafts")
    }
  }, [])

  // Listen for draft updates (when returning from wizard)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedDrafts = localStorage.getItem('murabah_drafts')
        if (savedDrafts) {
          const parsedDrafts = JSON.parse(savedDrafts)
          setDrafts(parsedDrafts)
        }
      } catch (error) {
        console.error('Failed to reload drafts:', error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for a custom event when drafts are updated in the same tab
    window.addEventListener('draftsUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('draftsUpdated', handleStorageChange)
    }
  }, [])

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-chart-2 text-white">Compliant</Badge>
      case "needs-review":
        return <Badge className="bg-chart-3 text-white">Needs Review</Badge>
      case "non-compliant":
        return <Badge className="bg-destructive text-destructive-foreground">Non-Compliant</Badge>
      default:
        return null
    }
  }

  const getShariahBoardBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-chart-2 text-white">Approved</Badge>
      case "pending":
        return <Badge variant="outline">Pending Review</Badge>
      case "revision-required":
        return <Badge className="bg-chart-3 text-white">Revision Required</Badge>
      default:
        return null
    }
  }

  const handleRowClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setIsDrawerOpen(true)
  }

  const handleAction = (action: string) => {
    toast(`${action} completed successfully`)
    setIsDrawerOpen(false)
  }

  const handleContinueEditing = (draft: Draft) => {
    if (onContinueEditing) {
      onContinueEditing(draft)
    }
  }

  const handleDeleteDraft = (draft: Draft, e: React.MouseEvent) => {
    e.stopPropagation()
    setDraftToDelete(draft)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteDraft = () => {
    if (draftToDelete) {
      try {
        const existingDrafts = JSON.parse(localStorage.getItem('murabah_drafts') || '[]')
        const filteredDrafts = existingDrafts.filter((d: Draft) => d.id !== draftToDelete.id)
        localStorage.setItem('murabah_drafts', JSON.stringify(filteredDrafts))
        
        setDrafts(prev => prev.filter(d => d.id !== draftToDelete.id))
        toast.success("Draft deleted successfully")
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('draftsUpdated'))
      } catch (error) {
        console.error('Failed to delete draft:', error)
        toast.error("Failed to delete draft")
      }
      
      setDeleteDialogOpen(false)
      setDraftToDelete(null)
    }
  }

  return (
    <div className="h-full p-6 space-y-6">
      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assessments">Recent Assessments</TabsTrigger>
          <TabsTrigger value="drafts">Saved Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{assessments.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-chart-2">
                  {assessments.filter(a => a.complianceStatus === "compliant").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Need Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-chart-3">
                  {assessments.filter(a => a.complianceStatus === "needs-review").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending Board Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-primary">
                  {assessments.filter(a => a.shariahBoardStatus === "pending").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Assessments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Uploaded Date</TableHead>
                    <TableHead>Compliance Status</TableHead>
                    <TableHead>Next Action</TableHead>
                    <TableHead>Shariah Board</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow
                      key={assessment.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(assessment)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{assessment.name}</p>
                          <p className="text-sm text-muted-foreground">{assessment.documentType}</p>
                        </div>
                      </TableCell>
                      <TableCell>{assessment.uploadedDate}</TableCell>
                      <TableCell>{getComplianceBadge(assessment.complianceStatus)}</TableCell>
                      <TableCell>{assessment.nextAction}</TableCell>
                      <TableCell>{getShariahBoardBadge(assessment.shariahBoardStatus)}</TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          {/* Draft Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{drafts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-primary">
                  {drafts.filter(d => d.currentStep > 1).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recently Edited</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-chart-3">
                  {drafts.filter(d => new Date(d.lastEdited).toDateString() === new Date().toDateString()).length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Drafts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Draft ID</TableHead>
                    <TableHead>Contract Type</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Edited</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drafts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No saved drafts yet. Start creating a contract to see drafts here.
                      </TableCell>
                    </TableRow>
                  ) : (
                    drafts.map((draft) => (
                      <TableRow
                        key={draft.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-mono text-sm">{draft.id.toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">
                              {draft.formData?.financierLegalName && draft.formData?.customerLegalName
                                ? `${draft.formData.financierLegalName} → ${draft.formData.customerLegalName}`
                                : draft.formData?.financierLegalName || "Untitled Draft"
                              }
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{draft.contractType}</TableCell>
                        <TableCell>{draft.createdDate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Draft</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{draft.lastEdited}</p>
                            <p className="text-xs text-muted-foreground">Step {draft.currentStep}: {draft.stepName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ width: `${(draft.currentStep / draft.totalSteps) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round((draft.currentStep / draft.totalSteps) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContinueEditing(draft)}
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Continue Editing
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleDeleteDraft(draft, e)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assessment Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[500px] sm:w-[540px] overflow-auto">
          {selectedAssessment && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedAssessment.name}</SheetTitle>
                <SheetDescription>{selectedAssessment.documentType}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Document Preview Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Document Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground">
                      PDF preview would appear here
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span>Overall Assessment</span>
                      {getComplianceBadge(selectedAssessment.complianceStatus)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shariah Board Status</span>
                      {getShariahBoardBadge(selectedAssessment.shariahBoardStatus)}
                    </div>
                  </CardContent>
                </Card>

                {/* Highlights */}
                {selectedAssessment.highlights.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedAssessment.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-chart-2 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Flags */}
                {selectedAssessment.flags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Issues ({selectedAssessment.flags.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedAssessment.flags.map((flag, index) => (
                          <div key={index} className="p-3 border border-border rounded-md">
                            <p className="text-sm mb-1">{flag.issue}</p>
                            <Badge variant="outline" className="text-xs">
                              {flag.severity} priority
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Legal Partner Notes */}
                {selectedAssessment.legalPartnerNotes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Legal Partner Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {selectedAssessment.legalPartnerNotes}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAction("Forwarded to Shariah Board")}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Forward to Shariah Board
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAction("Report generated")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard this draft? This action cannot be undone and all progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDraft} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}