import React from 'react';
import { LegalPartners as LegalPartnersComponent } from '@/components/LegalPartners';

/**
 * Legal Partners Page
 * 
 * Access Islamic finance legal experts and consultation services
 * Features:
 * - Browse qualified legal partners
 * - Filter by specialization and location
 * - Schedule legal consultations
 * - View partner credentials and ratings
 */

const LegalPartnersPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Legal Partners</h1>
        <p className="text-gray-600 mt-2">
          Connect with qualified Islamic finance legal experts for professional consultation
        </p>
      </div>
      
      <LegalPartnersComponent />
    </div>
  );
};

export default LegalPartnersPage;