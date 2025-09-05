import React from 'react';
import { DocumentAnalysis as DocumentAnalysisComponent } from '@/components/DocumentAnalysis';

/**
 * Document Analysis Page
 * 
 * Upload and analyze financial documents for Shariah compliance
 * Features:
 * - Document upload and processing
 * - AI-powered Shariah compliance analysis
 * - Detailed compliance reports
 * - Document management and storage
 */

interface DocumentAnalysisPageProps {
  onTriggerAIFlow?: () => void;
}

const DocumentAnalysisPage: React.FC<DocumentAnalysisPageProps> = ({ onTriggerAIFlow }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Document Analysis</h1>
        <p className="text-gray-600 mt-2">
          Upload and analyze your financial documents for Shariah compliance
        </p>
      </div>
      
      <DocumentAnalysisComponent onTriggerAIFlow={onTriggerAIFlow} />
    </div>
  );
};

export default DocumentAnalysisPage;