import { useState, useEffect, useCallback } from 'react';
import { 
  perPoolBurnAnalyticsService, 
  PoolBurnMetrics, 
  AggregatedBurnData,
  PoolBurnEvent 
} from '../services/perPoolBurnAnalyticsService';

export const usePerPoolBurnAnalytics = () => {
  const [poolMetrics, setPoolMetrics] = useState<PoolBurnMetrics[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedBurnData | null>(null);
  const [selectedPoolEvents, setSelectedPoolEvents] = useState<PoolBurnEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize the service
      await perPoolBurnAnalyticsService.initialize();

      // Fetch all data in parallel
      const [metrics, aggregated] = await Promise.all([
        perPoolBurnAnalyticsService.getPerPoolBurnMetrics(),
        perPoolBurnAnalyticsService.getAggregatedBurnData()
      ]);

      setPoolMetrics(metrics);
      setAggregatedData(aggregated);
      setLastUpdated(new Date());

    } catch (err) {
      console.error('Error fetching per-pool burn analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch burn analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPoolEvents = useCallback(async (poolAddress: string) => {
    try {
      setLoading(true);
      const events = await perPoolBurnAnalyticsService.getPoolBurnEvents(poolAddress);
      setSelectedPoolEvents(events);
    } catch (err) {
      console.error('Error fetching pool events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pool events');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    perPoolBurnAnalyticsService.clearCache();
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Derived computed values
  const topPerformingPools = poolMetrics
    .filter(pool => pool.totalBurned24h > 0)
    .sort((a, b) => b.burnEfficiency - a.burnEfficiency)
    .slice(0, 5);

  const totalBurnAmount = aggregatedData?.totalBurnedAllPools || 0;
  const totalVolume = aggregatedData?.totalVolumeAllPools || 0;
  const averageEfficiency = aggregatedData?.overallEfficiency || 0;

  const recentActivity = aggregatedData?.recentBurnEvents.slice(0, 50) || [];

  return {
    // Core data
    poolMetrics,
    aggregatedData,
    selectedPoolEvents,
    
    // Computed data
    topPerformingPools,
    totalBurnAmount,
    totalVolume,
    averageEfficiency,
    recentActivity,
    
    // State
    loading,
    error,
    lastUpdated,
    
    // Actions
    fetchPoolEvents,
    refreshData,
    clearCache
  };
};