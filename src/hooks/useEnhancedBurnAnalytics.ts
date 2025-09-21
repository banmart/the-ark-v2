import { useState, useEffect, useCallback } from 'react';
import { 
  enhancedPerPoolBurnAnalyticsService, 
  EnhancedPoolBurnMetrics, 
  EnhancedAggregatedBurnData, 
  EnhancedPoolBurnEvent,
  CSVExportData
} from '../services/enhancedPerPoolBurnAnalyticsService';

export const useEnhancedBurnAnalytics = () => {
  const [poolMetrics, setPoolMetrics] = useState<EnhancedPoolBurnMetrics[]>([]);
  const [aggregatedData, setAggregatedData] = useState<EnhancedAggregatedBurnData | null>(null);
  const [selectedPoolEvents, setSelectedPoolEvents] = useState<EnhancedPoolBurnEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await enhancedPerPoolBurnAnalyticsService.initialize();
      
      const [metrics, aggregated] = await Promise.all([
        enhancedPerPoolBurnAnalyticsService.getEnhancedPerPoolBurnMetrics(),
        enhancedPerPoolBurnAnalyticsService.getEnhancedAggregatedBurnData()
      ]);

      setPoolMetrics(metrics);
      setAggregatedData(aggregated);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Error fetching enhanced burn analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch burn analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPoolEvents = useCallback(async (poolAddress: string) => {
    try {
      const events = await enhancedPerPoolBurnAnalyticsService.getPoolBurnEvents(poolAddress);
      setSelectedPoolEvents(events);
    } catch (err) {
      console.error('Error fetching pool events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pool events');
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const clearCache = useCallback(async () => {
    try {
      enhancedPerPoolBurnAnalyticsService.clearCache();
      await fetchData();
    } catch (err) {
      console.error('Error clearing cache:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cache');
    }
  }, [fetchData]);

  const exportToCSV = useCallback(async (): Promise<CSVExportData[]> => {
    try {
      setExportLoading(true);
      const csvData = await enhancedPerPoolBurnAnalyticsService.exportToCSV();
      return csvData;
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setError(err instanceof Error ? err.message : 'Failed to export CSV');
      return [];
    } finally {
      setExportLoading(false);
    }
  }, []);

  const downloadCSV = useCallback(async (filename: string = 'ark-burn-analytics.csv') => {
    try {
      const csvData = await exportToCSV();
      if (csvData.length === 0) return;

      // Convert to CSV format
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => 
          typeof row[header as keyof CSVExportData] === 'string' && 
          (row[header as keyof CSVExportData] as string).includes(',')
            ? `"${row[header as keyof CSVExportData]}"`
            : row[header as keyof CSVExportData]
        ).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error downloading CSV:', err);
      setError(err instanceof Error ? err.message : 'Failed to download CSV');
    }
  }, [exportToCSV]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Computed values
  const topPerformingPools = poolMetrics
    .filter(pool => pool.totalBurned24h > 0)
    .slice(0, 5);

  const totalBurnAmount = aggregatedData?.totalBurnedAllPools || 0;
  const totalVolumeUSD = aggregatedData?.totalVolumeUSD || 0;
  const totalVolume = aggregatedData?.totalVolumeAllPools || 0;
  const averageEfficiency = aggregatedData?.overallEfficiency || 0;
  const burnPerMillionUSD = aggregatedData?.overallBurnPerMillionUSD || 0;

  const recentActivity = aggregatedData?.recentBurnEvents.slice(0, 10) || [];

  const burnAddressStats = aggregatedData?.burnAddressBreakdown || {
    totalNullBurns: 0,
    totalDeadBurns: 0,
    totalBurnAddressBurns: 0
  };

  const topPerformers = aggregatedData?.topPerformers || {
    byEfficiency: [],
    byVolume: [],
    byBurnAmount: []
  };

  // Enhanced metrics
  const highConfidencePools = poolMetrics.filter(
    pool => pool.volumeAnalytics.confidenceLevel === 'high'
  );

  const stablePairPools = poolMetrics.filter(
    pool => pool.volumeAnalytics.isStablePair
  );

  return {
    // Core data
    poolMetrics,
    aggregatedData,
    selectedPoolEvents,
    
    // State
    loading,
    error,
    lastUpdated,
    exportLoading,
    
    // Actions
    fetchPoolEvents,
    refreshData,
    clearCache,
    exportToCSV,
    downloadCSV,
    
    // Computed values
    topPerformingPools,
    totalBurnAmount,
    totalVolumeUSD,
    totalVolume,
    averageEfficiency,
    burnPerMillionUSD,
    recentActivity,
    burnAddressStats,
    topPerformers,
    
    // Enhanced analytics
    highConfidencePools,
    stablePairPools,
    
    // Statistics
    stats: {
      totalPools: poolMetrics.length,
      activePools: poolMetrics.filter(p => p.totalBurned24h > 0).length,
      totalTransactions: poolMetrics.reduce((sum, p) => sum + p.burnCount24h, 0),
      avgPoolEfficiency: poolMetrics.length > 0 ? 
        poolMetrics.reduce((sum, p) => sum + p.burnEfficiency, 0) / poolMetrics.length : 0
    }
  };
};