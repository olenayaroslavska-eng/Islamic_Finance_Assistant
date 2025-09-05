import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, Calendar, Globe, Building, Mail, MapPin, User, CreditCard, Upload, X, FileText, Percent, DollarSign, Loader2, RotateCcw, ScrollText, Sparkles, Settings2, ChevronDown, ChevronUp, Clock, ShieldCheck, CheckCircle, Users, PenTool, Send, Eye, Code, Blocks, ExternalLink, Copy, Download, RefreshCw, AlertCircle, Zap, Calculator, Info, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { Switch } from "./ui/switch"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { toast } from "sonner@2.0.3"

interface WizardStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  completed: boolean
  phase: string
}

interface FormData {
  // Phase 1: Information Gathering
  agreementDate: { day: string; month: string; year: string }
  jurisdiction: string
  financierLegalName: string
  financierRegistrationNumber: string
  financierBusinessAddress: string
  financierRegisteredAddress: string
  financierServiceAddress: string
  financierServiceEmail: string
  customerLegalName: string
  customerRegistrationNumber: string
  customerBusinessAddress: string
  customerRegisteredAddress: string
  customerServiceAddress: string
  customerServiceEmail: string
  facilityAmount: string
  facilityCurrency: string
  facilityPurpose: string
  profitRate: string
  maturityDate: { day: string; month: string; year: string }
  paymentTerms: string
  paymentDuration: string
  availabilityStartDate: { day: string; month: string; year: string }
  availabilityEndDate: { day: string; month: string; year: string }
  requestedAmount: string
  requestDate: { day: string; month: string; year: string }
  transactionDate: { day: string; month: string; year: string }
  commodityDescription: string
  commodityLocation: string
  costPrice: string
  murabahaProfit: string
  deferredSalePrice: string
  transactionMaturityDate: { day: string; month: string; year: string }
  acceptanceConfirmed: boolean
  propertyDetails: string
  sellingBrokerName: string
  sellingBrokerContact: string
  purchasingBrokerName: string
  purchasingBrokerContact: string
  bankName: string
  accountNumber: string
  iban: string
  swiftCode: string
  
  // Phase 2: AI Processing
  processingComplete: boolean
  draftContract: string
  
  // Phase 3: AI Optimization
  recommendations: {
    profitCalculation: boolean
    earlySettlement: boolean
    latePayment: boolean
  }
  optimizations: {
    paymentSchedule: boolean
    riskAssessment: boolean
    shariahCompliance: boolean
    agencyAppoint: boolean
    collateralSecurity: boolean
    forceMajeure: boolean
    documentationStandards: boolean
    disputeResolution: boolean
    debtCollection: boolean
    assignmentRights: boolean
    liabilityExclusions: boolean
    terminationConditions: boolean
    currencyExchange: boolean
    insuranceReqs: boolean
  }
  
  // Phase 4: Finalization
  contractApproved: boolean
  
  // Phase 5: Signing
  signatures: {
    projectManager: { status: 'pending' | 'signed'; timestamp?: string }
    customer: { status: 'pending' | 'signed'; timestamp?: string }
    financier: { status: 'pending' | 'signed'; timestamp?: string }
  }
  
  // Phase 6: Smart Contract
  blockchainMapping: {
    facilitySetup: boolean
    purchaseRequest: boolean
    paymentTerms: boolean
    earlySettlement: boolean
  }
  smartContractGenerated: boolean
  smartContractDeployed: boolean
  contractAddress: string
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

interface MurabahWizardProps {
  onBack: () => void
  onComplete: () => void
  resumeDraft?: Draft | null
}

export function MurabahWizard({ onBack, onComplete, resumeDraft }: MurabahWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [lastSaved, setLastSaved] = useState(new Date())
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isResuming, setIsResuming] = useState(!!resumeDraft)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [showCorruptedDraftDialog, setShowCorruptedDraftDialog] = useState(false)
  const [draftId] = useState(() => resumeDraft?.id || `draft-${Date.now()}`)
  const [formData, setFormData] = useState<FormData>({
    // Phase 1 defaults
    agreementDate: { day: "", month: "", year: "" },
    jurisdiction: "",
    financierLegalName: "",
    financierRegistrationNumber: "",
    financierBusinessAddress: "",
    financierRegisteredAddress: "",
    financierServiceAddress: "",
    financierServiceEmail: "",
    customerLegalName: "",
    customerRegistrationNumber: "",
    customerBusinessAddress: "",
    customerRegisteredAddress: "",
    customerServiceAddress: "",
    customerServiceEmail: "",
    facilityAmount: "",
    facilityCurrency: "USD",
    facilityPurpose: "",
    profitRate: "",
    maturityDate: { day: "", month: "", year: "" },
    paymentTerms: "",
    paymentDuration: "",
    availabilityStartDate: { day: "", month: "", year: "" },
    availabilityEndDate: { day: "", month: "", year: "" },
    requestedAmount: "",
    requestDate: { day: "", month: "", year: "" },
    transactionDate: { day: "", month: "", year: "" },
    commodityDescription: "",
    commodityLocation: "",
    costPrice: "",
    murabahaProfit: "",
    deferredSalePrice: "",
    transactionMaturityDate: { day: "", month: "", year: "" },
    acceptanceConfirmed: false,
    propertyDetails: "",
    sellingBrokerName: "",
    sellingBrokerContact: "",
    purchasingBrokerName: "",
    purchasingBrokerContact: "",
    bankName: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
    
    // Phase 2 defaults
    processingComplete: false,
    draftContract: "",
    
    // Phase 3 defaults
    recommendations: {
      profitCalculation: false,
      earlySettlement: false,
      latePayment: false
    },
    optimizations: {
      paymentSchedule: false,
      riskAssessment: false,
      shariahCompliance: false,
      agencyAppoint: false,
      collateralSecurity: false,
      forceMajeure: false,
      documentationStandards: false,
      disputeResolution: false,
      debtCollection: false,
      assignmentRights: false,
      liabilityExclusions: false,
      terminationConditions: false,
      currencyExchange: false,
      insuranceReqs: false
    },
    
    // Phase 4 defaults
    contractApproved: false,
    
    // Phase 5 defaults
    signatures: {
      projectManager: { status: 'pending' },
      customer: { status: 'pending' },
      financier: { status: 'pending' }
    },
    
    // Phase 6 defaults
    blockchainMapping: {
      facilitySetup: false,
      purchaseRequest: false,
      paymentTerms: false,
      earlySettlement: false
    },
    smartContractGenerated: false,
    smartContractDeployed: false,
    contractAddress: ""
  })

  const phases = [
    {
      name: "Information Gathering",
      steps: [0, 1, 2, 3, 4, 5]
    },
    {
      name: "AI Drafting", 
      steps: [6, 7]
    },
    {
      name: "AI Optimization",
      steps: [8, 9]
    },
    {
      name: "Finalization",
      steps: [10, 11]
    },
    {
      name: "Signing",
      steps: [12, 13, 14]
    },
    {
      name: "Smart Contract Deployment",
      steps: [15, 16, 17]
    }
  ]

  const steps: WizardStep[] = [
    // Phase 1: Information Gathering
    { id: "agreement-setup", title: "Agreement Setup", description: "Define contract terms and parties", icon: Calendar, completed: false, phase: "Information Gathering" },
    { id: "financier-info", title: "Financier Information", description: "Bank or financial institution details", icon: Building, completed: false, phase: "Information Gathering" },
    { id: "customer-info", title: "Customer Information", description: "Client information and requirements", icon: User, completed: false, phase: "Information Gathering" },
    { id: "facility-config", title: "Facility Configuration", description: "Financing terms and conditions", icon: CreditCard, completed: false, phase: "Information Gathering" },
    { id: "transaction-structure", title: "Transaction Structure", description: "Trade and commodity details", icon: Globe, completed: false, phase: "Information Gathering" },
    { id: "documentation", title: "Supporting Documentation", description: "Generate required documentation", icon: FileText, completed: false, phase: "Information Gathering" },
    
    // Phase 2: AI Drafting
    { id: "data-processing", title: "Data Processing", description: "Validating and processing input data", icon: Loader2, completed: false, phase: "AI Drafting" },
    { id: "draft-creation", title: "Draft Creation", description: "AI generating contract draft", icon: ScrollText, completed: false, phase: "AI Drafting" },
    
    // Phase 3: AI Optimization
    { id: "ai-recommendations", title: "AI Recommendations", description: "Smart contract enhancement suggestions", icon: Sparkles, completed: false, phase: "AI Optimization" },
    { id: "advanced-optimization", title: "Advanced Optimization", description: "Fine-tune contract provisions", icon: Settings2, completed: false, phase: "AI Optimization" },
    
    // Phase 4: Finalization
    { id: "final-review", title: "Final Review", description: "Review optimized contract", icon: Eye, completed: false, phase: "Finalization" },
    { id: "contract-approval", title: "Contract Approval", description: "Approve the final contract version", icon: ShieldCheck, completed: false, phase: "Finalization" },
    
    // Phase 5: Signing
    { id: "signature-distribution", title: "Signature Distribution", description: "Send contract for signatures", icon: Send, completed: false, phase: "Signing" },
    { id: "signature-collection", title: "Signature Collection", description: "Track signature progress", icon: Users, completed: false, phase: "Signing" },
    { id: "contract-execution", title: "Contract Execution", description: "Complete contract execution", icon: PenTool, completed: false, phase: "Signing" },
    
    // Phase 6: Smart Contract Deployment
    { id: "blockchain-mapping", title: "Blockchain Mapping", description: "Map contract clauses to blockchain", icon: Blocks, completed: false, phase: "Smart Contract Deployment" },
    { id: "smart-contract-generation", title: "Smart Contract Generation", description: "Generate blockchain smart contract", icon: Code, completed: false, phase: "Smart Contract Deployment" },
    { id: "deployment", title: "Deployment", description: "Deploy to blockchain network", icon: Zap, completed: false, phase: "Smart Contract Deployment" }
  ]

  const jurisdictions = [
    "Malaysia", "United Arab Emirates", "Saudi Arabia", "Kuwait", "Qatar", "Bahrain", "Oman", "Singapore", "United Kingdom", "United States"
  ]

  const currencies = [
    { value: "USD", label: "USD ($)", symbol: "$" },
    { value: "EUR", label: "EUR (€)", symbol: "€" },
    { value: "GBP", label: "GBP (£)", symbol: "£" },
    { value: "MYR", label: "MYR (RM)", symbol: "RM" },
    { value: "AED", label: "AED (د.إ)", symbol: "د.إ" },
    { value: "SAR", label: "SAR (ر.س)", symbol: "ر.س" },
    { value: "KWD", label: "KWD (د.ك)", symbol: "د.ك" },
    { value: "QAR", label: "QAR (ر.ق)", symbol: "ر.ق" },
    { value: "BHD", label: "BHD (.د.ب)", symbol: ".د.ب" },
    { value: "OMR", label: "OMR (ر.ع.)", symbol: "ر.ع." }
  ]

  const paymentTermsOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "semi-annual", label: "Semi-Annual" },
    { value: "annual", label: "Annual" }
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())
  const months = [
    { value: "01", label: "January" }, { value: "02", label: "February" }, { value: "03", label: "March" },
    { value: "04", label: "April" }, { value: "05", label: "May" }, { value: "06", label: "June" },
    { value: "07", label: "July" }, { value: "08", label: "August" }, { value: "09", label: "September" },
    { value: "10", label: "October" }, { value: "11", label: "November" }, { value: "12", label: "December" }
  ]
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"))

  // Initialize with resume draft data
  useEffect(() => {
    if (resumeDraft) {
      try {
        if (resumeDraft.formData && typeof resumeDraft.formData === 'object') {
          setFormData(resumeDraft.formData)
          setCurrentStep(resumeDraft.currentStep || 0)
          setLastSaved(new Date(resumeDraft.lastEdited))
        } else {
          // Corrupted or missing form data
          throw new Error('Invalid draft data')
        }
      } catch (error) {
        console.error('Failed to restore draft:', error)
        setShowCorruptedDraftDialog(true)
        setIsResuming(false)
      }
    }
  }, [resumeDraft])

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft()
    }, 2000)
    return () => clearTimeout(timer)
  }, [formData, currentStep])

  const saveDraft = () => {
    try {
      const draftData = {
        id: draftId,
        contractType: "Commodity Murabaha",
        createdDate: resumeDraft?.createdDate || new Date().toLocaleDateString(),
        lastEdited: new Date().toLocaleString(),
        status: "draft" as const,
        currentStep,
        totalSteps: steps.length,
        stepName: steps[currentStep]?.title || "",
        formData
      }

      // Save to localStorage (in real app this would be API call)
      const existingDrafts = JSON.parse(localStorage.getItem('murabah_drafts') || '[]')
      const draftIndex = existingDrafts.findIndex((d: Draft) => d.id === draftId)
      
      if (draftIndex >= 0) {
        existingDrafts[draftIndex] = draftData
      } else {
        existingDrafts.push(draftData)
      }
      
      localStorage.setItem('murabah_drafts', JSON.stringify(existingDrafts))
      setLastSaved(new Date())
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('draftsUpdated'))
      
      // Only show toast if not resuming (to avoid spam on initial load)
      if (!isResuming) {
        toast("Draft saved", { duration: 1000 })
      }
    } catch (error) {
      console.error('Failed to save draft:', error)
      toast.error("Failed to save draft")
    }
  }

  const handleDiscardDraft = () => {
    // Remove from localStorage
    const existingDrafts = JSON.parse(localStorage.getItem('murabah_drafts') || '[]')
    const filteredDrafts = existingDrafts.filter((d: Draft) => d.id !== draftId)
    localStorage.setItem('murabah_drafts', JSON.stringify(filteredDrafts))
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('draftsUpdated'))
    
    toast.success("Draft discarded")
    onBack()
  }

  const updateFormData = (field: string, value: string | boolean | object) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateNestedFormData = (parent: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...(prev[parent as keyof FormData] as any), [field]: value }
    }))
    // Trigger autosave on form data change
    setTimeout(saveDraft, 1000)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      onBack()
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    setUploadedFiles(prev => [...prev, ...newFiles])
    toast.success(`${newFiles.length} file(s) uploaded`)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const startProcessing = () => {
    setProcessingProgress(0)
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          updateFormData('processingComplete', true)
          toast.success("Contract draft generated successfully!")
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const generateDraft = () => {
    const draft = `COMMODITY MURABAHA AGREEMENT

This Agreement is entered into on ${formData.agreementDate.day}/${formData.agreementDate.month}/${formData.agreementDate.year}

PARTIES:
Financier: ${formData.financierLegalName}
Customer: ${formData.customerLegalName}

FACILITY DETAILS:
Amount: ${currencies.find(c => c.value === formData.facilityCurrency)?.symbol}${formData.facilityAmount}
Purpose: ${formData.facilityPurpose}
Profit Rate: ${formData.profitRate}% per annum

TRANSACTION STRUCTURE:
Commodity: ${formData.commodityDescription}
Location: ${formData.commodityLocation}
Cost Price: ${currencies.find(c => c.value === formData.facilityCurrency)?.symbol}${formData.costPrice}
Profit: ${currencies.find(c => c.value === formData.facilityCurrency)?.symbol}${formData.murabahaProfit}
Sale Price: ${currencies.find(c => c.value === formData.facilityCurrency)?.symbol}${formData.deferredSalePrice}

GOVERNING LAW: ${formData.jurisdiction}`

    updateFormData('draftContract', draft)
  }

  const handleSendForSigning = () => {
    toast.success("Contract sent for signatures")
    // In real implementation, this would trigger signature collection
  }

  const handleSmartContractDeploy = () => {
    updateFormData('smartContractDeployed', true)
    updateFormData('contractAddress', `0x${Math.random().toString(16).slice(2, 42)}`)
    toast.success("Smart contract deployed successfully!")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Agreement Setup
        return (
          <div className="space-y-6 max-w-[640px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date of Agreement</Label>
                <div className="flex space-x-2">
                  <Select value={formData.agreementDate.day} onValueChange={(value) => updateNestedFormData("agreementDate", "day", value)}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={formData.agreementDate.month} onValueChange={(value) => updateNestedFormData("agreementDate", "month", value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={formData.agreementDate.year} onValueChange={(value) => updateNestedFormData("agreementDate", "year", value)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Governing Jurisdiction</Label>
                <Select value={formData.jurisdiction} onValueChange={(value) => updateFormData("jurisdiction", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select governing jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map(jurisdiction => (
                      <SelectItem key={jurisdiction} value={jurisdiction}>{jurisdiction}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Defines the legal framework of the agreement.
                </p>
              </div>
            </div>
          </div>
        )

      case 1: // Financier Information
        return (
          <div className="space-y-6 max-w-[640px]">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Legal Name *</Label>
                <Input
                  value={formData.financierLegalName}
                  onChange={(e) => updateFormData("financierLegalName", e.target.value)}
                  placeholder="Enter institution legal name"
                />
              </div>
              <div className="space-y-2">
                <Label>Registration Number *</Label>
                <Input
                  value={formData.financierRegistrationNumber}
                  onChange={(e) => updateFormData("financierRegistrationNumber", e.target.value)}
                  placeholder="e.g. 200801234567"
                />
              </div>
              <div className="space-y-2">
                <Label>Business Address *</Label>
                <Textarea
                  value={formData.financierBusinessAddress}
                  onChange={(e) => updateFormData("financierBusinessAddress", e.target.value)}
                  placeholder="Enter complete business address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Registered Address</Label>
                <Textarea
                  value={formData.financierRegisteredAddress}
                  onChange={(e) => updateFormData("financierRegisteredAddress", e.target.value)}
                  placeholder="Enter registered address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Service Address</Label>
                <Textarea
                  value={formData.financierServiceAddress}
                  onChange={(e) => updateFormData("financierServiceAddress", e.target.value)}
                  placeholder="Enter service address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Service Email *</Label>
                <Input
                  type="email"
                  value={formData.financierServiceEmail}
                  onChange={(e) => updateFormData("financierServiceEmail", e.target.value)}
                  placeholder="contracts@institution.com"
                />
              </div>
            </div>
          </div>
        )

      case 2: // Customer Information
        return (
          <div className="space-y-6 max-w-[640px]">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Legal Name *</Label>
                <Input
                  value={formData.customerLegalName}
                  onChange={(e) => updateFormData("customerLegalName", e.target.value)}
                  placeholder="Enter legal name"
                />
              </div>
              <div className="space-y-2">
                <Label>Registration Number (company) OR ID Number (individual) *</Label>
                <Input
                  value={formData.customerRegistrationNumber}
                  onChange={(e) => updateFormData("customerRegistrationNumber", e.target.value)}
                  placeholder="Enter registration or ID number"
                />
              </div>
              <div className="space-y-2">
                <Label>Business Address</Label>
                <Textarea
                  value={formData.customerBusinessAddress}
                  onChange={(e) => updateFormData("customerBusinessAddress", e.target.value)}
                  placeholder="Enter business address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Service Email</Label>
                <Input
                  type="email"
                  value={formData.customerServiceEmail}
                  onChange={(e) => updateFormData("customerServiceEmail", e.target.value)}
                  placeholder="Enter service email"
                />
              </div>
            </div>
          </div>
        )

      case 3: // Facility Configuration
        return (
          <div className="space-y-6 max-w-[640px]">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Facility Amount *</Label>
                  <Input
                    type="number"
                    value={formData.facilityAmount}
                    onChange={(e) => updateFormData("facilityAmount", e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency *</Label>
                  <Select value={formData.facilityCurrency} onValueChange={(value) => updateFormData("facilityCurrency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(currency => (
                        <SelectItem key={currency.value} value={currency.value}>{currency.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Purpose of Facility *</Label>
                <Textarea
                  value={formData.facilityPurpose}
                  onChange={(e) => updateFormData("facilityPurpose", e.target.value)}
                  placeholder="Describe the purpose of this financing facility"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Profit Rate (%) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.profitRate}
                  onChange={(e) => updateFormData("profitRate", e.target.value)}
                  placeholder="e.g. 5.25"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Terms *</Label>
                <Select value={formData.paymentTerms} onValueChange={(value) => updateFormData("paymentTerms", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermsOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Duration *</Label>
                <Input
                  value={formData.paymentDuration}
                  onChange={(e) => updateFormData("paymentDuration", e.target.value)}
                  placeholder="e.g. 12 months, 2 years"
                />
              </div>
            </div>
          </div>
        )

      case 4: // Transaction Structure
        return (
          <div className="space-y-6 max-w-[640px]">
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-primary">Purchase Request</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Requested Amount *</Label>
                    <Input
                      type="number"
                      value={formData.requestedAmount}
                      onChange={(e) => updateFormData("requestedAmount", e.target.value)}
                      placeholder="Enter requested amount"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 text-primary">Commodity Sale Offer</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Commodity Description *</Label>
                    <Textarea
                      value={formData.commodityDescription}
                      onChange={(e) => updateFormData("commodityDescription", e.target.value)}
                      placeholder="Describe the commodity being traded"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Commodity Location *</Label>
                    <Input
                      value={formData.commodityLocation}
                      onChange={(e) => updateFormData("commodityLocation", e.target.value)}
                      placeholder="Enter commodity location"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Cost Price *</Label>
                      <Input
                        type="number"
                        value={formData.costPrice}
                        onChange={(e) => updateFormData("costPrice", e.target.value)}
                        placeholder="Cost price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Profit Amount *</Label>
                      <Input
                        type="number"
                        value={formData.murabahaProfit}
                        onChange={(e) => updateFormData("murabahaProfit", e.target.value)}
                        placeholder="Profit amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sale Price *</Label>
                      <Input
                        type="number"
                        value={formData.deferredSalePrice}
                        onChange={(e) => updateFormData("deferredSalePrice", e.target.value)}
                        placeholder="Final sale price"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 text-primary">Acceptance Confirmation</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptance"
                    checked={formData.acceptanceConfirmed}
                    onCheckedChange={(checked) => updateFormData("acceptanceConfirmed", checked === true)}
                  />
                  <Label htmlFor="acceptance">Confirm acceptance of transaction structure</Label>
                </div>
              </div>
            </div>
          </div>
        )

      case 5: // Supporting Documentation
        return (
          <div className="space-y-6 max-w-[640px]">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Property Details</Label>
                <Textarea
                  value={formData.propertyDetails}
                  onChange={(e) => updateFormData("propertyDetails", e.target.value)}
                  placeholder="Enter property details"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Selling Broker Name</Label>
                  <Input
                    value={formData.sellingBrokerName}
                    onChange={(e) => updateFormData("sellingBrokerName", e.target.value)}
                    placeholder="Broker name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selling Broker Contact</Label>
                  <Input
                    value={formData.sellingBrokerContact}
                    onChange={(e) => updateFormData("sellingBrokerContact", e.target.value)}
                    placeholder="Contact details"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purchasing Broker Name</Label>
                  <Input
                    value={formData.purchasingBrokerName}
                    onChange={(e) => updateFormData("purchasingBrokerName", e.target.value)}
                    placeholder="Broker name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purchasing Broker Contact</Label>
                  <Input
                    value={formData.purchasingBrokerContact}
                    onChange={(e) => updateFormData("purchasingBrokerContact", e.target.value)}
                    placeholder="Contact details"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Banking Information</Label>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    value={formData.bankName}
                    onChange={(e) => updateFormData("bankName", e.target.value)}
                    placeholder="Bank name"
                  />
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData("accountNumber", e.target.value)}
                    placeholder="Account number"
                  />
                  <Input
                    value={formData.iban}
                    onChange={(e) => updateFormData("iban", e.target.value)}
                    placeholder="IBAN (optional)"
                  />
                  <Input
                    value={formData.swiftCode}
                    onChange={(e) => updateFormData("swiftCode", e.target.value)}
                    placeholder="SWIFT code (optional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Supporting Documents</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                    Choose Files
                  </Button>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 6: // Data Processing
        return (
          <div className="flex flex-col items-center justify-center min-h-[500px] max-w-[640px] mx-auto">
            <Card className="w-full">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <div>
                    <h3 className="mb-2">Processing Contract Data</h3>
                    <p className="text-muted-foreground">
                      Please wait while we validate and process your information...
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Data completeness check</span>
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Field validation</span>
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Shariah structure compliance check</span>
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Drafting agreement text</span>
                        {processingProgress < 100 ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress value={processingProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">
                        Average processing time: 2-3 minutes
                      </p>
                    </div>

                    {!formData.processingComplete && (
                      <Button onClick={startProcessing} className="w-full">
                        Start Processing
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 7: // Draft Creation
        return (
          <div className="flex gap-6 h-full max-w-none">
            <div className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Contract Draft</CardTitle>
                  <CardDescription>Generated contract ready for review</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="whitespace-pre-wrap text-sm font-mono p-4 bg-muted/50 rounded">
                      {formData.draftContract || "No draft generated yet. Click 'Generate Draft' to create the contract."}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={generateDraft} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-80">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">DATE</Label>
                    <p className="text-sm">{formData.agreementDate.day}/{formData.agreementDate.month}/{formData.agreementDate.year}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">JURISDICTION</Label>
                    <p className="text-sm">{formData.jurisdiction}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">FACILITY AMOUNT</Label>
                    <p className="text-sm">{currencies.find(c => c.value === formData.facilityCurrency)?.symbol}{formData.facilityAmount}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">PROFIT RATE</Label>
                    <p className="text-sm">{formData.profitRate}% per annum</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">FINANCIER</Label>
                    <p className="text-sm">{formData.financierLegalName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">CUSTOMER</Label>
                    <p className="text-sm">{formData.customerLegalName}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 8: // AI Recommendations
        return (
          <div className="space-y-6 max-w-[800px]">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profit Calculation Verification</CardTitle>
                      <CardDescription>Verify and optimize profit calculations</CardDescription>
                    </div>
                    <Switch
                      checked={formData.recommendations.profitCalculation}
                      onCheckedChange={(checked) => 
                        updateNestedFormData("recommendations", "profitCalculation", checked)
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Recalculate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Early Settlement (Ibra) Clause</CardTitle>
                      <CardDescription>Add provisions for early settlement with rebate</CardDescription>
                    </div>
                    <Switch
                      checked={formData.recommendations.earlySettlement}
                      onCheckedChange={(checked) => 
                        updateNestedFormData("recommendations", "earlySettlement", checked)
                      }
                    />
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Late Payment Terms</CardTitle>
                      <CardDescription>Include Shariah-compliant late payment provisions</CardDescription>
                    </div>
                    <Switch
                      checked={formData.recommendations.latePayment}
                      onCheckedChange={(checked) => 
                        updateNestedFormData("recommendations", "latePayment", checked)
                      }
                    />
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        )

      case 9: // Advanced Optimization
        return (
          <div className="flex gap-6 max-w-none">
            <div className="flex-1 space-y-4">
              <h3>Advanced Contract Clauses</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.optimizations).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            updateNestedFormData("optimizations", key, checked)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="w-80">
              <Card>
                <CardHeader>
                  <CardTitle>Active Optimizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(formData.optimizations)
                      .filter(([_, enabled]) => enabled)
                      .map(([key]) => (
                        <Badge key={key} variant="secondary" className="mr-2">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 10: // Final Review
        return (
          <div className="space-y-6 max-w-[800px]">
            <Card>
              <CardHeader>
                <CardTitle>Contract Preview</CardTitle>
                <CardDescription>Review the optimized contract with AI enhancements highlighted</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="whitespace-pre-wrap text-sm space-y-2">
                    <div className="p-2 bg-green-50 border-l-4 border-green-500">
                      <span className="text-green-800">AI-added: Enhanced Shariah compliance verification</span>
                    </div>
                    <div className="p-2 bg-amber-50 border-l-4 border-amber-500">
                      <span className="text-amber-800">AI-modified: Payment schedule optimization</span>
                    </div>
                    <div className="font-mono text-xs bg-muted/50 p-4 rounded">
                      {formData.draftContract}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Changes Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm">3 clauses added for enhanced compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span className="text-sm">2 clauses modified for optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">1 outstanding check: Legal review recommended</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 11: // Contract Approval
        return (
          <div className="flex flex-col items-center justify-center min-h-[500px] max-w-[640px] mx-auto">
            {!formData.contractApproved ? (
              <Card className="w-full">
                <CardContent className="p-8 text-center">
                  <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="mb-2">Contract Approval Required</h3>
                  <p className="text-muted-foreground mb-6">
                    Do you want to approve this contract and generate the final publication-ready version?
                    Once approved, the contract will be locked and prepared for signing.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={handleBack}>Cancel</Button>
                    <Button onClick={() => updateFormData('contractApproved', true)}>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Approve Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="w-full space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <p className="text-green-800">Contract approved successfully. Ready for digital signing.</p>
                  </div>
                </div>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="mb-2">Contract Finalization Complete</h3>
                    <p className="text-muted-foreground mb-6">
                      The contract has been finalized and locked. Continue to the digital signing process.
                    </p>
                    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded border">
                      <p><strong>Contract ID:</strong> MUR-{currentYear}-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                      <p><strong>Status:</strong> Approved & Ready for Signing</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )

      case 12: // Signature Distribution
        return (
          <div className="space-y-6 max-w-[640px]">
            <Card>
              <CardHeader>
                <CardTitle>Signature Distribution</CardTitle>
                <CardDescription>Send contract to all parties for digital signatures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Project Manager</p>
                        <p className="text-xs text-muted-foreground">Internal approval signature</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Customer</p>
                        <p className="text-xs text-muted-foreground">{formData.customerLegalName}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Financier</p>
                        <p className="text-xs text-muted-foreground">{formData.financierLegalName}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>

                <Button onClick={handleSendForSigning} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send for Signing
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case 13: // Signature Collection
        return (
          <div className="space-y-6 max-w-[640px]">
            <Card>
              <CardHeader>
                <CardTitle>Signature Collection Dashboard</CardTitle>
                <CardDescription>Real-time tracking of signature progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>2 of 3 collected</span>
                  </div>
                  <Progress value={67} className="w-full" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Project Manager</p>
                        <p className="text-xs text-muted-foreground">Signed at 2:15 PM</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Signed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Customer</p>
                        <p className="text-xs text-muted-foreground">Signed at 3:42 PM</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Signed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Financier</p>
                        <p className="text-xs text-muted-foreground">Awaiting signature</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 14: // Contract Execution
        return (
          <div className="space-y-6 max-w-[640px]">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <p className="text-green-800">Contract Fully Executed</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contract Execution Complete</CardTitle>
                <CardDescription>All parties have signed the contract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Signed Copy (PDF)
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export Audit Trail
                  </Button>
                </div>

                <div className="border rounded p-4">
                  <h4 className="text-sm font-medium mb-3">Signature Timeline</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Project Manager</span>
                      <span>Today 2:15 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer</span>
                      <span>Today 3:42 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Financier</span>
                      <span>Today 4:18 PM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 15: // Blockchain Mapping
        return (
          <div className="space-y-6 max-w-[800px]">
            <h3>Blockchain Contract Mapping</h3>
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Facility Setup → Smart Contract Parameters</p>
                      <p className="text-sm text-muted-foreground">Map facility amount, profit rate, and terms</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.blockchainMapping.facilitySetup ? (
                        <Badge className="bg-green-100 text-green-800">Mapped</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      <Switch
                        checked={formData.blockchainMapping.facilitySetup}
                        onCheckedChange={(checked) => 
                          updateNestedFormData("blockchainMapping", "facilitySetup", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Purchase Request → Transaction Triggers</p>
                      <p className="text-sm text-muted-foreground">Automate purchase request processing</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.blockchainMapping.purchaseRequest ? (
                        <Badge className="bg-green-100 text-green-800">Mapped</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      <Switch
                        checked={formData.blockchainMapping.purchaseRequest}
                        onCheckedChange={(checked) => 
                          updateNestedFormData("blockchainMapping", "purchaseRequest", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Terms → Payment Schedule</p>
                      <p className="text-sm text-muted-foreground">Automate payment scheduling and collection</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.blockchainMapping.paymentTerms ? (
                        <Badge className="bg-green-100 text-green-800">Mapped</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      <Switch
                        checked={formData.blockchainMapping.paymentTerms}
                        onCheckedChange={(checked) => 
                          updateNestedFormData("blockchainMapping", "paymentTerms", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Early Settlement → Ibra Function</p>
                      <p className="text-sm text-muted-foreground">Handle early settlement with rebate calculation</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.blockchainMapping.earlySettlement ? (
                        <Badge className="bg-green-100 text-green-800">Mapped</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      <Switch
                        checked={formData.blockchainMapping.earlySettlement}
                        onCheckedChange={(checked) => 
                          updateNestedFormData("blockchainMapping", "earlySettlement", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 16: // Smart Contract Generation
        return (
          <div className="flex gap-6 max-w-none">
            <div className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Smart Contract Code</CardTitle>
                  <CardDescription>Generated blockchain smart contract</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="code" className="w-full">
                    <TabsList>
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="events">Events</TabsTrigger>
                    </TabsList>
                    <TabsContent value="code">
                      <ScrollArea className="h-[400px]">
                        <pre className="text-xs bg-muted/50 p-4 rounded overflow-x-auto">
{`pragma solidity ^0.8.0;

contract CommodityMurabaha {
    address public financier;
    address public customer;
    uint256 public facilityAmount;
    uint256 public profitRate;
    uint256 public costPrice;
    uint256 public salePrice;
    
    enum ContractState { 
        Active, 
        Executed, 
        EarlySettled 
    }
    
    ContractState public state;
    
    constructor(
        address _customer,
        uint256 _facilityAmount,
        uint256 _profitRate
    ) {
        financier = msg.sender;
        customer = _customer;
        facilityAmount = _facilityAmount;
        profitRate = _profitRate;
        state = ContractState.Active;
    }
    
    function executePurchase(
        uint256 _costPrice
    ) external {
        require(msg.sender == financier);
        costPrice = _costPrice;
        salePrice = _costPrice + 
            (_costPrice * profitRate / 100);
    }
    
    function requestEarlySettlement() 
        external returns (uint256) {
        require(msg.sender == customer);
        // Calculate Ibra (rebate)
        uint256 rebate = calculateIbra();
        state = ContractState.EarlySettled;
        return salePrice - rebate;
    }
    
    function calculateIbra() 
        private view returns (uint256) {
        // Shariah-compliant rebate calculation
        return (salePrice - costPrice) / 2;
    }
}`}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="parameters">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-muted/50 rounded">
                          <span>Facility Amount:</span>
                          <span>{formData.facilityAmount} {formData.facilityCurrency}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/50 rounded">
                          <span>Profit Rate:</span>
                          <span>{formData.profitRate}%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/50 rounded">
                          <span>Cost Price:</span>
                          <span>{formData.costPrice} {formData.facilityCurrency}</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="events">
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-muted/50 rounded">
                          <code>event PurchaseExecuted(uint256 costPrice, uint256 salePrice)</code>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <code>event EarlySettlementRequested(uint256 rebateAmount)</code>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <code>event ContractExecuted()</code>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="w-80">
              <Card>
                <CardHeader>
                  <CardTitle>Validation Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Compiled successfully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Security audit passed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Shariah compliance verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Ready for deployment</span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Validate Again
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => updateFormData('smartContractGenerated', true)}
                    >
                      Continue to Deploy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 17: // Deployment
        return (
          <div className="space-y-6 max-w-[640px]">
            {!formData.smartContractDeployed ? (
              <Card>
                <CardHeader>
                  <CardTitle>Smart Contract Deployment</CardTitle>
                  <CardDescription>Deploy the smart contract to the blockchain network</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-amber-800 font-medium">Deployment Confirmation</p>
                        <p className="text-amber-700 text-sm">
                          This action will deploy the smart contract to the blockchain. 
                          Once deployed, the contract cannot be modified.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSmartContractDeploy} className="flex-1">
                      <Zap className="h-4 w-4 mr-2" />
                      Deploy Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <p className="text-green-800">Smart Contract Successfully Deployed</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Deployment Complete</CardTitle>
                    <CardDescription>Your smart contract is now live on the blockchain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Contract Address:</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <code className="text-xs break-all">{formData.contractAddress}</code>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>

                    <div className="border rounded p-4">
                      <h4 className="text-sm font-medium mb-3">Deployment Log</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>✓ Contract compiled successfully</p>
                        <p>✓ Gas estimation completed</p>
                        <p>✓ Transaction submitted to blockchain</p>
                        <p>✓ Contract deployed and verified</p>
                        <p>✓ All functions tested and operational</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Step {currentStep + 1} content</p>
          </div>
        )
    }
  }

  const getPhaseForStep = (stepIndex: number) => {
    return phases.find(phase => phase.steps.includes(stepIndex))
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
              Return to Assistant
            </Button>
          </div>
          <h1 className="text-xl font-semibold">Commodity Murabaha Wizard</h1>
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length} • {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {phases.map((phase, phaseIndex) => (
              <div key={phaseIndex}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {phase.name}
                </h4>
                <div className="space-y-1">
                  {phase.steps.map((stepIndex) => {
                    const step = steps[stepIndex]
                    const IconComponent = step.icon
                    const isActive = stepIndex === currentStep
                    const isCompleted = stepIndex < currentStep
                    const isAccessible = stepIndex <= currentStep

                    return (
                      <button
                        key={step.id}
                        onClick={() => isAccessible && setCurrentStep(stepIndex)}
                        disabled={!isAccessible}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-accent text-accent-foreground border border-accent"
                            : isCompleted
                            ? "bg-green-50 hover:bg-green-100 border border-transparent text-green-800"
                            : isAccessible
                            ? "hover:bg-muted border border-transparent"
                            : "opacity-50 cursor-not-allowed border border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isCompleted
                              ? "bg-green-600 text-white"
                              : isActive
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted-foreground/20 text-muted-foreground"
                          }`}>
                            {isCompleted ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <IconComponent className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${
                              isActive ? "" : isCompleted ? "" : ""
                            }`}>
                              {step.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {step.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Resume Banner */}
        {isResuming && resumeDraft && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-800">
                    Resuming draft last saved on {resumeDraft.lastEdited}, Step {resumeDraft.currentStep + 1}.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDiscardDialog(true)}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Discard Draft
              </Button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="border-b border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{steps[currentStep]?.title}</h2>
              <p className="text-muted-foreground mt-1">{steps[currentStep]?.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                {getPhaseForStep(currentStep)?.name}
              </Badge>
              <Progress value={((currentStep + 1) / steps.length) * 100} className="w-32" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {renderStepContent()}
            </div>
          </ScrollArea>
        </div>

        {/* Navigation */}
        <div className="border-t border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Draft saved at {lastSaved.toLocaleTimeString()}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Discard Draft Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard this draft? All progress will be lost and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDiscardDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDiscardDraft}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Corrupted Draft Dialog */}
      <AlertDialog open={showCorruptedDraftDialog} onOpenChange={setShowCorruptedDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Draft Could Not Be Restored</AlertDialogTitle>
            <AlertDialogDescription>
              This draft appears to be corrupted or incomplete. Would you like to start a new contract instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCorruptedDraftDialog(false)
              onBack()
            }}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowCorruptedDraftDialog(false)
              setIsResuming(false)
              setCurrentStep(0)
              toast.success("Starting new contract")
            }}>
              Start New Contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}