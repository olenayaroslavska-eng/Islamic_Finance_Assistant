import React from 'react';
import { Vault as VaultComponent } from '@/components/Vault';

/**
 * Vault Page
 * 
 * Secure document storage and management system
 * Features:
 * - Encrypted document storage
 * - Document categorization and tagging
 * - Access control and permissions
 * - Audit trail and version control
 */

const VaultPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Secure Vault</h1>
        <p className="text-gray-600 mt-2">
          Securely store and manage your important financial documents
        </p>
      </div>
      
      <VaultComponent />
    </div>
  );
};

export default VaultPage;