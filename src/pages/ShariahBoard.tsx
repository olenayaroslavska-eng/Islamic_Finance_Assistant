import React from 'react';
import { ShariahBoard as ShariahBoardComponent } from '@/components/ShariahBoard';

/**
 * Shariah Board Page
 * 
 * Connect with qualified Shariah scholars for religious guidance
 * Features:
 * - Browse available Islamic scholars
 * - Schedule consultations
 * - View scholar credentials and specializations
 * - Access consultation history
 */

const ShariahBoardPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shariah Board</h1>
        <p className="text-gray-600 mt-2">
          Connect with qualified Islamic scholars for religious guidance and consultation
        </p>
      </div>
      
      <ShariahBoardComponent />
    </div>
  );
};

export default ShariahBoardPage;