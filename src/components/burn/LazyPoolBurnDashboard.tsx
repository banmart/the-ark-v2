import React, { memo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { usePerPoolBurnAnalytics } from '../../hooks/usePerPoolBurnAnalytics';
import PoolBurnDashboard from './PoolBurnDashboard';

const DataBuildingIndicator = () => (
  <Alert className="bg-blue-500/10 border-blue-500/20 mb-4">
    <Clock className="h-4 w-4 text-blue-400" />
    <AlertDescription className="text-blue-100">
      Per-pool burn analytics are building over time. Data will appear as more burn transactions occur across different trading pairs.
    </AlertDescription>
  </Alert>
);

const EmptyDataState = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <AlertCircle className="h-12 w-12 text-white/40" />
    <div className="text-center">
      <h3 className="text-lg font-semibold text-white/80 mb-2">No Pool Data Available</h3>
      <p className="text-white/60 mb-4 max-w-md">
        Pool burn analytics are still collecting data. This feature tracks burns across multiple ARK trading pairs and builds historical data over time.
      </p>
      <Button 
        onClick={onRefresh}
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Data
      </Button>
    </div>
  </div>
);

const LazyPoolBurnDashboard: React.FC = memo(() => {
  const {
    poolMetrics,
    aggregatedData,
    loading,
    error,
    lastUpdated,
    refreshData
  } = usePerPoolBurnAnalytics();

  if (loading && !poolMetrics.length) {
    return (
      <div className="space-y-4">
        <DataBuildingIndicator />
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-video-cyan mr-2" />
          <span className="text-white/80">Loading pool burn analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-500/10 border-red-500/20">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-red-100">
          Error loading pool burn analytics: {error}
          <Button 
            onClick={refreshData}
            variant="link"
            className="ml-2 p-0 h-auto text-red-300 hover:text-red-200"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!poolMetrics.length && !aggregatedData) {
    return (
      <div className="space-y-4">
        <DataBuildingIndicator />
        <EmptyDataState onRefresh={refreshData} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lastUpdated && (
        <div className="text-xs text-white/50 text-right">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
      <PoolBurnDashboard />
    </div>
  );
});

LazyPoolBurnDashboard.displayName = 'LazyPoolBurnDashboard';

export default LazyPoolBurnDashboard;