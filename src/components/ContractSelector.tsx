import { useState, useEffect } from "react"
import { Search, Check, Wand2, FileText, DollarSign, Building, Briefcase, Shield, HelpCircle, ChevronLeft, Grid3X3, List } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"

export interface ContractType {
  id: string
  title: string
  description: string
  category: "financing" | "investment" | "leasing" | "issuance" | "compliance"
  isDemo?: boolean
}

interface ContractSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (contractId: string) => void
  preselectedId?: string
}

export function ContractSelector({ open, onClose, onSelect, preselectedId }: ContractSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(preselectedId)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = localStorage.getItem("contract-selector-view")
    return (saved as "grid" | "list") || "grid"
  })

  useEffect(() => {
    setSelectedId(preselectedId)
  }, [preselectedId])

  useEffect(() => {
    localStorage.setItem("contract-selector-view", viewMode)
  }, [viewMode])

  const contractTypes: ContractType[] = [
    {
      id: "commodity-murabaha",
      title: "Commodity Murabaha Financing Agreement",
      description: "Primary demo contract for trade financing",
      category: "financing",
      isDemo: true
    },
    {
      id: "standard-murabaha",
      title: "Standard Murabaha Agreement",
      description: "Traditional cost-plus financing structure",
      category: "financing"
    },
    {
      id: "mudaraba",
      title: "Mudaraba Contract",
      description: "Profit-sharing partnership agreement",
      category: "investment"
    },
    {
      id: "ijarah-lease",
      title: "Ijarah Lease Agreement",
      description: "Shariah-compliant leasing contract",
      category: "leasing"
    },
    {
      id: "sukuk-issuance",
      title: "Sukuk Issuance",
      description: "Islamic bond issuance documentation",
      category: "issuance"
    },
    {
      id: "compliance-review",
      title: "Compliance Review",
      description: "Comprehensive Shariah compliance assessment",
      category: "compliance"
    },
    {
      id: "fatwa-requests",
      title: "Fatwa Requests",
      description: "Religious ruling request and documentation",
      category: "compliance"
    }
  ]

  const filters = [
    { id: "financing", label: "Financing", count: contractTypes.filter(c => c.category === "financing").length },
    { id: "investment", label: "Investment", count: contractTypes.filter(c => c.category === "investment").length },
    { id: "leasing", label: "Leasing", count: contractTypes.filter(c => c.category === "leasing").length },
    { id: "issuance", label: "Issuance", count: contractTypes.filter(c => c.category === "issuance").length },
    { id: "compliance", label: "Compliance", count: contractTypes.filter(c => c.category === "compliance").length }
  ]

  const filteredContracts = contractTypes.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !activeFilter || contract.category === activeFilter
    return matchesSearch && matchesFilter
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "financing": return DollarSign
      case "investment": return Building
      case "leasing": return Briefcase
      case "issuance": return FileText
      case "compliance": return Shield
      default: return HelpCircle
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    } else if (e.key === "Enter" && selectedId) {
      onSelect(selectedId)
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const currentIndex = filteredContracts.findIndex(c => c.id === selectedId)
      const nextIndex = e.key === "ArrowDown" 
        ? Math.min(currentIndex + 1, filteredContracts.length - 1)
        : Math.max(currentIndex - 1, 0)
      setSelectedId(filteredContracts[nextIndex]?.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-0"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Select a Contract Type
              </DialogTitle>
              <DialogDescription>
                Choose a template to launch the guided wizard
              </DialogDescription>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-muted/20 p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-7 w-7 p-0 rounded-md"
              >
                <Grid3X3 className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-7 w-7 p-0 rounded-md"
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeFilter === null ? "default" : "outline"}
              size="sm"
              className="rounded-full h-7 px-3"
              onClick={() => setActiveFilter(null)}
            >
              All ({contractTypes.length})
            </Button>
            {filters.map(filter => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                className="rounded-full h-7 px-3"
                onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Contract Grid/List */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {filteredContracts.map(contract => {
                const IconComponent = getCategoryIcon(contract.category)
                const isSelected = selectedId === contract.id
                
                return (
                  <Card
                    key={contract.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/60 relative group min-w-[280px] max-w-[300px] ${
                      isSelected ? 'border-primary shadow-md ring-1 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedId(contract.id)}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm line-clamp-2 pr-6">
                              {contract.title}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {contract.isDemo && (
                              <Badge variant="default" className="text-xs px-2 py-0 h-5">
                                Demo
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs px-2 py-0 h-5 capitalize">
                              {contract.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm mb-3 line-clamp-2">
                        {contract.description}
                      </CardDescription>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full h-7 text-xs rounded-full hover:bg-primary/5 hover:text-primary"
                      >
                        <Wand2 className="h-3 w-3 mr-1" />
                        Start wizard
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2 mt-4">
              {filteredContracts.map(contract => {
                const IconComponent = getCategoryIcon(contract.category)
                const isSelected = selectedId === contract.id
                
                return (
                  <div
                    key={contract.id}
                    className={`cursor-pointer transition-all duration-200 hover:bg-muted/30 rounded-lg border border-transparent relative group p-4 ${
                      isSelected ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                    onClick={() => setSelectedId(contract.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h6 style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.4' }} className="text-foreground mb-1 truncate">
                              {contract.title}
                            </h6>
                            <p className="text-muted-foreground text-sm truncate">
                              {contract.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {contract.isDemo && (
                                <Badge variant="default" className="text-xs px-2 py-0 h-5">
                                  Demo
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs px-2 py-0 h-5 capitalize">
                                {contract.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {isSelected && (
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-3 text-xs rounded-full hover:bg-primary/5 hover:text-primary"
                            >
                              <Wand2 className="h-3 w-3 mr-1" />
                              Start wizard
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-muted/20 flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
          <Button 
            onClick={() => selectedId && onSelect(selectedId)}
            disabled={!selectedId}
            className="rounded-full"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}