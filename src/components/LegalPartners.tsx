import { useState } from "react"
import { Search, Filter, MapPin, Phone, Mail, FileText, Send, Building2, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { toast } from "sonner@2.0.3"

type PartnerSpecialty = "Islamic Finance" | "Contract Law" | "Regulatory Compliance" | "Corporate Law" | "Banking Law" | "Securities"
type EngagementStatus = "active" | "pending" | "completed" | "cancelled"

interface LegalPartner {
  id: string
  name: string
  location: string
  region: string
  specialties: PartnerSpecialty[]
  description: string
  fullDescription: string
  contact: {
    phone: string
    email: string
    website?: string
  }
  activeEngagements: Engagement[]
  avatar: string
}

interface Engagement {
  id: string
  title: string
  status: EngagementStatus
  startDate: string
  description: string
}

interface Document {
  id: string
  name: string
  uploadDate: string
}

export function LegalPartners() {
  const [partners] = useState<LegalPartner[]>(mockPartners)
  const [filteredPartners, setFilteredPartners] = useState<LegalPartner[]>(mockPartners)
  const [searchTerm, setSearchTerm] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  
  // Sheet and modal states
  const [selectedPartner, setSelectedPartner] = useState<LegalPartner | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [engagementModalOpen, setEngagementModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string>("")
  const [engagementNotes, setEngagementNotes] = useState("")

  // Mock documents from previous uploads
  const availableDocuments: Document[] = [
    { id: "doc1", name: "Equipment_Lease_Agreement.pdf", uploadDate: "Dec 15, 2024" },
    { id: "doc2", name: "Murabaha_Contract_Draft.pdf", uploadDate: "Dec 14, 2024" },
    { id: "doc3", name: "Sukuk_Prospectus.pdf", uploadDate: "Dec 12, 2024" },
    { id: "doc4", name: "Investment_Policy.docx", uploadDate: "Dec 10, 2024" }
  ]

  // Apply filters
  const applyFilters = () => {
    let filtered = partners

    if (searchTerm) {
      filtered = filtered.filter(partner => 
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        partner.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (specialtyFilter !== "all") {
      filtered = filtered.filter(partner => 
        partner.specialties.includes(specialtyFilter as PartnerSpecialty)
      )
    }

    if (regionFilter !== "all") {
      filtered = filtered.filter(partner => partner.region === regionFilter)
    }

    setFilteredPartners(filtered)
  }

  // Handle search and filter changes
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters()
  }

  const handleSpecialtyFilter = (value: string) => {
    setSpecialtyFilter(value)
    applyFilters()
  }

  const handleRegionFilter = (value: string) => {
    setRegionFilter(value)
    applyFilters()
  }

  // Handle partner interactions
  const handlePartnerClick = (partner: LegalPartner) => {
    setSelectedPartner(partner)
    setSheetOpen(true)
  }

  const handleRequestReview = (partner: LegalPartner, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedPartner(partner)
    setEngagementModalOpen(true)
  }

  const handleStartNewEngagement = () => {
    setSheetOpen(false)
    setEngagementModalOpen(true)
  }

  const handleSubmitEngagement = () => {
    if (!selectedDocument || !engagementNotes.trim()) {
      toast("Please select a document and add notes")
      return
    }

    toast("Review request sent successfully")
    setEngagementModalOpen(false)
    setSelectedDocument("")
    setEngagementNotes("")
    setSelectedPartner(null)
  }

  // Get engagement status badge
  const getEngagementStatusBadge = (status: EngagementStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-chart-2 text-white">Active</Badge>
      case "pending":
        return <Badge className="bg-chart-3 text-white">Pending</Badge>
      case "completed":
        return <Badge variant="outline" className="text-muted-foreground">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-muted text-muted-foreground">Cancelled</Badge>
    }
  }

  // Get partner initials for avatar
  const getPartnerInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  // Empty state
  if (filteredPartners.length === 0 && searchTerm === "" && specialtyFilter === "all" && regionFilter === "all") {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div>
            <h1>Legal Partners</h1>
            <p className="text-muted-foreground mt-1">Engage with law firms for contract drafting and compliance review</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="mb-2">No legal partners available yet</h3>
              <p className="text-muted-foreground">
                Please check back soon. We're working to connect you with qualified law firms and compliance experts.
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
        <div>
          <h1>Legal Partners</h1>
          <p className="text-muted-foreground mt-1">Engage with law firms for contract drafting and compliance review</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by name or specialty"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <Select value={specialtyFilter} onValueChange={handleSpecialtyFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="Islamic Finance">Islamic Finance</SelectItem>
              <SelectItem value="Contract Law">Contract Law</SelectItem>
              <SelectItem value="Regulatory Compliance">Regulatory Compliance</SelectItem>
              <SelectItem value="Corporate Law">Corporate Law</SelectItem>
              <SelectItem value="Banking Law">Banking Law</SelectItem>
              <SelectItem value="Securities">Securities</SelectItem>
            </SelectContent>
          </Select>

          <Select value={regionFilter} onValueChange={handleRegionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Malaysia">Malaysia</SelectItem>
              <SelectItem value="Singapore">Singapore</SelectItem>
              <SelectItem value="UAE">UAE</SelectItem>
              <SelectItem value="Indonesia">Indonesia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="flex-1 overflow-auto p-6">
        {filteredPartners.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="mb-2">No partners found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <Card 
                key={partner.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-1 hover:border-primary/60"
                onClick={() => handlePartnerClick(partner)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getPartnerInitials(partner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base mb-1 line-clamp-1">{partner.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>{partner.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {partner.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {partner.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{partner.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {partner.description}
                  </p>
                  <Button 
                    className="w-full"
                    onClick={(e) => handleRequestReview(partner, e)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Request Review
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Partner Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-auto">
          {selectedPartner && (
            <>
              <SheetHeader>
                <SheetTitle>Partner Details</SheetTitle>
                <SheetDescription>
                  Review partner information and start a new engagement
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Partner Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                          {getPartnerInitials(selectedPartner.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="mb-2">{selectedPartner.name}</CardTitle>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{selectedPartner.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{selectedPartner.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{selectedPartner.contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Specialties</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedPartner.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">About</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedPartner.fullDescription}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Engagements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Engagements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPartner.activeEngagements.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No active engagements with this partner
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedPartner.activeEngagements.map((engagement) => (
                          <div key={engagement.id} className="p-3 border border-border rounded-md">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-medium">{engagement.title}</h6>
                              {getEngagementStatusBadge(engagement.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {engagement.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Started {engagement.startDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Button */}
                <div className="pt-4 border-t border-border">
                  <Button 
                    className="w-full"
                    onClick={handleStartNewEngagement}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Start New Engagement
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Engagement Request Modal */}
      <Dialog open={engagementModalOpen} onOpenChange={setEngagementModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Legal Review</DialogTitle>
            <DialogDescription>
              Select a document and provide details about the review you need
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Document</label>
              <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                <SelectTrigger>
                  <FileText className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Choose a document" />
                </SelectTrigger>
                <SelectContent>
                  {availableDocuments.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{doc.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message / Notes</label>
              <Textarea
                placeholder="Describe the type of review needed, specific concerns, or questions you have..."
                value={engagementNotes}
                onChange={(e) => setEngagementNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEngagementModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitEngagement}>
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Mock data
const mockPartners: LegalPartner[] = [
  {
    id: "1",
    name: "Rahman & Associates",
    location: "Kuala Lumpur, Malaysia",
    region: "Malaysia",
    specialties: ["Islamic Finance", "Contract Law", "Regulatory Compliance"],
    description: "Leading Islamic finance law firm with 20+ years of experience in Shariah-compliant transactions.",
    fullDescription: "Rahman & Associates is a premier legal firm specializing in Islamic finance and Shariah-compliant business structures. With over two decades of experience, our team has advised on major Sukuk issuances, Islamic banking transactions, and regulatory compliance matters across Southeast Asia. We pride ourselves on combining deep Islamic jurisprudence knowledge with modern legal expertise.",
    contact: {
      phone: "+60 3-2161 8888",
      email: "info@rahmanlaw.my",
      website: "www.rahmanlaw.my"
    },
    activeEngagements: [
      {
        id: "eng1",
        title: "Murabaha Contract Review",
        status: "active",
        startDate: "Dec 10, 2024",
        description: "Comprehensive review of property financing agreement"
      }
    ],
    avatar: "RA"
  },
  {
    id: "2",
    name: "Al-Shariah Legal Consultancy",
    location: "Dubai, UAE",
    region: "UAE",
    specialties: ["Islamic Finance", "Banking Law", "Securities"],
    description: "Specialized consultancy for Islamic banking and capital markets with AAOIFI expertise.",
    fullDescription: "Al-Shariah Legal Consultancy is a boutique firm focused exclusively on Islamic finance law. Our team includes certified Shariah advisors and experienced banking lawyers who have worked on some of the largest Islamic finance transactions in the GCC region. We provide comprehensive legal services for Islamic banks, investment firms, and corporate clients seeking Shariah-compliant solutions.",
    contact: {
      phone: "+971 4-555 0123",
      email: "contact@alshariah.ae"
    },
    activeEngagements: [
      {
        id: "eng2",
        title: "Sukuk Documentation",
        status: "pending",
        startDate: "Dec 8, 2024",
        description: "Legal documentation for infrastructure Sukuk issuance"
      },
      {
        id: "eng3",
        title: "Ijārah Agreement",
        status: "completed",
        startDate: "Nov 28, 2024",
        description: "Equipment lease structure review"
      }
    ],
    avatar: "AS"
  },
  {
    id: "3",
    name: "Singapore Islamic Law Partners",
    location: "Singapore",
    region: "Singapore",
    specialties: ["Corporate Law", "Islamic Finance", "Regulatory Compliance"],
    description: "Full-service law firm with dedicated Islamic finance practice serving Southeast Asian markets.",
    fullDescription: "Singapore Islamic Law Partners combines the expertise of a full-service commercial law firm with specialized knowledge in Islamic finance. Our multi-disciplinary team advises on complex cross-border transactions, regulatory matters, and corporate structuring for Islamic financial institutions and their clients across the ASEAN region.",
    contact: {
      phone: "+65 6789 0123",
      email: "enquiry@silp.sg"
    },
    activeEngagements: [],
    avatar: "SL"
  },
  {
    id: "4",
    name: "Jakarta Shariah Legal",
    location: "Jakarta, Indonesia",
    region: "Indonesia",
    specialties: ["Islamic Finance", "Contract Law", "Banking Law"],
    description: "Indonesia's leading Islamic law firm with extensive experience in local and international transactions.",
    fullDescription: "Jakarta Shariah Legal has been at the forefront of Indonesia's Islamic finance legal landscape for over 15 years. Our team has advised on landmark transactions including the first corporate Sukuk issuances in Indonesia and major Islamic banking mergers. We combine deep understanding of Indonesian regulations with international best practices in Islamic finance.",
    contact: {
      phone: "+62 21-5555 0123",
      email: "info@jslegal.id"
    },
    activeEngagements: [
      {
        id: "eng4",
        title: "Tawarruq Structure Review",
        status: "active",
        startDate: "Dec 5, 2024",
        description: "Compliance review of commodity trading structure"
      }
    ],
    avatar: "JS"
  },
  {
    id: "5",
    name: "Middle East Islamic Legal Group",
    location: "Bahrain",
    region: "UAE",
    specialties: ["Securities", "Islamic Finance", "Regulatory Compliance"],
    description: "Regional expertise in Islamic capital markets and Sukuk structuring across the Middle East.",
    fullDescription: "The Middle East Islamic Legal Group is a specialized practice focusing on Islamic capital markets and securities law. Based in Bahrain's financial district, we serve as legal counsel for major Islamic financial institutions, investment banks, and sovereign entities across the GCC. Our expertise spans Sukuk structuring, fund formation, and regulatory compliance.",
    contact: {
      phone: "+973 1234 5678",
      email: "legal@meilg.bh"
    },
    activeEngagements: [],
    avatar: "ME"
  },
  {
    id: "6",
    name: "Kuala Lumpur Shariah Advisors",
    location: "Kuala Lumpur, Malaysia",
    region: "Malaysia",
    specialties: ["Islamic Finance", "Corporate Law", "Contract Law"],
    description: "Boutique firm specializing in Shariah-compliant corporate structures and transactions.",
    fullDescription: "Kuala Lumpur Shariah Advisors is a boutique legal practice that focuses on providing sophisticated legal solutions for Islamic finance and Shariah-compliant business structures. Our team includes lawyers with advanced Islamic studies qualifications, enabling us to provide integrated legal and Shariah advisory services to our clients.",
    contact: {
      phone: "+60 3-7890 1234",
      email: "advisors@klsa.my"
    },
    activeEngagements: [
      {
        id: "eng5",
        title: "Corporate Restructuring",
        status: "active",
        startDate: "Nov 30, 2024",
        description: "Shariah-compliant corporate structure advisory"
      }
    ],
    avatar: "KS"
  }
]