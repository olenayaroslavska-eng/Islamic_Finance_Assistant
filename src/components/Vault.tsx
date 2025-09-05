import { useState } from "react"
import { Plus, Upload, Search, FolderOpen, FileText, Users, Settings, ChevronLeft, ChevronRight, Play, MoreHorizontal, Calendar, User, MessageCircle, Download, Share, Eye, EyeOff, Edit3, X, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { Textarea } from "./ui/textarea"
import { Separator } from "./ui/separator"
import { Progress } from "./ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Switch } from "./ui/switch"
import { toast } from "sonner@2.0.3"

type ProjectStatus = "active" | "completed" | "archived"
type DocumentStatus = "compliant" | "needs-review" | "non-compliant" | "processing"
type ColumnType = "text" | "date" | "compliance" | "currency" | "percentage"
type PermissionRole = "viewer" | "editor" | "reviewer"

interface VaultProject {
  id: string
  name: string
  documentCount: number
  status: ProjectStatus
  lastUpdated: string
  createdBy: string
  description: string
}

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  status: DocumentStatus
  complianceScore: number
  extractedData: Record<string, any>
}

interface TableColumn {
  id: string
  name: string
  type: ColumnType
  visible: boolean
}

interface ProjectMember {
  id: string
  name: string
  email: string
  role: PermissionRole
  avatar: string
}

interface UploadFile {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "processing" | "complete" | "error"
}

export function Vault() {
  const [projects] = useState<VaultProject[]>(mockProjects)
  const [selectedProject, setSelectedProject] = useState<VaultProject | null>(projects[0])
  const [documents] = useState<Document[]>(mockDocuments)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [queryInput, setQueryInput] = useState("")
  
  // Modal and sheet states
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false)
  const [uploadOverlayOpen, setUploadOverlayOpen] = useState(false)
  const [sharingPanelOpen, setSharingPanelOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  
  // Table configuration
  const [tableColumns, setTableColumns] = useState<TableColumn[]>(defaultColumns)
  const [editingColumn, setEditingColumn] = useState<string | null>(null)
  
  // Project form
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")

  // Handle project selection
  const handleProjectSelect = (project: VaultProject) => {
    setSelectedProject(project)
  }

  // Handle new project creation
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast("Please enter a project name")
      return
    }
    
    toast("Project created successfully")
    setNewProjectModalOpen(false)
    setNewProjectName("")
    setNewProjectDescription("")
  }

  // Handle file upload
  const handleFileUpload = (files: FileList) => {
    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading"
    }))
    
    setUploadFiles(prev => [...prev, ...newFiles])
    
    // Simulate upload progress
    newFiles.forEach(file => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadFiles(prev => 
            prev.map(f => f.id === file.id ? { ...f, progress: 100, status: "processing" } : f)
          )
          // Simulate processing
          setTimeout(() => {
            setUploadFiles(prev => 
              prev.map(f => f.id === file.id ? { ...f, status: "complete" } : f)
            )
          }, 2000)
        }
        setUploadFiles(prev => 
          prev.map(f => f.id === file.id ? { ...f, progress } : f)
        )
      }, 500)
    })
  }

  // Handle workflow execution
  const handleRunWorkflow = (workflowName: string) => {
    toast(`Running ${workflowName}...`)
  }

  // Handle query submission
  const handleSubmitQuery = () => {
    if (!queryInput.trim()) return
    toast("Analyzing documents for your query...")
    setQueryInput("")
  }

  // Handle column management
  const handleColumnToggle = (columnId: string) => {
    setTableColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    )
  }

  const handleColumnEdit = (columnId: string, newName: string) => {
    setTableColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, name: newName } : col
      )
    )
    setEditingColumn(null)
  }

  const handleAddColumn = () => {
    const newColumn: TableColumn = {
      id: `col-${Date.now()}`,
      name: "New Column",
      type: "text",
      visible: true
    }
    setTableColumns(prev => [...prev, newColumn])
    setEditingColumn(newColumn.id)
  }

  // Get status badge for projects
  const getProjectStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-chart-2 text-white">Active</Badge>
      case "completed":
        return <Badge variant="outline" className="text-muted-foreground">Completed</Badge>
      case "archived":
        return <Badge className="bg-muted text-muted-foreground">Archived</Badge>
    }
  }

  // Get status badge for documents
  const getDocumentStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-chart-2 text-white">Compliant</Badge>
      case "needs-review":
        return <Badge className="bg-chart-3 text-white">Needs Review</Badge>
      case "non-compliant":
        return <Badge className="bg-destructive text-destructive-foreground">Non-Compliant</Badge>
      case "processing":
        return <Badge variant="outline" className="text-muted-foreground">Processing</Badge>
    }
  }

  // Get upload status icon
  const getUploadStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case "uploading":
        return <Upload className="h-4 w-4 text-chart-3" />
      case "processing":
        return <Clock className="h-4 w-4 text-chart-3" />
      case "complete":
        return <CheckCircle className="h-4 w-4 text-chart-2" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
    }
  }

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get visible columns
  const visibleColumns = tableColumns.filter(col => col.visible)

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className={`border-r border-border bg-card transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2 flex-1">
                <FolderOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Projects</h3>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          
          {!sidebarCollapsed && (
            <>
              <Button 
                className="w-full mt-4"
                onClick={() => setNewProjectModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              
              <div className="mt-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search projects..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                    selectedProject?.id === project.id ? 'border-primary bg-primary/5' : 'hover:border-primary/60'
                  }`}
                  onClick={() => handleProjectSelect(project)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium line-clamp-1">{project.name}</h4>
                        {getProjectStatusBadge(project.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{project.documentCount}</span>
                        </div>
                        <span>•</span>
                        <span>{project.lastUpdated}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1>Vault</h1>
              <p className="text-muted-foreground mt-1">Securely store, review, and bulk-analyze your Islamic finance documents</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setUploadOverlayOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
              <Button onClick={() => setNewProjectModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {selectedProject ? (
          <div className="flex-1 overflow-auto">
            {/* Hero Area */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="mb-2">{selectedProject.name}</h2>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{selectedProject.documentCount} documents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Last updated {selectedProject.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Created by {selectedProject.createdBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getProjectStatusBadge(selectedProject.status)}
                  <Button variant="outline" size="sm" onClick={() => setSharingPanelOpen(true)}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Workflow Panel */}
            <div className="p-6 border-b border-border">
              <h3 className="mb-4">One-Click Workflows</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-primary/60">
                  <CardContent className="p-4" onClick={() => handleRunWorkflow("Extract Ijārah Structure")}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h5 className="font-medium">Extract Ijārah Structure</h5>
                        <p className="text-sm text-muted-foreground">Identify lease terms</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-primary/60">
                  <CardContent className="p-4" onClick={() => handleRunWorkflow("Flag Non-Compliant Clauses")}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-chart-3/10 rounded-md flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <h5 className="font-medium">Flag Non-Compliant Clauses</h5>
                        <p className="text-sm text-muted-foreground">Compliance analysis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-primary/60">
                  <CardContent className="p-4" onClick={() => handleRunWorkflow("Extract Murabaha Terms")}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-chart-2/10 rounded-md flex items-center justify-center">
                        <FileText className="h-5 w-5 text-chart-2" />
                      </div>
                      <div>
                        <h5 className="font-medium">Extract Murabaha Terms</h5>
                        <p className="text-sm text-muted-foreground">Pricing structure</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all duration-200 hover:shadow-sm hover:border-primary/60">
                  <CardContent className="p-4" onClick={() => handleRunWorkflow("Generate Compliance Report")}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-chart-5/10 rounded-md flex items-center justify-center">
                        <Download className="h-5 w-5 text-chart-5" />
                      </div>
                      <div>
                        <h5 className="font-medium">Generate Report</h5>
                        <p className="text-sm text-muted-foreground">Full analysis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Query Interface */}
            <div className="p-6 border-b border-border">
              <h3 className="mb-4">Document Q&A</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <MessageCircle className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Ask questions about your documents... e.g., 'What are the profit margins in Murabaha contracts?'"
                      className="pl-10"
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuery()}
                    />
                  </div>
                </div>
                <Button onClick={handleSubmitQuery} disabled={!queryInput.trim()}>
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Review Table */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Document Review</h3>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleAddColumn}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add custom column</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {tableColumns.map((column) => (
                        <DropdownMenuItem key={column.id} onClick={() => handleColumnToggle(column.id)}>
                          <div className="flex items-center gap-2">
                            {column.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            <span>{column.name}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((column) => (
                        <TableHead key={column.id}>
                          {editingColumn === column.id ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                defaultValue={column.name}
                                className="h-8"
                                onBlur={(e) => handleColumnEdit(column.id, e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleColumnEdit(column.id, e.currentTarget.value)
                                  }
                                }}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{column.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-4 w-4 p-0"
                                onClick={() => setEditingColumn(column.id)}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableHead>
                      ))}
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        {visibleColumns.map((column) => (
                          <TableCell key={column.id}>
                            {column.id === 'name' && doc.name}
                            {column.id === 'type' && doc.type}
                            {column.id === 'status' && getDocumentStatusBadge(doc.status)}
                            {column.id === 'uploadDate' && doc.uploadDate}
                            {column.id === 'complianceScore' && `${doc.complianceScore}%`}
                            {column.id === 'size' && doc.size}
                          </TableCell>
                        ))}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                Re-analyze
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
        ) : (
          // No project selected
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                <FolderOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="mb-2">Select a project to get started</h3>
                <p className="text-muted-foreground">
                  Choose a project from the sidebar or create a new one to begin organizing your Islamic finance documents.
                </p>
              </div>
              <Button onClick={() => setNewProjectModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <Dialog open={newProjectModalOpen} onOpenChange={setNewProjectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Organize your Islamic finance documents into a new project workspace
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Project Name</label>
              <Input
                placeholder="e.g., Q4 2024 Sukuk Review"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
              <Textarea
                placeholder="Brief description of the project scope and objectives..."
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Overlay */}
      <Dialog open={uploadOverlayOpen} onOpenChange={setUploadOverlayOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Add documents to {selectedProject?.name || "your project"} for analysis and review
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Drag and Drop Zone */}
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/60"
              onDrop={(e) => {
                e.preventDefault()
                const files = e.dataTransfer.files
                if (files.length > 0) {
                  handleFileUpload(files)
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="mb-2">Drop files here or click to browse</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Supports PDF, DOCX, and other document formats up to 10MB each
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(e.target.files)
                  }
                }}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>

            {/* Upload Progress */}
            {uploadFiles.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-medium">Upload Progress</h5>
                {uploadFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 border border-border rounded-md">
                    {getUploadStatusIcon(file.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </div>
                      {file.status === "uploading" && (
                        <Progress value={file.progress} className="h-2" />
                      )}
                      {file.status === "processing" && (
                        <div className="text-xs text-muted-foreground">Processing document...</div>
                      )}
                      {file.status === "complete" && (
                        <div className="text-xs text-chart-2">Upload complete</div>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setUploadFiles(prev => prev.filter(f => f.id !== file.id))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOverlayOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sharing Panel */}
      <Sheet open={sharingPanelOpen} onOpenChange={setSharingPanelOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Project Sharing</SheetTitle>
            <SheetDescription>
              Manage access and permissions for {selectedProject?.name}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Project Access */}
            <Card>
              <CardHeader>
                <CardTitle>Project Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Private Project</p>
                      <p className="text-sm text-muted-foreground">Only invited members can access</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Select defaultValue={member.role}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Mock data
const mockProjects: VaultProject[] = [
  {
    id: "1",
    name: "Q4 2024 Sukuk Review",
    documentCount: 24,
    status: "active",
    lastUpdated: "2 hours ago",
    createdBy: "Ahmad Rahman",
    description: "Comprehensive review of infrastructure Sukuk documentation and compliance analysis"
  },
  {
    id: "2",
    name: "Ijārah Equipment Leasing",
    documentCount: 12,
    status: "active",
    lastUpdated: "Yesterday",
    createdBy: "Fatima Al-Zahra",
    description: "Islamic equipment leasing contracts and compliance verification for construction machinery"
  },
  {
    id: "3",
    name: "Murabaha Property Financing",
    documentCount: 8,
    status: "completed",
    lastUpdated: "3 days ago",
    createdBy: "Omar Khalil",
    description: "Property acquisition financing using Murabaha structure with full Shariah compliance review"
  },
  {
    id: "4",
    name: "Investment Fund Analysis",
    documentCount: 15,
    status: "active",
    lastUpdated: "1 week ago",
    createdBy: "Dr. Sarah Ibrahim",
    description: "Wakala and Mudarabah-based investment fund structures and regulatory compliance"
  }
]

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Infrastructure_Sukuk_Prospectus.pdf",
    type: "Sukuk Prospectus",
    size: "5.2 MB",
    uploadDate: "Dec 15, 2024",
    status: "compliant",
    complianceScore: 92,
    extractedData: {}
  },
  {
    id: "2",
    name: "Equipment_Lease_Agreement.pdf",
    type: "Ijārah Contract",
    size: "2.4 MB",
    uploadDate: "Dec 14, 2024",
    status: "needs-review",
    complianceScore: 78,
    extractedData: {}
  },
  {
    id: "3",
    name: "Murabaha_Terms_Sheet.docx",
    type: "Terms Sheet",
    size: "456 KB",
    uploadDate: "Dec 12, 2024",
    status: "compliant",
    complianceScore: 95,
    extractedData: {}
  },
  {
    id: "4",
    name: "Compliance_Checklist.pdf",
    type: "Compliance Document",
    size: "1.1 MB",
    uploadDate: "Dec 10, 2024",
    status: "processing",
    complianceScore: 0,
    extractedData: {}
  }
]

const defaultColumns: TableColumn[] = [
  { id: "name", name: "Document Name", type: "text", visible: true },
  { id: "type", name: "Type", type: "text", visible: true },
  { id: "status", name: "Status", type: "compliance", visible: true },
  { id: "uploadDate", name: "Upload Date", type: "date", visible: true },
  { id: "complianceScore", name: "Compliance Score", type: "percentage", visible: true },
  { id: "size", name: "Size", type: "text", visible: false }
]

const mockMembers: ProjectMember[] = [
  {
    id: "1",
    name: "Ahmad Rahman",
    email: "ahmad.rahman@company.com",
    role: "editor",
    avatar: "AR"
  },
  {
    id: "2",
    name: "Dr. Hassan Ali",
    email: "hassan.ali@company.com",
    role: "reviewer",
    avatar: "HA"
  },
  {
    id: "3",
    name: "Fatima Al-Zahra",
    email: "fatima.zahra@company.com",
    role: "viewer",
    avatar: "FZ"
  }
]