import React from 'react';
import { Dashboard as DashboardComponent } from '@/components/Dashboard';

/**
 * Dashboard Page
 * 
 * Main dashboard displaying Islamic finance analytics, metrics, and overview
 * Features:
 * - Financial analytics and KPIs
 * - Shariah compliance metrics  
 * - Recent transactions
 * - Quick action buttons
 */
const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your Islamic finance activities and compliance metrics
        </p>
      </div>
      
      <DashboardComponent />
    </div>
  );
};

export default DashboardPage;