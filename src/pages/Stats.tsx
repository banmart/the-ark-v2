import React from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import StatsSection from '../components/StatsSection';
import ChartSection from '../components/ChartSection';
import { useContractData } from '../hooks/useContractData';

const Stats = () => {
  const { data: contractData, loading: contractLoading } = useContractData();

  return (
    <BaseLayout>
      {/* Stats Section */}
      <StatsSection 
        contractData={contractData} 
        contractLoading={contractLoading} 
      />
      
      {/* Chart Section */}
      <ChartSection />
    </BaseLayout>
  );
};

export default Stats;