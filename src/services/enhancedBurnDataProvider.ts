import { enhancedPerPoolBurnAnalyticsService } from './enhancedPerPoolBurnAnalyticsService';
import { EnhancedPoolBurnMetrics, EnhancedAggregatedBurnData } from './enhancedPerPoolBurnAnalyticsService';

class EnhancedBurnDataProvider {
  private static instance: EnhancedBurnDataProvider;
  private isInitializing = false;
  private initialized = false;

  static getInstance(): EnhancedBurnDataProvider {
    if (!EnhancedBurnDataProvider.instance) {
      EnhancedBurnDataProvider.instance = new EnhancedBurnDataProvider();
    }
    return EnhancedBurnDataProvider.instance;
  }

  async initializeIfNeeded(): Promise<void> {
    if (this.initialized || this.isInitializing) return;
    
    this.isInitializing = true;
    try {
      console.log('Enhanced burn data provider: initializing...');
      await enhancedPerPoolBurnAnalyticsService.initialize();
      this.initialized = true;
      console.log('Enhanced burn analytics service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize enhanced burn analytics:', error);
      throw error; // Re-throw to surface the error
    } finally {
      this.isInitializing = false;
    }
  }

  async getQuickData(): Promise<{ metrics: EnhancedPoolBurnMetrics[], aggregated: EnhancedAggregatedBurnData | null }> {
    await this.initializeIfNeeded();
    
    try {
      console.log('Enhanced burn data provider: fetching data...');
      
      // Get data in parallel for faster loading
      const [metrics, aggregated] = await Promise.all([
        enhancedPerPoolBurnAnalyticsService.getEnhancedPerPoolBurnMetrics(),
        enhancedPerPoolBurnAnalyticsService.getEnhancedAggregatedBurnData()
      ]);

      console.log('Enhanced burn data provider: data fetched', {
        metricsCount: metrics.length,
        aggregatedExists: !!aggregated,
        firstMetric: metrics[0] ? {
          pool: metrics[0].poolAddress,
          burned: metrics[0].totalBurned24h
        } : null
      });

      return { metrics, aggregated };
    } catch (error) {
      console.error('Error fetching quick enhanced burn data:', error);
      return { metrics: [], aggregated: null };
    }
  }
}

export const enhancedBurnDataProvider = EnhancedBurnDataProvider.getInstance();