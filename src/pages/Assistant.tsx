import React from 'react';
import { Assistant as AssistantComponent } from '@/components/Assistant';

/**
 * AI Assistant Page
 * 
 * Intelligent Islamic finance assistant providing guidance and answers
 * Features:
 * - Natural language processing for Islamic finance queries
 * - Shariah compliance guidance
 * - Financial product recommendations
 * - Contextual help and education
 */

interface AssistantPageProps {
  onStartWizard?: () => void;
}

const AssistantPage: React.FC<AssistantPageProps> = ({ onStartWizard }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600 mt-2">
          Get intelligent guidance on Islamic finance matters and Shariah compliance
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <AssistantComponent onStartWizard={onStartWizard} />
      </div>
    </div>
  );
};

export default AssistantPage;