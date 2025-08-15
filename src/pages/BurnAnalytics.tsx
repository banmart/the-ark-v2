import React from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import BurnProtocolAnalytics from '../components/burn/BurnProtocolAnalytics';

const BurnAnalytics = () => {
  return (
    <BaseLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
        <div className="container mx-auto px-4 py-8">
          <BurnProtocolAnalytics />
        </div>
      </div>
    </BaseLayout>
  );
};

export default BurnAnalytics;