import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PULSEX_SUBGRAPH_URL = 'https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsex';
const ARK_TOKEN_ADDRESS = '0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67'.toLowerCase();
const ARK_PLS_PAIR_ADDRESS = '0x5f49421c0f74873bc02d0a912f171a030008f2c9'.toLowerCase();

// In-memory cache
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 30000; // 30 seconds

interface GraphQLResponse {
  data?: {
    pair?: {
      id: string;
      reserve0: string;
      reserve1: string;
      reserveUSD: string;
      volumeUSD: string;
      token0: { id: string; symbol: string; name: string };
      token1: { id: string; symbol: string; name: string };
      token0Price: string;
      token1Price: string;
    };
    pairDayDatas?: Array<{
      date: number;
      dailyVolumeUSD: string;
      reserveUSD: string;
    }>;
    pulseXFactory?: {
      totalVolumeUSD: string;
      totalLiquidityUSD: string;
    };
  };
  errors?: Array<{ message: string }>;
}

async function querySubgraph(): Promise<GraphQLResponse> {
  // Use only pair-based queries which are more reliable
  const query = `{
    pair(id: "${ARK_PLS_PAIR_ADDRESS}") {
      id
      reserve0
      reserve1
      reserveUSD
      volumeUSD
      token0 { id symbol name }
      token1 { id symbol name }
      token0Price
      token1Price
    }
    pairDayDatas(
      where: { pair: "${ARK_PLS_PAIR_ADDRESS}" }
      orderBy: date
      orderDirection: desc
      first: 30
    ) {
      date
      dailyVolumeUSD
      reserveUSD
    }
  }`;

  console.log('Querying PulseX subgraph for pair data...');
  
  const response = await fetch(PULSEX_SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors && result.errors.length > 0) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
  }

  return result;
}

// Fetch PLS/USD price from a separate source (using WPLS/USDC or WPLS/DAI pair)
async function fetchPLSPrice(): Promise<number> {
  // WPLS/DAI pair on PulseX - commonly used for PLS price
  const WPLS_DAI_PAIR = '0xe56043671df55de5cdf8459710433c10324de0ae'.toLowerCase();
  
  const query = `{
    pair(id: "${WPLS_DAI_PAIR}") {
      token0 { id symbol }
      token1 { id symbol }
      token0Price
      token1Price
    }
  }`;

  try {
    const response = await fetch(PULSEX_SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    
    if (result.data?.pair) {
      const pair = result.data.pair;
      // DAI is token0 or token1, we need PLS price in USD
      const isToken0DAI = pair.token0.symbol === 'DAI' || pair.token0.symbol === 'USDC';
      const plsPrice = isToken0DAI 
        ? parseFloat(pair.token0Price) // DAI per PLS = USD per PLS
        : parseFloat(pair.token1Price);
      
      console.log('PLS price from DAI pair:', plsPrice);
      return plsPrice > 0 ? plsPrice : 0.00003; // Fallback
    }
  } catch (error) {
    console.error('Error fetching PLS price:', error);
  }
  
  return 0.00003; // Default fallback PLS price
}

function processGraphQLData(response: GraphQLResponse, plsUsdPrice: number) {
  const { pair, pairDayDatas } = response.data || {};
  
  if (!pair) {
    throw new Error('No pair data found for ARK/PLS');
  }
  
  // Determine which token is ARK
  const isToken0ARK = pair.token0.id.toLowerCase() === ARK_TOKEN_ADDRESS;
  
  // Calculate ARK price in PLS
  // token0Price = how many token1 per token0
  // token1Price = how many token0 per token1
  let arkPricePLS: number;
  let arkReserve: number;
  let plsReserve: number;
  
  if (isToken0ARK) {
    // ARK is token0, PLS is token1
    arkPricePLS = parseFloat(pair.token0Price); // PLS per ARK
    arkReserve = parseFloat(pair.reserve0);
    plsReserve = parseFloat(pair.reserve1);
  } else {
    // PLS is token0, ARK is token1
    arkPricePLS = parseFloat(pair.token1Price); // PLS per ARK
    arkReserve = parseFloat(pair.reserve1);
    plsReserve = parseFloat(pair.reserve0);
  }
  
  const arkPriceUSD = arkPricePLS * plsUsdPrice;
  
  // Get 24h volume from pair day data
  let volume24hUSD = 0;
  if (pairDayDatas && pairDayDatas.length > 0) {
    volume24hUSD = parseFloat(pairDayDatas[0].dailyVolumeUSD);
  }
  
  // Get liquidity
  const liquidityUSD = pair.reserveUSD ? parseFloat(pair.reserveUSD) : 0;
  
  // Calculate 24h price change from volume history
  let priceChange24h = 0;
  if (pairDayDatas && pairDayDatas.length >= 2) {
    // Estimate price change from liquidity changes (rough approximation)
    const todayLiquidity = parseFloat(pairDayDatas[0].reserveUSD);
    const yesterdayLiquidity = parseFloat(pairDayDatas[1].reserveUSD);
    if (yesterdayLiquidity > 0 && todayLiquidity > 0) {
      // This is a rough estimate - actual price change would require historical price data
      priceChange24h = ((todayLiquidity - yesterdayLiquidity) / yesterdayLiquidity) * 100;
    }
  }
  
  // Build volume history for charts
  const volumeHistory = (pairDayDatas || []).map(day => ({
    date: day.date,
    volumeUSD: parseFloat(day.dailyVolumeUSD),
    liquidityUSD: parseFloat(day.reserveUSD),
  })).reverse(); // Oldest first for charts

  return {
    // Current prices
    arkPriceUSD,
    arkPricePLS,
    plsUsdPrice,
    
    // Market data
    volume24hUSD,
    liquidityUSD,
    priceChange24h,
    
    // Reserves
    reserves: {
      arkReserve,
      plsReserve,
      token0: pair.token0,
      token1: pair.token1,
    },
    
    // Historical data
    volumeHistory,
    
    // Total volume
    totalVolumeUSD: parseFloat(pair.volumeUSD) || 0,
    
    // Metadata
    timestamp: Date.now(),
    source: 'PulseX Subgraph',
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check cache first
    if (cache && (Date.now() - cache.timestamp) < CACHE_TTL_MS) {
      console.log('Returning cached PulseX data');
      return new Response(JSON.stringify({
        ...cache.data,
        cached: true,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch PLS price and pair data in parallel
    const [plsPrice, graphqlResponse] = await Promise.all([
      fetchPLSPrice(),
      querySubgraph(),
    ]);
    
    const processedData = processGraphQLData(graphqlResponse, plsPrice);
    
    // Update cache
    cache = {
      data: processedData,
      timestamp: Date.now(),
    };

    console.log('PulseX data fetched successfully:', {
      arkPriceUSD: processedData.arkPriceUSD.toFixed(8),
      arkPricePLS: processedData.arkPricePLS.toFixed(8),
      plsUsdPrice: processedData.plsUsdPrice.toFixed(8),
      volume24hUSD: processedData.volume24hUSD.toFixed(2),
      liquidityUSD: processedData.liquidityUSD.toFixed(2),
    });

    return new Response(JSON.stringify({
      ...processedData,
      cached: false,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PulseX GraphQL error:', error);
    
    // Return cached data on error if available
    if (cache) {
      console.log('Returning stale cache due to error');
      return new Response(JSON.stringify({
        ...cache.data,
        cached: true,
        stale: true,
        error: error.message,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to fetch PulseX data',
      message: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
