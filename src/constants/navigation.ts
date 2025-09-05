import { NavigationItem } from '@/types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    description: 'Overview and analytics'
  },
  {
    id: 'assistant',
    label: 'AI Assistant',
    icon: 'Bot',
    path: '/assistant',
    description: 'Islamic finance guidance'
  },
  {
    id: 'document-analysis',
    label: 'Document Analysis',
    icon: 'FileSearch',
    path: '/documents',
    description: 'Shariah compliance analysis'
  },
  {
    id: 'shariah-board',
    label: 'Shariah Board',
    icon: 'Users',
    path: '/shariah-board',
    description: 'Connect with scholars'
  },
  {
    id: 'legal-partners',
    label: 'Legal Partners',
    icon: 'Scale',
    path: '/legal-partners',
    description: 'Legal consultation'
  },
  {
    id: 'vault',
    label: 'Vault',
    icon: 'Vault',
    path: '/vault',
    description: 'Secure document storage'
  },
  {
    id: 'history',
    label: 'History',
    icon: 'History',
    path: '/history',
    description: 'Transaction history'
  }
];

export const APP_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ASSISTANT: '/assistant',
  DOCUMENTS: '/documents',
  SHARIAH_BOARD: '/shariah-board',
  LEGAL_PARTNERS: '/legal-partners',
  VAULT: '/vault',
  HISTORY: '/history',
  MURABAHA_WIZARD: '/murabaha-wizard',
} as const;