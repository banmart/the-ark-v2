
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
          console.log('PLS price from edge function:', this.plsPrice, 'source:', data.source);
          
          return {
            plsUsdPrice: this.plsPrice,
            lastUpdated: this.lastUpdated,
            source: data.source || 'Price API'
          };
        }
      }
    } catch (error) {
      console.warn('Price API failed:', error);
    }

    // Return cached/fallback price
    return {
      plsUsdPrice: this.plsPrice,
      lastUpdated: this.lastUpdated,
      source: 'Cached'
    };
  }

  getCachedPrice(): number {
    return this.plsPrice;
  }
}

export const priceOracleService = new PriceOracleService();
export type { PriceOracleData };

