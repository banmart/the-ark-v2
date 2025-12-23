import { graphqlPriceService } from './price/graphqlPriceService';

interface PriceOracleData {
  plsUsdPrice: number;
  lastUpdated: Date;
  source: string;
}

const PRICE_API_URL = 'https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/price-api';

class PriceOracleService {
  private plsPrice: number = 0.00002;
  private lastUpdated: Date = new Date();

  async getPLSUSDPrice(): Promise<PriceOracleData> {
    // Primary: Try GraphQL service first (single source of truth)
    try {
      const graphqlPrice = await graphqlPriceService.getPLSPrice();
      
      if (graphqlPrice > 0) {
        this.plsPrice = graphqlPrice;
        this.lastUpdated = new Date();
        console.log('PLS price from GraphQL:', this.plsPrice);
        
        return {
          plsUsdPrice: this.plsPrice,
          lastUpdated: this.lastUpdated,
          source: 'PulseX GraphQL'
        };
      }
    } catch (error) {
      console.warn('GraphQL PLS price failed, trying fallback:', error);
    }

    // Fallback: Use existing price API
    try {
      const response = await fetch(PRICE_API_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.plsUsdPrice && data.plsUsdPrice > 0) {
          this.plsPrice = data.plsUsdPrice;
          this.lastUpdated = new Date(data.timestamp || Date.now());
          console.log('PLS price from fallback API:', this.plsPrice);
          
          return {
            plsUsdPrice: this.plsPrice,
            lastUpdated: this.lastUpdated,
            source: data.source || 'Price API'
          };
        }
      }
    } catch (error) {
      console.warn('Price API fallback also failed:', error);
    }

    // Return cached/fallback price
    return {
      plsUsdPrice: this.plsPrice,
      lastUpdated: this.lastUpdated,
      source: 'Cached'
    };
  }

  getCachedPrice(): number {
    // Check if GraphQL has a cached price
    const graphqlCached = graphqlPriceService.getCachedPLSPrice();
    if (graphqlCached > 0) {
      return graphqlCached;
    }
    return this.plsPrice;
  }
}

export const priceOracleService = new PriceOracleService();
export type { PriceOracleData };

