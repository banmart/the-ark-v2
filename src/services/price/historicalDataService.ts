import { DexPriceData, PriceHistoryPoint } from './types';

export interface HistoricalDataPoint extends PriceHistoryPoint {
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

export interface TimeframeConfig {
  key: string;
  label: string;
  duration: number; // milliseconds
  granularity: number; // milliseconds between data points
  maxPoints: number;
}

export const TIMEFRAMES: TimeframeConfig[] = [
  { key: '1H', label: '1 Hour', duration: 60 * 60 * 1000, granularity: 60 * 1000, maxPoints: 60 },
  { key: '4H', label: '4 Hours', duration: 4 * 60 * 60 * 1000, granularity: 4 * 60 * 1000, maxPoints: 60 },
  { key: '1D', label: '1 Day', duration: 24 * 60 * 60 * 1000, granularity: 15 * 60 * 1000, maxPoints: 96 },
  { key: '1W', label: '1 Week', duration: 7 * 24 * 60 * 60 * 1000, granularity: 60 * 60 * 1000, maxPoints: 168 },
  { key: '1M', label: '1 Month', duration: 30 * 24 * 60 * 60 * 1000, granularity: 4 * 60 * 60 * 1000, maxPoints: 180 },
  { key: '3M', label: '3 Months', duration: 90 * 24 * 60 * 60 * 1000, granularity: 12 * 60 * 60 * 1000, maxPoints: 180 },
];

export interface PriceFilter {
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  maxVolume?: number;
  volatilityThreshold?: number;
  showOnlySignificantMoves?: boolean;
}

export class HistoricalDataService {
  private static instance: HistoricalDataService;
  private historicalData: Map<string, HistoricalDataPoint[]> = new Map();
  private readonly STORAGE_KEY = 'ark_historical_price_data';
  private readonly MAX_STORAGE_DAYS = 90;

  static getInstance(): HistoricalDataService {
    if (!HistoricalDataService.instance) {
      HistoricalDataService.instance = new HistoricalDataService();
    }
    return HistoricalDataService.instance;
  }

  constructor() {
    this.loadFromStorage();
  }

  addPriceData(priceData: DexPriceData): void {
    const timestamp = priceData.lastUpdated.getTime();
    const dataPoint: HistoricalDataPoint = {
      timestamp,
      price: priceData.price,
      volume: priceData.volume24h,
      high: priceData.price, // For simplicity, using current price
      low: priceData.price,
      open: priceData.price,
      close: priceData.price,
    };

    // Store in different granularities
    TIMEFRAMES.forEach(timeframe => {
      const key = this.getStorageKey(timeframe.key);
      let data = this.historicalData.get(key) || [];
      
      // Add new data point
      data.push(dataPoint);
      
      // Keep only relevant data for this timeframe
      const cutoffTime = timestamp - timeframe.duration;
      data = data.filter(d => d.timestamp >= cutoffTime);
      
      // Compress data if we have too many points
      if (data.length > timeframe.maxPoints) {
        data = this.compressData(data, timeframe.maxPoints);
      }
      
      this.historicalData.set(key, data);
    });

    this.saveToStorage();
  }

  getHistoricalData(timeframe: string, filter?: PriceFilter): HistoricalDataPoint[] {
    const key = this.getStorageKey(timeframe);
    let data = this.historicalData.get(key) || [];
    
    if (filter) {
      data = this.applyFilter(data, filter);
    }
    
    return data;
  }

  getFormattedTimeSeriesData(timeframe: string, filter?: PriceFilter): Array<{ time: string; price: number; volume?: number }> {
    const data = this.getHistoricalData(timeframe, filter);
    const timeframeConfig = TIMEFRAMES.find(tf => tf.key === timeframe);
    
    return data.map(point => ({
      time: this.formatTimestamp(point.timestamp, timeframeConfig?.granularity || 60000),
      price: point.price,
      volume: point.volume,
    }));
  }

  private applyFilter(data: HistoricalDataPoint[], filter: PriceFilter): HistoricalDataPoint[] {
    return data.filter(point => {
      if (filter.minPrice && point.price < filter.minPrice) return false;
      if (filter.maxPrice && point.price > filter.maxPrice) return false;
      if (filter.minVolume && point.volume && point.volume < filter.minVolume) return false;
      if (filter.maxVolume && point.volume && point.volume > filter.maxVolume) return false;
      
      if (filter.showOnlySignificantMoves && filter.volatilityThreshold) {
        // Check if this point represents a significant price movement
        const prevIndex = data.indexOf(point) - 1;
        if (prevIndex >= 0) {
          const prevPoint = data[prevIndex];
          const changePercent = Math.abs((point.price - prevPoint.price) / prevPoint.price) * 100;
          if (changePercent < filter.volatilityThreshold) return false;
        }
      }
      
      return true;
    });
  }

  private compressData(data: HistoricalDataPoint[], maxPoints: number): HistoricalDataPoint[] {
    if (data.length <= maxPoints) return data;
    
    const compressionRatio = Math.ceil(data.length / maxPoints);
    const compressed: HistoricalDataPoint[] = [];
    
    for (let i = 0; i < data.length; i += compressionRatio) {
      const chunk = data.slice(i, i + compressionRatio);
      const avgPoint = this.calculateAverage(chunk);
      compressed.push(avgPoint);
    }
    
    return compressed;
  }

  private calculateAverage(points: HistoricalDataPoint[]): HistoricalDataPoint {
    if (points.length === 1) return points[0];
    
    const avgPrice = points.reduce((sum, p) => sum + p.price, 0) / points.length;
    const avgVolume = points.reduce((sum, p) => sum + (p.volume || 0), 0) / points.length;
    const timestamp = points[Math.floor(points.length / 2)].timestamp; // Middle timestamp
    
    return {
      timestamp,
      price: avgPrice,
      volume: avgVolume,
      high: Math.max(...points.map(p => p.high || p.price)),
      low: Math.min(...points.map(p => p.low || p.price)),
      open: points[0].open || points[0].price,
      close: points[points.length - 1].close || points[points.length - 1].price,
    };
  }

  private formatTimestamp(timestamp: number, granularity: number): string {
    const date = new Date(timestamp);
    
    if (granularity < 60 * 60 * 1000) { // Less than 1 hour
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (granularity < 24 * 60 * 60 * 1000) { // Less than 1 day
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  private getStorageKey(timeframe: string): string {
    return `${timeframe}_data`;
  }

  private saveToStorage(): void {
    try {
      const dataToSave: Record<string, HistoricalDataPoint[]> = {};
      this.historicalData.forEach((value, key) => {
        dataToSave[key] = value;
      });
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save historical data to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, value]) => {
          this.historicalData.set(key, value as HistoricalDataPoint[]);
        });
        
        // Clean up old data
        this.cleanupOldData();
      }
    } catch (error) {
      console.warn('Failed to load historical data from storage:', error);
    }
  }

  private cleanupOldData(): void {
    const cutoffTime = Date.now() - (this.MAX_STORAGE_DAYS * 24 * 60 * 60 * 1000);
    
    this.historicalData.forEach((data, key) => {
      const filtered = data.filter(point => point.timestamp >= cutoffTime);
      this.historicalData.set(key, filtered);
    });
  }

  // Get statistics for the current timeframe
  getTimeframeStats(timeframe: string): {
    high: number;
    low: number;
    change: number;
    changePercent: number;
    volume: number;
  } {
    const data = this.getHistoricalData(timeframe);
    if (data.length === 0) {
      return { high: 0, low: 0, change: 0, changePercent: 0, volume: 0 };
    }

    const prices = data.map(d => d.price);
    const volumes = data.map(d => d.volume || 0);
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
      change: lastPrice - firstPrice,
      changePercent: ((lastPrice - firstPrice) / firstPrice) * 100,
      volume: volumes.reduce((sum, v) => sum + v, 0),
    };
  }
}

export const historicalDataService = HistoricalDataService.getInstance();
