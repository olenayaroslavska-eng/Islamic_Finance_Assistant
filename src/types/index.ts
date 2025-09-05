// Core application types
export type FlowType = 
  | "assistant" 
  | "document-analysis" 
  | "ai-collaboration" 
  | "shariah-board" 
  | "legal-partners" 
  | "history" 
  | "dashboard" 
  | "vault";

// Navigation and routing
export interface NavigationItem {
  id: FlowType;
  label: string;
  icon: string;
  path: string;
  description?: string;
}

// User and authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'scholar';
  avatar?: string;
}

// Document types
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  shariahCompliant?: boolean;
}

// Financial products
export interface FinancialProduct {
  id: string;
  name: string;
  type: 'murabaha' | 'ijara' | 'musharaka' | 'mudharaba';
  amount: number;
  currency: string;
  status: 'active' | 'completed' | 'pending';
  shariahApproval: boolean;
}

// AI Assistant types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  context?: string;
}

export interface AssistantSession {
  id: string;
  messages: ChatMessage[];
  startTime: Date;
  endTime?: Date;
}

// Shariah Board
export interface Scholar {
  id: string;
  name: string;
  credentials: string[];
  specialization: string[];
  avatar?: string;
  availability: 'available' | 'busy' | 'offline';
}

export interface ShariahConsultation {
  id: string;
  title: string;
  description: string;
  scholar: Scholar;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

// Legal Partners
export interface LegalPartner {
  id: string;
  name: string;
  firm: string;
  specialization: string[];
  experience: number;
  rating: number;
  location: string;
}

// Dashboard analytics
export interface DashboardMetrics {
  totalTransactions: number;
  activeProducts: number;
  complianceScore: number;
  monthlyGrowth: number;
}

// Common API response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  data?: any;
}