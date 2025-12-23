import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW = 60000; // 1 minute

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('cf-connecting-ip') || 
         'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  record.count++;
  return record.count > RATE_LIMIT;
}

// Cache for price data
let priceCache: { plsUsd: number; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 60 seconds

const RPC_PROXY = "https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/rpc-proxy";

async function fetchCoinGeckoPrice(): Promise<number | null> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=pulsechain&vs_currencies=usd',
      {
        headers: { 'Accept': 'application/json' },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.pulsechain?.usd) {
        console.log('Price API: CoinGecko price:', data.pulsechain.usd);
        return data.pulsechain.usd;
      }
    }
    console.log('Price API: CoinGecko response not valid');
    return null;
  } catch (error) {
    console.error('Price API: CoinGecko error:', error);
    return null;
  }
}

async function fetchPulseXPrice(): Promise<number | null> {
  try {
    const PLS_DAI_PAIR = '0x6753560538ECa67617A9Ce605178F788bE7E524E';
    const WPLS = '0xA1077a294dDE1B09bB078844df40758a5D0f9a27';
    
    // Get reserves from PLS/DAI pair
    const getReservesCall = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [{
        to: PLS_DAI_PAIR,
        data: '0x0902f1ac' // getReserves()
      }, 'latest']
    };
    
    const token0Call = {
      jsonrpc: '2.0',
      id: 2,
      method: 'eth_call',
      params: [{
        to: PLS_DAI_PAIR,
        data: '0x0dfe1681' // token0()
      }, 'latest']
    };
    
    const [reservesRes, token0Res] = await Promise.all([
      fetch(RPC_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getReservesCall)
      }),
      fetch(RPC_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(token0Call)
      })
    ]);
    
    const reservesData = await reservesRes.json();
    const token0Data = await token0Res.json();
    
    if (!reservesData.result || !token0Data.result) {
      console.log('Price API: PulseX RPC calls failed');
      return null;
    }
    
    // Parse reserves (each is 112 bits = 28 hex chars, packed with timestamp)
    const reservesHex = reservesData.result.slice(2);
    const reserve0Hex = reservesHex.slice(0, 64);
    const reserve1Hex = reservesHex.slice(64, 128);
    
    const reserve0 = BigInt('0x' + reserve0Hex);
    const reserve1 = BigInt('0x' + reserve1Hex);
    
    // Determine which is PLS and which is DAI
    const token0Address = '0x' + token0Data.result.slice(26);
    const isToken0WPLS = token0Address.toLowerCase() === WPLS.toLowerCase();
    
    const plsReserve = isToken0WPLS ? reserve0 : reserve1;
    const daiReserve = isToken0WPLS ? reserve1 : reserve0;
    
    // Calculate price: DAI/PLS (both 18 decimals)
    const plsPrice = Number(daiReserve) / Number(plsReserve);
    
    console.log('Price API: PulseX price:', plsPrice);
    return plsPrice > 0 ? plsPrice : null;
  } catch (error) {
    console.error('Price API: PulseX error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  
  // Check rate limit
  if (isRateLimited(clientIP)) {
    console.log(`Price API: Rate limited ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded', plsUsdPrice: 0.00002, source: 'rate-limited' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Check cache
    if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
      console.log('Price API: Returning cached price:', priceCache.plsUsd);
      return new Response(
        JSON.stringify({
          plsUsdPrice: priceCache.plsUsd,
          source: 'cached',
          timestamp: priceCache.timestamp
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try CoinGecko first
    let price = await fetchCoinGeckoPrice();
    let source = 'coingecko';
    
    // Fallback to PulseX DEX
    if (!price) {
      price = await fetchPulseXPrice();
      source = 'pulsex';
    }
    
    // Final fallback
    if (!price) {
      price = 0.00002;
      source = 'fallback';
      console.log('Price API: Using fallback price');
    }
    
    // Update cache
    priceCache = { plsUsd: price, timestamp: Date.now() };
    
    return new Response(
      JSON.stringify({
        plsUsdPrice: price,
        source,
        timestamp: Date.now()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Price API Error:', error);
    return new Response(
      JSON.stringify({ 
        plsUsdPrice: 0.00002, 
        source: 'error-fallback',
        error: error.message 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
