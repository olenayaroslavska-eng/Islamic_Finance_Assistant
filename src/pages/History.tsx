import React from 'react';
import { History as HistoryComponent } from '@/components/History';

/**
 * History Page
 * 
 * View and manage transaction and consultation history
 * Features:
 * - Complete transaction history
 * - Consultation records
 * - Document access history
 * - Advanced filtering and search
 */

const HistoryPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">History</h1>
        <p className="text-gray-600 mt-2">
          View your complete transaction and consultation history
        </p>
      </div>
      
      <HistoryComponent />
    </div>
  );
};

export default HistoryPage;